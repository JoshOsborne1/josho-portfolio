import { NextResponse } from 'next/server';

const REPO = 'JoshOsborne1/josho-portfolio';
const FILE = 'handbook-data.json';
const BRANCH = 'main';
const RAW_URL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${FILE}`;

// GitHub API helper
async function ghRequest(method: string, path: string, body?: object) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN env var not set');
  const res = await fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    method,
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub ${method} ${path}: ${res.status} ${err.slice(0, 200)}`);
  }
  return res.json();
}

export async function GET() {
  try {
    // Use raw URL for fast reads (no auth needed for public repo)
    const res = await fetch(`${RAW_URL}?_=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`raw fetch ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ settings: {}, edits: {}, selected: [], history: [], savedAt: null, error: String(e) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const savedAt = new Date().toISOString();

    // Get current SHA (required for updates)
    const meta = await ghRequest('GET', `contents/${FILE}`);
    const sha: string = meta.sha;

    // Enforce history limit (keep last 100 snapshots)
    const incoming = body as { settings: object; edits: object; selected: string[]; history?: object[] };
    const history: object[] = Array.isArray(incoming.history) ? incoming.history.slice(0, 100) : [];

    const payload = {
      settings: incoming.settings || {},
      edits: incoming.edits || {},
      selected: incoming.selected || [],
      history,
      savedAt,
    };

    const content = Buffer.from(JSON.stringify(payload, null, 2)).toString('base64');

    await ghRequest('PUT', `contents/${FILE}`, {
      message: `handbook: save ${savedAt}`,
      content,
      sha,
      branch: BRANCH,
    });

    return NextResponse.json({ ok: true, savedAt });
  } catch (e) {
    console.error('Handbook save error:', e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
