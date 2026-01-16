import { NextRequest, NextResponse } from "next/server";

/**
 * Minimal token endpoint (TEST MODE)
 * Exchanges code for a fake access token.
 * Next step we'll validate code/client and mint real tokens stored in Supabase.
 */
export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);

  const code = params.get("code") ?? "";
  if (code !== "TEST_CODE_123") {
    return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
  }

  return NextResponse.json({
    access_token: "TEST_ACCESS_TOKEN_ABC",
    token_type: "bearer",
    expires_in: 3600,
    scope: params.get("scope") ?? "basic",
  });
}

