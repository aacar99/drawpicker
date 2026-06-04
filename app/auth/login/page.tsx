"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const supabase = createClient();

  async function handleEmail() {
    setLoading(true);
    setError("");
    setMessage("");
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else setMessage("Email adresinize dogrulama linki gonderildi!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else location.href = "/";
    }
    setLoading(false);
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-2">
          🎉 <span className="text-sky-400">DrawPicker</span>
        </h1>
        <p className="text-zinc-500 text-center text-sm mb-8">
          {isSignUp ? "Hesap olustur" : "Giris yap"}
        </p>
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-3 rounded-xl mb-4 hover:bg-gray-100 transition"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
          Google ile devam et
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-zinc-600 text-xs">veya</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition mb-3"
        />
        <input
          type="password"
          placeholder="Sifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition mb-4"
        />
        {error && <p className="text-red-400 text-sm mb-3">❌ {error}</p>}
        {message && <p className="text-green-400 text-sm mb-3">✅ {message}</p>}
        <button
          onClick={handleEmail}
          disabled={loading}
          className="w-full bg-gradient-to-r from-sky-600 to-sky-500 py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
        >
          {loading ? "..." : isSignUp ? "Kayit Ol" : "Giris Yap"}
        </button>
        <p className="text-center text-zinc-500 text-sm mt-2 mb-2"><a href="/auth/reset" className="text-sky-400 hover:underline text-sm">Şifremi Unuttum?</a></p>
        <p className="text-center text-zinc-500 text-sm mt-4">
          {isSignUp ? "Zaten hesabin var mi?" : "Hesabin yok mu?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-sky-400 hover:underline">
            {isSignUp ? "Giris yap" : "Kayit ol"}
          </button>
        </p>
      </div>
    </main>
  );
}
