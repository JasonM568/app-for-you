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
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg(`Error: ${error.message}`);
    setMsg("🎉 帳號建立成功！請點擊下方連結登入，或返回 GPT 重新授權。");
  }

  return (
    <main style={{ padding: 24, maxWidth: 520, margin: "40px auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Meta 廣告分析師 - 建立新帳號</h1>
      
      <div style={{ padding: 12, backgroundColor: "#fff3cd", borderRadius: 8, marginBottom: 16, color: "#856404" }}>
        📌 歡迎使用 Meta 廣告分析師！請先註冊帳號，完成後即可在 ChatGPT 中使用所有分析功能。
      </div>
      
      {msg ? <p style={{ color: msg.includes("🎉") ? "green" : msg.includes("Error") ? "crimson" : "#666", marginBottom: 12 }}>{msg}</p> : null}
      
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
