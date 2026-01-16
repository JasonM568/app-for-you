import { NextRequest, NextResponse } from "next/server";

/**
 * Minimal authorize endpoint (TEST MODE)
 * It validates redirect_uri allowlist and immediately redirects back with a fake code.
 * Next step we'll replace this with real Supabase session check + real code issuing.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const redirect_uri = sp.get("redirect_uri") ?? "";
  const state = sp.get("state") ?? "";

  // ✅ Put your GPT callback URL here (allowlist)
  const allowed = new Set([
    "https://chat.openai.com/aip/g-d3f09556f71f0d404bdecd936d5a26362e82a34e/oauth/callback",
  ]);

  if (!allowed.has(redirect_uri)) {
    return NextResponse.json(
      { error: "invalid_redirect_uri", got: redirect_uri },
      { status: 400 }
    );
  }

  // TEST: always "authorize" and send a fake code back
  const cb = new URL(redirect_uri);
  cb.searchParams.set("code", "TEST_CODE_123");
  if (state) cb.searchParams.set("state", state);

  return NextResponse.redirect(cb.toString(), 302);
}

