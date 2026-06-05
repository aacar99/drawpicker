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
  winners: { username: string; author?: string; avatar?: string; image?: string; profilePicture?: string; }[];
  cert_code?: string;
};

type PricingInterval = "monthly" | "yearly";

const HOME_TEXT: Record<string, any> = {
  tr: {
    account: "👤 Hesabım", youtubeTitle: "YouTube Çekilişi", youtubeSub: "YouTube yorumlarından rastgele kazanan seçin.", twitterTitle: "X (Twitter) Çekilişi", twitterSub: "X gönderilerinden rastgele kazanan seçin.", commentFiltering: "Yorum filtreleme", multipleWinners: "Çoklu kazanan", backupWinners: "Yedek kazanan", certificate: "Sertifika ile kanıt", startYoutube: "YouTube Çekilişi Yap →", startTwitter: "X Çekilişi Yap →", pricingSub: "İhtiyacına göre plan seç. İstediğin zaman iptal et.", monthly: "Aylık", yearly: "Yıllık", discount: "%30 indirim", freeDesc: "Tek seferlik deneme", startFree: "Ücretsiz Başla →", buy: "Satın Al →", details: "Tüm plan detaylarını gör →", popular: "EN POPÜLER", perMonth: "ay", perYear: "yıl", save: "tasarruf", footer: "©️ 2025 DrawPicker.io — Güvenli ödeme · Dodo Payments", footerPricing: "Fiyatlar", footerAccount: "Hesabım", footerLogin: "Giriş",
    featuresTitle: "Özelliklerimiz",
    feature1Title: "⚡ Hızlı Sonuç", feature1Content: "Binlerce katılımcı saniyeler içinde taranır. Twitter/X ve YouTube yorumları otomatik toplanır. Adil rezervuar örnekleme algoritması ile kazanan belirlenir. Sonuçlar anında ekranda görünür.",
    feature2Title: "📜 Sertifikalı Çekiliş", feature2Content: "Her çekiliş için benzersiz bir sertifika kodu üretilir. Bu kod ile çekilişin adil ve şeffaf yapıldığı kanıtlanabilir. Sonuçlar kalıcı bir bağlantı ile paylaşılabilir. İzleyicileriniz sonucu doğrulayabilir.",
    feature3Title: "🔒 Güvenli ve Şeffaf", feature3Content: "Tüm çekiliş sonuçları güvenli şekilde Supabase veritabanında saklanır. Kazananlar profil fotoğrafları ile birlikte gösterilir. CSV formatında dışa aktarma imkânı sunar. Gizlilik ve güvenlik ön planda tutulur.",
    howTitle: "Nasıl Çalışır?",
    step1: "1. Linki Yapıştır", step1Desc: "Twitter/X gönderinin veya YouTube videosunun linkini giriş kutusuna yapıştır. ID de kabul edilir.",
    step2: "2. Kuralları Belirle", step2Desc: "Beğeni, retweet, yorum zorunluluğu gibi katılım şartlarını tek tıkla aktif et. Anahtar kelime ve mention filtresi de ekleyebilirsin.",
    step3: "3. Çekilişi Başlat", step3Desc: "Butona bas. Sistem otomatik olarak tüm katılımcıları toplar, filtreleri uygular ve adil seçim yapar.",
    step4: "4. Kazananı Paylaş", step4Desc: "Kazanan açıklanır ve çekilişin adil olduğunu kanıtlayan sertifika oluşturulur. Sonucu link ile paylaş.",
    contactTitle: "İletişim & Destek", contactSub: "Sorularınız, önerileriniz veya teknik destek için bize ulaşın.", contactEmail: "✉️ Bize Yazın", contactNote: "support@drawpicker.io adresimizden 24 saat içinde yanıt veriyoruz.",
    features: {
      free: ["1 ücretsiz çekiliş", "200 katılımcıya kadar", "Temel filtreler", "Sonuç sertifikası"],
      starter: ["Sınırsız çekiliş", "5.000 katılımcıya kadar", "Yedek kazanan", "CSV export", "Sonuç sertifikası"],
      pro: ["Sınırsız çekiliş", "40.000 katılımcıya kadar", "Tüm özellikler", "Öncelikli destek"],
      business: ["Sınırsız çekiliş", "300.000 katılımcıya kadar", "Tüm özellikler", "Özel destek"],
    },
  },
  en: {
    account: "👤 Account", youtubeTitle: "YouTube Giveaway", youtubeSub: "Pick a fair random winner from YouTube comments.", twitterTitle: "X (Twitter) Giveaway", twitterSub: "Pick a fair random winner from your X posts.", commentFiltering: "Comment filtering", multipleWinners: "Multiple winners", backupWinners: "Backup winners", certificate: "Proof certificate", startYoutube: "Start YouTube Giveaway →", startTwitter: "Start X Giveaway →", pricingSub: "Choose the plan that fits your needs. Cancel anytime.", monthly: "Monthly", yearly: "Yearly", discount: "30% off", freeDesc: "One-time trial", startFree: "Start Free →", buy: "Buy Now →", details: "View all plan details →", popular: "MOST POPULAR", perMonth: "month", perYear: "year", save: "saved", footer: "©️ 2025 DrawPicker.io — Secure payment · Dodo Payments", footerPricing: "Pricing", footerAccount: "Account", footerLogin: "Login",
    featuresTitle: "Our Features",
    feature1Title: "⚡ Fast Results", feature1Content: "Thousands of participants are scanned in seconds. Twitter/X and YouTube comments are collected automatically. The winner is determined by a fair reservoir sampling algorithm. Results appear instantly on screen.",
    feature2Title: "📜 Certified Giveaway", feature2Content: "A unique certificate code is generated for each giveaway. This code proves the giveaway was fair and transparent. Results can be shared with a permanent link. Your audience can verify the result.",
    feature3Title: "🔒 Secure & Transparent", feature3Content: "All giveaway results are securely stored in the database. Winners are shown with their profile photos. Export to CSV format is available. Privacy and security are top priorities.",
    howTitle: "How It Works?",
    step1: "1. Paste the Link", step1Desc: "Paste the link of your Twitter/X post or YouTube video. IDs are also accepted.",
    step2: "2. Set the Rules", step2Desc: "Enable participation requirements like likes, retweets, comments with one click. You can also add keyword and mention filters.",
    step3: "3. Start the Giveaway", step3Desc: "Press the button. The system automatically collects all participants, applies filters, and makes a fair selection.",
    step4: "4. Share the Winner", step4Desc: "The winner is announced and a certificate proving fairness is generated. Share the result with a link.",
    contactTitle: "Contact & Support", contactSub: "Contact us for questions, suggestions or technical support.", contactEmail: "✉️ Email Us", contactNote: "We respond within 24 hours at support@drawpicker.io.",
    features: {
      free: ["1 free giveaway", "Up to 200 participants", "Basic filters", "Result certificate"],
      starter: ["Unlimited giveaways", "Up to 5,000 participants", "Backup winners", "CSV export", "Result certificate"],
      pro: ["Unlimited giveaways", "Up to 40,000 participants", "All features", "Priority support"],
      business: ["Unlimited giveaways", "Up to 300,000 participants", "All features", "Dedicated support"],
    },
  },
  de: {
    account: "👤 Konto", youtubeTitle: "YouTube Gewinnspiel", youtubeSub: "Wähle einen fairen Gewinner aus YouTube-Kommentaren.", twitterTitle: "X (Twitter) Gewinnspiel", twitterSub: "Wähle einen fairen Gewinner aus deinen X-Beiträgen.", commentFiltering: "Kommentarfilter", multipleWinners: "Mehrere Gewinner", backupWinners: "Ersatzgewinner", certificate: "Nachweis-Zertifikat", startYoutube: "YouTube Gewinnspiel starten →", startTwitter: "X Gewinnspiel starten →", pricingSub: "Wähle den passenden Tarif. Jederzeit kündbar.", monthly: "Monatlich", yearly: "Jährlich", discount: "30% Rabatt", freeDesc: "Einmaliger Test", startFree: "Kostenlos starten →", buy: "Kaufen →", details: "Alle Tarifdetails →", popular: "BELIEBT", perMonth: "Monat", perYear: "Jahr", save: "gespart", footer: "©️ 2025 DrawPicker.io — Sichere Zahlung · Dodo Payments", footerPricing: "Preise", footerAccount: "Konto", footerLogin: "Anmelden",
    featuresTitle: "Unsere Funktionen",
    feature1Title: "⚡ Schnelles Ergebnis", feature1Content: "Tausende von Teilnehmern werden in Sekunden gescannt. Kommentare werden automatisch gesammelt und der Gewinner durch einen fairen Algorithmus bestimmt.",
    feature2Title: "📜 Zertifiziertes Gewinnspiel", feature2Content: "Für jedes Gewinnspiel wird ein einzigartiger Zertifikatscode generiert. Dieser beweist die Fairness. Ergebnisse können mit einem dauerhaften Link geteilt werden.",
    feature3Title: "🔒 Sicher & Transparent", feature3Content: "Alle Ergebnisse werden sicher gespeichert. Gewinner werden mit Profilfotos angezeigt. CSV-Export verfügbar. Datenschutz hat höchste Priorität.",
    howTitle: "Wie funktioniert es?",
    step1: "1. Link einfügen", step1Desc: "Füge den Link deines X-Beitrags oder YouTube-Videos ein.",
    step2: "2. Regeln festlegen", step2Desc: "Aktiviere Teilnahmebedingungen wie Likes, Retweets, Kommentare mit einem Klick.",
    step3: "3. Gewinnspiel starten", step3Desc: "Klicke auf die Schaltfläche. Das System sammelt automatisch alle Teilnehmer.",
    step4: "4. Gewinner teilen", step4Desc: "Der Gewinner wird bekannt gegeben und ein Zertifikat erstellt.",
    contactTitle: "Kontakt & Support", contactSub: "Kontaktiere uns bei Fragen oder technischen Problemen.", contactEmail: "✉️ Schreib uns", contactNote: "Wir antworten innerhalb von 24 Stunden: support@drawpicker.io",
    features: {
      free: ["1 kostenloses Gewinnspiel", "Bis zu 200 Teilnehmer", "Grundfilter", "Ergebniszertifikat"],
      starter: ["Unbegrenzte Gewinnspiele", "Bis zu 5.000 Teilnehmer", "Ersatzgewinner", "CSV Export", "Zertifikat"],
      pro: ["Unbegrenzte Gewinnspiele", "Bis zu 40.000 Teilnehmer", "Alle Funktionen", "Priorisierter Support"],
      business: ["Unbegrenzte Gewinnspiele", "Bis zu 300.000 Teilnehmer", "Alle Funktionen", "Premium-Support"],
    },
  },
  fr: {
    account: "👤 Compte", youtubeTitle: "Tirage YouTube", youtubeSub: "Choisissez un gagnant équitable parmi les commentaires YouTube.", twitterTitle: "Tirage X (Twitter)", twitterSub: "Choisissez un gagnant équitable depuis vos publications X.", commentFiltering: "Filtrage des commentaires", multipleWinners: "Plusieurs gagnants", backupWinners: "Gagnants suppléants", certificate: "Certificat de preuve", startYoutube: "Créer un tirage YouTube →", startTwitter: "Créer un tirage X →", pricingSub: "Choisissez le plan adapté. Annulez à tout moment.", monthly: "Mensuel", yearly: "Annuel", discount: "30% réduction", freeDesc: "Essai unique", startFree: "Commencer Gratuitement →", buy: "Acheter →", details: "Voir tous les plans →", popular: "LE PLUS POPULAIRE", perMonth: "mois", perYear: "an", save: "économisé", footer: "©️ 2025 DrawPicker.io — Paiement sécurisé · Dodo Payments", footerPricing: "Tarifs", footerAccount: "Compte", footerLogin: "Connexion",
    featuresTitle: "Nos Fonctionnalités",
    feature1Title: "⚡ Résultat Rapide", feature1Content: "Des milliers de participants sont analysés en quelques secondes. Les commentaires sont collectés automatiquement et le gagnant est déterminé par un algorithme équitable.",
    feature2Title: "📜 Tirage Certifié", feature2Content: "Un code de certificat unique est généré pour chaque tirage. Ce code prouve que le tirage était équitable. Les résultats peuvent être partagés avec un lien permanent.",
    feature3Title: "🔒 Sécurisé & Transparent", feature3Content: "Tous les résultats sont stockés en toute sécurité. Les gagnants sont affichés avec leurs photos de profil. Export CSV disponible.",
    howTitle: "Comment ça marche ?",
    step1: "1. Collez le lien", step1Desc: "Collez le lien de votre publication X ou de votre vidéo YouTube.",
    step2: "2. Définissez les règles", step2Desc: "Activez les conditions de participation comme les likes, retweets, commentaires en un clic.",
    step3: "3. Lancez le tirage", step3Desc: "Appuyez sur le bouton. Le système collecte automatiquement tous les participants.",
    step4: "4. Partagez le gagnant", step4Desc: "Le gagnant est annoncé et un certificat est généré.",
    contactTitle: "Contact & Support", contactSub: "Contactez-nous pour vos questions ou support technique.", contactEmail: "✉️ Écrivez-nous", contactNote: "Nous répondons sous 24h à support@drawpicker.io",
    features: {
      free: ["1 tirage gratuit", "Jusqu'à 200 participants", "Filtres de base", "Certificat de résultat"],
      starter: ["Tirages illimités", "Jusqu'à 5.000 participants", "Gagnants suppléants", "Export CSV", "Certificat"],
      pro: ["Tirages illimités", "Jusqu'à 40.000 participants", "Toutes les fonctions", "Support prioritaire"],
      business: ["Tirages illimités", "Jusqu'à 300.000 participants", "Toutes les fonctions", "Support dédié"],
    },
  },
  es: {
    account: "👤 Cuenta", youtubeTitle: "Sorteo de YouTube", youtubeSub: "Elige un ganador justo de comentarios de YouTube.", twitterTitle: "Sorteo de X (Twitter)", twitterSub: "Elige un ganador justo de tus publicaciones en X.", commentFiltering: "Filtro de comentarios", multipleWinners: "Múltiples ganadores", backupWinners: "Ganadores suplentes", certificate: "Certificado de prueba", startYoutube: "Crear sorteo YouTube →", startTwitter: "Crear sorteo X →", pricingSub: "Elige el plan que necesitas. Cancela cuando quieras.", monthly: "Mensual", yearly: "Anual", discount: "30% descuento", freeDesc: "Prueba única", startFree: "Comenzar Gratis →", buy: "Comprar →", details: "Ver todos los planes →", popular: "MÁS POPULAR", perMonth: "mes", perYear: "año", save: "ahorro", footer: "©️ 2025 DrawPicker.io — Pago seguro · Dodo Payments", footerPricing: "Precios", footerAccount: "Cuenta", footerLogin: "Iniciar sesión",
    featuresTitle: "Nuestras Funciones",
    feature1Title: "⚡ Resultado Rápido", feature1Content: "Miles de participantes se analizan en segundos. Los comentarios se recopilan automáticamente y el ganador se determina mediante un algoritmo justo.",
    feature2Title: "📜 Sorteo Certificado", feature2Content: "Se genera un código de certificado único para cada sorteo. Este código demuestra que el sorteo fue justo. Los resultados se pueden compartir con un enlace permanente.",
    feature3Title: "🔒 Seguro y Transparente", feature3Content: "Todos los resultados se almacenan de forma segura. Los ganadores se muestran con sus fotos de perfil. Exportación CSV disponible.",
    howTitle: "¿Cómo funciona?",
    step1: "1. Pega el enlace", step1Desc: "Pega el enlace de tu publicación X o video de YouTube.",
    step2: "2. Establece reglas", step2Desc: "Activa condiciones de participación como likes, retweets, comentarios con un clic.",
    step3: "3. Inicia el sorteo", step3Desc: "Presiona el botón. El sistema recopila automáticamente a todos los participantes.",
    step4: "4. Comparte el ganador", step4Desc: "Se anuncia el ganador y se genera un certificado.",
    contactTitle: "Contacto y Soporte", contactSub: "Contáctanos para preguntas o soporte técnico.", contactEmail: "✉️ Escríbenos", contactNote: "Respondemos en 24 horas en support@drawpicker.io",
    features: {
      free: ["1 sorteo gratis", "Hasta 200 participantes", "Filtros básicos", "Certificado de resultado"],
      starter: ["Sorteos ilimitados", "Hasta 5.000 participantes", "Ganadores suplentes", "Exportar CSV", "Certificado"],
      pro: ["Sorteos ilimitados", "Hasta 40.000 participantes", "Todas las funciones", "Soporte prioritario"],
      business: ["Sorteos ilimitados", "Hasta 300.000 participantes", "Todas las funciones", "Soporte dedicado"],
    },
  },
  it: {
    account: "👤 Account", youtubeTitle: "Sorteggio YouTube", youtubeSub: "Scegli un vincitore equo dai commenti YouTube.", twitterTitle: "Sorteggio X (Twitter)", twitterSub: "Scegli un vincitore equo dai tuoi post X.", commentFiltering: "Filtro commenti", multipleWinners: "Più vincitori", backupWinners: "Vincitori di riserva", certificate: "Certificato di prova", startYoutube: "Avvia sorteggio YouTube →", startTwitter: "Avvia sorteggio X →", pricingSub: "Scegli il piano adatto. Annulla quando vuoi.", monthly: "Mensile", yearly: "Annuale", discount: "30% sconto", freeDesc: "Prova unica", startFree: "Inizia Gratis →", buy: "Acquista →", details: "Tutti i piani →", popular: "PIÙ POPOLARE", perMonth: "mese", perYear: "anno", save: "risparmio", footer: "©️ 2025 DrawPicker.io — Pagamento sicuro · Dodo Payments", footerPricing: "Prezzi", footerAccount: "Account", footerLogin: "Accedi",
    featuresTitle: "Le Nostre Funzionalità",
    feature1Title: "⚡ Risultato Rapido", feature1Content: "Migliaia di partecipanti vengono analizzati in secondi. I commenti vengono raccolti automaticamente e il vincitore viene determinato da un algoritmo equo.",
    feature2Title: "📜 Sorteggio Certificato", feature2Content: "Viene generato un codice certificato unico per ogni sorteggio. Questo codice prova che il sorteggio era equo. I risultati possono essere condivisi con un link permanente.",
    feature3Title: "🔒 Sicuro e Trasparente", feature3Content: "Tutti i risultati vengono archiviati in modo sicuro. I vincitori vengono mostrati con le loro foto profilo. Esportazione CSV disponibile.",
    howTitle: "Come funziona?",
    step1: "1. Incolla il link", step1Desc: "Incolla il link del tuo post X o video YouTube.",
    step2: "2. Imposta le regole", step2Desc: "Attiva condizioni di partecipazione come like, retweet, commenti con un clic.",
    step3: "3. Avvia il sorteggio", step3Desc: "Premi il pulsante. Il sistema raccoglie automaticamente tutti i partecipanti.",
    step4: "4. Condividi il vincitore", step4Desc: "Il vincitore viene annunciato e viene generato un certificato.",
    contactTitle: "Contatto e Supporto", contactSub: "Contattaci per domande o supporto tecnico.", contactEmail: "✉️ Scrivici", contactNote: "Rispondiamo entro 24 ore a support@drawpicker.io",
    features: {
      free: ["1 sorteggio gratuito", "Fino a 200 partecipanti", "Filtri di base", "Certificato risultato"],
      starter: ["Sorteggi illimitati", "Fino a 5.000 partecipanti", "Vincitori di riserva", "Export CSV", "Certificato"],
      pro: ["Sorteggi illimitati", "Fino a 40.000 partecipanti", "Tutte le funzioni", "Supporto prioritario"],
      business: ["Sorteggi illimitati", "Fino a 300.000 partecipanti", "Tutte le funzioni", "Supporto dedicato"],
    },
  },
  ru: {
    account: "👤 Аккаунт", youtubeTitle: "Розыгрыш YouTube", youtubeSub: "Выберите справедливого победителя из комментариев YouTube.", twitterTitle: "Розыгрыш X (Twitter)", twitterSub: "Выберите справедливого победителя из ваших постов X.", commentFiltering: "Фильтрация комментариев", multipleWinners: "Несколько победителей", backupWinners: "Запасные победители", certificate: "Сертификат", startYoutube: "Начать розыгрыш YouTube →", startTwitter: "Начать розыгрыш X →", pricingSub: "Выберите подходящий план. Отмените в любое время.", monthly: "Ежемесячно", yearly: "Ежегодно", discount: "скидка 30%", freeDesc: "Однократная попытка", startFree: "Начать бесплатно →", buy: "Купить →", details: "Все планы →", popular: "ПОПУЛЯРНЫЙ", perMonth: "мес", perYear: "год", save: "экономия", footer: "©️ 2025 DrawPicker.io — Безопасная оплата · Dodo Payments", footerPricing: "Цены", footerAccount: "Аккаунт", footerLogin: "Войти",
    featuresTitle: "Наши Функции",
    feature1Title: "⚡ Быстрый результат", feature1Content: "Тысячи участников обрабатываются за секунды. Комментарии собираются автоматически и победитель выбирается честным алгоритмом.",
    feature2Title: "📜 Сертифицированный розыгрыш", feature2Content: "Для каждого розыгрыша генерируется уникальный код. Этот код доказывает честность. Результаты можно поделиться постоянной ссылкой.",
    feature3Title: "🔒 Безопасно и прозрачно", feature3Content: "Все результаты надёжно хранятся. Победители показываются с фото профиля. Экспорт в CSV доступен.",
    howTitle: "Как это работает?",
    step1: "1. Вставьте ссылку", step1Desc: "Вставьте ссылку на публикацию X или видео YouTube.",
    step2: "2. Установите правила", step2Desc: "Активируйте условия участия: лайки, ретвиты, комментарии одним нажатием.",
    step3: "3. Начните розыгрыш", step3Desc: "Нажмите кнопку. Система автоматически собирает всех участников.",
    step4: "4. Поделитесь победителем", step4Desc: "Победитель объявляется и создаётся сертификат.",
    contactTitle: "Контакты и поддержка", contactSub: "Свяжитесь с нами по вопросам или технической поддержке.", contactEmail: "✉️ Написать нам", contactNote: "Отвечаем в течение 24 часов: support@drawpicker.io",
    features: {
      free: ["1 розыгрыш бесплатно", "До 200 участников", "Базовые фильтры", "Сертификат результата"],
      starter: ["Неограниченные розыгрыши", "До 5.000 участников", "Запасные победители", "CSV экспорт", "Сертификат"],
      pro: ["Неограниченные розыгрыши", "До 40.000 участников", "Все функции", "Приоритетная поддержка"],
      business: ["Неограниченные розыгрыши", "До 300.000 участников", "Все функции", "Выделенная поддержка"],
    },
  },
  zh: {
    account: "👤 账户", youtubeTitle: "YouTube 抽奖", youtubeSub: "从 YouTube 评论中公平选出获奖者。", twitterTitle: "X (Twitter) 抽奖", twitterSub: "从您的 X 帖子中公平选出获奖者。", commentFiltering: "评论过滤", multipleWinners: "多个获奖者", backupWinners: "备用获奖者", certificate: "证明证书", startYoutube: "开始 YouTube 抽奖 →", startTwitter: "开始 X 抽奖 →", pricingSub: "选择适合您的计划。随时取消。", monthly: "每月", yearly: "每年", discount: "7折优惠", freeDesc: "一次性试用", startFree: "免费开始 →", buy: "立即购买 →", details: "查看所有计划 →", popular: "最受欢迎", perMonth: "月", perYear: "年", save: "节省", footer: "©️ 2025 DrawPicker.io — 安全支付 · Dodo Payments", footerPricing: "价格", footerAccount: "账户", footerLogin: "登录",
    featuresTitle: "我们的功能",
    feature1Title: "⚡ 快速结果", feature1Content: "数千名参与者在几秒钟内被扫描。评论自动收集，通过公平算法确定获奖者。",
    feature2Title: "📜 认证抽奖", feature2Content: "每次抽奖都会生成唯一的证书代码。此代码证明抽奖是公平透明的。结果可通过永久链接分享。",
    feature3Title: "🔒 安全透明", feature3Content: "所有结果安全存储。获奖者与个人资料照片一起显示。支持 CSV 导出。",
    howTitle: "如何使用？",
    step1: "1. 粘贴链接", step1Desc: "粘贴您的 X 帖子或 YouTube 视频的链接。",
    step2: "2. 设置规则", step2Desc: "一键激活参与条件，如点赞、转发、评论。",
    step3: "3. 开始抽奖", step3Desc: "按下按钮。系统自动收集所有参与者并公平选择。",
    step4: "4. 分享获奖者", step4Desc: "公布获奖者并生成证书。",
    contactTitle: "联系与支持", contactSub: "如有问题或技术支持，请联系我们。", contactEmail: "✉️ 发送邮件", contactNote: "我们在 24 小时内回复 support@drawpicker.io",
    features: {
      free: ["1次免费抽奖", "最多200名参与者", "基本过滤器", "结果证书"],
      starter: ["无限抽奖", "最多5,000名参与者", "备用获奖者", "CSV导出", "证书"],
      pro: ["无限抽奖", "最多40,000名参与者", "所有功能", "优先支持"],
      business: ["无限抽奖", "最多300,000名参与者", "所有功能", "专属支持"],
    },
  },
  ko: {
    account: "👤 계정", youtubeTitle: "YouTube 추첨", youtubeSub: "YouTube 댓글에서 공정한 당첨자를 선택하세요.", twitterTitle: "X (Twitter) 추첨", twitterSub: "X 게시물에서 공정한 당첨자를 선택하세요.", commentFiltering: "댓글 필터링", multipleWinners: "여러 당첨자", backupWinners: "예비 당첨자", certificate: "증명 인증서", startYoutube: "YouTube 추첨 시작 →", startTwitter: "X 추첨 시작 →", pricingSub: "필요에 맞는 플랜을 선택하세요. 언제든지 취소 가능.", monthly: "월간", yearly: "연간", discount: "30% 할인", freeDesc: "1회 체험", startFree: "무료로 시작 →", buy: "지금 구매 →", details: "모든 플랜 보기 →", popular: "가장 인기", perMonth: "월", perYear: "년", save: "절약", footer: "©️ 2025 DrawPicker.io — 안전한 결제 · Dodo Payments", footerPricing: "요금", footerAccount: "계정", footerLogin: "로그인",
    featuresTitle: "주요 기능",
    feature1Title: "⚡ 빠른 결과", feature1Content: "수천 명의 참가자가 몇 초 만에 스캔됩니다. 댓글이 자동으로 수집되고 공정한 알고리즘으로 당첨자가 결정됩니다.",
    feature2Title: "📜 인증된 추첨", feature2Content: "각 추첨에 대해 고유한 인증서 코드가 생성됩니다. 이 코드는 추첨이 공정했음을 증명합니다. 결과를 영구 링크로 공유할 수 있습니다.",
    feature3Title: "🔒 안전하고 투명한", feature3Content: "모든 결과가 안전하게 저장됩니다. 당첨자는 프로필 사진과 함께 표시됩니다. CSV 내보내기 지원.",
    howTitle: "어떻게 사용하나요?",
    step1: "1. 링크 붙여넣기", step1Desc: "X 게시물 또는 YouTube 동영상의 링크를 붙여넣으세요.",
    step2: "2. 규칙 설정", step2Desc: "좋아요, 리트윗, 댓글 등 참여 조건을 클릭 한 번으로 활성화하세요.",
    step3: "3. 추첨 시작", step3Desc: "버튼을 누르세요. 시스템이 자동으로 모든 참가자를 수집합니다.",
    step4: "4. 당첨자 공유", step4Desc: "당첨자가 발표되고 인증서가 생성됩니다.",
    contactTitle: "문의 및 지원", contactSub: "질문이나 기술 지원이 필요하시면 연락하세요.", contactEmail: "✉️ 이메일 보내기", contactNote: "support@drawpicker.io로 24시간 내에 답변드립니다.",
    features: {
      free: ["1회 무료 추첨", "최대 200명 참가자", "기본 필터", "결과 인증서"],
      starter: ["무제한 추첨", "최대 5,000명 참가자", "예비 당첨자", "CSV 내보내기", "인증서"],
      pro: ["무제한 추첨", "최대 40,000명 참가자", "모든 기능", "우선 지원"],
      business: ["무제한 추첨", "최대 300,000명 참가자", "모든 기능", "전용 지원"],
    },
  },
  pl: {
    account: "👤 Konto", youtubeTitle: "Losowanie YouTube", youtubeSub: "Wybierz uczciwy losowy wynik z komentarzy YouTube.", twitterTitle: "Losowanie X (Twitter)", twitterSub: "Wybierz uczciwy losowy wynik z postów X.", commentFiltering: "Filtrowanie komentarzy", multipleWinners: "Wielu zwycięzców", backupWinners: "Zwycięzcy rezerwowi", certificate: "Certyfikat dowodowy", startYoutube: "Rozpocznij losowanie YouTube →", startTwitter: "Rozpocznij losowanie X →", pricingSub: "Wybierz plan dopasowany do potrzeb. Anuluj kiedy chcesz.", monthly: "Miesięcznie", yearly: "Rocznie", discount: "30% zniżki", freeDesc: "Jednorazowa próba", startFree: "Zacznij za darmo →", buy: "Kup teraz →", details: "Wszystkie plany →", popular: "NAJPOPULARNIEJSZY", perMonth: "mies", perYear: "rok", save: "oszczędność", footer: "©️ 2025 DrawPicker.io — Bezpieczna płatność · Dodo Payments", footerPricing: "Cennik", footerAccount: "Konto", footerLogin: "Zaloguj się",
    featuresTitle: "Nasze Funkcje",
    feature1Title: "⚡ Szybki wynik", feature1Content: "Tysiące uczestników są skanowane w ciągu sekund. Komentarze są zbierane automatycznie i zwycięzca jest wyłaniany przez uczciwy algorytm.",
    feature2Title: "📜 Certyfikowane losowanie", feature2Content: "Dla każdego losowania generowany jest unikalny kod certyfikatu. Kod ten dowodzi uczciwości. Wyniki można udostępnić stałym linkiem.",
    feature3Title: "🔒 Bezpieczne i przejrzyste", feature3Content: "Wszystkie wyniki są bezpiecznie przechowywane. Zwycięzcy są pokazywani ze zdjęciami profilowymi. Eksport CSV dostępny.",
    howTitle: "Jak to działa?",
    step1: "1. Wklej link", step1Desc: "Wklej link do swojego posta X lub filmu YouTube.",
    step2: "2. Ustaw zasady", step2Desc: "Aktywuj warunki uczestnictwa jak polubienia, retwity, komentarze jednym kliknięciem.",
    step3: "3. Rozpocznij losowanie", step3Desc: "Naciśnij przycisk. System automatycznie zbiera wszystkich uczestników.",
    step4: "4. Udostępnij zwycięzcę", step4Desc: "Zwycięzca jest ogłaszany i generowany jest certyfikat.",
    contactTitle: "Kontakt i wsparcie", contactSub: "Skontaktuj się z nami w sprawie pytań lub wsparcia technicznego.", contactEmail: "✉️ Napisz do nas", contactNote: "Odpowiadamy w ciągu 24 godzin: support@drawpicker.io",
    features: {
      free: ["1 losowanie za darmo", "Do 200 uczestników", "Podstawowe filtry", "Certyfikat wyniku"],
      starter: ["Nieograniczone losowania", "Do 5.000 uczestników", "Zwycięzcy rezerwowi", "Eksport CSV", "Certyfikat"],
      pro: ["Nieograniczone losowania", "Do 40.000 uczestników", "Wszystkie funkcje", "Priorytetowe wsparcie"],
      business: ["Nieograniczone losowania", "Do 300.000 uczestników", "Wszystkie funkcje", "Dedykowane wsparcie"],
    },
  },
  ro: {
    account: "👤 Cont", youtubeTitle: "Extragere YouTube", youtubeSub: "Alegeți un câștigător echitabil din comentariile YouTube.", twitterTitle: "Extragere X (Twitter)", twitterSub: "Alegeți un câștigător echitabil din postările X.", commentFiltering: "Filtrare comentarii", multipleWinners: "Mai mulți câștigători", backupWinners: "Câștigători rezervă", certificate: "Certificat de dovadă", startYoutube: "Începe extragerea YouTube →", startTwitter: "Începe extragerea X →", pricingSub: "Alege planul potrivit. Anulează oricând.", monthly: "Lunar", yearly: "Anual", discount: "30% reducere", freeDesc: "Încercare unică", startFree: "Începe Gratuit →", buy: "Cumpără →", details: "Toate planurile →", popular: "CEL MAI POPULAR", perMonth: "lună", perYear: "an", save: "economisit", footer: "©️ 2025 DrawPicker.io — Plată sigură · Dodo Payments", footerPricing: "Prețuri", footerAccount: "Cont", footerLogin: "Autentificare",
    featuresTitle: "Funcțiile Noastre",
    feature1Title: "⚡ Rezultat Rapid", feature1Content: "Mii de participanți sunt scanați în câteva secunde. Comentariile sunt colectate automat și câștigătorul este determinat printr-un algoritm echitabil.",
    feature2Title: "📜 Extragere Certificată", feature2Content: "Un cod de certificat unic este generat pentru fiecare extragere. Rezultatele pot fi partajate cu un link permanent.",
    feature3Title: "🔒 Sigur și Transparent", feature3Content: "Toate rezultatele sunt stocate în siguranță. Câștigătorii sunt afișați cu fotografiile lor de profil. Export CSV disponibil.",
    howTitle: "Cum funcționează?",
    step1: "1. Lipește linkul", step1Desc: "Lipește linkul postării X sau videoclipului YouTube.",
    step2: "2. Setează regulile", step2Desc: "Activează condițiile de participare cu un clic.",
    step3: "3. Începe extragerea", step3Desc: "Apasă butonul. Sistemul colectează automat toți participanții.",
    step4: "4. Împărtășește câștigătorul", step4Desc: "Câștigătorul este anunțat și se generează un certificat.",
    contactTitle: "Contact și Suport", contactSub: "Contactați-ne pentru întrebări sau asistență tehnică.", contactEmail: "✉️ Scrie-ne", contactNote: "Răspundem în 24 de ore la support@drawpicker.io",
    features: {
      free: ["1 extragere gratuită", "Până la 200 participanți", "Filtre de bază", "Certificat rezultat"],
      starter: ["Extrageri nelimitate", "Până la 5.000 participanți", "Câștigători rezervă", "Export CSV", "Certificat"],
      pro: ["Extrageri nelimitate", "Până la 40.000 participanți", "Toate funcțiile", "Suport prioritar"],
      business: ["Extrageri nelimitate", "Până la 300.000 participanți", "Toate funcțiile", "Suport dedicat"],
    },
  },
  el: {
    account: "👤 Λογαριασμός", youtubeTitle: "Κλήρωση YouTube", youtubeSub: "Επιλέξτε έναν δίκαιο νικητή από τα σχόλια YouTube.", twitterTitle: "Κλήρωση X (Twitter)", twitterSub: "Επιλέξτε έναν δίκαιο νικητή από τις αναρτήσεις X.", commentFiltering: "Φιλτράρισμα σχολίων", multipleWinners: "Πολλοί νικητές", backupWinners: "Εφεδρικοί νικητές", certificate: "Πιστοποιητικό", startYoutube: "Έναρξη κλήρωσης YouTube →", startTwitter: "Έναρξη κλήρωσης X →", pricingSub: "Επιλέξτε το κατάλληλο πλάνο. Ακυρώστε οποτεδήποτε.", monthly: "Μηνιαίο", yearly: "Ετήσιο", discount: "30% έκπτωση", freeDesc: "Εφάπαξ δοκιμή", startFree: "Ξεκινήστε δωρεάν →", buy: "Αγοράστε →", details: "Όλα τα πλάνα →", popular: "ΠΙΟ ΔΗΜΟΦΙΛΕΣ", perMonth: "μήνα", perYear: "έτος", save: "εξοικονόμηση", footer: "©️ 2025 DrawPicker.io — Ασφαλής πληρωμή · Dodo Payments", footerPricing: "Τιμές", footerAccount: "Λογαριασμός", footerLogin: "Σύνδεση",
    featuresTitle: "Οι Λειτουργίες Μας",
    feature1Title: "⚡ Γρήγορο αποτέλεσμα", feature1Content: "Χιλιάδες συμμετέχοντες σαρώνονται σε δευτερόλεπτα. Τα σχόλια συλλέγονται αυτόματα και ο νικητής καθορίζεται με δίκαιο αλγόριθμο.",
    feature2Title: "📜 Πιστοποιημένη κλήρωση", feature2Content: "Δημιουργείται μοναδικός κωδικός πιστοποιητικού για κάθε κλήρωση. Τα αποτελέσματα μπορούν να κοινοποιηθούν με μόνιμο σύνδεσμο.",
    feature3Title: "🔒 Ασφαλές και διαφανές", feature3Content: "Όλα τα αποτελέσματα αποθηκεύονται με ασφάλεια. Οι νικητές εμφανίζονται με φωτογραφίες προφίλ. Διαθέσιμη εξαγωγή CSV.",
    howTitle: "Πώς λειτουργεί;",
    step1: "1. Επικολλήστε τον σύνδεσμο", step1Desc: "Επικολλήστε τον σύνδεσμο της ανάρτησής σας X ή βίντεο YouTube.",
    step2: "2. Ορίστε κανόνες", step2Desc: "Ενεργοποιήστε προϋποθέσεις συμμετοχής με ένα κλικ.",
    step3: "3. Ξεκινήστε την κλήρωση", step3Desc: "Πατήστε το κουμπί. Το σύστημα συλλέγει αυτόματα όλους τους συμμετέχοντες.",
    step4: "4. Κοινοποιήστε τον νικητή", step4Desc: "Ανακοινώνεται ο νικητής και δημιουργείται πιστοποιητικό.",
    contactTitle: "Επικοινωνία & Υποστήριξη", contactSub: "Επικοινωνήστε μαζί μας για ερωτήσεις ή τεχνική υποστήριξη.", contactEmail: "✉️ Γράψτε μας", contactNote: "Απαντάμε εντός 24 ωρών στο support@drawpicker.io",
    features: {
      free: ["1 δωρεάν κλήρωση", "Έως 200 συμμετέχοντες", "Βασικά φίλτρα", "Πιστοποιητικό αποτελέσματος"],
      starter: ["Απεριόριστες κληρώσεις", "Έως 5.000 συμμετέχοντες", "Εφεδρικοί νικητές", "Εξαγωγή CSV", "Πιστοποιητικό"],
      pro: ["Απεριόριστες κληρώσεις", "Έως 40.000 συμμετέχοντες", "Όλες οι λειτουργίες", "Προτεραιότητα υποστήριξης"],
      business: ["Απεριόριστες κληρώσεις", "Έως 300.000 συμμετέχοντες", "Όλες οι λειτουργίες", "Αποκλειστική υποστήριξη"],
    },
  },
};

