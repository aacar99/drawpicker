"use client";

import { useState } from "react";
import LangPicker from "./LangPicker";
import Rule from "./Rule";
import ResultsPanel from "./ResultsPanel";
import { tr } from "@/lib/i18n";
import type { Platform, Rules, User } from "@/lib/types";

const ACCENT: Record<string, any> = {
  sky: {
    text: "text-sky-400",
    ring: "focus:border-sky-500",
    btn: "from-sky-600 to-sky-500",
    shadow: "shadow-sky-500/20",
    solid: "bg-sky-600 hover:bg-sky-500",
    hover: "hover:border-sky-500",
    ruleOn: "border-sky-500 bg-sky-500/10",
    chk: "bg-sky-500",
    check: "text-sky-400",
    cardFrom: "from-sky-500/10 to-cyan-500/5 border border-sky-500/40",
    certBorder: "border-sky-500/40",
  },
  purple: {
    text: "text-purple-400",
    ring: "focus:border-purple-500",
    btn: "from-purple-600 to-purple-500",
    shadow: "shadow-purple-500/20",
    solid: "bg-purple-600 hover:bg-purple-500",
    hover: "hover:border-purple-500",
    ruleOn: "border-purple-500 bg-purple-500/10",
    chk: "bg-purple-500",
    check: "text-purple-400",
    cardFrom: "from-purple-500/10 to-cyan-500/5 border border-purple-500/40",
    certBorder: "border-purple-500/40",
  },
};

export type RuleDef = {
  key: keyof Rules;
  fixed?: boolean;
  default?: boolean;
};

export type GiveawayConfig = {
  platform: Platform;
  accent: "sky" | "purple";
  icon: string;
  titleKey: string;
  subKey: string;
  inputKey: string;
  inputPhKey: string;
  ruleDefs: RuleDef[];
  showKeyword?: boolean;
  showMinLen?: boolean;
  showMinFollowers?: boolean;
};

