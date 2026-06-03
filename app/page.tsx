"use client";

import { useEffect, useState } from "react";
import LangPicker from "@/components/LangPicker";
import { tr } from "@/lib/i18n";
import { createClient } from "@/lib/supabase-client";

type LastDraw = {
  platform: string;
  total: number;
  winners: { username: string; author?: string }[];
  cert_code?: string;
};

export default function Home() {
  const [lang, setLang] = useState("tr");
  const [lastDraw, setLastDraw] = useState<LastDraw | null>(null);
  const [user, setUser] = useState<any>(null);
  const t = tr(lang);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    supabase
      .from("draw_results")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setLastDraw(data); });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_40%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_40%)]" />

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <a href="/" className="text-xl font-black bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
          🎉 DrawPicker
        </a>
        <div className="flex items-center gap-3">
          <LangPicker lang={lang} setLang={setLang} accentHover="hover:border-sky-500" accentCheck="text-sky-400" />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-sm hidden sm:block">{user.email}</span>
              <button onClick={handleLogout} className="text-sm border border-white/10 hover:border-red-500 px-3 py-1.5 rounded-xl transition text-zinc-400 hover:text-red-400">
                Çıkış
              </button>
            </div>
          ) : (
            <a href="/auth/login" className="bg-gradient-to-r from-sky-600 to-sky-500 hover:opacity-90 text-white text-sm font-bold px-4 py-2 rounded-xl transition">
              Giriş Yap
            </a>
          )}
        </div>
      </nav>

      <div className="relative max-w-5xl mx-auto px-4 py-12">

        {/* HERO */}
        <section className="text-center mb-12">
          <h1 className="text-5xl sm:text-7xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Çekilişin
            </span>
            <br />
            <span className="text-white">Adresi!</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg mb-8">
            Güvenilir, şeffaf ve profesyonel çekilişler
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="/twitter" className="bg-gradient-to-r from-sky-600 to-sky-500 hover:opacity-90 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-sky-500/20">
              Çekiliş Yap →
            </a>
            <a href="#nasil" className="border border-white/10 hover:border-white/30 text-zinc-300 font-bold px-6 py-3 rounded-xl transition">
              ▶ Nasıl Çalışır?
            </a>
          </div>
          <p className="text-zinc-600 text-sm mt-4">Kredi kartı gerekmez • 200 katılımcıya kadar ücretsiz</p>
        </section>

        {/* SON ÇEKİLİŞ */}
        {lastDraw && (
          <div className="mb-10 bg-[#16161f]/90 border border-white/10 rounded-3xl p-6 hover:border-cyan-400/50 transition">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Son Çekiliş</div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="font-black text-xl mb-1">
                  {lastDraw.platform === "twitter" ? "𝕏 Twitter / X" : "▶️ YouTube"}
                </div>
                <div className="text-zinc-400 text-sm">
                  Toplam Katılımcı: {lastDraw.total?.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500 mb-1">Kazanan</div>
                <div className="text-cyan-300 font-black text-xl">
                  @{lastDraw.winners?.[0]?.username || "—"}
                </div>
                <div className="text-zinc-600 text-xs mt-1">Tebrikler 🎊</div>
              </div>
            </div>
            {lastDraw.cert_code && (
              <div className="mt-4 text-center font-mono text-xs text-zinc-500 border border-dashed border-white/10 rounded-xl py-2">
                Çekiliş Sertifikası: {lastDraw.cert_code}
              </div>
            )}
          </div>
        )}

        {/* PLATFORM KARTLARI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          <a href="/twitter" className="group bg-[#16161f]/90 border border-white/10 hover:border-sky-500 rounded-3xl p-8 transition">
            <div className="text-5xl mb-5">𝕏</div>
            <div className="text-2xl font-black text-sky-400 mb-2">X (Twitter) Çekilişi</div>
            <p className="text-zinc-400 text-sm mb-4">X gönderilerinizden adil ve rastgele kazanan seçin.</p>
            <ul className="text-zinc-500 text-xs space-y-1">
              <li>✓ Yorum filtreleme</li>
              <li>✓ Çoklu kazanan belirleme</li>
              <li>✓ Yedek kazanan seçimi</li>
            </ul>
          </a>

          <a href="/youtube" className="group bg-[#16161f]/90 border border-white/10 hover:border-purple-500 rounded-3xl p-8 transition">
            <div className="text-5xl mb-5">▶️</div>
            <div className="text-2xl font-black text-purple-400 mb-2">YouTube Çekilişi</div>
            <p className="text-zinc-400 text-sm mb-4">YouTube videolarınızdan adil ve rastgele kazanan seçin.</p>
            <ul className="text-zinc-500 text-xs space-y-1">
              <li>✓ Yorum filtreleme</li>
              <li>✓ Çoklu kazanan belirleme</li>
              <li>✓ Yedek kazanan seçimi</li>
            </ul>
          </a>
        </div>

      </div>
    </main>
  );
}
