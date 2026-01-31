import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  getPendingRegistration,
  deletePendingRegistration,
} from "@/lib/pending-registrations-store";
import { upsertProvisioning } from "@/lib/provisioning-store";
import { provisionarClienteAsync } from "@/actions/provisionar-cliente";

const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3001";
const adminSecret = process.env.ADMIN_API_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  console.log(
    `[Webhook] Received event. Body length: ${body.length}, Signature: ${sig?.substring(0, 10)}...`,
  );

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    console.log(`[Webhook] Event constructed: ${event.type}`);
  } catch (err: any) {
    console.error(`[Webhook] Signature Verification Error: ${err.message}`);
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("[Webhook] STRIPE_WEBHOOK_SECRET is missing in .env");
    }
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const pendingId = session.metadata?.pendingId;

    console.log(
      `[Webhook] Processing checkout.session.completed. PendingId: ${pendingId}`,
    );

    if (!pendingId) {
      console.error("[Webhook] No pendingId in session metadata");
      return new NextResponse("Ignored: No pendingId", { status: 200 });
    }

    // 1. Retrieve Data
    const pendingData = await getPendingRegistration(pendingId);
    if (!pendingData) {
      console.error(
        `[Webhook] Pending registration not found for ID: ${pendingId}`,
      );
      return new NextResponse("Error: Data not found", { status: 404 });
    }

    try {
      // 2. Create Ecommerce (Call Backend)
      const ecommercePayload = {
        name: pendingData.storeData.name,
        subdomain: pendingData.storeData.subdomain,
        plan: pendingData.plan,
        stripeSubscriptionId: session.subscription,
        stripeCustomerId: session.customer,
        address: pendingData.storeData.address,
      };

      console.log(
        "[Webhook] Creating Ecommerce in Backend...",
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
        console.error(
          "[Webhook] Failed to create ecommerce on backend:",
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

      console.log("[Webhook] Creating Admin User in Backend...");

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
        console.error("[Webhook] Failed to create user on backend:", errorText);
        throw new Error(`Backend User Error: ${errorText}`);
      }

      // 4. Trigger Coolify/Provisioning
      const subdomainNorm = pendingData.storeData.subdomain
        .toLowerCase()
        .trim();

      console.log("[Webhook] Upserting Provisioning status...");
      await upsertProvisioning(subdomainNorm, {
        ecommerceId,
        status: "provisionando",
        email: pendingData.adminData.email,
      });

      console.log("[Webhook] Triggering Async Provisioning...");
      provisionarClienteAsync(subdomainNorm).catch((err) => {
        console.error("[Webhook] Async provisioning error:", err);
      });

      // 5. Cleanup
      await deletePendingRegistration(pendingId);
      console.log(
        "[Webhook] Successfully processed registration for:",
        subdomainNorm,
      );
    } catch (error) {
      console.error("[Webhook] Processing Error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  return new NextResponse("Received", { status: 200 });
}