export default function Home() {
  const [lang, setLang] = useState("tr");
  const [lastDraw, setLastDraw] = useState<LastDraw | null>(null);
  const [user, setUser] = useState<any>(null);
  const [pricingInterval, setPricingInterval] = useState<PricingInterval>("monthly");
  const [openFeature, setOpenFeature] = useState<number | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(null);

  const t = translations[lang as keyof typeof translations] || translations.tr;
  const h = HOME_TEXT[lang] || HOME_TEXT.en;

  useEffect(() => {
    const saved = localStorage.getItem("dp_lang") || localStorage.getItem("drawpicker_lang");
    if (saved) setLang(saved);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    supabase.from("draw_results").select("*").order("created_at", { ascending: false }).limit(1).single().then(({ data }) => { if (data) setLastDraw(data); });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  const lastWinner = lastDraw?.winners?.[0];

  const features = [
    { title: h.feature1Title, content: h.feature1Content },
    { title: h.feature2Title, content: h.feature2Content },
    { title: h.feature3Title, content: h.feature3Content },
  ];

  const steps = [
    { title: h.step1, desc: h.step1Desc },
    { title: h.step2, desc: h.step2Desc },
    { title: h.step3, desc: h.step3Desc },
    { title: h.step4, desc: h.step4Desc },
  ];

  return (
    <main className="min-h-screen bg-[#080812] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#0ea5e933,transparent_32%),radial-gradient(circle_at_85%_45%,#a855f733,transparent_35%),linear-gradient(180deg,#080812,#0b0b14)]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* NAVBAR */}
      <nav className="relative z-[9999] max-w-7xl mx-auto flex items-center justify-between px-5 py-5 border-b border-white/10">
        <a href="/" className="text-2xl font-black tracking-tight">🎁 Draw<span className="text-pink-400">Picker</span></a>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-300">
          <a href="/" className="text-white border-b-2 border-cyan-400 pb-2">{t.nav.home}</a>
          <a href="#features" className="hover:text-white">{t.nav.features}</a>
          <a href="#nasil" className="hover:text-white">{t.nav.how}</a>
          <a href="#pricing" className="hover:text-white text-pink-400">{t.nav.pricing}</a>
          <a href="#iletisim" className="hover:text-white">{t.nav.contact}</a>
        </div>
        <div className="relative z-[10000] flex items-center gap-3">
          <LangPicker lang={lang} setLang={setLang} accentHover="hover:border-sky-500" accentCheck="text-sky-400" />
          {user ? (
            <div className="flex items-center gap-2">
              <a href="/dashboard" className="text-sm border border-white/10 hover:border-sky-500 px-4 py-2 rounded-xl transition text-zinc-300 hover:text-white hidden sm:block">{h.account}</a>
              <button onClick={handleLogout} className="text-sm border border-white/10 hover:border-red-500 px-4 py-2 rounded-xl transition text-zinc-300 hover:text-red-400">{t.nav.logout}</button>
            </div>
          ) : (
            <a href="/auth/login" className="text-sm font-black px-5 py-2 rounded-xl border border-white/10 hover:border-cyan-400 transition">{t.nav.login}</a>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 pt-14 pb-14 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300 mb-7">{t.hero.badge}</div>
        <h1 className="text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight mb-7">
          {t.hero.title1}<br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">{t.hero.title2}</span>
        </h1>
        <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10">{t.hero.desc}</p>
      </section>

      {/* PLATFORM CARDS */}
      <section id="platforms" className="relative z-10 max-w-7xl mx-auto px-5 pb-14">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden bg-[#141421]/90 border border-red-500/30 rounded-3xl p-7 shadow-2xl">
              <div className="absolute right-8 top-16 text-[9rem] text-white/[0.04]">▶️</div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-3xl mb-5">▶️</div>
              <h2 className="text-3xl font-black mb-3">{h.youtubeTitle}</h2>
              <p className="text-zinc-400 text-sm mb-6">{h.youtubeSub}</p>
              <div className="space-y-3 text-sm text-zinc-300 mb-7">
                <div>✓ {h.commentFiltering}</div>
                <div>✓ {h.multipleWinners}</div>
                <div>✓ {h.backupWinners}</div>
                <div>✓ {h.certificate}</div>
              </div>
              <a href="/youtube" className="block w-full text-center bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 py-4 rounded-xl font-black transition">{h.startYoutube}</a>
            </div>

            <div className="relative overflow-hidden bg-[#141421]/90 border border-sky-500/30 rounded-3xl p-7 shadow-2xl">
              <div className="absolute right-8 top-10 text-[10rem] text-white/[0.04]">𝕏</div>
              <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-3xl mb-5">𝕏</div>
              <h2 className="text-3xl font-black mb-3">{h.twitterTitle}</h2>
              <p className="text-zinc-400 text-sm mb-6">{h.twitterSub}</p>
              <div className="space-y-3 text-sm text-zinc-300 mb-7">
                <div>✓ {h.commentFiltering}</div>
                <div>✓ {h.multipleWinners}</div>
                <div>✓ {h.backupWinners}</div>
                <div>✓ {h.certificate}</div>
              </div>
              <a href="/twitter" className="block w-full text-center bg-gradient-to-r from-cyan-400 to-blue-600 hover:opacity-90 py-4 rounded-xl font-black transition">{h.startTwitter}</a>
            </div>
          </div>

          <div className="bg-[#141421]/90 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="text-sm text-zinc-400 font-bold mb-4">🏆 {t.lastDraw.title}</div>
            <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5 mb-5">
              <div className="flex items-center gap-4">
                {lastWinner?.avatar || lastWinner?.image || lastWinner?.profilePicture ? (
                  <img src={lastWinner.avatar || lastWinner.image || lastWinner.profilePicture} alt="" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-sky-400 flex items-center justify-center text-3xl">🏆</div>
                )}
                <div>
                  <div className="text-zinc-400 text-sm">{t.lastDraw.winner}</div>
                  <div className="text-2xl font-black">@{lastWinner?.username || "drawpicker"}</div>
                  <div className="text-zinc-500 text-sm">{t.lastDraw.congrats}</div>
                </div>
              </div>
              <a href={lastDraw?.id ? `/result/${lastDraw.id}` : "#"} className="inline-block mt-4 text-xs font-black bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg transition">{t.lastDraw.view}</a>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">💬</div>
                <div className="font-black text-xl">{(lastDraw?.total || 0).toLocaleString()}</div>
                <div className="text-[11px] text-zinc-500">{t.lastDraw.comments}</div>
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">👥</div>
                <div className="font-black text-xl">{lastDraw?.winners?.length || 0}</div>
                <div className="text-[11px] text-zinc-500">{t.lastDraw.eligible}</div>
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-black text-xl">1</div>
                <div className="text-[11px] text-zinc-500">{t.lastDraw.winners}</div>
              </div>
            </div>
            <div className="border border-white/10 bg-white/[0.03] rounded-xl px-4 py-3 text-center text-xs font-mono text-zinc-300">
              {t.lastDraw.cert}: {lastDraw?.cert_code || "DP-XXXXXXXX"}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES ACCORDION */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-5 pb-20">
        <h2 className="text-3xl font-black text-center mb-8">
          <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">{h.featuresTitle}</span>
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden cursor-pointer" onClick={() => setOpenFeature(openFeature === i ? null : i)}>
              <div className="p-5 flex items-center justify-between">
                <div className="font-black text-lg">{f.title}</div>
                <span className="text-sky-400 text-xl">{openFeature === i ? "−" : "+"}</span>
              </div>
              {openFeature === i && (
                <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                  {f.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil" className="relative z-10 max-w-7xl mx-auto px-5 pb-20">
        <h2 className="text-3xl font-black text-center mb-8">
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{h.howTitle}</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden cursor-pointer" onClick={() => setOpenStep(openStep === i ? null : i)}>
              <div className="p-5 flex items-center justify-between gap-3">
                <div className="font-black">{s.title}</div>
                <span className="text-purple-400 text-xl flex-shrink-0">{openStep === i ? "−" : "+"}</span>
              </div>
              {openStep === i && (
                <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                  {s.desc}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-5 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{t.nav.pricing}</span>
          </h2>
          <p className="text-zinc-400 mb-8">{h.pricingSub}</p>
          <div className="inline-flex bg-[#16161f] border border-white/10 rounded-2xl p-1">
            <button onClick={() => setPricingInterval("monthly")} className={`px-6 py-2 rounded-xl text-sm font-bold transition ${pricingInterval === "monthly" ? "bg-sky-600 text-white" : "text-zinc-400 hover:text-white"}`}>{h.monthly}</button>
            <button onClick={() => setPricingInterval("yearly")} className={`px-6 py-2 rounded-xl text-sm font-bold transition ${pricingInterval === "yearly" ? "bg-sky-600 text-white" : "text-zinc-400 hover:text-white"}`}>
              {h.yearly} <span className="text-green-400 text-xs ml-1">{h.discount}</span>
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
            {h.features.free.map((f: string, i: number) => <li key={i}>✓ {f}</li>)}
          </ul>
          <a href="/auth/login" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold text-sm transition">{h.startFree}</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {(["starter", "pro", "business"] as const).map((key) => {
            const plan = PLANS[key];
            const price = pricingInterval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const isPopular = key === "pro";
            return (
              <div key={key} className={`relative bg-[#141421]/90 border rounded-3xl p-6 flex flex-col ${isPopular ? "border-purple-500 shadow-lg shadow-purple-500/20" : "border-white/10"}`}>
                {isPopular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-black px-4 py-1 rounded-full whitespace-nowrap">{h.popular}</div>}
                <div className="font-black text-2xl mb-1">{plan.name}</div>
                <div className="text-4xl font-black mb-1">${price}<span className="text-zinc-500 text-base font-normal">/{pricingInterval === "yearly" ? h.perYear : h.perMonth}</span></div>
                {pricingInterval === "yearly" && <div className="text-green-400 text-xs mb-3">${Math.round(price / 12)} / {h.perMonth} — {h.save}</div>}
                <ul className="space-y-2 mb-6 flex-1">
                  {(h.features[key] || []).map((f: string, i: number) => (
                    <li key={i} className="text-zinc-400 text-sm flex items-center gap-2"><span className="text-green-400">✓</span> {f}</li>
                  ))}
                </ul>
                <a href="/pricing" className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition ${isPopular ? "bg-purple-600 hover:bg-purple-500" : "bg-sky-600 hover:bg-sky-500"}`}>{h.buy}</a>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <a href="/pricing" className="text-zinc-400 hover:text-white text-sm underline transition">{h.details}</a>
        </div>
      </section>

      {/* İLETİŞİM */}
      <section id="iletisim" className="relative z-10 max-w-7xl mx-auto px-5 pb-16">
        <div className="bg-[#141421]/90 border border-white/10 rounded-3xl p-8 text-center max-w-2xl mx-auto">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-2xl font-black mb-2">{h.contactTitle}</h2>
          <p className="text-zinc-400 text-sm mb-6">{h.contactSub}</p>
          <a href="mailto:support@drawpicker.io" className="inline-block bg-gradient-to-r from-sky-600 to-sky-500 px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition mb-4">
            {h.contactEmail}
          </a>
          <p className="text-zinc-500 text-xs">{h.contactNote}</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 max-w-7xl mx-auto px-5 py-8 text-center text-zinc-600 text-sm">
        <p>{h.footer}</p>
        <div className="flex justify-center gap-6 mt-3">
          <a href="/pricing" className="hover:text-white transition">{h.footerPricing}</a>
          <a href="/dashboard" className="hover:text-white transition">{h.footerAccount}</a>
          <a href="/auth/login" className="hover:text-white transition">{h.footerLogin}</a>
        </div>
      </footer>
    </main>
  );
}
