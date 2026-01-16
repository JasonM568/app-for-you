"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SignupPage() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Signing up...");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg(`Error: ${error.message}`);
    setMsg("Signup success. You can now log in.");
  }

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1>Sign up</h1>
      <form onSubmit={onSignup} style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </label>
        <button type="submit" style={{ padding: 10 }}>Create account</button>
      </form>
      <p style={{ marginTop: 12 }}>{msg}</p>
      <p style={{ marginTop: 12 }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </main>
  );
}

