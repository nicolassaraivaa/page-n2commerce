import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface SetupPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const { session_id } = await searchParams;
  const sessionId = Array.isArray(session_id) ? session_id[0] : session_id;

  if (!sessionId) {
    redirect("/payment-error");
  }

  console.log("SetupPage: Checking session", sessionId);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("SetupPage: Session retrieved", {
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
    });

    // Accept 'paid' OR 'no_payment_required' (for 100% off coupons or trials)
    if (
      session.payment_status !== "paid" &&
      session.payment_status !== "no_payment_required"
    ) {
      console.log("SetupPage: Payment not paid. Redirecting.");
      redirect("/payment-error");
    }

    console.log("SetupPage: Payment verified. Rendering form.");
    // Success! Render the setup form.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
        <Suspense fallback={<div>Carregando...</div>}>
          <SetupContent
            customerEmail={session.customer_details?.email || ""}
            customerName={session.customer_details?.name || ""}
            sessionId={sessionId}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    redirect("/payment-error");
  }
}

import { SetupForm } from "@/components/setup/setup-form";

// Client component for the UI
function SetupContent({
  customerEmail,
  customerName,
  sessionId,
}: {
  customerEmail: string;
  customerName: string;
  sessionId: string;
}) {
  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-2">Pagamento Confirmado! 🎉</h1>
      <p className="text-gray-600 mb-6">
        Obrigado, {customerName}.<br />
        Vamos ativar sua loja agora mesmo.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-left">
        <SetupForm sessionId={sessionId} customerEmail={customerEmail} />
      </div>
    </div>
  );
}
