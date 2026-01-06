"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function createTenantAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;
  const password = formData.get("password") as string;
  const sessionId = formData.get("sessionId") as string;

  if (!name || !subdomain || !password || !sessionId) {
    return { error: "Todos os campos são obrigatórios." };
  }

  // 1. Retrieve Stripe Session to get customer details & plan
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
    if (
      !session ||
      (session.payment_status !== "paid" &&
        session.payment_status !== "no_payment_required")
    ) {
      return { error: "Pagamento não confirmado." };
    }
  } catch (error) {
    console.error("Stripe Error:", error);
    return { error: "Erro ao verificar pagamento." };
  }

  // 2. Map Stripe Price ID to Internal Plan Enum
  // We need to look at the line items or metadata. Simplified logic: check amount/price ID.
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
  const priceId = lineItems.data[0]?.price?.id;

  let plan = "iniciante"; // default

  const priceMap: Record<string, string> = {
    [process.env.NEXT_PUBLIC_PRICE_ID_START || ""]: "iniciante",
    [process.env.NEXT_PUBLIC_PRICE_ID_START_ANNUAL || ""]: "iniciante",
    [process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL || ""]: "profissional",
    [process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL_ANNUAL || ""]:
      "profissional",
    [process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE || ""]: "enterprise",
    [process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE_ANNUAL || ""]: "enterprise",
  };

  if (priceId && priceMap[priceId]) {
    plan = priceMap[priceId];
  }

  // 3. Call Main Backend API
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3001";

  try {
    const response = await fetch(`${backendUrl}/api/admin/create-tenant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ADMIN_API_SECRET}`,
      },
      body: JSON.stringify({
        name,
        subdomain,
        plan,
        adminName: session.customer_details?.name || "Admin",
        adminEmail: session.customer_details?.email,
        adminPassword: password,
        stripeSubscriptionId: session.subscription as string,
        stripeCustomerId: session.customer as string,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend Error:", data);

      let errorMessage = data.details || data.error || "Erro ao criar loja.";

      if (errorMessage === "Subdomain already taken") {
        errorMessage =
          "Este subdomínio já está em uso. Por favor, escolha outro.";
      }

      return { error: errorMessage };
    }

    // Success! Redirect to login (or auto-login URL if implemented)
    // data.loginUrl should correspond to the authentication page
  } catch (error) {
    console.error("API Call Error:", error);
    return { error: "Erro de conexão com o sistema." };
  }

  // If successful, redirect
  const loginUrl = process.env.BACKEND_LOGIN_URL || "http://localhost:3001/authentication";
  redirect(loginUrl);
}