export default function GiveawayPage({ config }: { config: GiveawayConfig }) {
  const a = ACCENT[config.accent];

  const [lang, setLang] = useState("en");
  const t = tr(lang);

  const [input, setInput] = useState("");
  const [winnerCount, setWinnerCount] = useState(1);
  const [backupCount, setBackupCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [minLen, setMinLen] = useState(0);
  const [minFollowers, setMinFollowers] = useState(0);

  const initialRules: Record<string, boolean> = {};
  config.ruleDefs.forEach((r) => {
    initialRules[r.key as string] = Boolean(r.default);
  });

  const [rules, setRules] = useState<Record<string, boolean>>(initialRules);

  const [loading, setLoading] = useState(false);
  const [winners, setWinners] = useState<User[]>([]);
  const [backups, setBackups] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [eligible, setEligible] = useState(0);
  const [certCode, setCertCode] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [warn, setWarn] = useState("");

  function toggle(key: string) {
    setRules((p) => ({ ...p, [key]: !p[key] }));
  }

  async function startDraw() {
    setError("");
    setWarn("");
    setWinners([]);
    setBackups([]);
    setTotal(0);
    setEligible(0);
    setCertCode("");
    setResultUrl("");

    if (!input.trim()) {
      setError(t("noUrl"));
      return;
    }

    const anyRule = config.ruleDefs.some(
      (r) => r.fixed || r.default || rules[r.key as string]
    );

    if (!anyRule) {
      setError(t("noRule"));
      return;
    }

    setLoading(true);

    try {
      const reqRules: Rules = {
        ...rules,
        keyword,
        minLen,
        minFollowers,
      };

      config.ruleDefs.forEach((r) => {
        if (r.fixed) {
          (reqRules as any)[r.key] = true;
        }
      });

      const res = await fetch("/api/draw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: config.platform,
          input,
          winnerCount,
          backupCount,
          rules: reqRules,
          excluded: [],
        }),
      });

      const text = await res.text();

      let data: any = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(text || "Sunucudan JSON olmayan cevap geldi");
      }

      console.log("DRAW RESPONSE:", data);

      if (!res.ok || data.error) {
        setError(data.error || `API hata verdi: ${res.status}`);
        setLoading(false);
        return;
      }

      if (!data.mainWinners || data.mainWinners.length === 0) {
        setError(t("noElig"));
        setLoading(false);
        return;
      }

      setTotal(data.totalParticipants || 0);
      setEligible(data.eligibleCount || 0);
      setWinners(data.mainWinners || []);
      setBackups(data.backupWinners || []);
      setCertCode(data.certCode || "");
      setResultUrl(data.resultUrl || data.shareUrl || "");

      try {
        localStorage.setItem(
          "drawpicker:lastDraw",
          JSON.stringify({
            platform: config.platform,
            total: data.totalParticipants || 0,
            winners: data.mainWinners || [],
            createdAt: new Date().toISOString(),
          })
        );
      } catch {}

      if (data.truncated) {
        setWarn(t("truncated"));
      }
    } catch (e: any) {
      console.error("START DRAW ERROR:", e);
      setError(e?.message || JSON.stringify(e) || "Bilinmeyen frontend hatası");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_35%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_35%)]" />

      <div className="relative max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <a
            href="/"
            className="text-zinc-400 text-sm hover:text-white transition whitespace-nowrap"
          >
            {t("back")}
          </a>

          <LangPicker
            lang={lang}
            setLang={setLang}
            accentHover={a.hover}
            accentCheck={a.check}
          />
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{config.icon}</div>

          <h1 className="text-4xl sm:text-5xl font-black mb-3">
            <span className={a.text}>{t(config.titleKey)}</span>
          </h1>

          <p className="text-zinc-400 text-sm">{t(config.subKey)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-[#16161f]/90 border border-white/10 rounded-3xl p-6">
            <div className="font-bold mb-4 text-sm">
              🔗 {t(config.inputKey)}
            </div>

            <input
              type="text"
              placeholder={t(config.inputPhKey)}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none ${a.ring} transition mb-6`}
            />

            <div className="font-bold mb-3 text-sm">⚡ Quick Rules</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {config.ruleDefs.map((r) => (
                <Rule
                  key={r.key as string}
                  label={t("r_" + (r.key as string))}
                  val={r.fixed ? true : Boolean(rules[r.key as string])}
                  toggle={() => toggle(r.key as string)}
                  fixed={r.fixed}
                  onClass={a.ruleOn}
                  chkClass={a.chk}
                />
              ))}
            </div>

            {config.showKeyword && rules["mustKeyword"] && (
              <div className="mb-3">
                <label className="text-xs text-zinc-400 mb-1.5 block">
                  {t("kwLbl")}
                </label>
                <input
                  type="text"
                  placeholder={t("kwPh")}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className={`w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none ${a.ring} transition`}
                />
              </div>
            )}

            {config.showMinLen && rules["mustMinLength"] && (
              <div className="mb-3">
                <label className="text-xs text-zinc-400 mb-1.5 block">
                  {t("minLenLbl")}
                </label>
                <input
                  type="number"
                  placeholder="50"
                  min={1}
                  value={minLen}
                  onChange={(e) => setMinLen(Number(e.target.value))}
                  className={`w-32 bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none ${a.ring} transition`}
                />
              </div>
            )}

            {config.showMinFollowers && rules["mustMinFollowers"] && (
              <div className="mb-3">
                <label className="text-xs text-zinc-400 mb-1.5 block">
                  {t("minFolLbl")}
                </label>
                <input
                  type="number"
                  placeholder="100"
                  min={1}
                  value={minFollowers}
                  onChange={(e) => setMinFollowers(Number(e.target.value))}
                  className={`w-40 bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none ${a.ring} transition`}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6 mt-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">
                  {t("winnerCount")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={winnerCount}
                  onChange={(e) => setWinnerCount(Number(e.target.value))}
                  className={`w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none ${a.ring} transition`}
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">
                  {t("backupCount")}
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={backupCount}
                  onChange={(e) => setBackupCount(Number(e.target.value))}
                  className={`w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none ${a.ring} transition`}
                />
              </div>
            </div>

            <button
              onClick={startDraw}
              disabled={loading}
              className={`w-full bg-gradient-to-r ${a.btn} hover:opacity-90 text-white py-4 rounded-xl font-black text-lg transition disabled:opacity-50 shadow-lg ${a.shadow}`}
            >
              {loading ? `⏳ ${t("loading")}...` : `🎯 ${t("draw")}`}
            </button>

            {error && <p className="text-red-400 text-sm mt-3">❌ {error}</p>}
            {warn && <p className="text-amber-400 text-sm mt-3">{warn}</p>}
          </div>

          <div>
            {winners.length > 0 ? (
              <ResultsPanel
                t={t}
                accent={a}
                total={total}
                winners={winners}
                backups={backups}
                certCode={certCode}
                resultUrl={resultUrl}
                onRedraw={startDraw}
                compactEmpty
              />
            ) : (
              <div className="bg-[#16161f]/70 border border-white/10 rounded-3xl p-8 text-center text-zinc-500">
                🎁 Draw result will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}