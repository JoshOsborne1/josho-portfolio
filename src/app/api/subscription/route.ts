import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_PATH = path.join(process.cwd(), 'data', 'subscriptions.json');

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json({ isPro: false });

  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    const subs: Record<string, { status: string; email: string; currentPeriodEnd: number }> = JSON.parse(raw);
    const match = Object.values(subs).find(s => s.email === email && s.status === 'active');
    if (match) {
      return NextResponse.json({ isPro: true, currentPeriodEnd: match.currentPeriodEnd });
    }
  } catch {
    // no data file yet
  }

  return NextResponse.json({ isPro: false });
}
