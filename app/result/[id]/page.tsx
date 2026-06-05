"use client";

import { useEffect, useState, useRef } from "react";
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
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/result/${id}`)
      .then((r) => r.json())
      .then((data) => { setResult(data.result || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  // Konfeti animasyonu
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: any[] = [];
    const colors = ["#60a5fa","#a78bfa","#f472b6","#34d399","#fbbf24","#f87171","#e879f9"];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }

    let animId: number;
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      pieces.forEach((p) => {
        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = p.color;
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.angle);
        ctx!.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
        ctx!.restore();
        p.y += p.speed;
        p.angle += p.spin;
        if (p.y > canvas!.height) {
          p.y = -10;
          p.x = Math.random() * canvas!.width;
        }
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [result]);

  async function handleShare() {
    const url = `${window.location.origin}/result/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "DrawPicker Çekiliş Sonucu", url });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#1d4ed8,#7c3aed,#be185d)"}}>
        <div className="text-white text-xl font-black animate-pulse">⏳ Yükleniyor...</div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#1d4ed8,#7c3aed,#be185d)"}}>
        <div className="text-center text-white">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-3xl font-black mb-2">Sonuç Bulunamadı</h1>
          <a href="/" className="text-white/70 hover:text-white text-sm underline">← Ana Sayfa</a>
        </div>
      </main>
    );
  }

  const winners: Winner[] = result.winners || [];
  const backups: Winner[] = result.backups || [];
  const isTwitter = result.platform === "twitter";
  const date = result.created_at ? new Date(result.created_at).toLocaleDateString("tr-TR") : "";
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : "https://drawpicker.io"}/result/${id}`;

  return (
    <main className="min-h-screen relative overflow-hidden" style={{background:"linear-gradient(135deg,#1d4ed8,#7c3aed,#be185d)"}}>
      {/* Konfeti canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Blob arka planlar */}
      <div className="fixed -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-50 pointer-events-none" style={{background:"#60a5fa"}} />
      <div className="fixed -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-50 pointer-events-none" style={{background:"#f472b6"}} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none" style={{background:"#a78bfa"}} />

      <div className="relative z-20 max-w-6xl mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="text-white/70 hover:text-white text-sm transition px-3 py-2 rounded-xl" style={{background:"rgba(255,255,255,0.1)",backdropFilter:"blur(10px)"}}>
            ← DrawPicker.io
          </a>
          <div className="text-2xl font-black text-white">🎉 Çekiliş Sonucu</div>
          <div className="w-28" />
        </div>

        {/* Ana Grid */}
        <div className="grid lg:grid-cols-2 gap-6 flex-1">
          {/* SOL — Çekiliş Bilgisi */}
          <div className="rounded-3xl p-6 flex flex-col gap-4" style={{background:"rgba(255,255,255,0.12)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.25)"}}>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-widest mb-1">Platform</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{isTwitter ? "𝕏" : "▶️"}</span>
                <span className="text-white font-black text-lg">{isTwitter ? "Twitter / X" : "YouTube"}</span>
              </div>
            </div>

            {date && (
              <div>
                <div className="text-white/60 text-xs uppercase tracking-widest mb-1">Tarih</div>
                <div className="text-white font-bold">{date}</div>
              </div>
            )}

            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl p-4 text-center" style={{background:"rgba(255,255,255,0.15)"}}>
                <div className="text-white font-black text-2xl">{result.total?.toLocaleString() || "—"}</div>
                <div className="text-white/60 text-xs mt-1">Katılımcı</div>
              </div>
              <div className="rounded-2xl p-4 text-center" style={{background:"rgba(255,255,255,0.15)"}}>
                <div className="text-white font-black text-2xl">{winners.length}</div>
                <div className="text-white/60 text-xs mt-1">Kazanan</div>
              </div>
              <div className="rounded-2xl p-4 text-center" style={{background:"rgba(255,255,255,0.15)"}}>
                <div className="text-white font-black text-2xl">{backups.length}</div>
                <div className="text-white/60 text-xs mt-1">Yedek</div>
              </div>
            </div>

            {/* Sertifika */}
            <div className="rounded-2xl p-4 text-center" style={{background:"rgba(255,255,255,0.1)",border:"1px dashed rgba(255,255,255,0.3)"}}>
              <div className="text-white/60 text-xs mb-1">📜 Çekiliş Sertifikası</div>
              <div className="text-white font-black text-xl tracking-widest">{result.cert_code}</div>
            </div>

            {/* Paylaş Butonu */}
            <button onClick={handleShare} className="w-full py-4 rounded-2xl font-black text-base transition hover:opacity-90 active:scale-95" style={{background:"rgba(255,255,255,0.25)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.3)",color:"white"}}>
              {copied ? "✅ Link Kopyalandı!" : "📤 Çekilişi Paylaş"}
            </button>

            <a href="/" className="w-full py-3 rounded-2xl font-bold text-sm text-center transition hover:opacity-90" style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"rgba(255,255,255,0.8)"}}>
              🎯 Yeni Çekiliş Başlat
            </a>
          </div>

          {/* SAĞ — Kazananlar */}
          <div className="flex flex-col gap-4">
            {/* Kazananlar */}
            <div className="rounded-3xl p-6" style={{background:"rgba(255,255,255,0.12)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.25)"}}>
              <div className="text-white font-black text-xl mb-4">🏆 Kazananlar</div>
              <div className="space-y-3">
                {winners.map((w, i) => (
                  <div key={i} className="rounded-2xl p-4 flex items-center gap-4" style={{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.2)"}}>
                    {w.profilePicture ? (
                      <img src={w.profilePicture} alt={w.username} className="w-14 h-14 rounded-full object-cover flex-shrink-0" style={{border:"2px solid rgba(255,255,255,0.4)"}} />
                    ) : (
                      <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-xl" style={{background:`linear-gradient(135deg,hsl(${i*80+200},70%,60%),hsl(${i*80+240},70%,50%))`}}>
                        {(w.username || "?")[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-black text-lg">@{w.username}</div>
                      {w.author && <div className="text-white/60 text-sm truncate">{w.author}</div>}
                    </div>
                    <div className="text-2xl">🏆</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yedek Kazananlar */}
            {backups.length > 0 && (
              <div className="rounded-3xl p-6" style={{background:"rgba(255,255,255,0.08)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.15)"}}>
                <div className="text-white/80 font-black text-lg mb-4">🥈 Yedek Kazananlar</div>
                <div className="space-y-2">
                  {backups.map((w, i) => (
                    <div key={i} className="rounded-xl p-3 flex items-center gap-3" style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)"}}>
                      {w.profilePicture ? (
                        <img src={w.profilePicture} alt={w.username} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black" style={{background:"rgba(255,255,255,0.2)"}}>
                          {(w.username || "?")[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-white font-bold">@{w.username}</div>
                        {w.author && <div className="text-white/50 text-xs">{w.author}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
