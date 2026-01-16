"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const sp = useSearchParams();
  const returnTo = useMemo(() => sp.get("returnTo") || "/", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Logging in...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(`Error: ${error.message}`);
    setMsg("Login success. Redirecting...");
    window.location.href = returnTo;
  }

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1>Log in</h1>
      <form onSubmit={onLogin} style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8, backgroundColor: "#ffffff", color: "#000000", border: "1px solid #ccc" }} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 8, backgroundColor: "#ffffff", color: "#000000", border: "1px solid #ccc" }} />
        </label>
        <button type="submit" style={{ padding: 10 }}>Log in</button>
      </form>
      <p style={{ marginTop: 12 }}>{msg}</p>
      <p style={{ marginTop: 12 }}>
        No account? <a href="/signup">Sign up</a>
      </p>
    </main>
  );
}

