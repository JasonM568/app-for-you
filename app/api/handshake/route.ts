import { NextResponse } from "next/server";

export async function POST() {
  // Purpose: show onboarding text in the consent window + provide a harmless endpoint.
  return NextResponse.json({ ok: true });
}
