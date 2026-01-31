import {
  getPendingRegistration,
  deletePendingRegistration,
} from "@/lib/pending-registrations-store";
import { upsertProvisioning } from "@/lib/provisioning-store";
import { provisionarClienteAsync } from "@/actions/provisionar-cliente";

const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3001";
const adminSecret = process.env.ADMIN_API_SECRET;

export async function processRegistration(
  pendingId: string,
  subscriptionId: string | null,
  customerId: string | null,
) {
  console.log(`[ProcessRegistration] Starting for PendingID: ${pendingId}`);

  // 1. Retrieve Data
  const pendingData = await getPendingRegistration(pendingId);
  if (!pendingData) {
    console.warn(
      `[ProcessRegistration] Pending registration not found for ID: ${pendingId}. It might have been processed already.`,
    );
    return { success: false, reason: "not_found_or_processed" };
  }

  try {
    // 2. Create Ecommerce (Call Backend)
    const ecommercePayload = {
      name: pendingData.storeData.name,
      subdomain: pendingData.storeData.subdomain,
      plan: pendingData.plan,
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customerId,
      address: pendingData.storeData.address,
    };

    console.log(
      "[ProcessRegistration] Creating Ecommerce in Backend...",
      ecommercePayload.subdomain,
    );

    const ecommerceRes = await fetch(
      `${backendUrl}/api/admin/create-ecommerce`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify(ecommercePayload),
      },
    );

    if (!ecommerceRes.ok) {
      const errorText = await ecommerceRes.text();
      if (
        errorText.includes("Subdomain already taken") ||
        errorText.includes("already been registered")
      ) {
      }
      console.error(
        "[ProcessRegistration] Failed to create ecommerce on backend:",
        errorText,
      );
      throw new Error(`Backend Error: ${errorText}`);
    }

    const ecommerceResult = await ecommerceRes.json();
    const ecommerceId = ecommerceResult.ecommerceId;

    // 3. Create User & Link (Call Backend)
    const userPayload = {
      ecommerceId,
      adminName: pendingData.adminData.name,
      adminEmail: pendingData.adminData.email,
      adminPassword: pendingData.adminData.password,
    };

    console.log("[ProcessRegistration] Creating Admin User in Backend...");

    const userRes = await fetch(
      `${backendUrl}/api/admin/create-user-and-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify(userPayload),
      },
    );

    if (!userRes.ok) {
      const errorText = await userRes.text();
      console.error(
        "[ProcessRegistration] Failed to create user on backend:",
        errorText,
      );
    }

    // 4. Trigger Coolify/Provisioning
    const subdomainNorm = pendingData.storeData.subdomain.toLowerCase().trim();

    console.log("[ProcessRegistration] Upserting Provisioning status...");
    await upsertProvisioning(subdomainNorm, {
      ecommerceId,
      status: "provisionando",
      email: pendingData.adminData.email,
    });

    console.log("[ProcessRegistration] Triggering Async Provisioning...");
    provisionarClienteAsync(subdomainNorm).catch((err) => {
      console.error("[ProcessRegistration] Async provisioning error:", err);
    });

    // 5. Cleanup
    await deletePendingRegistration(pendingId);
    console.log(
      "[ProcessRegistration] Successfully processed registration for:",
      subdomainNorm,
    );

    return { success: true, subdomain: subdomainNorm };
  } catch (error) {
    console.error("[ProcessRegistration] Error:", error);
    throw error;
  }
}
