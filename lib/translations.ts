const base = {
  hero: {
    badge: "🛡️ 100% Fair • Transparent • Secure",
    title1: "The Fair Giveaway",
    title2: "Platform!",
    desc: "Create secure, transparent and professional giveaways on X and YouTube.",
    start: "Start Giveaway →",
    how: "▶ How It Works?",
    free: "Free",
    noCard: "No credit card required",
    limit: "Free up to 200 participants",
  },
  lastDraw: {
    title: "Last Giveaway",
    winner: "Winner",
    congrats: "Congratulations! 🎉",
    view: "View Result",
    comments: "Total Comments",
    eligible: "Eligible Participants",
    winners: "Winner",
    cert: "Giveaway Certificate",
  },
  features: {
    fastTitle: "Fast Results",
    fastText: "Get giveaway results in seconds.",
    certTitle: "Certified",
    certText: "A verifiable giveaway certificate is generated.",
    secureTitle: "Secure",
    secureText: "Results are stored and can be shared.",
  },
};

export const translations = {
  tr: {
    nav: {
      home: "Ana Sayfa",
      features: "Özellikler",
      how: "Nasıl Çalışır?",
      pricing: "Fiyatlandırma",
      faq: "SSS",
      contact: "İletişim",
      login: "Giriş Yap",
      logout: "Çıkış",
    },
    hero: {
      badge: "🛡️ %100 Adil • Şeffaf • Güvenilir",
      title1: "Adil Çekilişin",
      title2: "Tek Adresi!",
      desc: "X ve YouTube’da güvenilir, şeffaf ve profesyonel çekilişler düzenleyin.",
      start: "Hemen Çekiliş Yap →",
      how: "▶ Nasıl Çalışır?",
      free: "Ücretsiz",
      noCard: "Kredi kartı gerekmez",
      limit: "200 katılımcıya kadar ücretsiz",
    },
    lastDraw: {
      title: "Son Çekiliş",
      winner: "Kazanan",
      congrats: "Tebrikler! 🎉",
      view: "Sonucu Görüntüle",
      comments: "Toplam Yorum",
      eligible: "Uygun Katılımcı",
      winners: "Kazanan",
      cert: "Çekiliş Sertifikası",
    },
    features: {
      fastTitle: "Hızlı Sonuç",
      fastText: "Saniyeler içinde çekiliş sonucu alın.",
      certTitle: "Sertifikalı",
      certText: "Doğrulanabilir çekiliş sertifikası oluşturulur.",
      secureTitle: "Güvenli",
      secureText: "Sonuçlar kayıt altında tutulur ve paylaşılabilir.",
    },
  },

  en: {
    nav: {
      home: "Home",
      features: "Features",
      how: "How It Works?",
      pricing: "Pricing",
      faq: "FAQ",
      contact: "Contact",
      login: "Login",
      logout: "Logout",
    },
    ...base,
  },

  de: {
    nav: {
      home: "Startseite",
      features: "Funktionen",
      how: "Wie funktioniert es?",
      pricing: "Preise",
      faq: "FAQ",
      contact: "Kontakt",
      login: "Anmelden",
      logout: "Abmelden",
    },
    ...base,
  },

  zh: {
    nav: {
      home: "主页",
      features: "功能",
      how: "如何使用？",
      pricing: "价格",
      faq: "常见问题",
      contact: "联系",
      login: "登录",
      logout: "退出",
    },
    ...base,
  },

  ru: {
    nav: {
      home: "Главная",
      features: "Функции",
      how: "Как это работает?",
      pricing: "Цены",
      faq: "FAQ",
      contact: "Контакты",
      login: "Войти",
      logout: "Выйти",
    },
    ...base,
  },

  ko: {
    nav: {
      home: "홈",
      features: "기능",
      how: "사용 방법",
      pricing: "가격",
      faq: "FAQ",
      contact: "문의",
      login: "로그인",
      logout: "로그아웃",
    },
    ...base,
  },

  es: {
    nav: {
      home: "Inicio",
      features: "Funciones",
      how: "¿Cómo funciona?",
      pricing: "Precios",
      faq: "FAQ",
      contact: "Contacto",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
    },
    ...base,
  },

  it: {
    nav: {
      home: "Home",
      features: "Funzionalità",
      how: "Come funziona?",
      pricing: "Prezzi",
      faq: "FAQ",
      contact: "Contatto",
      login: "Accedi",
      logout: "Esci",
    },
    ...base,
  },

  fr: {
    nav: {
      home: "Accueil",
      features: "Fonctionnalités",
      how: "Comment ça marche ?",
      pricing: "Tarifs",
      faq: "FAQ",
      contact: "Contact",
      login: "Connexion",
      logout: "Déconnexion",
    },
    ...base,
  },

  el: {
    nav: {
      home: "Αρχική",
      features: "Χαρακτηριστικά",
      how: "Πώς λειτουργεί;",
      pricing: "Τιμές",
      faq: "FAQ",
      contact: "Επικοινωνία",
      login: "Σύνδεση",
      logout: "Αποσύνδεση",
    },
    ...base,
  },

  pl: {
    nav: {
      home: "Strona główna",
      features: "Funkcje",
      how: "Jak to działa?",
      pricing: "Cennik",
      faq: "FAQ",
      contact: "Kontakt",
      login: "Zaloguj się",
      logout: "Wyloguj",
    },
    ...base,
  },

  ro: {
    nav: {
      home: "Acasă",
      features: "Funcții",
      how: "Cum funcționează?",
      pricing: "Prețuri",
      faq: "FAQ",
      contact: "Contact",
      login: "Autentificare",
      logout: "Ieșire",
    },
    ...base,
  },
};

export type TranslationLang = keyof typeof translations;