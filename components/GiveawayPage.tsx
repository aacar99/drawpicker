"use client";

import { useState, useEffect } from "react";
import LangPicker from "./LangPicker";
import Rule from "./Rule";
import ResultsPanel from "./ResultsPanel";
import { tr } from "@/lib/i18n";
import { createClient } from "@/lib/supabase-client";
import type { User } from "@/lib/types";

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
  },
};

const PLAN_LEVEL: Record<string, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  business: 3,
};

function canUse(userPlan: string, rulePlan?: string) {
  return PLAN_LEVEL[userPlan || "free"] >= PLAN_LEVEL[rulePlan || "free"];
}

export default function GiveawayPage({ config }: any) {
  const a = ACCENT[config.accent] || ACCENT.sky;

  const [lang, setLang] = useState("tr");
  const t = tr(lang);

  const [input, setInput] = useState("");
  const [winnerCount, setWinnerCount] = useState(1);
  const [backupCount, setBackupCount] = useState(0);
  const [rules, setRules] = useState<any>({});
  const [showGeneralRules, setShowGeneralRules] = useState(false);

  const [loading, setLoading] = useState(false);
  const [winners, setWinners] = useState<User[]>([]);
  const [backups, setBackups] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [certCode, setCertCode] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);

      if (data.user) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("plan")
          .eq("id", data.user.id)
          .single();

        setPlan(dbUser?.plan || "free");
      }
    });
  }, []);

  function toggle(rule: any) {
    const key = rule.key;
    const locked = !canUse(plan, rule.plan);

    if (locked) {
      setShowUpgrade(true);
      return;
    }

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
        setError(data.error || t("apiErr"));
        setLoading(false);
        return;
      }

      setWinners(data.mainWinners || []);
      setBackups(data.backupWinners || []);
      setTotal(data.totalParticipants || 0);
      setCertCode(data.certCode || "");
      setResultUrl(data.resultUrl || data.shareUrl || "");
    } catch (e: any) {
      setError(e?.message || t("apiErr"));
    } finally {
      setLoading(false);
    }
  }

  const quickRules = config.quickRules || config.ruleDefs?.slice(0, 4) || [];
  const advancedRules =
    config.advancedRules || config.ruleDefs?.slice(4) || [];

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_35%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_35%)]" />

      {loading && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#16161f] border border-sky-500/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl shadow-sky-500/20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin" />
            <h2 className="text-2xl font-black mb-2">{t("drawRunning")}</h2>
            <p className="text-zinc-400 text-sm">{t("drawRunningSub")}</p>
          </div>
        </div>
      )}

      {showUpgrade && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#16161f] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-2xl font-black mb-2">Paket yükseltmeniz gerekiyor</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Bu özellik mevcut paketinizde yok. Devam etmek için Starter, Pro veya Business paketine geçin.
            </p>

            <a
              href="/pricing"
              className={`block w-full bg-gradient-to-r ${a.btn} py-3 rounded-xl font-bold text-sm mb-3 hover:opacity-90 transition`}
            >
              Paketleri Gör →
            </a>

            <button
              onClick={() => setShowUpgrade(false)}
              className="text-zinc-500 text-sm hover:text-white transition"
            >
              Şimdi değil
            </button>
          </div>
        </div>
      )}

      <div className="relative max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <a
            href="/"
            className="text-zinc-400 text-sm hover:text-white transition whitespace-nowrap"
          >
            {t("back")}
          </a>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-300">
              Plan: <span className={a.text}>{plan.toUpperCase()}</span>
            </div>

            <LangPicker
              lang={lang}
              setLang={setLang}
              accentHover={a.hover}
              accentCheck={a.check}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{config.icon}</div>

          <h1 className="text-4xl sm:text-5xl font-black mb-3">
            <span className={a.text}>{t(config.titleKey)}</span>
          </h1>

          <p className="text-zinc-400 text-sm">{t(config.subKey)}</p>
        </div>

        {!user && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
            <p className="text-amber-400 text-sm font-medium">
              ⚠️ Çekiliş yapabilmek için giriş yapmalısınız.{" "}
              <a href="/auth/login" className="underline font-bold">
                Giriş Yap →
              </a>
            </p>
          </div>
        )}

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

            <div className="mb-6">
              <div className="font-black mb-3 text-sm flex items-center gap-2">
                <span>⚡</span>
                <span>{t("quickRules")}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {quickRules.map((r: any) => {
                  const locked = !canUse(plan, r.plan);

                  return (
                    <Rule
                      key={r.key}
                      label={`${r.icon || ""} ${t("r_" + r.key)}`}
                      val={Boolean(rules[r.key])}
                      toggle={() => toggle(r)}
                      fixed={r.fixed}
                      locked={locked}
                      plan={r.plan || "free"}
                      onClass={a.ruleOn}
                      chkClass={a.chk}
                    />
                  );
                })}
              </div>

              {advancedRules.length > 0 && (
                <div className="bg-[#101018] border border-white/10 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowGeneralRules(!showGeneralRules)}
                    className="w-full flex items-center justify-between px-4 py-4 text-sm font-black hover:bg-white/5 transition"
                  >
                    <span>⚙️ {t("generalRules")}</span>
                    <span className={`${a.text} text-xl leading-none`}>
                      {showGeneralRules ? "−" : "+"}
                    </span>
                  </button>

                  {showGeneralRules && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 pt-0">
                      {advancedRules.map((r: any) => {
                        const locked = !canUse(plan, r.plan);

                        return (
                          <Rule
                            key={r.key}
                            label={`${r.icon || ""} ${t("r_" + r.key)}`}
                            val={Boolean(rules[r.key])}
                            toggle={() => toggle(r)}
                            fixed={r.fixed}
                            locked={locked}
                            plan={r.plan || "free"}
                            onClass={a.ruleOn}
                            chkClass={a.chk}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
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
                  disabled={plan === "free"}
                  onChange={(e) => setBackupCount(Number(e.target.value))}
                  className={`w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none ${a.ring} transition ${
                    plan === "free" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />

                {plan === "free" && (
                  <p className="text-[11px] text-amber-400 mt-1">
                    Yedek kazanan Starter ve üzeri paketlerde aktif.
                  </p>
                )}
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
              />
            ) : (
              <div className="bg-[#16161f]/70 border border-white/10 rounded-3xl p-8 text-center text-zinc-500">
                <div className="text-5xl mb-3">🎁</div>
                <div className="font-black text-white mb-1">
                  {t("resultHere")}
                </div>
                <div className="text-sm text-zinc-500">{t(config.subKey)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}