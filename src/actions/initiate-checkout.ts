"use server";

import { stripe } from "@/lib/stripe";
import { createPendingRegistration } from "@/lib/pending-registrations-store";
import { redirect } from "next/navigation";

function getPriceIdFromPlan(
  plan: string,
  billingCycle: "monthly" | "yearly" = "monthly",
) {
  return null;
}

export async function initiateCheckoutAction(
  prevState: any,
  formData: FormData,
) {
  // 1. Extract Data
  const priceId = formData.get("priceId") as string;

  // Store Info
  const storeName = formData.get("storeName") as string;
  const subdomain = formData.get("subdomain") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const contactEmail = formData.get("contactEmail") as string;

  // Address
  const zipCode = formData.get("zipCode") as string;
  const street = formData.get("street") as string;
  const number = formData.get("number") as string;
  const complement = formData.get("complement") as string;
  const neighborhood = formData.get("neighborhood") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;

  // Admin Info
  const adminName = formData.get("adminName") as string;
  const adminCpf = formData.get("adminCpf") as string;
  const adminEmail = formData.get("adminEmail") as string;
  const adminPassword = formData.get("adminPassword") as string;

  // 2. Validation
  if (!priceId) return { error: "Plano inválido." };
  if (!storeName || !subdomain || !contactPhone || !contactEmail)
    return { error: "Preencha todos os dados da loja." };
  if (!zipCode || !street || !number || !neighborhood || !city || !state)
    return { error: "Endereço incompleto." };
  if (!adminName || !adminCpf || !adminEmail || !adminPassword)
    return { error: "Preencha todos os dados do administrador." };

  const priceMap: Record<string, string> = {
    [process.env.NEXT_PUBLIC_PRICE_ID_START || ""]: "iniciante",
    [process.env.NEXT_PUBLIC_PRICE_ID_START_ANNUAL || ""]: "iniciante",
    [process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL || ""]: "profissional",
    [process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL_ANNUAL || ""]:
      "profissional",
    [process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE || ""]: "enterprise",
    [process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE_ANNUAL || ""]: "enterprise",
  };

  const planName = priceMap[priceId] || "iniciante";

  // 4. Save to Pending Store
  let pendingId;
  try {
    pendingId = await createPendingRegistration({
      plan: planName,
      storeData: {
        name: storeName,
        subdomain: subdomain.toLowerCase().trim(),
        contactEmail,
        contactPhone,
        address: {
          zipCode,
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
        },
      },
      adminData: {
        name: adminName,
        cpf: adminCpf,
        email: adminEmail,
        password: adminPassword,
      },
    });
  } catch (error) {
    console.error("Error saving pending registration:", error);
    return { error: "Erro interno ao salvar dados. Tente novamente." };
  }

  let sessionUrl;

  // 5. Create Stripe Session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        pendingId: pendingId,
        subdomain: subdomain.toLowerCase().trim(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/setup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/setup?error=cancelled`,
    });

    if (session.url) {
      sessionUrl = session.url;
    } else {
      return { error: "Erro ao criar sessão de pagamento." };
    }
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return { error: "Erro ao conectar com pagamento." };
  }

  if (sessionUrl) {
    redirect(sessionUrl);
  }
}
