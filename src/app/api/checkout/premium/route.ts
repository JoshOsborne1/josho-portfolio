export const dynamic = "force-static";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { priceId } = await req.json();

  // Static export - return placeholder response
  // In production with server, this would create Stripe checkout session
  return NextResponse.json({ 
    url: "https://buy.stripe.com/PLACEHOLDER",
    note: "Stripe checkout requires server runtime - configure in production"
  });
}
