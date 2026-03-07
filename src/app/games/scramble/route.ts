import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const html = readFileSync(join(process.cwd(), 'public', 'scramble.html'), 'utf8');
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new NextResponse('Game not found', { status: 404 });
  }
}
