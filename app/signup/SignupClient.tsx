"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SignupClient({ returnTo }: { returnTo: string }) {
  const supabase = supabaseBrowser();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg("正在建立您的帳號...");
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
    });
    
    // Supabase 返回 user 但 identities 為空表示 email 已存在
    if (data?.user && data.user.identities && data.user.identities.length === 0) {
      return setMsg("此帳號已經註冊成功，請至登入頁面登入。");
    }
    
    if (error) {
      // 檢查各種可能的重複註冊錯誤訊息
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes("already") || errorMsg.includes("exist") || errorMsg.includes("duplicate")) {
        return setMsg("此帳號已經註冊成功，請至登入頁面登入。");
      }
      return setMsg(`Error: ${error.message}`);
    }
    
    setMsg("🎉 帳號建立成功！正在跳轉到登入頁面...");
    
    // 延遲 1.5 秒後跳轉到登入頁面
    setTimeout(() => {
      const loginUrl = `/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`;
      router.push(loginUrl);
    }, 1500);
  }

  return (
    <main style={{ padding: 24, maxWidth: 520, margin: "40px auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Meta 廣告分析師 - 建立新帳號</h1>
      
      <div style={{ padding: 12, backgroundColor: "#fff3cd", borderRadius: 8, marginBottom: 16, color: "#856404" }}>
        📌 歡迎使用 Meta 廣告分析師！請先註冊帳號，完成後即可在 ChatGPT 中使用所有分析功能。
      </div>
      
      {msg ? (
        <p style={{ 
          color: msg.includes("🎉") ? "green" : msg.includes("Error") ? "crimson" : msg.includes("此帳號已經註冊") ? "#d97706" : "#666", 
          marginBottom: 12,
          fontWeight: msg.includes("此帳號已經註冊") ? 600 : 400,
          backgroundColor: msg.includes("此帳號已經註冊") ? "#fef3c7" : "transparent",
          padding: msg.includes("此帳號已經註冊") ? "12px" : "0",
          borderRadius: msg.includes("此帳號已經註冊") ? "8px" : "0",
          border: msg.includes("此帳號已經註冊") ? "1px solid #fbbf24" : "none"
        }}>
          {msg}
        </p>
      ) : null}
      
      <form onSubmit={onSignup} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8, backgroundColor: "#ffffff", color: "#000000" }} 
          />
        </label>
        <label>
          Password
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8, backgroundColor: "#ffffff", color: "#000000" }} 
          />
        </label>
        <button 
          type="submit" 
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", backgroundColor: "#0070f3", color: "white", cursor: "pointer", fontWeight: 600 }}
        >
          註冊並開始使用
        </button>
      </form>
      
      <div style={{ marginTop: 16, textAlign: "center", color: "#666" }}>
        已經有帳號了？
        <a 
          href={`/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
          style={{ color: "#0070f3", marginLeft: 4, textDecoration: "none", fontWeight: 600 }}
        >
          前往登入
        </a>
      </div>
    </main>
  );
}
