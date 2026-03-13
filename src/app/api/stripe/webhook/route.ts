import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });

const DATA_PATH = path.join(process.cwd(), 'data', 'subscriptions.json');

async function readSubs(): Promise<Record<string, { status: string; email: string; priceId: string; currentPeriodEnd: number }>> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeSubs(data: Record<string, unknown>) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const subs = await readSubs();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'subscription' && session.customer) {
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        subs[customerId] = {
          status: sub.status,
          email: session.customer_email || '',
          priceId: sub.items.data[0]?.price.id || '',
          currentPeriodEnd: (sub as unknown as { current_period_end: number }).current_period_end ?? 0,
        };
        await writeSubs(subs);
      }
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
      if (subs[customerId]) {
        subs[customerId].status = sub.status;
        subs[customerId].currentPeriodEnd = (sub as unknown as { current_period_end: number }).current_period_end ?? 0;
        await writeSubs(subs);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
      if (subs[customerId]) {
        subs[customerId].status = 'canceled';
        await writeSubs(subs);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
