"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleReset() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://drawpicker.io/auth/callback?type=recovery`,
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-2">
          🔑 <span className="text-sky-400">DrawPicker</span>
        </h1>
        <p className="text-zinc-500 text-center text-sm mb-8">Şifreni sıfırla</p>
        {sent ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <p className="text-green-400 font-bold">Email gönderildi!</p>
            <p className="text-zinc-400 text-sm mt-2">Emailini kontrol et ve linke tıkla.</p>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email adresin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#16161f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition mb-4"
            />
            {error && <p className="text-red-400 text-sm mb-3">❌ {error}</p>}
            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-600 to-sky-500 py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
            >
              {loading ? "..." : "Şifre Sıfırlama Linki Gönder"}
            </button>
          </>
        )}
        <p className="text-center text-zinc-500 text-sm mt-4">
          <a href="/auth/login" className="text-sky-400 hover:underline">← Giriş sayfasına dön</a>
        </p>
      </div>
    </main>
  );
}
