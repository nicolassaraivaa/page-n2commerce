"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function createCheckoutSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/setup?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/`,
  });

  if (session.url) {
    redirect(session.url);
  }
}
