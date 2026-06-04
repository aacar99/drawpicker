"use client";

import { useEffect, useState } from "react";
import LangPicker from "@/components/LangPicker";
import { createClient } from "@/lib/supabase-client";
import { translations } from "@/lib/translations";
import { PLANS } from "@/lib/plans";

type LastDraw = {
  id?: string;
  platform: string;
  total: number;
  winners: {
    username: string;
    author?: string;
    avatar?: string;
    image?: string;
    profilePicture?: string;
  }[];
  cert_code?: string;
};

type PricingInterval = "monthly" | "yearly";

const HOME_TEXT: Record<string, any> = {
  tr: {
    account: "👤 Hesabım",
    youtubeTitle: "YouTube Çekilişi",
    youtubeSub: "YouTube yorumlarından  rastgele kazanan seçin.",
    twitterTitle: "X (Twitter) Çekilişi",
    twitterSub: "X gönderilerinden rastgele kazanan seçin.",
    commentFiltering: "Yorum filtreleme",
    multipleWinners: "Çoklu kazanan",
    backupWinners: "Yedek kazanan",
    certificate: "Sertifika ile kanıt",
    startYoutube: "YouTube Çekilişi Yap →",
    startTwitter: "X Çekilişi Yap →",
    pricingSub: "İhtiyacına göre plan seç. İstediğin zaman iptal et.",
    monthly: "Aylık",
    yearly: "Yıllık",
    discount: "%30 indirim",
    freeDesc: "Tek seferlik deneme",
    startFree: "Ücretsiz Başla →",
    buy: "Satın Al →",
    details: "Tüm plan detaylarını gör →",
    popular: "EN POPÜLER",
    perMonth: "ay",
    perYear: "yıl",
    save: "tasarruf",
    footer: "©️ 2025 DrawPicker.io — Güvenli ödeme · Dodo Payments",
    footerPricing: "Fiyatlar",
    footerAccount: "Hesabım",
    footerLogin: "Giriş",
    features: {
      free: ["1 ücretsiz çekiliş", "200 katılımcıya kadar", "Tweet beğeni kontrolü", "Retweet kontrolü", "Sonuç sertifikası"],
      starter: ["Ayda 50 çekiliş", "5.000 katılımcıya kadar", "Beğeni ve retweet kontrolü", "Yorum ve takip kontrolü", "Etiketleme ve anahtar kelime", "Yedek kazanan", "CSV export", "Sonuç sertifikası"],
      pro: ["Sınırsız çekiliş", "20.000 katılımcıya kadar", "Starter özellikleri", "Ek X hesabı takibi", "Profil fotoğrafı kontrolü", "Minimum takipçi", "Minimum yorum uzunluğu", "Bot / spam filtresi", "Öncelikli tarama"],
      business: ["Sınırsız çekiliş", "100.000 katılımcıya kadar", "Pro özellikleri", "Hesap yaşı kontrolü", "Gizli hesap filtreleme", "Gelişmiş bot analizi", "Çoklu kullanıcı", "API erişimi", "White Label", "Özel destek"],
    },
  },

  en: {
    account: "👤 Account",
    youtubeTitle: "YouTube Giveaway",
    youtubeSub: "Pick a fair random winner from YouTube comments.",
    twitterTitle: "X (Twitter) Giveaway",
    twitterSub: "Pick a fair random winner from your X posts.",
    commentFiltering: "Comment filtering",
    multipleWinners: "Multiple winners",
    backupWinners: "Backup winners",
    certificate: "Proof certificate",
    startYoutube: "Start YouTube Giveaway →",
    startTwitter: "Start X Giveaway →",
    pricingSub: "Choose the plan that fits your needs. Cancel anytime.",
    monthly: "Monthly",
    yearly: "Yearly",
    discount: "30% off",
    freeDesc: "One-time trial",
    startFree: "Start Free →",
    buy: "Buy Now →",
    details: "View all plan details →",
    popular: "MOST POPULAR",
    perMonth: "month",
    perYear: "year",
    save: "saved",
    footer: "©️ 2025 DrawPicker.io — Secure payment · Dodo Payments",
    footerPricing: "Pricing",
    footerAccount: "Account",
    footerLogin: "Login",
    features: {
      free: ["1 free giveaway", "Up to 200 participants", "Tweet like check", "Retweet check", "Result certificate"],
      starter: ["50 giveaways per month", "Up to 5,000 participants", "Like and retweet check", "Comment and follow check", "Mention and keyword rules", "Backup winners", "CSV export", "Result certificate"],
      pro: ["Unlimited giveaways", "Up to 20,000 participants", "Starter features", "Extra X account follow", "Profile picture check", "Minimum followers", "Minimum comment length", "Bot / spam filter", "Priority scanning"],
      business: ["Unlimited giveaways", "Up to 100,000 participants", "Pro features", "Account age check", "Private account filtering", "Advanced bot analysis", "Multiple users", "API access", "White Label", "Priority support"],
    },
  },

  de: {
    account: "👤 Konto",
    youtubeTitle: "YouTube Gewinnspiel",
    youtubeSub: "Wähle einen fairen Gewinner aus YouTube-Kommentaren.",
    twitterTitle: "X (Twitter) Gewinnspiel",
    twitterSub: "Wähle einen fairen Gewinner aus deinen X-Beiträgen.",
    commentFiltering: "Kommentarfilter",
    multipleWinners: "Mehrere Gewinner",
    backupWinners: "Ersatzgewinner",
    certificate: "Nachweis-Zertifikat",
    startYoutube: "YouTube Gewinnspiel starten →",
    startTwitter: "X Gewinnspiel starten →",
    pricingSub: "Wähle den passenden Tarif. Jederzeit kündbar.",
    monthly: "Monatlich",
    yearly: "Jährlich",
    discount: "30% Rabatt",
    freeDesc: "Einmaliger Test",
    startFree: "Kostenlos starten →",
    buy: "Kaufen →",
    details: "Alle Tarifdetails ansehen →",
    popular: "BELIEBT",
    perMonth: "Monat",
    perYear: "Jahr",
    save: "gespart",
    footer: "©️ 2025 DrawPicker.io — Sichere Zahlung · Dodo Payments",
    footerPricing: "Preise",
    footerAccount: "Konto",
    footerLogin: "Anmelden",
    features: {
      free: ["1 kostenloses Gewinnspiel", "Bis zu 200 Teilnehmer", "Like-Prüfung", "Retweet-Prüfung", "Ergebniszertifikat"],
      starter: ["50 Gewinnspiele pro Monat", "Bis zu 5.000 Teilnehmer", "Like- und Retweet-Prüfung", "Kommentar- und Follow-Prüfung", "Markierung und Keyword", "Ersatzgewinner", "CSV Export", "Ergebniszertifikat"],
      pro: ["Unbegrenzte Gewinnspiele", "Bis zu 20.000 Teilnehmer", "Starter-Funktionen", "Zusätzliches X-Konto folgen", "Profilbild-Prüfung", "Mindestanzahl Follower", "Min. Kommentarlänge", "Bot-/Spam-Filter", "Priorisierte Prüfung"],
      business: ["Unbegrenzte Gewinnspiele", "Bis zu 100.000 Teilnehmer", "Pro-Funktionen", "Account-Alter-Prüfung", "Private Konten filtern", "Erweiterte Bot-Analyse", "Mehrere Benutzer", "API-Zugriff", "White Label", "Premium-Support"],
    },
  },

  es: {
    account: "👤 Cuenta",
    youtubeTitle: "Sorteo de YouTube",
    youtubeSub: "Elige un ganador justo de comentarios de YouTube.",
    twitterTitle: "Sorteo de X (Twitter)",
    twitterSub: "Elige un ganador justo de tus publicaciones en X.",
    commentFiltering: "Filtro de comentarios",
    multipleWinners: "Múltiples ganadores",
    backupWinners: "Ganadores suplentes",
    certificate: "Certificado de prueba",
    startYoutube: "Crear sorteo YouTube →",
    startTwitter: "Crear sorteo X →",
    pricingSub: "Elige el plan que necesitas. Cancela cuando quieras.",
    monthly: "Mensual",
    yearly: "Anual",
    discount: "30% descuento",
    freeDesc: "Prueba única",
    startFree: "Comenzar Gratis →",
    buy: "Comprar →",
    details: "Ver todos los planes →",
    popular: "MÁS POPULAR",
    perMonth: "mes",
    perYear: "año",
    save: "ahorro",
    footer: "©️ 2025 DrawPicker.io — Pago seguro · Dodo Payments",
    footerPricing: "Precios",
    footerAccount: "Cuenta",
    footerLogin: "Iniciar sesión",
    features: {
      free: ["1 sorteo gratis", "Hasta 200 participantes", "Comprobación de like", "Comprobación de retweet", "Certificado de resultado"],
      starter: ["50 sorteos al mes", "Hasta 5.000 participantes", "Like y retweet", "Comentario y seguimiento", "Mención y palabra clave", "Ganadores suplentes", "Exportar CSV", "Certificado de resultado"],
      pro: ["Sorteos ilimitados", "Hasta 20.000 participantes", "Funciones Starter", "Seguimiento de cuenta X extra", "Comprobación de foto de perfil", "Mínimo de seguidores", "Longitud mínima de comentario", "Filtro bot/spam", "Escaneo prioritario"],
      business: ["Sorteos ilimitados", "Hasta 100.000 participantes", "Funciones Pro", "Edad de cuenta", "Filtro de cuentas privadas", "Análisis avanzado de bots", "Múltiples usuarios", "Acceso API", "White Label", "Soporte prioritario"],
    },
  },

  fr: {
    account: "👤 Compte",
    youtubeTitle: "Tirage YouTube",
    youtubeSub: "Choisissez un gagnant équitable parmi les commentaires YouTube.",
    twitterTitle: "Tirage X (Twitter)",
    twitterSub: "Choisissez un gagnant équitable depuis vos publications X.",
    commentFiltering: "Filtrage des commentaires",
    multipleWinners: "Plusieurs gagnants",
    backupWinners: "Gagnants suppléants",
    certificate: "Certificat de preuve",
    startYoutube: "Créer un tirage YouTube →",
    startTwitter: "Créer un tirage X →",
    pricingSub: "Choisissez le plan adapté. Annulez à tout moment.",
    monthly: "Mensuel",
    yearly: "Annuel",
    discount: "30% réduction",
    freeDesc: "Essai unique",
    startFree: "Commencer Gratuitement →",
    buy: "Acheter →",
    details: "Voir tous les plans →",
    popular: "LE PLUS POPULAIRE",
    perMonth: "mois",
    perYear: "an",
    save: "économisé",
    footer: "©️ 2025 DrawPicker.io — Paiement sécurisé · Dodo Payments",
    footerPricing: "Tarifs",
    footerAccount: "Compte",
    footerLogin: "Connexion",
    features: {
      free: ["1 tirage gratuit", "Jusqu’à 200 participants", "Vérification du like", "Vérification du retweet", "Certificat de résultat"],
      starter: ["50 tirages par mois", "Jusqu’à 5.000 participants", "Like et retweet", "Commentaire et suivi", "Mention et mot-clé", "Gagnants suppléants", "Export CSV", "Certificat de résultat"],
      pro: ["Tirages illimités", "Jusqu’à 20.000 participants", "Fonctions Starter", "Suivi d’un compte X supplémentaire", "Vérification photo de profil", "Minimum d’abonnés", "Longueur minimale du commentaire", "Filtre bot/spam", "Scan prioritaire"],
      business: ["Tirages illimités", "Jusqu’à 100.000 participants", "Fonctions Pro", "Âge du compte", "Filtrage comptes privés", "Analyse bot avancée", "Utilisateurs multiples", "Accès API", "White Label", "Support prioritaire"],
    },
  },
};
export default function Home() {
  const [lang, setLang] = useState("tr");
  const [lastDraw, setLastDraw] = useState<LastDraw | null>(null);
  const [user, setUser] = useState<any>(null);
  const [pricingInterval, setPricingInterval] =
    useState<PricingInterval>("monthly");

  const t = translations[lang as keyof typeof translations] || translations.tr;
  const h = HOME_TEXT[lang] || HOME_TEXT.en;

  useEffect(() => {
    const saved = localStorage.getItem("drawpicker_lang");
    if (saved) setLang(saved);

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    supabase
      .from("draw_results")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setLastDraw(data);
      });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  const lastWinner = lastDraw?.winners?.[0];

  return (
    <main className="min-h-screen bg-[#080812] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#0ea5e933,transparent_32%),radial-gradient(circle_at_85%_45%,#a855f733,transparent_35%),linear-gradient(180deg,#080812,#0b0b14)]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:48px_48px]" />

      <nav className="relative z-[9999] max-w-7xl mx-auto flex items-center justify-between px-5 py-5 border-b border-white/10">
        <a href="/" className="text-2xl font-black tracking-tight">
          🎁 Draw<span className="text-pink-400">Picker</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-300">
          <a href="/" className="text-white border-b-2 border-cyan-400 pb-2">
            {t.nav.home}
          </a>
          <a href="#platforms" className="hover:text-white">
            {t.nav.features}
          </a>
          <a href="#nasil" className="hover:text-white">
            {t.nav.how}
          </a>
          <a href="#pricing" className="hover:text-white text-pink-400">
            {t.nav.pricing}
          </a>
          <a href="#sss" className="hover:text-white">
            {t.nav.faq}
          </a>
          <a href="#iletisim" className="hover:text-white">
            {t.nav.contact}
          </a>
        </div>

        <div className="relative z-[10000] flex items-center gap-3">
          <LangPicker
            lang={lang}
            setLang={setLang}
            accentHover="hover:border-sky-500"
            accentCheck="text-sky-400"
          />

          {user ? (
            <div className="flex items-center gap-2">
              <a
                href="/dashboard"
                className="text-sm border border-white/10 hover:border-sky-500 px-4 py-2 rounded-xl transition text-zinc-300 hover:text-white hidden sm:block"
              >
                {h.account}
              </a>

              <button
                onClick={handleLogout}
                className="text-sm border border-white/10 hover:border-red-500 px-4 py-2 rounded-xl transition text-zinc-300 hover:text-red-400"
              >
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="text-sm font-black px-5 py-2 rounded-xl border border-white/10 hover:border-cyan-400 transition"
            >
              {t.nav.login}
            </a>
          )}
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-5 pt-14 pb-14 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300 mb-7">
          {t.hero.badge}
        </div>

        <h1 className="text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight mb-7">
          {t.hero.title1}
          <br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
            {t.hero.title2}
          </span>
        </h1>

        <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          {t.hero.desc}
        </p>
      </section>

      <section
        id="platforms"
        className="relative z-10 max-w-7xl mx-auto px-5 pb-14"
      >
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden bg-[#141421]/90 border border-red-500/30 rounded-3xl p-7 shadow-2xl">
              <div className="absolute right-8 top-16 text-[9rem] text-white/[0.04]">
                ▶️
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-3xl mb-5">
                ▶️
              </div>

              <h2 className="text-3xl font-black mb-3">
                {h.youtubeTitle}
              </h2>

              <p className="text-zinc-400 text-sm mb-6">
                {h.youtubeSub}
              </p>

              <div className="space-y-3 text-sm text-zinc-300 mb-7">
                <div>✓ {h.commentFiltering}</div>
                <div>✓ {h.multipleWinners}</div>
                <div>✓ {h.backupWinners}</div>
                <div>✓ {h.certificate}</div>
              </div>

              <a
                href="/youtube"
                className="block w-full text-center bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 py-4 rounded-xl font-black transition"
              >
                {h.startYoutube}
              </a>
            </div>

            <div className="relative overflow-hidden bg-[#141421]/90 border border-sky-500/30 rounded-3xl p-7 shadow-2xl">
              <div className="absolute right-8 top-10 text-[10rem] text-white/[0.04]">
                𝕏
              </div>

              <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-3xl mb-5">
                𝕏
              </div>

              <h2 className="text-3xl font-black mb-3">
                {h.twitterTitle}
              </h2>

              <p className="text-zinc-400 text-sm mb-6">
                {h.twitterSub}
              </p>

              <div className="space-y-3 text-sm text-zinc-300 mb-7">
                <div>✓ {h.commentFiltering}</div>
                <div>✓ {h.multipleWinners}</div>
                <div>✓ {h.backupWinners}</div>
                <div>✓ {h.certificate}</div>
              </div>

              <a
                href="/twitter"
                className="block w-full text-center bg-gradient-to-r from-cyan-400 to-blue-600 hover:opacity-90 py-4 rounded-xl font-black transition"
              >
                {h.startTwitter}
              </a>
            </div>
          </div>
          <div className="bg-[#141421]/90 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="text-sm text-zinc-400 font-bold mb-4">
              🏆 {t.lastDraw.title}
            </div>

            <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5 mb-5">
              <div className="flex items-center gap-4">
                {lastWinner?.avatar ||
                lastWinner?.image ||
                lastWinner?.profilePicture ? (
                  <img
                    src={
                      lastWinner.avatar ||
                      lastWinner.image ||
                      lastWinner.profilePicture
                    }
                    alt=""
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-sky-400 flex items-center justify-center text-3xl">
                    🏆
                  </div>
                )}

                <div>
                  <div className="text-zinc-400 text-sm">
                    {t.lastDraw.winner}
                  </div>

                  <div className="text-2xl font-black">
                    @{lastWinner?.username || "drawpicker"}
                  </div>

                  <div className="text-zinc-500 text-sm">
                    {t.lastDraw.congrats}
                  </div>
                </div>
              </div>

              <a
                href={lastDraw?.id ? `/result/${lastDraw.id}` : "#"}
                className="inline-block mt-4 text-xs font-black bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg transition"
              >
                {t.lastDraw.view}
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">💬</div>
                <div className="font-black text-xl">
                  {(lastDraw?.total || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {t.lastDraw.comments}
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">👥</div>
                <div className="font-black text-xl">
                  {lastDraw?.winners?.length || 0}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {t.lastDraw.eligible}
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-black text-xl">1</div>
                <div className="text-[11px] text-zinc-500">
                  {t.lastDraw.winners}
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.03] rounded-xl px-4 py-3 text-center text-xs font-mono text-zinc-300">
              {t.lastDraw.cert}: {lastDraw?.cert_code || "DP-XXXXXXXX"}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-5 pb-20">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-black mb-1">{t.features.fastTitle}</div>
            <p className="text-sm text-zinc-400">{t.features.fastText}</p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">📜</div>
            <div className="font-black mb-1">{t.features.certTitle}</div>
            <p className="text-sm text-zinc-400">{t.features.certText}</p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">🔒</div>
            <div className="font-black mb-1">{t.features.secureTitle}</div>
            <p className="text-sm text-zinc-400">{t.features.secureText}</p>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="relative z-10 max-w-7xl mx-auto px-5 pb-24"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {t.nav.pricing}
            </span>
          </h2>

          <p className="text-zinc-400 mb-8">{h.pricingSub}</p>

          <div className="inline-flex bg-[#16161f] border border-white/10 rounded-2xl p-1">
            <button
              onClick={() => setPricingInterval("monthly")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${
                pricingInterval === "monthly"
                  ? "bg-sky-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {h.monthly}
            </button>

            <button
              onClick={() => setPricingInterval("yearly")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${
                pricingInterval === "yearly"
                  ? "bg-sky-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {h.yearly}
              <span className="text-green-400 text-xs ml-1">
                {h.discount}
              </span>
            </button>
          </div>
        </div>

        <div className="bg-[#141421]/90 border border-white/10 rounded-3xl p-6 mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-black text-xl mb-1">🆓 Free</div>
            <div className="text-zinc-400 text-sm">{h.freeDesc}</div>
          </div>

          <div className="text-3xl font-black">$0</div>

          <ul className="text-zinc-400 text-sm space-y-1">
            {h.features.free.map((f: string, i: number) => (
              <li key={i}>✓ {f}</li>
            ))}
          </ul>

          <a
            href="/auth/login"
            className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold text-sm transition"
          >
            {h.startFree}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {(["starter", "pro", "business"] as const).map((key) => {
            const plan = PLANS[key];
            const price =
              pricingInterval === "yearly"
                ? plan.yearlyPrice
                : plan.monthlyPrice;
            const isPopular = key === "pro";

            return (
              <div
                key={key}
                className={`relative bg-[#141421]/90 border rounded-3xl p-6 flex flex-col ${
                  isPopular
                    ? "border-purple-500 shadow-lg shadow-purple-500/20"
                    : "border-white/10"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-black px-4 py-1 rounded-full whitespace-nowrap">
                    {h.popular}
                  </div>
                )}

                <div className="font-black text-2xl mb-1">{plan.name}</div>

                <div className="text-4xl font-black mb-1">
                  ${price}
                  <span className="text-zinc-500 text-base font-normal">
                    /
                    {pricingInterval === "yearly"
                      ? h.perYear
                      : h.perMonth}
                  </span>
                </div>

                {pricingInterval === "yearly" && (
                  <div className="text-green-400 text-xs mb-3">
                    ${Math.round(price / 12)} / {h.perMonth} — {h.save}
                  </div>
                )}

                <ul className="space-y-2 mb-6 flex-1">
                  {h.features[key].map((f: string, i: number) => (
                    <li
                      key={i}
                      className="text-zinc-400 text-sm flex items-center gap-2"
                    >
                      <span className="text-green-400">✓</span> {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="/pricing"
                  className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition ${
                    isPopular
                      ? "bg-purple-600 hover:bg-purple-500"
                      : "bg-sky-600 hover:bg-sky-500"
                  }`}
                >
                  {h.buy}
                </a>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <a
            href="/pricing"
            className="text-zinc-400 hover:text-white text-sm underline transition"
          >
            {h.details}
          </a>
        </div>
      </section>

      <footer
        id="iletisim"
        className="relative z-10 border-t border-white/10 max-w-7xl mx-auto px-5 py-8 text-center text-zinc-600 text-sm"
      >
        <p>{h.footer}</p>

        <div className="flex justify-center gap-6 mt-3">
          <a href="/pricing" className="hover:text-white transition">
            {h.footerPricing}
          </a>
          <a href="/dashboard" className="hover:text-white transition">
            {h.footerAccount}
          </a>
          <a href="/auth/login" className="hover:text-white transition">
            {h.footerLogin}
          </a>
        </div>
      </footer>
    </main>
  );
}