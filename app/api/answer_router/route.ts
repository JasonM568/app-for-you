import { NextRequest, NextResponse } from "next/server";

function getBearer(req: NextRequest) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

export async function POST(req: NextRequest) {
  const token = getBearer(req);
  if (token !== "TEST_ACCESS_TOKEN_ABC") {
    const baseUrl = process.env.BASE_URL || "https://qbc-gpts.vercel.app";

    // 讓使用者登入後，回到 authorize 繼續走 OAuth
    const authorizeUrl = new URL("/oauth/authorize", baseUrl);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("client_id", process.env.OAUTH_CLIENT_ID || "");
    authorizeUrl.searchParams.set(
      "redirect_uri",
      "https://chat.openai.com/aip/g-d3f09556f71f0d404bdecd936d5a26362e82a34e/oauth/callback"
    );
    authorizeUrl.searchParams.set("scope", "basic");
    authorizeUrl.searchParams.set("state", "from_answer_router");

    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set("returnTo", authorizeUrl.toString());

    return NextResponse.json(
      { valid: false, login_url: loginUrl.toString() },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    valid: true,
    answer: `（已授權）收到你的訊息：${body?.message ?? ""}`,
  });
}

