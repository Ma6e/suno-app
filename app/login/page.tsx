"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  async function signUp() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your email to confirm sign up.");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">AI MUSIC STUDIO</p>
          <h1 className="mt-2 text-3xl font-bold text-white">SunoFlow</h1>
        </div>

        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 p-3 text-white outline-none placeholder:text-slate-500"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 p-3 text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={signIn}
            disabled={loading}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#7c9cff] to-[#5de4c6] px-4 py-3 font-semibold text-slate-950"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <button
            onClick={signUp}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
