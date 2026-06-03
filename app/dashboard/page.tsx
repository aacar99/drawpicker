"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { getPlan } from "@/lib/plans";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        window.location.href = "/auth/login";
        return;
      }
      setUser(data.user);
      const { data: db } = await supabase.from("users").select("*").eq("id", data.user.id).single();
      setDbUser(db);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center">
        <div className="text-zinc-400">Yükleniyor...</div>
      </main>
    );
  }

  const plan = getPlan(dbUser?.plan || "free");
  const drawsUsed = dbUser?.draws_this_month || 0;
  const drawsTotal = plan.drawsPerMonth;
  const pct = drawsTotal >= 999999 ? 100 : Math.min((drawsUsed / drawsTotal) * 100, 100);
  const periodEnd = dbUser?.current_period_end
    ? new Date(dbUser.current_period_end).toLocaleDateString("tr-TR")
    : null;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_40%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_40%)]" />
      <div className="relative max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="text-zinc-500 text-sm hover:text-white transition">← Ana Sayfa</a>
          <button onClick={handleLogout} className="text-sm text-zinc-500 hover:text-red-400 transition">Çıkış</button>
        </div>

        <h1 className="text-3xl font-black mb-8">👤 Hesabım</h1>

        {/* Kullanıcı Bilgisi */}
        <div className="bg-[#16161f] border border-white/10 rounded-3xl p-6 mb-4">
          <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Email</div>
          <div className="font-bold">{user?.email}</div>
        </div>

        {/* Plan Bilgisi */}
        <div className="bg-[#16161f] border border-white/10 rounded-3xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Mevcut Plan</div>
              <div className="text-2xl font-black text-sky-400">{plan.name}</div>
            </div>
            {periodEnd && (
              <div className="text-right">
                <div className="text-zinc-500 text-xs mb-1">Yenileme</div>
                <div className="text-sm">{periodEnd}</div>
              </div>
            )}
          </div>

          {/* Kullanım */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-400">Bu ay çekiliş</span>
              <span className="font-bold">
                {drawsUsed} / {drawsTotal >= 999999 ? "∞" : drawsTotal}
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div
                className="bg-sky-500 h-2 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Plan yükselt */}
        {dbUser?.plan === "free" || dbUser?.plan === "starter" ? (
          <a href="/pricing"
            className="block w-full bg-gradient-to-r from-sky-600 to-purple-600 py-4 rounded-2xl font-black text-center text-lg hover:opacity-90 transition">
            🚀 Planı Yükselt →
          </a>
        ) : (
          <a href="/pricing"
            className="block w-full border border-white/10 hover:border-sky-500 py-4 rounded-2xl font-bold text-center text-sm transition text-zinc-400">
            Planları Gör
          </a>
        )}
      </div>
    </main>
  );
}
