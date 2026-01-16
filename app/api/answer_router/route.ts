import { NextRequest, NextResponse } from "next/server";

/**
 * Extract Bearer token from Authorization header
 */
function getBearer(req: NextRequest) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

export async function POST(req: NextRequest) {
  const token = getBearer(req);

  /**
   * ❌ 未登入 / 未帶 token → 導向 Login → OAuth authorize
   */
  if (!token) {
    const baseUrl =
      process.env.BASE_URL?.replace(/\/$/, "") ||
      "https://qbc-gpts.vercel.app";

    // OAuth authorize URL（登入完成後會回來這裡）
    const authorizeUrl = new URL("/oauth/authorize", baseUrl);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set(
      "client_id",
      process.env.OAUTH_CLIENT_ID || ""
    );
    authorizeUrl.searchParams.set(
      "redirect_uri",
      "https://chat.openai.com/aip/g-6967b65b2ce08191bc1dd2f4f786bbc4/oauth/callback"
    );
    authorizeUrl.searchParams.set("scope", "basic");
    authorizeUrl.searchParams.set("state", "from_answer_router");

    // Login 頁（完成後自動導回 authorize）
    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set("returnTo", authorizeUrl.toString());

    return NextResponse.json(
      {
        valid: false,
        note: "請先完成登入驗證後才能使用此 GPT。",
        login_url: loginUrl.toString(),
      },
      { status: 401 }
    );
  }

  /**
   * ✅ 已登入（目前僅示意，後續可接 Supabase token 驗證）
   */
  const body = await req.json().catch(() => ({}));

  return NextResponse.json({
    valid: true,
    answer: `（已授權）收到你的訊息：${body?.message ?? ""}`,
  });
}
