"use client";

import { useEffect, useState } from "react";
import LangPicker from "@/components/LangPicker";
import { createClient } from "@/lib/supabase-client";
import { translations } from "@/lib/translations";

type LastDraw = {
  id?: string;
  platform: string;
  total: number;
  winners: { username: string; author?: string }[];
  cert_code?: string;
};

export default function Home() {
  const [lang, setLang] = useState("tr");
  const [lastDraw, setLastDraw] = useState<LastDraw | null>(null);
  const [user, setUser] = useState<any>(null);

  const t = translations[lang as keyof typeof translations] || translations.tr;

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

      <nav className="relative z-[9999] max-w-7xl mx-auto flex items-center justify-between px-5 py-5">
        <a href="/" className="text-2xl font-black tracking-tight">
          🎁 Draw<span className="text-pink-400">Picker</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-300">
          <a href="/" className="text-white border-b-2 border-cyan-400 pb-2">
            {t.nav.home}
          </a>
          <a href="#platforms" className="hover:text-white">
            Çekiliş Yap
          </a>
          <a href="#ozellikler" className="hover:text-white">
            {t.nav.features}
          </a>
          <a href="#sss" className="hover:text-white">
            {t.nav.faq}
          </a>
        </div>

        <div className="relative z-[10000] flex items-center gap-3">
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
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="text-sm font-black px-5 py-2 rounded-xl border border-white/10 hover:border-cyan-400 transition"
            >
              {t.nav.login}
            </a>
          )}
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-5 pt-12 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300 mb-7">
          🛡️ %100 Adil • Şeffaf • Güvenilir
        </div>

        <h1 className="text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight mb-7">
          Sosyal Medya Çekilişlerinde
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Adil Kazananı Seçin
          </span>
        </h1>

        <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Gelişmiş filtreleme sistemi ile botları engelleyin, gerçek katılımcıları seçin.
          Sertifikalı ve güvenilir çekiliş deneyimi.
        </p>
      </section>

      <section id="platforms" className="relative z-10 max-w-5xl mx-auto px-5 pb-14">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden bg-[#141421]/90 border border-red-500/30 rounded-3xl p-7 shadow-2xl">
            <div className="absolute right-8 top-16 text-[9rem] text-white/[0.04]">▶</div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-3xl mb-5">
              ▶
            </div>

            <h2 className="text-3xl font-black mb-3">YouTube Çekilişi</h2>
            <p className="text-zinc-400 text-sm mb-6">
              YouTube yorumlarından adil ve rastgele kazanan seçin.
            </p>

            <div className="space-y-3 text-sm text-zinc-300 mb-7">
              <div>✓ Yorum filtreleme</div>
              <div>✓ Çoklu kazanan belirleme</div>
              <div>✓ Yedek kazanan seçimi</div>
              <div>✓ Sertifika ile kanıt</div>
            </div>

            <a
              href="/youtube"
              className="block w-full text-center bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 py-4 rounded-xl font-black transition"
            >
              YouTube Çekilişi Yap →
            </a>
          </div>

          <div className="relative overflow-hidden bg-[#141421]/90 border border-sky-500/30 rounded-3xl p-7 shadow-2xl">
            <div className="absolute right-8 top-10 text-[10rem] text-white/[0.04]">𝕏</div>

            <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-3xl mb-5">
              𝕏
            </div>

            <h2 className="text-3xl font-black mb-3">X (Twitter) Çekilişi</h2>
            <p className="text-zinc-400 text-sm mb-6">
              X gönderilerinizden adil ve rastgele kazanan seçin.
            </p>

            <div className="space-y-3 text-sm text-zinc-300 mb-7">
              <div>✓ Yorum filtreleme</div>
              <div>✓ Çoklu kazanan belirleme</div>
              <div>✓ Yedek kazanan seçimi</div>
              <div>✓ Sertifika ile kanıt</div>
            </div>

            <a
              href="/twitter"
              className="block w-full text-center bg-gradient-to-r from-cyan-400 to-blue-600 hover:opacity-90 py-4 rounded-xl font-black transition"
            >
              X Çekilişi Yap →
            </a>
          </div>
        </div>
      </section>

      <section id="ozellikler" className="relative z-10 max-w-5xl mx-auto px-5 pb-20">
        <div className="bg-[#141421]/80 border border-white/10 rounded-3xl p-6">
          <h2 className="text-center text-3xl font-black mb-8">
            Neden DrawPicker?
          </h2>

          <div className="grid sm:grid-cols-5 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl mb-3">🛡️</div>
              <div className="font-black mb-2">%100 Adil</div>
              <p className="text-xs text-zinc-400">
                Rastgele algoritmamız ile her çekiliş tamamen adildir.
              </p>
            </div>

            <div className="p-4">
              <div className="text-3xl mb-3">🔒</div>
              <div className="font-black mb-2">Güvenilir</div>
              <p className="text-xs text-zinc-400">
                Verileriniz güvenli şekilde işlenir ve saklanmaz.
              </p>
            </div>

            <div className="p-4">
              <div className="text-3xl mb-3">🏅</div>
              <div className="font-black mb-2">Sertifikalı</div>
              <p className="text-xs text-zinc-400">
                Tüm sonuçlar sertifika ile kanıtlanabilir.
              </p>
            </div>

            <div className="p-4">
              <div className="text-3xl mb-3">⚡</div>
              <div className="font-black mb-2">Hızlı</div>
              <p className="text-xs text-zinc-400">
                Saniyeler içinde çekilişinizi tamamlayın.
              </p>
            </div>

            <div className="p-4">
              <div className="text-3xl mb-3">📱</div>
              <div className="font-black mb-2">Mobil Uyumlu</div>
              <p className="text-xs text-zinc-400">
                Tüm cihazlarda kusursuz deneyim.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}