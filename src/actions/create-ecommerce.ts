"use server";

import { stripe } from "@/lib/stripe";
import { upsertProvisioning } from "@/lib/provisioning-store";
import { provisionarClienteAsync } from "@/actions/provisionar-cliente";

export async function createEcommerceAction(
  prevState: any,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;
  const sessionId = formData.get("sessionId") as string;

  const zipCode = formData.get("zipCode") as string;
  const street = formData.get("street") as string;
  const number = formData.get("number") as string;
  const complement = formData.get("complement") as string;
  const neighborhood = formData.get("neighborhood") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;

  if (!name || !subdomain || !sessionId) {
    return { error: "Nome da loja e subdomínio são obrigatórios." };
  }

  if (!zipCode || !street || !number || !neighborhood || !city || !state) {
    return { error: "Todos os campos de endereço são obrigatórios." };
  }

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

  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
  const priceId = lineItems.data[0]?.price?.id;

  let plan = "iniciante";

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

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3001";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${backendUrl}/api/admin/create-ecommerce`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ADMIN_API_SECRET}`,
      },
      body: JSON.stringify({
        name,
        subdomain,
        plan,
        stripeSubscriptionId: session.subscription as string,
        stripeCustomerId: session.customer as string,
        address: {
          zipCode: zipCode.replace(/\D/g, ""),
          street,
          number,
          complement: complement || undefined,
          neighborhood,
          city,
          state: state.toUpperCase(),
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return {
        error: "Erro ao processar resposta do servidor. Tente novamente.",
      };
    }

    if (!response.ok) {
      console.error("Backend Error:", data);

      let errorMessage = data.details || data.error || "Erro ao criar loja.";

      if (errorMessage === "Subdomain already taken") {
        errorMessage =
          "Este subdomínio já está em uso. Por favor, escolha outro.";
      }

      if (errorMessage === "Session already used") {
        errorMessage =
          "Esta sessão de pagamento já foi utilizada. Cada pagamento pode ser usado apenas uma vez.";
      }

      return { error: errorMessage };
    }

    const subdomainNorm = subdomain.toLowerCase().trim();
    await upsertProvisioning(subdomainNorm, {
      ecommerceId: data.ecommerceId,
      status: "provisionando",
    });
    provisionarClienteAsync(subdomainNorm).catch((err) => {
      console.error("[create-ecommerce] provisionarClienteAsync error:", err);
    });

    return { success: true, ecommerceId: data.ecommerceId, subdomain: subdomainNorm };
  } catch (error: any) {
    console.error("API Call Error:", error);

    if (error.name === "AbortError") {
      return {
        error:
          "Tempo de conexão esgotado. Verifique sua conexão e tente novamente.",
      };
    }

    if (error.cause?.code === "ECONNREFUSED" || error.code === "ECONNREFUSED") {
      return {
        error: `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${backendUrl}`,
      };
    }

    if (error.message?.includes("fetch failed")) {
      return {
        error: "Erro de conexão. Verifique sua internet e tente novamente.",
      };
    }

    return {
      error: "Erro ao conectar com o sistema. Por favor, tente novamente.",
    };
  }
}
