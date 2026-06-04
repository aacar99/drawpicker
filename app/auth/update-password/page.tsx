"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setDone(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-2">
          🔑 <span className="text-sky-400">DrawPicker</span>
        </h1>
        <p className="text-zinc-500 text-center text-sm mb-8">Yeni şifreni belirle</p>

        {done ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-green-400 font-bold">Şifren güncellendi!</p>
            <a href="/auth/login" className="block mt-4 text-sky-400 hover:underline text-sm">
              Giriş yap →
            </a>
          </div>
        ) : (
          <>
            <input
              type="password"
              placeholder="Yeni şifren"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#16161f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition mb-4"
            />
            {error && <p className="text-red-400 text-sm mb-3">❌ {error}</p>}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-600 to-sky-500 py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
            >
              {loading ? "..." : "Şifremi Güncelle"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
