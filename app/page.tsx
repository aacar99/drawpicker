"use client";

import { useEffect, useState } from "react";
import LangPicker from "@/components/LangPicker";
import { createClient } from "@/lib/supabase-client";
import { translations } from "@/lib/translations";

type LastDraw = {
  id?: string;
  platform: string;
  total: number;
  winners: {
    username: string;
    author?: string;
    avatar?: string;
    image?: string;
    profilePicture?: string;
  }[];
  cert_code?: string;
};

export default function Home() {
  const [lang, setLang] = useState("tr");
  const [lastDraw, setLastDraw] = useState<LastDraw | null>(null);
  const [user, setUser] = useState<any>(null);

  const t =
    translations[lang as keyof typeof translations] ||
    translations.tr;

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

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

  const lastWinner = lastDraw?.winners?.[0];

  return (
    <main className="min-h-screen bg-[#080812] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#0ea5e933,transparent_32%),radial-gradient(circle_at_85%_45%,#a855f733,transparent_35%),linear-gradient(180deg,#080812,#0b0b14)]" />

      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* NAVBAR */}

      <nav className="relative z-[9999] max-w-7xl mx-auto flex items-center justify-between px-5 py-5 border-b border-white/10">
        <a href="/" className="text-2xl font-black tracking-tight">
          🎁 Draw<span className="text-pink-400">Picker</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-300">
          <a
            href="/"
            className="text-white border-b-2 border-cyan-400 pb-2"
          >
            {t.nav.home}
          </a>

          <a href="#platforms" className="hover:text-white">
            {t.nav.features}
          </a>

          <a href="#ozellikler" className="hover:text-white">
            {t.nav.how}
          </a>

          <a href="#sss" className="hover:text-white">
            {t.nav.faq}
          </a>

          <a href="#iletisim" className="hover:text-white">
            {t.nav.contact}
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
            <div className="flex items-center gap-3">
              <span className="hidden lg:block text-sm text-zinc-400 max-w-[180px] truncate">
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

      {/* HERO */}

      <section className="relative z-10 max-w-7xl mx-auto px-5 pt-14 pb-14 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300 mb-7">
          {t.hero.badge}
        </div>

        <h1 className="text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight mb-7">
          {t.hero.title1}
          <br />

          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
            {t.hero.title2}
          </span>
        </h1>

        <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          {t.hero.desc}
        </p>
      </section>

      {/* PLATFORM CARDS */}

      <section
        id="platforms"
        className="relative z-10 max-w-7xl mx-auto px-5 pb-14"
      >
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* YOUTUBE */}

            <div className="relative overflow-hidden bg-[#141421]/90 border border-red-500/30 rounded-3xl p-7 shadow-2xl">
              <div className="absolute right-8 top-16 text-[9rem] text-white/[0.04]">
                ▶
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-3xl mb-5">
                ▶
              </div>

              <h2 className="text-3xl font-black mb-3">
                YouTube Giveaway
              </h2>

              <p className="text-zinc-400 text-sm mb-6">
                Pick a fair random winner from YouTube comments.
              </p>

              <div className="space-y-3 text-sm text-zinc-300 mb-7">
                <div>✓ Comment filtering</div>
                <div>✓ Multiple winners</div>
                <div>✓ Backup winners</div>
                <div>✓ Proof certificate</div>
              </div>

              <a
                href="/youtube"
                className="block w-full text-center bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 py-4 rounded-xl font-black transition"
              >
                {lang === "tr"
                  ? "YouTube Çekilişi Yap →"
                  : "Start YouTube Giveaway →"}
              </a>
            </div>

            {/* TWITTER */}

            <div className="relative overflow-hidden bg-[#141421]/90 border border-sky-500/30 rounded-3xl p-7 shadow-2xl">
              <div className="absolute right-8 top-10 text-[10rem] text-white/[0.04]">
                𝕏
              </div>

              <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-3xl mb-5">
                𝕏
              </div>

              <h2 className="text-3xl font-black mb-3">
                X (Twitter) Giveaway
              </h2>

              <p className="text-zinc-400 text-sm mb-6">
                Pick a fair random winner from your X posts.
              </p>

              <div className="space-y-3 text-sm text-zinc-300 mb-7">
                <div>✓ Comment filtering</div>
                <div>✓ Multiple winners</div>
                <div>✓ Backup winners</div>
                <div>✓ Proof certificate</div>
              </div>

              <a
                href="/twitter"
                className="block w-full text-center bg-gradient-to-r from-cyan-400 to-blue-600 hover:opacity-90 py-4 rounded-xl font-black transition"
              >
                {lang === "tr"
                  ? "X Çekilişi Yap →"
                  : "Start X Giveaway →"}
              </a>
            </div>
          </div>

          {/* LAST WINNER */}

          <div className="bg-[#141421]/90 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="text-sm text-zinc-400 font-bold mb-4">
              🏆 {t.lastDraw.title}
            </div>

            <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5 mb-5">
              <div className="flex items-center gap-4">
                {lastWinner?.avatar ||
                lastWinner?.image ||
                lastWinner?.profilePicture ? (
                  <img
                    src={
                      lastWinner.avatar ||
                      lastWinner.image ||
                      lastWinner.profilePicture
                    }
                    alt=""
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-sky-400 flex items-center justify-center text-3xl">
                    🏆
                  </div>
                )}

                <div>
                  <div className="text-zinc-400 text-sm">
                    {t.lastDraw.winner}
                  </div>

                  <div className="text-2xl font-black">
                    @{lastWinner?.username || "drawpicker"}
                  </div>

                  <div className="text-zinc-500 text-sm">
                    {t.lastDraw.congrats}
                  </div>
                </div>
              </div>

              <a
                href={lastDraw?.id ? `/result/${lastDraw.id}` : "#"}
                className="inline-block mt-4 text-xs font-black bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg transition"
              >
                {t.lastDraw.view}
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">💬</div>

                <div className="font-black text-xl">
                  {(lastDraw?.total || 2142).toLocaleString()}
                </div>

                <div className="text-[11px] text-zinc-500">
                  {t.lastDraw.comments}
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">👥</div>

                <div className="font-black text-xl">1.356</div>

                <div className="text-[11px] text-zinc-500">
                  {t.lastDraw.eligible}
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>

                <div className="font-black text-xl">1</div>

                <div className="text-[11px] text-zinc-500">
                  {t.lastDraw.winners}
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.03] rounded-xl px-4 py-3 text-center text-xs font-mono text-zinc-300">
              {t.lastDraw.cert}:{" "}
              {lastDraw?.cert_code || "DP-A7F3K9L2B1"}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section
        id="ozellikler"
        className="relative z-10 max-w-7xl mx-auto px-5 pb-20"
      >
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">⚡</div>

            <div className="font-black mb-1">
              {t.features.fastTitle}
            </div>

            <p className="text-sm text-zinc-400">
              {t.features.fastText}
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">📜</div>

            <div className="font-black mb-1">
              {t.features.certTitle}
            </div>

            <p className="text-sm text-zinc-400">
              {t.features.certText}
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">🔒</div>

            <div className="font-black mb-1">
              {t.features.secureTitle}
            </div>

            <p className="text-sm text-zinc-400">
              {t.features.secureText}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}