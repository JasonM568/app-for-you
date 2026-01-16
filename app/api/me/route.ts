import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function getBaseUrl(req: NextRequest) {
  // ✅ 你在 Vercel 設 BASE_URL=https://qbc-gpts.vercel.app 會最穩
  // 若未設定，就退回用 request origin
  return process.env.BASE_URL || req.nextUrl.origin;
}

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookieStore = await cookies(); // Next 16 型別上偏 async，用 await 最安全
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

  // ✅ 未登入：回引導文字 + 完整 login_url（給 GPT 印出可點擊連結）
  if (error || !data?.user) {
    const baseUrl = getBaseUrl(req);
    const login_url = `${baseUrl}/login`;

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

  // ✅ 已登入
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
