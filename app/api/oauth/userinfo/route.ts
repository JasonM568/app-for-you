import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getBearer(req: NextRequest) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

export async function GET(req: NextRequest) {
  const token = getBearer(req);

  if (!token || !token.startsWith("TOKEN_")) {
    return NextResponse.json({ 
      error: "invalid_token",
      message: "歡迎使用Meta廣告分析師的服務，接下來我將與您進行廣告分析討論"
    }, { status: 401 });
  }

  // Extract user_id from token
  const user_id = token.replace("TOKEN_", "");

  // Get user info from Supabase
  const admin = supabaseAdmin();
  const { data, error } = await admin.auth.admin.getUserById(user_id);

  if (error || !data.user) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }

  return NextResponse.json({
    id: data.user.id,
    email: data.user.email,
    name: "Meta 廣告分析師",
    message: "歡迎使用Meta廣告分析師的服務，接下來我將與您進行廣告分析討論",
  });
}
