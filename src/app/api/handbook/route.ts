import { NextResponse } from 'next/server';

const VPS = 'http://89.167.8.42:3011';

export async function GET() {
  try {
    const res = await fetch(`${VPS}/handbook`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`VPS returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ settings: {}, edits: {}, selected: [], savedAt: null, error: String(e) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${VPS}/handbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
