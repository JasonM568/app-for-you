"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (code) {
      const supabase = supabaseBrowser();
      
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.error("認證失敗:", error);
          router.push("/login");
        } else {
          // 認證成功，導向登入頁面
          router.push("/login");
        }
      });
    }
  }, [searchParams, router]);

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "40px auto", textAlign: "center" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Meta 廣告分析師</h1>
      <p style={{ color: "#666" }}>正在處理認證...</p>
    </div>
  );
}
