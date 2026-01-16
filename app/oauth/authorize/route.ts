import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const response_type = sp.get("response_type");
  const client_id = sp.get("client_id") ?? "";
  const redirect_uri = sp.get("redirect_uri") ?? "";
  const scope = sp.get("scope") ?? "basic";
  const state = sp.get("state") ?? "";

  if (response_type !== "code") {
    return NextResponse.json({ error: "unsupported_response_type" }, { status: 400 });
  }

  // ✅ Validate client_id (跟你 Vercel env: OAUTH_CLIENT_ID 一致)
  if (client_id !== process.env.OAUTH_CLIENT_ID) {
    return NextResponse.json({ error: "invalid_client" }, { status: 400 });
  }

  // ✅ Allowlist redirect_uri（你的 GPT 回呼 URL）
  const allowed = new Set([
    "https://chat.openai.com/aip/g-6967b65b2ce08191bc1dd2f4f786bbc4/oauth/callback",
  ]);
  if (!allowed.has(redirect_uri)) {
    return NextResponse.json({ error: "invalid_redirect_uri", got: redirect_uri }, { status: 400 });
  }

  // ---- Check Supabase login via cookies ----
  const res = new NextResponse();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();

  // 未登入 → 導到 /login，並帶 returnTo 回來續跑 authorize
  if (!data.user) {
    const loginUrl = new URL("/login", process.env.BASE_URL);
    loginUrl.searchParams.set("returnTo", req.nextUrl.toString());
    return NextResponse.redirect(loginUrl.toString(), { headers: res.headers });
  }

  // 已登入 → 產生一次性 code，寫入 Supabase
  const code = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  const admin = supabaseAdmin();
  const { error } = await admin.from("oauth_codes").insert({
    code,
    user_id: data.user.id,
    client_id,
    redirect_uri,
    scope,
    state,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: "server_error", detail: error.message }, { status: 500 });
  }

  // redirect 回 ChatGPT callback
  const cb = new URL(redirect_uri);
  cb.searchParams.set("code", code);
  if (state) cb.searchParams.set("state", state);

  return NextResponse.redirect(cb.toString(), { headers: res.headers });
}
