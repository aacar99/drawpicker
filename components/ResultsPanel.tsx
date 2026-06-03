"use client";

import { useState } from "react";

type Props = {
  t?: (k: string) => string;
  accent?: any;
  winners: any[];
  backups: any[];
  total: number;
  certCode: string;
  resultUrl?: string;
  onRedraw?: () => void;
  compactEmpty?: boolean;
};

export default function ResultsPanel({
  t,
  accent,
  winners,
  backups,
  total,
  certCode,
  resultUrl,
  onRedraw,
}: Props) {
  const [copied, setCopied] = useState(false);

  const tr = (key: string) => (t ? t(key) : key);
  const a = accent || {
    text: "text-cyan-300",
    solid: "bg-cyan-500 hover:bg-cyan-400",
    hover: "hover:border-cyan-500",
    certBorder: "border-cyan-400/20",
  };

  async function shareResult() {
    const url = resultUrl || "https://drawpicker.io";
    const text = `🎉 DrawPicker çekiliş sonucu hazır!\n\n${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "DrawPicker Çekiliş Sonucu",
          text,
          url,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  }

  function exportCSV() {
    const rows = [
      ["Type", "Username", "Author"],
      ...winners.map((w) => [
        "Winner",
        w.username || "",
        w.author || w.name || "",
      ]),
      ...backups.map((w) => [
        "Backup",
        w.username || "",
        w.author || w.name || "",
      ]),
    ];

    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "drawpicker-results.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-[#16161f]/90 border border-cyan-500/30 rounded-3xl p-6">
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[#1d1d2b] border border-white/10 rounded-2xl p-4 text-center">
          <div className={`text-2xl font-black ${a.text}`}>
            {total.toLocaleString()}
          </div>
          <div className="text-xs text-zinc-500 mt-1">{tr("total")}</div>
        </div>

        <div className="bg-[#1d1d2b] border border-white/10 rounded-2xl p-4 text-center">
          <div className={`text-2xl font-black ${a.text}`}>
            {winners.length}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {tr("winnersStat")}
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🎉</div>

        <div className={`${a.text} font-black tracking-widest mb-3`}>
          {tr("mainWinner")}
        </div>

        {winners.map((w, i) => (
          <div
            key={i}
            className="bg-[#1d1d2b] border border-cyan-400/20 rounded-2xl p-4 mb-3 flex items-center justify-center gap-4"
          >
            {w.profilePicture || w.avatar || w.image ? (
              <img
                src={w.profilePicture || w.avatar || w.image}
                alt=""
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                🎊
              </div>
            )}

            <div className="text-left">
              <div className="text-2xl font-black">
                @{w.username || "unknown"}
              </div>
              <div className="text-zinc-400 text-sm">
                {w.author || w.name || ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      {backups.length > 0 && (
        <div className="mb-6">
          <div className="font-bold mb-3 text-zinc-300">
            🥈 {tr("backupWinner")}
          </div>

          {backups.map((w, i) => (
            <div
              key={i}
              className="bg-[#1d1d2b] border border-white/10 rounded-xl p-3 mb-2"
            >
              <div className="font-semibold">
                B{i + 1}. @{w.username || "unknown"}
              </div>
              <div className="text-zinc-500 text-sm">
                {w.author || w.name || ""}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#1d1d2b] border border-cyan-400/20 rounded-2xl p-4 text-center mb-6">
        <div className="text-zinc-400 text-sm mb-2">📜 {tr("cert")}</div>
        <div className={`${a.text} font-black text-xl tracking-widest`}>
          {certCode}
        </div>
      </div>

      {copied && (
        <p className="text-green-400 text-sm text-center mb-3">
          ✅ {tr("copyDone")}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={onRedraw}
          className={`border border-white/10 ${a.hover} py-3 rounded-xl font-bold text-sm transition`}
        >
          🔄 {tr("redraw")}
        </button>

        <button
          onClick={shareResult}
          className={`${a.solid} text-white py-3 rounded-xl font-black text-sm transition`}
        >
          📤 {tr("share")}
        </button>
      </div>

      <button
        onClick={exportCSV}
        className={`w-full border border-white/10 ${a.hover} py-3 rounded-xl font-bold text-sm transition`}
      >
        📥 {tr("export")}
      </button>
    </div>
  );
}