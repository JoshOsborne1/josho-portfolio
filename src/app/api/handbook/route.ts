export const dynamic = "force-static";
export const revalidate = 60;

import { NextResponse } from "next/server";

export async function GET() {
  // Static export - return placeholder response
  return NextResponse.json({ 
    handbook: [],
    note: "Handbook API requires server runtime - configure in production"
  });
}
