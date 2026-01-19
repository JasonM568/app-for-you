"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginClient({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");
  
  const isOAuthFlow = returnTo && returnTo !== "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // 轉換 Email 未驗證的錯誤訊息
      if (error.message.includes("Email not confirmed")) {
        setMsg("您的Email還沒完成驗證，請到信箱收取認證信件。");
      } else {
        setMsg(error.message);
      }
      return;
    }
    
    setMsg("登入成功！");
    
    // 如果有 returnTo，自動跳轉
    if (isOAuthFlow) {
      const target = returnTo;
      if (target.startsWith("http")) {
        window.location.assign(target);
      } else {
        router.replace(target);
      }
    }
    // 如果沒有 returnTo，只顯示成功訊息和按鈕
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Meta 廣告分析師 - 登入</h1>
      
      {!isOAuthFlow && (
        <div style={{ padding: 12, backgroundColor: "#fff3cd", borderRadius: 8, marginBottom: 16, color: "#856404" }}>
          📌 使用說明：請先在 ChatGPT 中開啟 Meta 廣告分析師，當需要授權時系統會自動導向此頁面。
        </div>
      )}
      
      {msg ? <p style={{ color: msg.includes("成功") ? "green" : "crimson" }}>{msg}</p> : null}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8, backgroundColor: "#ffffff", color: "#000000" }}
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8, backgroundColor: "#ffffff", color: "#000000" }}
        />
        <button
          type="submit"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", backgroundColor: "#0070f3", color: "white", cursor: "pointer" }}
        >
          Sign in
        </button>
      </form>
      
      <div style={{ marginTop: 16, textAlign: "center", color: "#666" }}>
        第一次使用？
        <a 
          href={`/signup${isOAuthFlow ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
          style={{ color: "#0070f3", marginLeft: 4, textDecoration: "none", fontWeight: 600 }}
        >
          註冊新帳號
        </a>
      </div>
      
      {msg.includes("成功") && !isOAuthFlow && (
        <div style={{ marginTop: 20, padding: 16, backgroundColor: "#f0f9ff", borderRadius: 8, textAlign: "center" }}>
          <p style={{ marginBottom: 12, color: "#0070f3" }}>🎉 驗證完成！您已成功登入，請點擊下方按鈕返回 GPT 繼續對話。</p>
          <a 
            href="https://chatgpt.com/g/g-6967b65b2ce08191bc1dd2f4f786bbc4-meta-guang-gao-fen-xi-shi"
            style={{ 
              display: "inline-block",
              padding: "10px 20px", 
              backgroundColor: "#0070f3", 
              color: "white", 
              textDecoration: "none", 
              borderRadius: 8,
              fontWeight: 600
            }}
          >
            前往 GPT
          </a>
        </div>
      )}
      
      {msg.includes("成功") && isOAuthFlow && (
        <div style={{ marginTop: 20, padding: 16, backgroundColor: "#f0f9ff", borderRadius: 8, textAlign: "center" }}>
          <p style={{ color: "#0070f3" }}>🎉 驗證完成！正在自動返回 GPT...</p>
        </div>
      )}
    </div>
  );
}
