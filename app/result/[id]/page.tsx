"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Winner = {
  username?: string;
  author?: string;
  profilePicture?: string;
  avatar?: string;
  image?: string;
};

export default function ResultPage() {
  const params = useParams();
  const id = params?.id as string;

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/result/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setResult(data.result || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-zinc-400">Yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-3xl font-black mb-2">Sonuç Bulunamadı</h1>
          <a href="/" className="text-sky-400 hover:underline text-sm">
            ← Ana Sayfa
          </a>
        </div>
      </main>
    );
  }

  const winners: Winner[] = result.winners || [];
  const backups: Winner[] = result.backups || [];
  const isTwitter = result.platform === "twitter";
  const platformName = isTwitter ? "Twitter / X" : "YouTube";

  const date = result.created_at
    ? new Date(result.created_at).toLocaleDateString("tr-TR")
    : "";

  const drawTitle =
    result.title ||
    result.giveaway_title ||
    result.tweet_text ||
    result.video_title ||
    result.input_url ||
    "Çekiliş";

  const authorName =
    result.author_name ||
    result.authorName ||
    result.tweet_author_name ||
    result.username ||
    "";

  const authorUsername =
    result.author_username ||
    result.authorUsername ||
    result.tweet_author_username ||
    result.screen_name ||
    "";

  const authorAvatar =
    result.author_avatar ||
    result.authorAvatar ||
    result.profilePicture ||
    result.profile_image_url ||
    "";

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_35%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_40%)]" />

      <div className="relative max-w-5xl mx-auto">
        {/* BRAND */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-10">
          <a href="/" className="text-3xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Draper.ai
            </span>
          </a>

          <div className="text-right text-sm text-zinc-400 leading-relaxed hidden sm:block">
            Sosyal medya çekilişlerinde
            <br />
            adil sonuçların adresi
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🎉</div>

          <h1 className="text-5xl font-black bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
            Çekiliş Sonucu
          </h1>
        </div>

        {/* POST / GIVEAWAY CARD */}
        <div className="bg-[#101827]/80 border border-white/10 rounded-3xl p-6 mb-5 shadow-2xl">
          {(authorName || authorUsername || authorAvatar) && (
            <div className="flex items-center gap-4 mb-5">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorUsername || authorName}
                  className="w-16 h-16 rounded-full object-cover border border-cyan-500/40"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center text-white font-black text-xl">
                  {(authorName || authorUsername || "?")[0].toUpperCase()}
                </div>
              )}

              <div>
                {authorName && (
                  <div className="text-2xl font-black">{authorName}</div>
                )}

                {authorUsername && (
                  <div className="text-zinc-400 text-lg">
                    @{String(authorUsername).replace("@", "")}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <div className="text-5xl shrink-0">🎁</div>

            <div className="flex-1">
              <div className="text-zinc-500 text-sm font-bold mb-1">
                Çekiliş
              </div>

              <div className="text-2xl font-black leading-snug whitespace-pre-line">
                {drawTitle}
              </div>

              <div className="flex flex-wrap gap-3 mt-5">
                <span className="bg-[#080812] border border-white/10 rounded-xl px-4 py-2 text-sm font-bold">
                  Platform: {platformName}
                </span>

                {date && (
                  <span className="bg-[#080812] border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-zinc-300">
                    Tarih: {date}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[#101827]/80 border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-cyan-400">
              {result.total?.toLocaleString() || "—"}
            </div>
            <div className="text-sm text-zinc-400 mt-1">Katılımcı</div>
          </div>

          <div className="bg-[#101827]/80 border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-cyan-400">
              {winners.length}
            </div>
            <div className="text-sm text-zinc-400 mt-1">Kazanan</div>
          </div>

          <div className="bg-[#101827]/80 border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-cyan-400">
              {backups.length}
            </div>
            <div className="text-sm text-zinc-400 mt-1">Yedek</div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="font-mono text-cyan-400 bg-[#101827]/80 border border-dashed border-cyan-500/30 rounded-xl py-3 px-5 text-sm inline-block">
            Sertifika: {result.cert_code}
          </div>
        </div>

        {/* WINNERS */}
        <div className="bg-[#101827]/80 border border-cyan-500/20 rounded-3xl p-6 mb-4">
          <div className="text-cyan-300 font-black text-2xl mb-5">
            🏆 Kazananlar
          </div>

          <div className="space-y-3">
            {winners.map((w, i) => {
              const img = w.profilePicture || w.avatar || w.image;

              return (
                <div
                  key={i}
                  className="bg-[#182033] rounded-2xl p-5 border border-white/10 flex items-center gap-4"
                >
                  {img ? (
                    <img
                      src={img}
                      alt={w.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500/40"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center text-white font-black text-xl">
                      {(w.username || "?")[0].toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="font-black text-2xl">
                      @{w.username}
                    </div>

                    {w.author && (
                      <div className="text-zinc-400 text-base">
                        {w.author}
                      </div>
                    )}
                  </div>

                  <div className="text-3xl">🏆</div>
                </div>
              );
            })}
          </div>
        </div>

        {backups.length > 0 && (
          <div className="bg-[#101827]/80 border border-white/10 rounded-3xl p-6 mb-4">
            <div className="text-zinc-300 font-black text-2xl mb-5">
              🥈 Yedek Kazananlar
            </div>

            <div className="space-y-3">
              {backups.map((w, i) => {
                const img = w.profilePicture || w.avatar || w.image;

                return (
                  <div
                    key={i}
                    className="bg-[#182033] rounded-2xl p-5 border border-white/10 flex items-center gap-4"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={w.username}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-500 flex items-center justify-center text-white font-black text-lg">
                        {(w.username || "?")[0].toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="font-bold text-zinc-300">
                        @{w.username}
                      </div>

                      {w.author && (
                        <div className="text-zinc-500 text-sm">
                          {w.author}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href="/"
            className="text-zinc-500 text-sm hover:text-white transition"
          >
            ← Draper.ai
          </a>
        </div>
      </div>
    </main>
  );
}
