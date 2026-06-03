"use client";

import { useState, useEffect } from "react";
import LangPicker from "./LangPicker";
import Rule from "./Rule";
import ResultsPanel from "./ResultsPanel";
import { tr } from "@/lib/i18n";
import { createClient } from "@/lib/supabase-client";
import type { Platform, Rules, User } from "@/lib/types";

const ACCENT: Record<string, any> = {
  sky: {
    text: "text-sky-400", ring: "focus:border-sky-500", btn: "from-sky-600 to-sky-500",
    shadow: "shadow-sky-500/20", solid: "bg-sky-600 hover:bg-sky-500",
    hover: "hover:border-sky-500", ruleOn: "border-sky-500 bg-sky-500/10",
    chk: "bg-sky-500", check: "text-sky-400",
    cardFrom: "from-sky-500/10 to-cyan-500/5 border border-sky-500/40",
    certBorder: "border-sky-500/40",
  },
  purple: {
    text: "text-purple-400", ring: "focus:border-purple-500", btn: "from-purple-600 to-purple-500",
    shadow: "shadow-purple-500/20", solid: "bg-purple-600 hover:bg-purple-500",
    hover: "hover:border-purple-500", ruleOn: "border-purple-500 bg-purple-500/10",
    chk: "bg-purple-500", check: "text-purple-400",
    cardFrom: "from-purple-500/10 to-cyan-500/5 border border-purple-500/40",
    certBorder: "border-purple-500/40",
  },
};

export default function GiveawayPage({ config }: any) {
  const a = ACCENT[config.accent];
  const [lang, setLang] = useState("tr");
  const t = tr(lang);

  const [input, setInput] = useState("");
  const [winnerCount, setWinnerCount] = useState(1);
  const [backupCount, setBackupCount] = useState(0);
  const [rules, setRules] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [winners, setWinners] = useState<User[]>([]);
  const [backups, setBackups] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [certCode, setCertCode] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  function toggle(key: string) {
    setRules((p: any) => ({ ...p, [key]: !p[key] }));
  }

  async function startDraw() {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    setLoading(true);
    setError("");
    setWinners([]);
    setBackups([]);
    setTotal(0);
    setCertCode("");
    setResultUrl("");
    setShowUpgrade(false);

    try {
      const res = await fetch("/api/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: config.platform,
          input,
          winnerCount,
          backupCount,
          rules,
          excluded: [],
        }),
      });

      const data = await res.json();

      if (res.status === 401 || data.error === "login_required") {
        window.location.href = "/auth/login";
        return;
      }

      if (res.status === 403 || data.error === "upgrade_required") {
        setShowUpgrade(true);
        setLoading(false);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.error || "API Error");
        setLoading(false);
        return;
      }

      setWinners(data.mainWinners || []);
      setBackups(data.backupWinners || []);
      setTotal(data.totalParticipants || 0);
      setCertCode(data.certCode || "");
      setResultUrl(data.resultUrl || data.shareUrl || "");
    } catch (e: any) {
      setError(e?.message || "Unknown Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_35%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_35%)]" />

      <div className="relative max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <a href="/" className="text-zinc-400 text-sm hover:text-white transition whitespace-nowrap">← {t("back")}</a>
          <LangPicker lang={lang} setLang={setLang} accentHover={a.hover} accentCheck={a.check} />
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{config.icon}</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">
            <span className={a.text}>{t(config.titleKey)}</span>
          </h1>
          <p className="text-zinc-400 text-sm">{t(config.subKey)}</p>
        </div>

        {/* GİRİŞ YAPILMAMIŞSA UYARI */}
        {!user && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
            <p className="text-amber-400 text-sm font-medium">
              ⚠️ Çekiliş yapabilmek için giriş yapmalısınız.{" "}
              <a href="/auth/login" className="underline font-bold">Giriş Yap →</a>
            </p>
          </div>
        )}

        {/* UPGRADE MODAL */}
        {showUpgrade && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-[#16161f] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-2xl font-black mb-2">Ücretsiz hakkınız doldu</h2>
              <p className="text-zinc-400 text-sm mb-6">
                1 ücretsiz çekiliş hakkınızı kullandınız. Devam etmek için bir paket satın alın.
              </p>
              <a href="/pricing" className="block w-full bg-gradient-to-r from-sky-600 to-sky-500 py-3 rounded-xl font-bold text-sm mb-3 hover:opacity-90 transition">
                Paketleri Gör →
              </a>
              <button onClick={() => setShowUpgrade(false)} className="text-zinc-500 text-sm hover:text-white transition">
                Şimdi değil
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-[#16161f]/90 border border-white/10 rounded-3xl p-6">
            <div className="font-bold mb-4 text-sm">🔗 {t(config.inputKey)}</div>
            <input
              type="text"
              placeholder={t(config.inputPhKey)}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none ${a.ring} transition mb-6`}
            />

            <div className="font-bold mb-3 text-sm">⚡ {t("rules")}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {config.ruleDefs?.map((r: any) => (
                <Rule
                  key={r.key}
                  label={t("r_" + r.key)}
                  val={Boolean(rules[r.key])}
                  toggle={() => toggle(r.key)}
                  fixed={r.fixed}
                  onClass={a.ruleOn}
                  chkClass={a.chk}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">{t("winnerCount")}</label>
                <input type="number" min={1} max={50} value={winnerCount}
                  onChange={(e) => setWinnerCount(Number(e.target.value))}
                  className={`w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none ${a.ring} transition`}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">{t("backupCount")}</label>
                <input type="number" min={0} max={50} value={backupCount}
                  onChange={(e) => setBackupCount(Number(e.target.value))}
                  className={`w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none ${a.ring} transition`}
                />
              </div>
            </div>

            <button onClick={startDraw} disabled={loading}
              className={`w-full bg-gradient-to-r ${a.btn} hover:opacity-90 text-white py-4 rounded-xl font-black text-lg transition disabled:opacity-50 shadow-lg ${a.shadow}`}
            >
              {loading ? `⏳ ${t("loading")}...` : `🎯 ${t("draw")}`}
            </button>

            {error && <p className="text-red-400 text-sm mt-3">❌ {error}</p>}
          </div>

          <div>
            {winners.length > 0 ? (
              <ResultsPanel
                t={t}
                accent={a}
                total={total}
                eligible={total}
                winners={winners}
                backups={backups}
                certCode={certCode}
                resultUrl={resultUrl}
                onRedraw={startDraw}
              />
            ) : (
              <div className="bg-[#16161f]/70 border border-white/10 rounded-3xl p-8 text-center text-zinc-500">
                🎁 {t("noElig") ? "Çekiliş sonucu burada görünecek" : "Draw result will appear here"}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
