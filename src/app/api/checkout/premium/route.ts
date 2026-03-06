import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-10-28" as any });

export async function POST(req: Request) {
  const { priceId } = await req.json();

  const priceMap: Record<string, string> = {
    STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID ?? "",
    STRIPE_YEARLY_PRICE_ID: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID ?? "",
  };

  const resolvedPriceId = priceMap[priceId] ?? priceId;
  if (!resolvedPriceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: resolvedPriceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium`,
    metadata: { source: "josho.pro" },
  });

  return NextResponse.json({ url: session.url });
}
