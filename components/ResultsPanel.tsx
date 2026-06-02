"use client";

import { useState } from "react";

type Winner = {
  username: string;
  author?: string;
};

type Props = {
  winners: Winner[];
  backups: Winner[];
  total: number;
  certCode: string;
  onRedraw?: () => void;
};

export default function ResultsPanel({
  winners,
  backups,
  total,
  certCode,
  onRedraw,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function shareResult() {
    const winnerText = winners
      .map(
        (w, i) =>
          `${i + 1}. @${w.username}${w.author ? ` (${w.author})` : ""}`
      )
      .join("\n");

    const backupText =
      backups.length > 0
        ? "\n\n🥈 Yedekler:\n" +
          backups
            .map(
              (w, i) =>
                `B${i + 1}. @${w.username}${
                  w.author ? ` (${w.author})` : ""
                }`
            )
            .join("\n")
        : "";

    const text =
      `🎉 DrawPicker Çekiliş Sonucu\n\n` +
      `🏆 Kazanan:\n${winnerText}\n\n` +
      `👥 Toplam Katılımcı: ${total.toLocaleString()}\n` +
      `📜 Sertifika: ${certCode}` +
      backupText +
      `\n\n🔗 https://drawpicker.io`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}

    const shareUrl =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(text);

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  function downloadCSV() {
    const rows = [
      ["Type", "Username", "Author"],
      ...winners.map((w) => ["Winner", w.username, w.author || ""]),
      ...backups.map((w) => ["Backup", w.username, w.author || ""]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "draw-results.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="bg-[#16161f]/90 border border-cyan-500/30 rounded-3xl p-6 mt-6">
      <div className="text-center mb-6">
        <div className="text-cyan-300 font-black text-2xl mb-2">
          🎉 KAZANAN
        </div>

        {winners.map((w, i) => (
          <div
            key={i}
            className="bg-[#1d1d2b] border border-cyan-400/20 rounded-2xl p-4 mb-3"
          >
            <div className="text-2xl font-black text-white">
              @{w.username}
            </div>

            {w.author && (
              <div className="text-zinc-400 text-sm mt-1">
                {w.author}
              </div>
            )}
          </div>
        ))}
      </div>

      {backups.length > 0 && (
        <div className="mb-6">
          <div className="text-zinc-300 font-bold mb-3">
            🥈 Yedek Kazananlar
          </div>

          <div className="space-y-2">
            {backups.map((w, i) => (
              <div
                key={i}
                className="bg-[#1d1d2b] border border-white/10 rounded-xl p-3"
              >
                <div className="font-semibold text-white">
                  @{w.username}
                </div>

                {w.author && (
                  <div className="text-zinc-500 text-sm">
                    {w.author}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#1d1d2b] border border-cyan-400/20 rounded-2xl p-4 text-center mb-6">
        <div className="text-zinc-400 text-sm mb-2">
          📜 Çekiliş Sertifikası
        </div>

        <div className="text-cyan-300 font-black text-2xl tracking-widest">
          {certCode}
        </div>

        <div className="text-zinc-500 text-sm mt-2">
          👥 Toplam Katılımcı: {total.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onRedraw}
          className="bg-[#1d1d2b] hover:bg-[#27273a] border border-white/10 rounded-xl py-3 font-semibold transition"
        >
          🔄 Tekrar Çek
        </button>

        <button
          onClick={shareResult}
          className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl py-3 font-black transition"
        >
          {copied ? "✅ Kopyalandı" : "📤 Paylaş"}
        </button>

        <button
          onClick={downloadCSV}
          className="bg-[#1d1d2b] hover:bg-[#27273a] border border-white/10 rounded-xl py-3 font-semibold transition"
        >
          📄 CSV İndir
        </button>
      </div>
    </div>
  );
}