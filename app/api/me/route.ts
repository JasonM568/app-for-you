import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // 我們用 res 來承接 supabase 可能要 set 的 cookies
  const res = new NextResponse();({ ok: true });

  const supabase = createServerClient(url, anon, {
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
  });

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    // 回傳時把 res 的 cookies 一起帶回去
    return NextResponse.json({ loggedIn: false }, { headers: res.headers });
  }

  return NextResponse.json(
    { loggedIn: true, user: { id: data.user.id, email: data.user.email } },
    { headers: res.headers }
  );
}
