import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);

  const code = params.get("code") ?? "";
  const client_id = params.get("client_id") ?? "";
  const client_secret = params.get("client_secret") ?? "";

  // Validate client
  if (client_id !== process.env.OAUTH_CLIENT_ID || client_secret !== process.env.OAUTH_CLIENT_SECRET) {
    return NextResponse.json({ error: "invalid_client" }, { status: 401 });
  }

  // Validate code from database
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("oauth_codes")
    .select("*")
    .eq("code", code)
    .eq("client_id", client_id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
  }

  // Check expiration
  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: "invalid_grant", detail: "code expired" }, { status: 400 });
  }

  // Delete used code
  await admin.from("oauth_codes").delete().eq("code", code);

  // Return access token (using user_id as token for simplicity)
  return NextResponse.json({
    access_token: `TOKEN_${data.user_id}`,
    token_type: "bearer",
    expires_in: 3600,
    scope: data.scope,
  });
}

