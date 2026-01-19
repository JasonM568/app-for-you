import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getBaseUrl(req: NextRequest) {
  return process.env.BASE_URL || req.nextUrl.origin;
}

function getBearer(req: NextRequest) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

export async function GET(req: NextRequest) {
  // 優先检查 Bearer token（OAuth 流程）
  const token = getBearer(req);
  if (token && token.startsWith("TOKEN_")) {
    const user_id = token.replace("TOKEN_", "");
    const admin = supabaseAdmin();
    const { data, error } = await admin.auth.admin.getUserById(user_id);

    if (!error && data.user) {
      return NextResponse.json({
        loggedIn: true,
        valid: true,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      });
    }
  }

  // 如果沒有 token，检查 cookies
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // 某些環境 set cookie 可能不允許，忽略即可
        }
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    const baseUrl = getBaseUrl(req);
    const login_url = `${baseUrl.replace(/\s+/g, "")}/login`;

    return NextResponse.json(
      {
        loggedIn: false,
        valid: false,
        note: "首次使用請先點擊下方『登入』完成驗證，完成後我才會開始回答你的問題。",
        login_url,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      loggedIn: true,
      valid: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    },
    { status: 200 }
  );
}
