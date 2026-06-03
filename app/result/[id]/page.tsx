"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Winner = {
  username?: string;
  author?: string;
  profilePicture?: string;
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
          <a href="/" className="text-sky-400 hover:underline text-sm">← Ana Sayfa</a>
        </div>
      </main>
    );
  }

  const winners: Winner[] = result.winners || [];
  const backups: Winner[] = result.backups || [];
  const isTwitter = result.platform === "twitter";
  const date = result.created_at ? new Date(result.created_at).toLocaleDateString("tr-TR") : "";

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_40%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_40%)]" />
      <div className="relative max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
            Çekiliş Sonucu
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="bg-[#16161f] border border-white/10 rounded-xl px-3 py-1 text-sm font-bold">
              {isTwitter ? "𝕏 Twitter / X" : "▶️ YouTube"}
            </span>
            {date && <span className="text-zinc-500 text-sm">{date}</span>}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#16161f] border border-white/7 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-cyan-400">{result.total?.toLocaleString() || "—"}</div>
              <div className="text-xs text-zinc-500 mt-1">Katılımcı</div>
            </div>
            <div className="bg-[#16161f] border border-white/7 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-cyan-400">{winners.length}</div>
              <div className="text-xs text-zinc-500 mt-1">Kazanan</div>
            </div>
            <div className="bg-[#16161f] border border-white/7 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-cyan-400">{backups.length}</div>
              <div className="text-xs text-zinc-500 mt-1">Yedek</div>
            </div>
          </div>
          <div className="font-mono text-cyan-400/70 bg-[#16161f] border border-dashed border-cyan-500/20 rounded-xl py-2 px-4 text-sm inline-block">
            Sertifika: {result.cert_code}
          </div>
        </div>

        <div className="bg-[#16161f] border border-cyan-500/20 rounded-3xl p-6 mb-4">
          <div className="text-cyan-300 font-black text-xl mb-4">🏆 Kazananlar</div>
          <div className="space-y-3">
            {winners.map((w, i) => (
              <div key={i} className="bg-[#1d1d2b] rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                {w.profilePicture ? (
                  <img src={w.profilePicture} alt={w.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/40" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center text-white font-black text-lg">
                    {(w.username || "?")[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-black text-lg">@{w.username}</div>
                  {w.author && <div className="text-zinc-500 text-sm">{w.author}</div>}
                </div>
                <div className="text-2xl">🏆</div>
              </div>
            ))}
          </div>
        </div>

        {backups.length > 0 && (
          <div className="bg-[#16161f] border border-white/10 rounded-3xl p-6 mb-4">
            <div className="text-zinc-300 font-black text-xl mb-4">🥈 Yedek Kazananlar</div>
            <div className="space-y-3">
              {backups.map((w, i) => (
                <div key={i} className="bg-[#1d1d2b] rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                  {w.profilePicture ? (
                    <img src={w.profilePicture} alt={w.username}
                      className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-500 flex items-center justify-center text-white font-black text-lg">
                      {(w.username || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-zinc-300">@{w.username}</div>
                    {w.author && <div className="text-zinc-500 text-sm">{w.author}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <a href="/" className="text-zinc-500 text-sm hover:text-white transition">← DrawPicker.io</a>
        </div>
      </div>
    </main>
  );
}
