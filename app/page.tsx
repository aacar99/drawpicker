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
      .then(({ data }) => {
        if (data) setLastDraw(data);
      });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#0ea5e933,transparent_32%),radial-gradient(circle_at_85%_45%,#a855f733,transparent_35%),linear-gradient(180deg,#080812,#0b0b14)]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:48px_48px]" />

      <nav className="relative z-10 max-w-7xl mx-auto flex items-center justify-between px-5 py-5">
        <a href="/" className="text-2xl font-black tracking-tight">
          draw<span className="text-pink-400">picker</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-300">
          <a href="/" className="text-white border-b-2 border-cyan-400 pb-2">Ana Sayfa</a>
          <a href="#ozellikler" className="hover:text-white">Özellikler</a>
          <a href="#nasil" className="hover:text-white">Nasıl Çalışır?</a>
          <a href="#fiyat" className="hover:text-white">Fiyatlandırma</a>
          <a href="#sss" className="hover:text-white">SSS</a>
          <a href="#iletisim" className="hover:text-white">İletişim</a>
        </div>

        <div className="flex items-center gap-3">
          <LangPicker
            lang={lang}
            setLang={setLang}
            accentHover="hover:border-sky-500"
            accentCheck="text-sky-400"
          />

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-sm hidden lg:block max-w-[180px] truncate">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm border border-white/10 hover:border-red-500 px-4 py-2 rounded-xl transition text-zinc-300 hover:text-red-400"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="text-sm font-black px-5 py-2 rounded-xl border border-white/10 hover:border-cyan-400 transition"
            >
              Giriş Yap
            </a>
          )}
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-5 pt-14 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300 mb-7">
            🛡️ %100 Adil • Şeffaf • Güvenilir
          </div>

          <h1 className="text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight mb-7">
            Adil Çekilişin
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
              Tek Adresi!
            </span>
          </h1>

          <p className="text-zinc-300 text-lg max-w-xl leading-relaxed mb-8">
            X ve YouTube’da güvenilir, şeffaf ve profesyonel çekilişler düzenleyin.
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <a
              href={user ? "/twitter" : "/auth/login"}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 hover:opacity-90 text-white font-black px-7 py-4 rounded-xl transition shadow-lg shadow-sky-500/20"
            >
              Hemen Çekiliş Yap →
            </a>

            <a
              href="#nasil"
              className="border border-white/10 bg-white/5 hover:border-white/30 text-zinc-200 font-black px-7 py-4 rounded-xl transition"
            >
              ▶ Nasıl Çalışır?
            </a>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-400 font-semibold">
            <span>▣ Ücretsiz</span>
            <span>•</span>
            <span>Kayıt gerekmez</span>
            <span>•</span>
            <span>200 katılımcıya kadar ücretsiz</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-r from-pink-500/20 to-sky-500/20 blur-3xl" />

          <div className="relative bg-[#141421]/90 border border-white/10 rounded-[2rem] p-6 shadow-2xl">
            <div className="text-sm text-zinc-400 font-bold mb-4">Son Çekiliş</div>

            <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-sky-400 flex items-center justify-center text-3xl">
                  🏆
                </div>

                <div>
                  <div className="text-zinc-400 text-sm">Kazanan</div>
                  <div className="text-2xl font-black">
                    @{lastDraw?.winners?.[0]?.username || "kerem.demir"}
                  </div>
                  <div className="text-zinc-500 text-sm">Tebrikler! 🎉</div>
                </div>
              </div>

              <a
                href={lastDraw?.cert_code ? "#" : "#"}
                className="inline-block mt-4 text-xs font-black bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg transition"
              >
                Sonucu Görüntüle
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">💬</div>
                <div className="font-black text-xl">
                  {(lastDraw?.total || 2142).toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-500">Toplam Yorum</div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">👥</div>
                <div className="font-black text-xl">1.356</div>
                <div className="text-[11px] text-zinc-500">Uygun Katılımcı</div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-black text-xl">1</div>
                <div className="text-[11px] text-zinc-500">Kazanan</div>
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.03] rounded-xl px-4 py-3 text-center text-xs font-mono text-zinc-300">
              Çekiliş Sertifikası: {lastDraw?.cert_code || "DP-A7F3K9L2B1"}
            </div>
          </div>
        </div>
      </section>

      <section id="ozellikler" className="relative z-10 max-w-7xl mx-auto px-5 pb-20">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-black mb-1">Hızlı Sonuç</div>
            <p className="text-sm text-zinc-400">Saniyeler içinde çekiliş sonucu alın.</p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">📜</div>
            <div className="font-black mb-1">Sertifikalı</div>
            <p className="text-sm text-zinc-400">Doğrulanabilir çekiliş sertifikası oluşturulur.</p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">🔒</div>
            <div className="font-black mb-1">Güvenli</div>
            <p className="text-sm text-zinc-400">Sonuçlar kayıt altında tutulur ve paylaşılabilir.</p>
          </div>
        </div>
      </section>
    </main>
  );
}