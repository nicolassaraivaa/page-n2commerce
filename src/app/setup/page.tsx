import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface SetupPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function checkSessionAlreadyUsed(
  stripeSubscriptionId: string | null,
  stripeCustomerId: string | null,
) {
  if (!stripeSubscriptionId && !stripeCustomerId) {
    return false;
  }

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3001";

  try {
    const response = await fetch(`${backendUrl}/api/admin/check-session-used`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ADMIN_API_SECRET}`,
      },
      body: JSON.stringify({
        stripeSubscriptionId,
        stripeCustomerId,
      }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.alreadyUsed === true;
  } catch (error) {
    console.error("Error checking session:", error);
    return false;
  }
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const { session_id, plan } = await searchParams;
  const sessionId = Array.isArray(session_id) ? session_id[0] : session_id;
  const priceId = Array.isArray(plan) ? plan[0] : plan;

  // Case 1: Payment Success (Session ID present)
  // Case 1: Payment Success (Session ID present)
  if (sessionId) {
    console.log("SetupPage: Checking session", sessionId);

    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error("Error retrieving Stripe session:", error);
      redirect("/payment-error");
    }

    if (
      session.payment_status !== "paid" &&
      session.payment_status !== "no_payment_required"
    ) {
      redirect("/payment-error");
    }

    const alreadyUsed = await checkSessionAlreadyUsed(
      (session.subscription as string) || null,
      (session.customer as string) || null,
    );

    if (alreadyUsed) {
      redirect("/payment-error?error=session_already_used");
    }

    // Try to process registration here as a fallback
    const pendingId = session.metadata?.pendingId;
    if (pendingId) {
      console.log(
        "SetupPage: Found PendingID, attempting processing...",
        pendingId,
      );
      // We import processRegistration dynamically or at top level if possible (it's server side)
      // Since we are in a server component (SetupPage), we can call the action logic directly.
      // However, processRegistration is in src/lib, so we need to import it.
      try {
        const { processRegistration } =
          await import("@/lib/process-registration");
        await processRegistration(
          pendingId,
          session.subscription as string,
          session.customer as string,
        );
      } catch (e) {
        console.error(
          "SetupPage processing error (might be already processed):",
          e,
        );
      }
    }

    const subdomain = session.metadata?.subdomain;
    if (subdomain) {
      redirect(`/provisionando?cliente=${subdomain}`);
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-2">Pagamento Recebido!</h1>
          <p>Estamos preparando sua loja. Aguarde um momento...</p>
        </div>
      </div>
    );
  }

  // Case 2: No Session, but Plan selected (Setup Flow)
  if (priceId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black py-10">
        <Suspense fallback={<div>Carregando...</div>}>
          <SetupContent priceId={priceId} />
        </Suspense>
      </div>
    );
  }

  // Case 3: Neither
  redirect("/");
}

import { SetupForm } from "@/components/setup/setup-form";

// Client component for the UI
function SetupContent({ priceId }: { priceId: string }) {
  return (
    <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-xl text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Configuração da Loja
        </h1>
        <p className="text-gray-600">
          Preencha os dados abaixo para criar sua loja e prosseguir para o
          pagamento.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-left">
        <SetupForm priceId={priceId} />
      </div>
    </div>
  );
}
