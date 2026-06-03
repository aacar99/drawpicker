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

  const t =
    translations[lang as keyof typeof translations] ||
    translations.tr;

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
        if (!data) return;

        setLastDraw({
          id: data.id,
          platform: data.platform,
          total:
            data.total ||
            data.total_participants ||
            data.totalParticipants ||
            0,

          winners:
            data.winners ||
            data.main_winners ||
            data.mainWinners ||
            [],

          cert_code:
            data.cert_code ||
            data.certCode ||
            "",
        });
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

      <nav className="relative z-[9999] max-w-7xl mx-auto flex items-center justify-between px-5 py-5">
        <a href="/" className="text-2xl font-black tracking-tight">
          draw<span className="text-pink-400">picker</span>
        </a>

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

      <section className="relative z-10 max-w-7xl mx-auto px-5 pt-14 pb-20">
        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          {/* YOUTUBE */}
          <div className="bg-[#141421]/90 border border-white/10 rounded-[2rem] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[120px] opacity-5">
              ▶️
            </div>

            <div className="text-5xl mb-4">▶️</div>

            <h2 className="text-3xl font-black mb-3">
              YouTube Çekilişi
            </h2>

            <p className="text-zinc-400 mb-6">
              YouTube yorumlarından adil ve rastgele kazanan seçin.
            </p>

            <ul className="space-y-2 text-sm text-zinc-300 mb-8">
              <li>✓ Yorum filtreleme</li>
              <li>✓ Çoklu kazanan belirleme</li>
              <li>✓ Yedek kazanan seçimi</li>
              <li>✓ Sertifika ile kanıt</li>
            </ul>

            <a
              href="/youtube"
              className="block w-full text-center bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 py-4 rounded-xl font-black transition"
            >
              YouTube Çekilişi Yap →
            </a>
          </div>

          {/* TWITTER */}
          <div className="bg-[#141421]/90 border border-white/10 rounded-[2rem] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[120px] opacity-5">
              𝕏
            </div>

            <div className="text-5xl mb-4">𝕏</div>

            <h2 className="text-3xl font-black mb-3">
              X (Twitter) Çekilişi
            </h2>

            <p className="text-zinc-400 mb-6">
              X gönderilerinden adil ve rastgele kazanan seçin.
            </p>

            <ul className="space-y-2 text-sm text-zinc-300 mb-8">
              <li>✓ Yorum filtreleme</li>
              <li>✓ Çoklu kazanan belirleme</li>
              <li>✓ Yedek kazanan seçimi</li>
              <li>✓ Sertifika ile kanıt</li>
            </ul>

            <a
              href="/twitter"
              className="block w-full text-center bg-gradient-to-r from-sky-500 to-blue-500 hover:opacity-90 py-4 rounded-xl font-black transition"
            >
              X Çekilişi Yap →
            </a>
          </div>
        </div>

        {/* SON ÇEKİLİŞ */}
        <div className="relative bg-[#141421]/90 border border-white/10 rounded-[2rem] p-6 shadow-2xl max-w-3xl mx-auto">
          <div className="text-sm text-zinc-400 font-bold mb-4">
            🏆 Son Çekiliş
          </div>

          <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5 mb-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-sky-400 flex items-center justify-center text-3xl">
                🏆
              </div>

              <div>
                <div className="text-zinc-400 text-sm">
                  Kazanan
                </div>

                <div className="text-2xl font-black">
                  @
                  {lastDraw?.winners?.[0]?.username ||
                    "drawpicker"}
                </div>

                <div className="text-zinc-500 text-sm">
                  Tebrikler! 🎉
                </div>
              </div>
            </div>

            <a
              href={
                lastDraw?.id
                  ? `/result/${lastDraw.id}`
                  : "#"
              }
              className="inline-block mt-4 text-xs font-black bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg transition"
            >
              Sonucu Görüntüle
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">💬</div>

              <div className="font-black text-xl">
                {(lastDraw?.total || 0).toLocaleString()}
              </div>

              <div className="text-[11px] text-zinc-500">
                Toplam Yorum
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">👥</div>

              <div className="font-black text-xl">
                {(lastDraw?.total || 0).toLocaleString()}
              </div>

              <div className="text-[11px] text-zinc-500">
                Uygun Katılımcı
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">🏆</div>

              <div className="font-black text-xl">
                {lastDraw?.winners?.length || 1}
              </div>

              <div className="text-[11px] text-zinc-500">
                Kazanan
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.03] rounded-xl px-4 py-3 text-center text-xs font-mono text-zinc-300">
            Çekiliş Sertifikası:{" "}
            {lastDraw?.cert_code ||
              "DP-A7F3K9L2B1"}
          </div>
        </div>
      </section>
    </main>
  );
}