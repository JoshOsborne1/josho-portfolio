import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });

export async function POST(req: NextRequest) {
  try {
    const { priceId, email } = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://josho.pro';

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      line_items: [{ price: priceId || process.env.STRIPE_PRICE_MONTHLY, quantity: 1 }],
      success_url: `${baseUrl}/games?pro=success`,
      cancel_url: `${baseUrl}/games`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    };

    if (email) sessionParams.customer_email = email;

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
