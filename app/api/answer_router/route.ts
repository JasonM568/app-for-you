import { NextRequest, NextResponse } from "next/server";

function getBearer(req: NextRequest) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

export async function POST(req: NextRequest) {
  const token = getBearer(req);
  if (token !== "TEST_ACCESS_TOKEN_ABC") {
    return NextResponse.json(
      { valid: false, login_url: "/login" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    valid: true,
    answer: `（已授權）收到你的訊息：${body?.message ?? ""}`,
  });
}

