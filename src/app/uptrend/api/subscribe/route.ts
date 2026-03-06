// src/app/uptrend/api/subscribe/route.ts
// POST {email, company, website} — saves inbound lead to leads/uptrend-inbound.json
// CORS: josho.pro only

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const CORS_ORIGIN = 'https://josho.pro';
const LEADS_DIR = path.join(process.cwd(), 'leads');
const LEADS_FILE = path.join(LEADS_DIR, 'uptrend-inbound.json');

function corsHeaders(origin: string | null) {
  const allowed = origin === CORS_ORIGIN || origin === 'http://josho.pro';
  return {
    'Access-Control-Allow-Origin': allowed ? origin! : CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  let body: { email?: string; company?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers });
  }

  const { email, company, website } = body;
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 422, headers });
  }

  // Ensure leads dir exists
  if (!existsSync(LEADS_DIR)) mkdirSync(LEADS_DIR, { recursive: true });

  // Read or create leads file
  let leads: Array<Record<string, string>> = [];
  if (existsSync(LEADS_FILE)) {
    try {
      leads = JSON.parse(readFileSync(LEADS_FILE, 'utf8'));
    } catch {
      leads = [];
    }
  }

  // Deduplicate by email
  const already = leads.find((l) => l.email === email);
  if (already) {
    return NextResponse.json({ ok: true, duplicate: true }, { status: 200, headers });
  }

  leads.push({
    email,
    company: company || '',
    website: website || '',
    submittedAt: new Date().toISOString(),
    source: 'uptrend-landing',
  });

  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

  return NextResponse.json({ ok: true }, { status: 201, headers });
}
