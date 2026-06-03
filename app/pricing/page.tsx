"use client";

import { useState, useEffect } from "react";
import { PLANS } from "@/lib/plans";
import { createClient } from "@/lib/supabase-client";
import LangPicker from "@/components/LangPicker";

const PT: Record<string, any> = {
  tr: {
    back: "← Ana Sayfa",
    title: "Fiyatlandırma",
    sub: "İhtiyacına göre plan seç. İstediğin zaman iptal et.",
    monthly: "Aylık",
    yearly: "Yıllık",
    discount: "%30 indirim",
    freeDesc: "Tek seferlik deneme",
    current: "Mevcut Plan",
    default: "Varsayılan",
    popular: "EN POPÜLER",
    perMonth: "ay",
    perYear: "yıl",
    yearlySave: "tasarruf",
    loading: "Yükleniyor...",
    buy: "Satın Al →",
    secure: "Güvenli ödeme · Dodo Payments · İstediğin zaman iptal",
    errors: {
      generic: "Hata oluştu",
      network: "Bağlantı hatası",
    },
  },
  en: {
    back: "← Home",
    title: "Pricing",
    sub: "Choose the plan that fits your needs. Cancel anytime.",
    monthly: "Monthly",
    yearly: "Yearly",
    discount: "30% off",
    freeDesc: "One-time trial",
    current: "Current Plan",
    default: "Default",
    popular: "MOST POPULAR",
    perMonth: "month",
    perYear: "year",
    yearlySave: "saved",
    loading: "Loading...",
    buy: "Buy Now →",
    secure: "Secure payment · Dodo Payments · Cancel anytime",
    errors: {
      generic: "Something went wrong",
      network: "Connection error",
    },
  },
  de: {
    back: "← Startseite",
    title: "Preise",
    sub: "Wähle den passenden Tarif. Jederzeit kündbar.",
    monthly: "Monatlich",
    yearly: "Jährlich",
    discount: "30% Rabatt",
    freeDesc: "Einmaliger Test",
    current: "Aktueller Plan",
    default: "Standard",
    popular: "BELIEBT",
    perMonth: "Monat",
    perYear: "Jahr",
    yearlySave: "gespart",
    loading: "Lädt...",
    buy: "Kaufen →",
    secure: "Sichere Zahlung · Dodo Payments · Jederzeit kündbar",
    errors: {
      generic: "Ein Fehler ist aufgetreten",
      network: "Verbindungsfehler",
    },
  },
  es: {
    back: "← Inicio",
    title: "Precios",
    sub: "Elige el plan que necesitas. Cancela cuando quieras.",
    monthly: "Mensual",
    yearly: "Anual",
    discount: "30% descuento",
    freeDesc: "Prueba única",
    current: "Plan actual",
    default: "Predeterminado",
    popular: "MÁS POPULAR",
    perMonth: "mes",
    perYear: "año",
    yearlySave: "ahorro",
    loading: "Cargando...",
    buy: "Comprar →",
    secure: "Pago seguro · Dodo Payments · Cancela cuando quieras",
    errors: {
      generic: "Ocurrió un error",
      network: "Error de conexión",
    },
  },
  fr: {
    back: "← Accueil",
    title: "Tarifs",
    sub: "Choisissez le plan adapté. Annulez à tout moment.",
    monthly: "Mensuel",
    yearly: "Annuel",
    discount: "30% réduction",
    freeDesc: "Essai unique",
    current: "Plan actuel",
    default: "Par défaut",
    popular: "LE PLUS POPULAIRE",
    perMonth: "mois",
    perYear: "an",
    yearlySave: "économisé",
    loading: "Chargement...",
    buy: "Acheter →",
    secure: "Paiement sécurisé · Dodo Payments · Annulez à tout moment",
    errors: {
      generic: "Une erreur est survenue",
      network: "Erreur de connexion",
    },
  },
  it: {
    back: "← Home",
    title: "Prezzi",
    sub: "Scegli il piano adatto. Annulla quando vuoi.",
    monthly: "Mensile",
    yearly: "Annuale",
    discount: "30% sconto",
    freeDesc: "Prova singola",
    current: "Piano attuale",
    default: "Predefinito",
    popular: "PIÙ POPOLARE",
    perMonth: "mese",
    perYear: "anno",
    yearlySave: "risparmio",
    loading: "Caricamento...",
    buy: "Acquista →",
    secure: "Pagamento sicuro · Dodo Payments · Annulla quando vuoi",
    errors: {
      generic: "Si è verificato un errore",
      network: "Errore di connessione",
    },
  },
  zh: {
    back: "← 首页",
    title: "价格",
    sub: "选择适合你的方案，可随时取消。",
    monthly: "月付",
    yearly: "年付",
    discount: "优惠 30%",
    freeDesc: "一次性试用",
    current: "当前方案",
    default: "默认",
    popular: "最受欢迎",
    perMonth: "月",
    perYear: "年",
    yearlySave: "节省",
    loading: "加载中...",
    buy: "购买 →",
    secure: "安全支付 · Dodo Payments · 可随时取消",
    errors: {
      generic: "发生错误",
      network: "连接错误",
    },
  },
  ru: {
    back: "← Главная",
    title: "Цены",
    sub: "Выберите подходящий план. Отмена в любое время.",
    monthly: "Месяц",
    yearly: "Год",
    discount: "скидка 30%",
    freeDesc: "Разовая проба",
    current: "Текущий план",
    default: "По умолчанию",
    popular: "ПОПУЛЯРНЫЙ",
    perMonth: "мес",
    perYear: "год",
    yearlySave: "экономия",
    loading: "Загрузка...",
    buy: "Купить →",
    secure: "Безопасная оплата · Dodo Payments · Отмена в любое время",
    errors: {
      generic: "Произошла ошибка",
      network: "Ошибка соединения",
    },
  },
  ko: {
    back: "← 홈",
    title: "요금제",
    sub: "필요에 맞는 플랜을 선택하세요. 언제든 취소할 수 있습니다.",
    monthly: "월간",
    yearly: "연간",
    discount: "30% 할인",
    freeDesc: "1회 체험",
    current: "현재 플랜",
    default: "기본",
    popular: "가장 인기",
    perMonth: "월",
    perYear: "년",
    yearlySave: "절약",
    loading: "로딩 중...",
    buy: "구매 →",
    secure: "안전 결제 · Dodo Payments · 언제든 취소 가능",
    errors: {
      generic: "오류가 발생했습니다",
      network: "연결 오류",
    },
  },
  el: {
    back: "← Αρχική",
    title: "Τιμές",
    sub: "Επιλέξτε το κατάλληλο πλάνο. Ακύρωση οποιαδήποτε στιγμή.",
    monthly: "Μηνιαίο",
    yearly: "Ετήσιο",
    discount: "30% έκπτωση",
    freeDesc: "Μία δοκιμή",
    current: "Τρέχον πλάνο",
    default: "Προεπιλογή",
    popular: "ΔΗΜΟΦΙΛΕΣ",
    perMonth: "μήνα",
    perYear: "έτος",
    yearlySave: "εξοικονόμηση",
    loading: "Φόρτωση...",
    buy: "Αγορά →",
    secure: "Ασφαλής πληρωμή · Dodo Payments · Ακύρωση οποιαδήποτε στιγμή",
    errors: {
      generic: "Παρουσιάστηκε σφάλμα",
      network: "Σφάλμα σύνδεσης",
    },
  },
  pl: {
    back: "← Strona główna",
    title: "Cennik",
    sub: "Wybierz plan dla siebie. Anuluj w dowolnym momencie.",
    monthly: "Miesięcznie",
    yearly: "Rocznie",
    discount: "30% zniżki",
    freeDesc: "Jednorazowy test",
    current: "Aktualny plan",
    default: "Domyślny",
    popular: "NAJPOPULARNIEJSZY",
    perMonth: "mies.",
    perYear: "rok",
    yearlySave: "oszczędzasz",
    loading: "Ładowanie...",
    buy: "Kup →",
    secure: "Bezpieczna płatność · Dodo Payments · Anuluj w dowolnym momencie",
    errors: {
      generic: "Wystąpił błąd",
      network: "Błąd połączenia",
    },
  },
  ro: {
    back: "← Acasă",
    title: "Prețuri",
    sub: "Alege planul potrivit. Anulezi oricând.",
    monthly: "Lunar",
    yearly: "Anual",
    discount: "30% reducere",
    freeDesc: "Test unic",
    current: "Plan curent",
    default: "Implicit",
    popular: "CEL MAI POPULAR",
    perMonth: "lună",
    perYear: "an",
    yearlySave: "economisești",
    loading: "Se încarcă...",
    buy: "Cumpără →",
    secure: "Plată securizată · Dodo Payments · Anulezi oricând",
    errors: {
      generic: "A apărut o eroare",
      network: "Eroare de conexiune",
    },
  },
};

