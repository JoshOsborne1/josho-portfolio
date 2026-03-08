export const dynamic = "force-static";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Static export - return placeholder response
  return NextResponse.json({ 
    success: true,
    note: "Lead capture requires server runtime - configure in production"
  });
}
