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
    features: {
      free: ["1 ücretsiz çekiliş", "200 katılımcıya kadar", "Tweet beğeni kontrolü", "Retweet kontrolü", "Sonuç sertifikası"],
      starter: ["Ayda 50 çekiliş", "5.000 katılımcıya kadar", "Beğeni ve retweet kontrolü", "Yorum ve takip kontrolü", "Etiketleme ve anahtar kelime", "Yedek kazanan", "CSV export", "Sonuç sertifikası"],
      pro: ["Sınırsız çekiliş", "20.000 katılımcıya kadar", "Starter özellikleri", "Ek X hesabı takibi", "Profil fotoğrafı kontrolü", "Minimum takipçi", "Minimum yorum uzunluğu", "Bot / spam filtresi", "Öncelikli tarama"],
      business: ["Sınırsız çekiliş", "100.000 katılımcıya kadar", "Pro özellikleri", "Hesap yaşı kontrolü", "Gizli hesap filtreleme", "Gelişmiş bot analizi", "Çoklu kullanıcı", "API erişimi", "White Label", "Özel destek"],
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
    features: {
      free: ["1 free giveaway", "Up to 200 participants", "Tweet like check", "Retweet check", "Result certificate"],
      starter: ["50 giveaways per month", "Up to 5,000 participants", "Like and retweet check", "Comment and follow check", "Mention and keyword rules", "Backup winners", "CSV export", "Result certificate"],
      pro: ["Unlimited giveaways", "Up to 20,000 participants", "Starter features", "Extra X account follow", "Profile picture check", "Minimum followers", "Minimum comment length", "Bot / spam filter", "Priority scanning"],
      business: ["Unlimited giveaways", "Up to 100,000 participants", "Pro features", "Account age check", "Private account filtering", "Advanced bot analysis", "Multiple users", "API access", "White Label", "Priority support"],
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
    features: {
      free: ["1 kostenloses Gewinnspiel", "Bis zu 200 Teilnehmer", "Like-Prüfung", "Retweet-Prüfung", "Ergebniszertifikat"],
      starter: ["50 Gewinnspiele pro Monat", "Bis zu 5.000 Teilnehmer", "Like- und Retweet-Prüfung", "Kommentar- und Follow-Prüfung", "Markierung und Keyword", "Ersatzgewinner", "CSV Export", "Ergebniszertifikat"],
      pro: ["Unbegrenzte Gewinnspiele", "Bis zu 20.000 Teilnehmer", "Starter-Funktionen", "Zusätzliches X-Konto folgen", "Profilbild-Prüfung", "Mindestanzahl Follower", "Min. Kommentarlänge", "Bot-/Spam-Filter", "Priorisierte Prüfung"],
      business: ["Unbegrenzte Gewinnspiele", "Bis zu 100.000 Teilnehmer", "Pro-Funktionen", "Account-Alter-Prüfung", "Private Konten filtern", "Erweiterte Bot-Analyse", "Mehrere Benutzer", "API-Zugriff", "White Label", "Premium-Support"],
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
    features: {
      free: ["1 sorteo gratis", "Hasta 200 participantes", "Comprobación de like", "Comprobación de retweet", "Certificado de resultado"],
      starter: ["50 sorteos al mes", "Hasta 5.000 participantes", "Like y retweet", "Comentario y seguimiento", "Mención y palabra clave", "Ganadores suplentes", "Exportar CSV", "Certificado de resultado"],
      pro: ["Sorteos ilimitados", "Hasta 20.000 participantes", "Funciones Starter", "Seguimiento de cuenta X extra", "Comprobación de foto de perfil", "Mínimo de seguidores", "Longitud mínima de comentario", "Filtro bot/spam", "Escaneo prioritario"],
      business: ["Sorteos ilimitados", "Hasta 100.000 participantes", "Funciones Pro", "Edad de cuenta", "Filtro de cuentas privadas", "Análisis avanzado de bots", "Múltiples usuarios", "Acceso API", "White Label", "Soporte prioritario"],
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
    features: {
      free: ["1 tirage gratuit", "Jusqu’à 200 participants", "Vérification du like", "Vérification du retweet", "Certificat de résultat"],
      starter: ["50 tirages par mois", "Jusqu’à 5.000 participants", "Like et retweet", "Commentaire et suivi", "Mention et mot-clé", "Gagnants suppléants", "Export CSV", "Certificat de résultat"],
      pro: ["Tirages illimités", "Jusqu’à 20.000 participants", "Fonctions Starter", "Suivi d’un compte X supplémentaire", "Vérification photo de profil", "Minimum d’abonnés", "Longueur minimale du commentaire", "Filtre bot/spam", "Scan prioritaire"],
      business: ["Tirages illimités", "Jusqu’à 100.000 participants", "Fonctions Pro", "Âge du compte", "Filtrage comptes privés", "Analyse bot avancée", "Utilisateurs multiples", "Accès API", "White Label", "Support prioritaire"],
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
    features: {
      free: ["1 estrazione gratuita", "Fino a 200 partecipanti", "Controllo like", "Controllo retweet", "Certificato risultato"],
      starter: ["50 estrazioni al mese", "Fino a 5.000 partecipanti", "Like e retweet", "Commento e follow", "Menzione e parola chiave", "Vincitori di riserva", "Export CSV", "Certificato risultato"],
      pro: ["Estrazioni illimitate", "Fino a 20.000 partecipanti", "Funzioni Starter", "Follow account X extra", "Controllo foto profilo", "Follower minimi", "Lunghezza minima commento", "Filtro bot/spam", "Scansione prioritaria"],
      business: ["Estrazioni illimitate", "Fino a 100.000 partecipanti", "Funzioni Pro", "Età account", "Filtro account privati", "Analisi bot avanzata", "Utenti multipli", "Accesso API", "White Label", "Supporto prioritario"],
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
    features: {
      free: ["1 次免费抽奖", "最多 200 名参与者", "点赞检查", "转推检查", "结果证书"],
      starter: ["每月 50 次抽奖", "最多 5,000 名参与者", "点赞和转推检查", "评论和关注检查", "提及和关键词规则", "候补获奖者", "CSV 导出", "结果证书"],
      pro: ["无限抽奖", "最多 20,000 名参与者", "Starter 功能", "额外 X 账号关注", "头像检查", "最低粉丝数", "最短评论长度", "机器人/垃圾过滤", "优先扫描"],
      business: ["无限抽奖", "最多 100,000 名参与者", "Pro 功能", "账号年龄检查", "私密账号过滤", "高级机器人分析", "多用户", "API 访问", "白标", "优先支持"],
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
    features: {
      free: ["1 бесплатный розыгрыш", "До 200 участников", "Проверка лайка", "Проверка ретвита", "Сертификат результата"],
      starter: ["50 розыгрышей в месяц", "До 5.000 участников", "Проверка лайка и ретвита", "Проверка комментария и подписки", "Упоминание и ключевое слово", "Запасные победители", "CSV экспорт", "Сертификат результата"],
      pro: ["Безлимитные розыгрыши", "До 20.000 участников", "Функции Starter", "Подписка на дополнительный X аккаунт", "Проверка аватара", "Минимум подписчиков", "Мин. длина комментария", "Фильтр ботов/спама", "Приоритетное сканирование"],
      business: ["Безлимитные розыгрыши", "До 100.000 участников", "Функции Pro", "Проверка возраста аккаунта", "Фильтр закрытых аккаунтов", "Расширенный анализ ботов", "Несколько пользователей", "API доступ", "White Label", "Приоритетная поддержка"],
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
    features: {
      free: ["무료 추첨 1회", "참가자 최대 200명", "좋아요 확인", "리트윗 확인", "결과 인증서"],
      starter: ["월 50회 추첨", "참가자 최대 5,000명", "좋아요 및 리트윗 확인", "댓글 및 팔로우 확인", "멘션 및 키워드 규칙", "예비 당첨자", "CSV 내보내기", "결과 인증서"],
      pro: ["무제한 추첨", "참가자 최대 20,000명", "Starter 기능", "추가 X 계정 팔로우", "프로필 사진 확인", "최소 팔로워", "최소 댓글 길이", "봇/스팸 필터", "우선 스캔"],
      business: ["무제한 추첨", "참가자 최대 100,000명", "Pro 기능", "계정 나이 확인", "비공개 계정 필터", "고급 봇 분석", "다중 사용자", "API 접근", "화이트 라벨", "우선 지원"],
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
    features: {
      free: ["1 δωρεάν κλήρωση", "Έως 200 συμμετέχοντες", "Έλεγχος like", "Έλεγχος retweet", "Πιστοποιητικό αποτελέσματος"],
      starter: ["50 κληρώσεις τον μήνα", "Έως 5.000 συμμετέχοντες", "Έλεγχος like και retweet", "Έλεγχος σχολίου και follow", "Mention και λέξη-κλειδί", "Αναπληρωματικοί νικητές", "Εξαγωγή CSV", "Πιστοποιητικό αποτελέσματος"],
      pro: ["Απεριόριστες κληρώσεις", "Έως 20.000 συμμετέχοντες", "Λειτουργίες Starter", "Follow επιπλέον X λογαριασμού", "Έλεγχος φωτογραφίας προφίλ", "Ελάχιστοι ακόλουθοι", "Ελάχιστο μήκος σχολίου", "Φίλτρο bot/spam", "Προτεραιότητα σάρωσης"],
      business: ["Απεριόριστες κληρώσεις", "Έως 100.000 συμμετέχοντες", "Λειτουργίες Pro", "Έλεγχος ηλικίας λογαριασμού", "Φίλτρο ιδιωτικών λογαριασμών", "Προηγμένη ανάλυση bot", "Πολλαπλοί χρήστες", "Πρόσβαση API", "White Label", "Προτεραιότητα υποστήριξης"],
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
    features: {
      free: ["1 darmowe losowanie", "Do 200 uczestników", "Sprawdzenie polubienia", "Sprawdzenie retweetu", "Certyfikat wyniku"],
      starter: ["50 losowań miesięcznie", "Do 5.000 uczestników", "Sprawdzenie polubienia i retweetu", "Sprawdzenie komentarza i obserwacji", "Oznaczenie i słowo kluczowe", "Zwycięzcy rezerwowi", "Eksport CSV", "Certyfikat wyniku"],
      pro: ["Nielimitowane losowania", "Do 20.000 uczestników", "Funkcje Starter", "Obserwacja dodatkowego konta X", "Sprawdzenie zdjęcia profilowego", "Minimum obserwujących", "Minimalna długość komentarza", "Filtr bot/spam", "Priorytetowe skanowanie"],
      business: ["Nielimitowane losowania", "Do 100.000 uczestników", "Funkcje Pro", "Sprawdzenie wieku konta", "Filtrowanie prywatnych kont", "Zaawansowana analiza botów", "Wielu użytkowników", "Dostęp API", "White Label", "Priorytetowe wsparcie"],
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
    features: {
      free: ["1 extragere gratuită", "Până la 200 participanți", "Verificare like", "Verificare retweet", "Certificat rezultat"],
      starter: ["50 extrageri pe lună", "Până la 5.000 participanți", "Verificare like și retweet", "Verificare comentariu și follow", "Mențiune și cuvânt cheie", "Câștigători de rezervă", "Export CSV", "Certificat rezultat"],
      pro: ["Extrageri nelimitate", "Până la 20.000 participanți", "Funcții Starter", "Follow cont X suplimentar", "Verificare poză profil", "Minim urmăritori", "Lungime minimă comentariu", "Filtru bot/spam", "Scanare prioritară"],
      business: ["Extrageri nelimitate", "Până la 100.000 participanți", "Funcții Pro", "Verificare vârstă cont", "Filtrare conturi private", "Analiză bot avansată", "Utilizatori multipli", "Acces API", "White Label", "Suport prioritar"],
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
        alert(data.error || "Error");
      }
    } catch {
      alert("Connection error");
    }

    setLoading(null);
  }

  const plans = [
    { key: "starter", ...PLANS.starter, popular: false },
    { key: "pro", ...PLANS.pro, popular: true },
    { key: "business", ...PLANS.business, popular: false },
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
            {txt.features.free.map((f: string, i: number) => (
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
            const featureList = txt.features[plan.key] || plan.features;

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
                  {featureList.map((f: string, i: number) => (
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

        <p className="text-center text-zinc-600 text-sm mt-8">{txt.secure}</p>
      </div>
    </main>
  );
}