export default function PricingPage() {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [lang, setLang] = useState("tr");

  const txt = PT[lang] || PT.en;

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user);

        const { data: dbUser } = await supabase
          .from("users")
          .select("plan")
          .eq("id", data.user.id)
          .single();

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
        alert(data.error || txt.errors.generic);
      }
    } catch {
      alert(txt.errors.network);
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
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="text-zinc-500 text-sm hover:text-white transition">
            {txt.back}
          </a>

          <LangPicker
            lang={lang}
            setLang={setLang}
            accentHover="hover:border-sky-500"
            accentCheck="text-sky-400"
          />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
              {txt.title}
            </span>
          </h1>

          <p className="text-zinc-400 mb-8">{txt.sub}</p>

          <div className="inline-flex bg-[#16161f] border border-white/10 rounded-2xl p-1 mb-4">
            <button
              onClick={() => setInterval("monthly")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${
                interval === "monthly"
                  ? "bg-sky-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {txt.monthly}
            </button>

            <button
              onClick={() => setInterval("yearly")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${
                interval === "yearly"
                  ? "bg-sky-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {txt.yearly}
              <span className="text-green-400 text-xs ml-1">{txt.discount}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#16161f] border border-white/10 rounded-3xl p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="font-black text-xl mb-1">{PLANS.free.name}</div>
            <div className="text-zinc-400 text-sm">{txt.freeDesc}</div>
          </div>

          <div className="text-3xl font-black">$0</div>

          <ul className="text-zinc-400 text-sm space-y-1">
            {PLANS.free.features.map((f, i) => (
              <li key={i}>✓ {f}</li>
            ))}
          </ul>

          <div className="bg-zinc-700 text-zinc-400 px-4 py-2 rounded-xl text-sm font-bold">
            {userPlan === "free" ? txt.current : txt.default}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const price =
              interval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

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
                    {txt.popular}
                  </div>
                )}

                <div className="font-black text-2xl mb-1">{plan.name}</div>

                <div className="text-4xl font-black mb-1">
                  ${price}
                  <span className="text-zinc-500 text-base font-normal">
                    /{interval === "yearly" ? txt.perYear : txt.perMonth}
                  </span>
                </div>

                {interval === "yearly" && (
                  <div className="text-green-400 text-xs mb-4">
                    ${(price / 12).toFixed(0)} / {txt.perMonth} — {txt.yearlySave}
                  </div>
                )}

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className="text-zinc-400 text-sm flex items-center gap-2"
                    >
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
                    ? `⏳ ${txt.loading}`
                    : isCurrentPlan
                    ? `✓ ${txt.current}`
                    : txt.buy}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-zinc-600 text-sm mt-8">
          {txt.secure}
        </p>
      </div>
    </main>
  );
}