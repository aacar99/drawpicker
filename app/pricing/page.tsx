"use client";

import { useState, useEffect } from "react";
import { PLANS } from "@/lib/plans";
import { createClient } from "@/lib/supabase-client";

export default function PricingPage() {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<string>("free");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user);
        const { data: dbUser } = await supabase
          .from("users").select("plan").eq("id", data.user.id).single();
        if (dbUser) setUserPlan(dbUser.plan);
      }
    });
  }, []);

  async function handleCheckout(plan: string) {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "Hata oluştu");
      }
    } catch (e) {
      alert("Bağlantı hatası");
    }
    setLoading(null);
  }

  const plans = [
    { key: "starter", ...PLANS.starter, color: "sky", popular: false },
    { key: "pro", ...PLANS.pro, color: "purple", popular: true },
    { key: "business", ...PLANS.business, color: "cyan", popular: false },
  ];

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_40%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_40%)]" />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <a href="/" className="text-zinc-500 text-sm hover:text-white transition block mb-6">← Ana Sayfa</a>
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
              Fiyatlandırma
            </span>
          </h1>
          <p className="text-zinc-400 mb-8">İhtiyacına göre plan seç. İstediğin zaman iptal et.</p>

          {/* Aylık / Yıllık Toggle */}
          <div className="inline-flex bg-[#16161f] border border-white/10 rounded-2xl p-1 mb-4">
            <button
              onClick={() => setInterval("monthly")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${interval === "monthly" ? "bg-sky-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              Aylık
            </button>
            <button
              onClick={() => setInterval("yearly")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${interval === "yearly" ? "bg-sky-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              Yıllık <span className="text-green-400 text-xs ml-1">%30 indirim</span>
            </button>
          </div>
        </div>

        {/* Free Plan */}
        <div className="bg-[#16161f] border border-white/10 rounded-3xl p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="font-black text-xl mb-1">Free</div>
            <div className="text-zinc-400 text-sm">Tek seferlik deneme</div>
          </div>
          <div className="text-3xl font-black">$0</div>
          <ul className="text-zinc-400 text-sm space-y-1">
            {PLANS.free.features.map((f, i) => <li key={i}>✓ {f}</li>)}
          </ul>
          <div className="bg-zinc-700 text-zinc-400 px-4 py-2 rounded-xl text-sm font-bold">
            {userPlan === "free" ? "Mevcut Plan" : "Varsayılan"}
          </div>
        </div>

        {/* Ücretli Planlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const price = interval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const isCurrentPlan = userPlan === plan.key;

            return (
              <div
                key={plan.key}
                className={`bg-[#16161f] border rounded-3xl p-6 flex flex-col relative ${
                  plan.popular
                    ? "border-purple-500 shadow-lg shadow-purple-500/20"
                    : "border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-black px-4 py-1 rounded-full">
                    EN POPÜLER
                  </div>
                )}

                <div className="font-black text-2xl mb-1">{plan.name}</div>
                <div className="text-4xl font-black mb-1">
                  ${price}
                  <span className="text-zinc-500 text-base font-normal">
                    /{interval === "yearly" ? "yıl" : "ay"}
                  </span>
                </div>

                {interval === "yearly" && (
                  <div className="text-green-400 text-xs mb-4">
                    Aylık ${(price / 12).toFixed(0)} — %30 tasarruf
                  </div>
                )}

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-zinc-400 text-sm flex items-center gap-2">
                      <span className="text-green-400">✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.key)}
                  disabled={loading === plan.key || isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                    isCurrentPlan
                      ? "bg-zinc-700 text-zinc-400 cursor-default"
                      : plan.popular
                      ? "bg-purple-600 hover:bg-purple-500 text-white"
                      : "bg-sky-600 hover:bg-sky-500 text-white"
                  }`}
                >
                  {loading === plan.key
                    ? "⏳ Yükleniyor..."
                    : isCurrentPlan
                    ? "✓ Mevcut Plan"
                    : "Satın Al →"}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-zinc-600 text-sm mt-8">
          Güvenli ödeme · Dodo Payments · İstediğin zaman iptal
        </p>
      </div>
    </main>
  );
}
