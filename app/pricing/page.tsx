"use client";

import { useState, useEffect } from "react";
import { PLANS } from "@/lib/plans";
import { createClient } from "@/lib/supabase-client";
import LangPicker from "@/components/LangPicker";

const PT: Record<string, any> = {
  tr: {
    back: "← Ana Sayfa", title: "Fiyatlar", sub: "İhtiyacına göre plan ve ödeme şekli seç.",
    monthly: "Aylık", yearly: "Yıllık", discount: "%50'ye varan tasarruf", freeDesc: "Tek seferlik deneme",
    current: "Mevcut Plan", default: "Varsayılan", popular: "EN POPÜLER", perMonth: "ay", perYear: "yıl",
    yearlySave: "tasarruf", loading: "Yükleniyor...",
    subBtn: "Abonelik Satın Al →", subNote: "Her ay otomatik yenilenir", onceBtn: "💎 Tek Seferlik Al", onceNote: "Kripto ile ödenebilir · yenilenmez",
    secure: "Güvenli ödeme · Dodo Payments",
    features: {
      free: ["200 katılımcıya kadar", "Ayda 1 çekiliş", "Tüm kurallar ve filtreler", "Sonuç sertifikası"],
      starter: ["5.000 katılımcıya kadar", "Sınırsız çekiliş", "Tüm kurallar ve filtreler", "AI bot / spam filtresi", "Yedek kazanan & CSV export", "Doğrulanabilir sonuç sertifikası", "Marka kaldırma & API erişimi", "7/24 destek"],
      pro: ["40.000 katılımcıya kadar", "Sınırsız çekiliş", "Tüm kurallar ve filtreler", "AI bot / spam filtresi", "Yedek kazanan & CSV export", "Doğrulanabilir sonuç sertifikası", "Marka kaldırma & API erişimi", "7/24 destek"],
      business: ["300.000 katılımcıya kadar", "Sınırsız çekiliş", "Tüm kurallar ve filtreler", "AI bot / spam filtresi", "Yedek kazanan & CSV export", "Doğrulanabilir sonuç sertifikası", "Marka kaldırma & API erişimi", "7/24 destek"],
      diamond: ["1.000.000 katılımcıya kadar", "Sınırsız çekiliş", "Tüm kurallar ve filtreler", "AI bot / spam filtresi", "Yedek kazanan & CSV export", "Doğrulanabilir sonuç sertifikası", "Marka kaldırma & API erişimi", "7/24 destek"],
    },
  },
  en: {
    back: "← Home", title: "Prices", sub: "Choose the plan and payment type that fits you.",
    monthly: "Monthly", yearly: "Yearly", discount: "Save up to 50%", freeDesc: "One-time trial",
    current: "Current Plan", default: "Default", popular: "MOST POPULAR", perMonth: "month", perYear: "year",
    yearlySave: "saved", loading: "Loading...",
    subBtn: "Buy Subscription →", subNote: "Renews automatically every month", onceBtn: "💎 One-time Purchase", onceNote: "Crypto supported · no renewal",
    secure: "Secure payment · Dodo Payments",
    features: {
      free: ["Up to 200 participants", "1 giveaway / month", "All rules & filters", "Result certificate"],
      starter: ["Up to 5,000 participants", "Unlimited giveaways", "All rules & filters", "AI bot / spam filter", "Backup winners & CSV export", "Verifiable result certificate", "Branding removal & API access", "24/7 support"],
      pro: ["Up to 40,000 participants", "Unlimited giveaways", "All rules & filters", "AI bot / spam filter", "Backup winners & CSV export", "Verifiable result certificate", "Branding removal & API access", "24/7 support"],
      business: ["Up to 300,000 participants", "Unlimited giveaways", "All rules & filters", "AI bot / spam filter", "Backup winners & CSV export", "Verifiable result certificate", "Branding removal & API access", "24/7 support"],
      diamond: ["Up to 1,000,000 participants", "Unlimited giveaways", "All rules & filters", "AI bot / spam filter", "Backup winners & CSV export", "Verifiable result certificate", "Branding removal & API access", "24/7 support"],
    },
  },
  de: {
    back: "← Startseite", title: "Preise", sub: "Wähle Tarif und Zahlungsart, die zu dir passen.",
    monthly: "Monatlich", yearly: "Jährlich", discount: "Bis zu 50% sparen", freeDesc: "Einmaliger Test",
    current: "Aktueller Plan", default: "Standard", popular: "BELIEBT", perMonth: "Monat", perYear: "Jahr",
    yearlySave: "gespart", loading: "Lädt...",
    subBtn: "Abo kaufen →", subNote: "Verlängert sich monatlich automatisch", onceBtn: "💎 Einmalkauf", onceNote: "Krypto möglich · keine Verlängerung",
    secure: "Sichere Zahlung · Dodo Payments",
    features: {
      free: ["Bis zu 200 Teilnehmer", "1 Gewinnspiel / Monat", "Alle Regeln & Filter", "Ergebniszertifikat"],
      starter: ["Bis zu 5.000 Teilnehmer", "Unbegrenzte Gewinnspiele", "Alle Regeln & Filter", "KI Bot- / Spam-Filter", "Ersatzgewinner & CSV-Export", "Überprüfbares Ergebniszertifikat", "Branding-Entfernung & API-Zugang", "24/7 Support"],
      pro: ["Bis zu 40.000 Teilnehmer", "Unbegrenzte Gewinnspiele", "Alle Regeln & Filter", "KI Bot- / Spam-Filter", "Ersatzgewinner & CSV-Export", "Überprüfbares Ergebniszertifikat", "Branding-Entfernung & API-Zugang", "24/7 Support"],
      business: ["Bis zu 300.000 Teilnehmer", "Unbegrenzte Gewinnspiele", "Alle Regeln & Filter", "KI Bot- / Spam-Filter", "Ersatzgewinner & CSV-Export", "Überprüfbares Ergebniszertifikat", "Branding-Entfernung & API-Zugang", "24/7 Support"],
      diamond: ["Bis zu 1.000.000 Teilnehmer", "Unbegrenzte Gewinnspiele", "Alle Regeln & Filter", "KI Bot- / Spam-Filter", "Ersatzgewinner & CSV-Export", "Überprüfbares Ergebniszertifikat", "Branding-Entfernung & API-Zugang", "24/7 Support"],
    },
  },
  es: {
    back: "← Inicio", title: "Precios", sub: "Elige el plan y la forma de pago que necesitas.",
    monthly: "Mensual", yearly: "Anual", discount: "Ahorra hasta 50%", freeDesc: "Prueba única",
    current: "Plan actual", default: "Predeterminado", popular: "MÁS POPULAR", perMonth: "mes", perYear: "año",
    yearlySave: "ahorro", loading: "Cargando...",
    subBtn: "Comprar suscripción →", subNote: "Se renueva automáticamente cada mes", onceBtn: "💎 Compra única", onceNote: "Cripto disponible · sin renovación",
    secure: "Pago seguro · Dodo Payments",
    features: {
      free: ["Hasta 200 participantes", "1 sorteo / mes", "Todas las reglas y filtros", "Certificado de resultado"],
      starter: ["Hasta 5.000 participantes", "Sorteos ilimitados", "Todas las reglas y filtros", "Filtro de bots / spam con IA", "Ganadores de reserva y exportación CSV", "Certificado de resultado verificable", "Eliminación de marca y acceso API", "Soporte 24/7"],
      pro: ["Hasta 40.000 participantes", "Sorteos ilimitados", "Todas las reglas y filtros", "Filtro de bots / spam con IA", "Ganadores de reserva y exportación CSV", "Certificado de resultado verificable", "Eliminación de marca y acceso API", "Soporte 24/7"],
      business: ["Hasta 300.000 participantes", "Sorteos ilimitados", "Todas las reglas y filtros", "Filtro de bots / spam con IA", "Ganadores de reserva y exportación CSV", "Certificado de resultado verificable", "Eliminación de marca y acceso API", "Soporte 24/7"],
      diamond: ["Hasta 1.000.000 participantes", "Sorteos ilimitados", "Todas las reglas y filtros", "Filtro de bots / spam con IA", "Ganadores de reserva y exportación CSV", "Certificado de resultado verificable", "Eliminación de marca y acceso API", "Soporte 24/7"],
    },
  },
  fr: {
    back: "← Accueil", title: "Prix", sub: "Choisissez le forfait et le mode de paiement adaptés.",
    monthly: "Mensuel", yearly: "Annuel", discount: "Économisez jusqu’à 50%", freeDesc: "Essai unique",
    current: "Plan actuel", default: "Par défaut", popular: "LE PLUS POPULAIRE", perMonth: "mois", perYear: "an",
    yearlySave: "économisé", loading: "Chargement...",
    subBtn: "Acheter l’abonnement →", subNote: "Renouvellement automatique chaque mois", onceBtn: "💎 Achat unique", onceNote: "Crypto possible · sans renouvellement",
    secure: "Paiement sécurisé · Dodo Payments",
    features: {
      free: ["Jusqu’à 200 participants", "1 tirage / mois", "Toutes les règles et filtres", "Certificat de résultat"],
      starter: ["Jusqu’à 5 000 participants", "Tirages illimités", "Toutes les règles et filtres", "Filtre anti-bot / spam IA", "Gagnants de secours & export CSV", "Certificat de résultat vérifiable", "Suppression du branding & accès API", "Support 24/7"],
      pro: ["Jusqu’à 40 000 participants", "Tirages illimités", "Toutes les règles et filtres", "Filtre anti-bot / spam IA", "Gagnants de secours & export CSV", "Certificat de résultat vérifiable", "Suppression du branding & accès API", "Support 24/7"],
      business: ["Jusqu’à 300 000 participants", "Tirages illimités", "Toutes les règles et filtres", "Filtre anti-bot / spam IA", "Gagnants de secours & export CSV", "Certificat de résultat vérifiable", "Suppression du branding & accès API", "Support 24/7"],
      diamond: ["Jusqu’à 1 000 000 participants", "Tirages illimités", "Toutes les règles et filtres", "Filtre anti-bot / spam IA", "Gagnants de secours & export CSV", "Certificat de résultat vérifiable", "Suppression du branding & accès API", "Support 24/7"],
    },
  },
  it: {
    back: "← Home", title: "Prezzi", sub: "Scegli il piano e il metodo di pagamento adatti.",
    monthly: "Mensile", yearly: "Annuale", discount: "Risparmia fino al 50%", freeDesc: "Prova singola",
    current: "Piano attuale", default: "Predefinito", popular: "PIÙ POPOLARE", perMonth: "mese", perYear: "anno",
    yearlySave: "risparmio", loading: "Caricamento...",
    subBtn: "Acquista abbonamento →", subNote: "Si rinnova automaticamente ogni mese", onceBtn: "💎 Acquisto singolo", onceNote: "Cripto supportato · nessun rinnovo",
    secure: "Pagamento sicuro · Dodo Payments",
    features: {
      free: ["Fino a 200 partecipanti", "1 estrazione / mese", "Tutte le regole e i filtri", "Certificato dei risultati"],
      starter: ["Fino a 5.000 partecipanti", "Estrazioni illimitate", "Tutte le regole e i filtri", "Filtro bot / spam IA", "Vincitori di riserva ed esportazione CSV", "Certificato dei risultati verificabile", "Rimozione branding e accesso API", "Supporto 24/7"],
      pro: ["Fino a 40.000 partecipanti", "Estrazioni illimitate", "Tutte le regole e i filtri", "Filtro bot / spam IA", "Vincitori di riserva ed esportazione CSV", "Certificato dei risultati verificabile", "Rimozione branding e accesso API", "Supporto 24/7"],
      business: ["Fino a 300.000 partecipanti", "Estrazioni illimitate", "Tutte le regole e i filtri", "Filtro bot / spam IA", "Vincitori di riserva ed esportazione CSV", "Certificato dei risultati verificabile", "Rimozione branding e accesso API", "Supporto 24/7"],
      diamond: ["Fino a 1.000.000 partecipanti", "Estrazioni illimitate", "Tutte le regole e i filtri", "Filtro bot / spam IA", "Vincitori di riserva ed esportazione CSV", "Certificato dei risultati verificabile", "Rimozione branding e accesso API", "Supporto 24/7"],
    },
  },
  zh: {
    back: "← 首页", title: "价格", sub: "选择适合你的方案和付款方式。",
    monthly: "月付", yearly: "年付", discount: "最高节省 50%", freeDesc: "一次性试用",
    current: "当前方案", default: "默认", popular: "最受欢迎", perMonth: "月", perYear: "年",
    yearlySave: "节省", loading: "加载中...",
    subBtn: "购买订阅 →", subNote: "每月自动续订", onceBtn: "💎 一次性购买", onceNote: "支持加密货币 · 不续费",
    secure: "安全支付 · Dodo Payments",
    features: {
      free: ["最多 200 名参与者", "每月 1 次抽奖", "全部规则与筛选", "结果证书"],
      starter: ["最多 5,000 名参与者", "无限抽奖", "全部规则与筛选", "AI 机器人 / 垃圾过滤", "候补获奖者与 CSV 导出", "可验证结果证书", "去除品牌与 API 访问", "7×24 支持"],
      pro: ["最多 40,000 名参与者", "无限抽奖", "全部规则与筛选", "AI 机器人 / 垃圾过滤", "候补获奖者与 CSV 导出", "可验证结果证书", "去除品牌与 API 访问", "7×24 支持"],
      business: ["最多 300,000 名参与者", "无限抽奖", "全部规则与筛选", "AI 机器人 / 垃圾过滤", "候补获奖者与 CSV 导出", "可验证结果证书", "去除品牌与 API 访问", "7×24 支持"],
      diamond: ["最多 1,000,000 名参与者", "无限抽奖", "全部规则与筛选", "AI 机器人 / 垃圾过滤", "候补获奖者与 CSV 导出", "可验证结果证书", "去除品牌与 API 访问", "7×24 支持"],
    },
  },
  ru: {
    back: "← Главная", title: "Цены", sub: "Выберите план и способ оплаты.",
    monthly: "Месяц", yearly: "Год", discount: "Экономия до 50%", freeDesc: "Разовая проба",
    current: "Текущий план", default: "По умолчанию", popular: "ПОПУЛЯРНЫЙ", perMonth: "мес", perYear: "год",
    yearlySave: "экономия", loading: "Загрузка...",
    subBtn: "Купить подписку →", subNote: "Автоматически продлевается каждый месяц", onceBtn: "💎 Разовая покупка", onceNote: "Крипто · без продления",
    secure: "Безопасная оплата · Dodo Payments",
    features: {
      free: ["До 200 участников", "1 розыгрыш в месяц", "Все правила и фильтры", "Сертификат результата"],
      starter: ["До 5 000 участников", "Безлимитные розыгрыши", "Все правила и фильтры", "ИИ фильтр ботов / спама", "Запасные победители и экспорт CSV", "Проверяемый сертификат результата", "Удаление брендинга и доступ к API", "Поддержка 24/7"],
      pro: ["До 40 000 участников", "Безлимитные розыгрыши", "Все правила и фильтры", "ИИ фильтр ботов / спама", "Запасные победители и экспорт CSV", "Проверяемый сертификат результата", "Удаление брендинга и доступ к API", "Поддержка 24/7"],
      business: ["До 300 000 участников", "Безлимитные розыгрыши", "Все правила и фильтры", "ИИ фильтр ботов / спама", "Запасные победители и экспорт CSV", "Проверяемый сертификат результата", "Удаление брендинга и доступ к API", "Поддержка 24/7"],
      diamond: ["До 1 000 000 участников", "Безлимитные розыгрыши", "Все правила и фильтры", "ИИ фильтр ботов / спама", "Запасные победители и экспорт CSV", "Проверяемый сертификат результата", "Удаление брендинга и доступ к API", "Поддержка 24/7"],
    },
  },
  ko: {
    back: "← 홈", title: "가격", sub: "필요에 맞는 플랜과 결제 방식을 선택하세요.",
    monthly: "월간", yearly: "연간", discount: "최대 50% 절약", freeDesc: "1회 체험",
    current: "현재 플랜", default: "기본", popular: "가장 인기", perMonth: "월", perYear: "년",
    yearlySave: "절약", loading: "로딩 중...",
    subBtn: "구독 구매 →", subNote: "매월 자동 갱신됩니다", onceBtn: "💎 일회성 구매", onceNote: "암호화폐 가능 · 갱신 없음",
    secure: "안전 결제 · Dodo Payments",
    features: {
      free: ["최대 200명 참가", "월 1회 추첨", "모든 규칙 및 필터", "결과 인증서"],
      starter: ["최대 5,000명 참가", "무제한 추첨", "모든 규칙 및 필터", "AI 봇 / 스팸 필터", "예비 당첨자 & CSV 내보내기", "검증 가능한 결과 인증서", "브랜딩 제거 & API 액세스", "24/7 지원"],
      pro: ["최대 40,000명 참가", "무제한 추첨", "모든 규칙 및 필터", "AI 봇 / 스팸 필터", "예비 당첨자 & CSV 내보내기", "검증 가능한 결과 인증서", "브랜딩 제거 & API 액세스", "24/7 지원"],
      business: ["최대 300,000명 참가", "무제한 추첨", "모든 규칙 및 필터", "AI 봇 / 스팸 필터", "예비 당첨자 & CSV 내보내기", "검증 가능한 결과 인증서", "브랜딩 제거 & API 액세스", "24/7 지원"],
      diamond: ["최대 1,000,000명 참가", "무제한 추첨", "모든 규칙 및 필터", "AI 봇 / 스팸 필터", "예비 당첨자 & CSV 내보내기", "검증 가능한 결과 인증서", "브랜딩 제거 & API 액세스", "24/7 지원"],
    },
  },
  el: {
    back: "← Αρχική", title: "Τιμές", sub: "Επιλέξτε πλάνο και τρόπο πληρωμής.",
    monthly: "Μηνιαίο", yearly: "Ετήσιο", discount: "Εξοικονομήστε έως 50%", freeDesc: "Μία δοκιμή",
    current: "Τρέχον πλάνο", default: "Προεπιλογή", popular: "ΔΗΜΟΦΙΛΕΣ", perMonth: "μήνα", perYear: "έτος",
    yearlySave: "εξοικονόμηση", loading: "Φόρτωση...",
    subBtn: "Αγορά συνδρομής →", subNote: "Ανανεώνεται αυτόματα κάθε μήνα", onceBtn: "💎 Εφάπαξ αγορά", onceNote: "Κρύπτο · χωρίς ανανέωση",
    secure: "Ασφαλής πληρωμή · Dodo Payments",
    features: {
      free: ["Έως 200 συμμετέχοντες", "1 κλήρωση / μήνα", "Όλοι οι κανόνες & φίλτρα", "Πιστοποιητικό αποτελέσματος"],
      starter: ["Έως 5.000 συμμετέχοντες", "Απεριόριστες κληρώσεις", "Όλοι οι κανόνες & φίλτρα", "Φίλτρο bot / spam με AI", "Εφεδρικοί νικητές & εξαγωγή CSV", "Επαληθεύσιμο πιστοποιητικό αποτελέσματος", "Αφαίρεση branding & πρόσβαση API", "Υποστήριξη 24/7"],
      pro: ["Έως 40.000 συμμετέχοντες", "Απεριόριστες κληρώσεις", "Όλοι οι κανόνες & φίλτρα", "Φίλτρο bot / spam με AI", "Εφεδρικοί νικητές & εξαγωγή CSV", "Επαληθεύσιμο πιστοποιητικό αποτελέσματος", "Αφαίρεση branding & πρόσβαση API", "Υποστήριξη 24/7"],
      business: ["Έως 300.000 συμμετέχοντες", "Απεριόριστες κληρώσεις", "Όλοι οι κανόνες & φίλτρα", "Φίλτρο bot / spam με AI", "Εφεδρικοί νικητές & εξαγωγή CSV", "Επαληθεύσιμο πιστοποιητικό αποτελέσματος", "Αφαίρεση branding & πρόσβαση API", "Υποστήριξη 24/7"],
      diamond: ["Έως 1.000.000 συμμετέχοντες", "Απεριόριστες κληρώσεις", "Όλοι οι κανόνες & φίλτρα", "Φίλτρο bot / spam με AI", "Εφεδρικοί νικητές & εξαγωγή CSV", "Επαληθεύσιμο πιστοποιητικό αποτελέσματος", "Αφαίρεση branding & πρόσβαση API", "Υποστήριξη 24/7"],
    },
  },
  pl: {
    back: "← Strona główna", title: "Ceny", sub: "Wybierz plan i sposób płatności.",
    monthly: "Miesięcznie", yearly: "Rocznie", discount: "Oszczędź do 50%", freeDesc: "Jednorazowy test",
    current: "Aktualny plan", default: "Domyślny", popular: "NAJPOPULARNIEJSZY", perMonth: "mies.", perYear: "rok",
    yearlySave: "oszczędzasz", loading: "Ładowanie...",
    subBtn: "Kup subskrypcję →", subNote: "Odnawia się automatycznie co miesiąc", onceBtn: "💎 Zakup jednorazowy", onceNote: "Krypto · bez odnawiania",
    secure: "Bezpieczna płatność · Dodo Payments",
    features: {
      free: ["Do 200 uczestników", "1 losowanie / miesiąc", "Wszystkie reguły i filtry", "Certyfikat wyniku"],
      starter: ["Do 5 000 uczestników", "Nielimitowane losowania", "Wszystkie reguły i filtry", "Filtr botów / spamu AI", "Zapasowi zwycięzcy i eksport CSV", "Weryfikowalny certyfikat wyniku", "Usunięcie brandingu i dostęp API", "Wsparcie 24/7"],
      pro: ["Do 40 000 uczestników", "Nielimitowane losowania", "Wszystkie reguły i filtry", "Filtr botów / spamu AI", "Zapasowi zwycięzcy i eksport CSV", "Weryfikowalny certyfikat wyniku", "Usunięcie brandingu i dostęp API", "Wsparcie 24/7"],
      business: ["Do 300 000 uczestników", "Nielimitowane losowania", "Wszystkie reguły i filtry", "Filtr botów / spamu AI", "Zapasowi zwycięzcy i eksport CSV", "Weryfikowalny certyfikat wyniku", "Usunięcie brandingu i dostęp API", "Wsparcie 24/7"],
      diamond: ["Do 1 000 000 uczestników", "Nielimitowane losowania", "Wszystkie reguły i filtry", "Filtr botów / spamu AI", "Zapasowi zwycięzcy i eksport CSV", "Weryfikowalny certyfikat wyniku", "Usunięcie brandingu i dostęp API", "Wsparcie 24/7"],
    },
  },
  ro: {
    back: "← Acasă", title: "Prețuri", sub: "Alege planul și metoda de plată.",
    monthly: "Lunar", yearly: "Anual", discount: "Economisești până la 50%", freeDesc: "Test unic",
    current: "Plan curent", default: "Implicit", popular: "CEL MAI POPULAR", perMonth: "lună", perYear: "an",
    yearlySave: "economisești", loading: "Se încarcă...",
    subBtn: "Cumpără abonament →", subNote: "Se reînnoiește automat lunar", onceBtn: "💎 Achiziție unică", onceNote: "Cripto · fără reînnoire",
    secure: "Plată securizată · Dodo Payments",
    features: {
      free: ["Până la 200 participanți", "1 extragere / lună", "Toate regulile și filtrele", "Certificat de rezultat"],
      starter: ["Până la 5.000 participanți", "Extrageri nelimitate", "Toate regulile și filtrele", "Filtru bot / spam AI", "Câștigători de rezervă și export CSV", "Certificat de rezultat verificabil", "Eliminare branding și acces API", "Suport 24/7"],
      pro: ["Până la 40.000 participanți", "Extrageri nelimitate", "Toate regulile și filtrele", "Filtru bot / spam AI", "Câștigători de rezervă și export CSV", "Certificat de rezultat verificabil", "Eliminare branding și acces API", "Suport 24/7"],
      business: ["Până la 300.000 participanți", "Extrageri nelimitate", "Toate regulile și filtrele", "Filtru bot / spam AI", "Câștigători de rezervă și export CSV", "Certificat de rezultat verificabil", "Eliminare branding și acces API", "Suport 24/7"],
      diamond: ["Până la 1.000.000 participanți", "Extrageri nelimitate", "Toate regulile și filtrele", "Filtru bot / spam AI", "Câștigători de rezervă și export CSV", "Certificat de rezultat verificabil", "Eliminare branding și acces API", "Suport 24/7"],
    },
  },
};

export default function PricingPage() {
  const [interval, setIntervalState] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [lang, setLang] = useState("tr");

  const txt = PT[lang] || PT.en;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dp_lang") || localStorage.getItem("drawpicker_lang");
      if (saved && PT[saved]) setLang(saved);
    } catch {}

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user);
        const { data: dbUser } = await supabase.from("users").select("plan").eq("id", data.user.id).single();
        if (dbUser) setUserPlan(dbUser.plan);
      }
    });
  }, []);

  async function handleCheckout(plan: string, mode: "subscription" | "one_time") {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    setLoading(`${plan}-${mode}`);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval, mode }),
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
    { key: "diamond", ...PLANS.diamond, popular: false },
  ];

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_40%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_40%)]" />

      <div className="relative max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="text-zinc-500 text-sm hover:text-white transition">{txt.back}</a>
          <LangPicker lang={lang} setLang={setLang} accentHover="hover:border-sky-500" accentCheck="text-sky-400" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">{txt.title}</span>
          </h1>
          <p className="text-zinc-400 mb-8">{txt.sub}</p>

          <div className="inline-flex bg-[#16161f] border border-white/10 rounded-2xl p-1 mb-2">
            <button onClick={() => setIntervalState("monthly")} className={`px-6 py-2 rounded-xl text-sm font-bold transition ${interval === "monthly" ? "bg-sky-600 text-white" : "text-zinc-400 hover:text-white"}`}>
              {txt.monthly}
            </button>
            <button onClick={() => setIntervalState("yearly")} className={`px-6 py-2 rounded-xl text-sm font-bold transition ${interval === "yearly" ? "bg-sky-600 text-white" : "text-zinc-400 hover:text-white"}`}>
              {txt.yearly}<span className="text-green-400 text-xs ml-1">{txt.discount}</span>
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
            {txt.features.free.map((f: string, i: number) => <li key={i}>✓ {f}</li>)}
          </ul>
          <div className="bg-zinc-700 text-zinc-400 px-4 py-2 rounded-xl text-sm font-bold">
            {userPlan === "free" ? txt.current : txt.default}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const price = interval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const isCurrentPlan = userPlan === plan.key;
            const featureList = txt.features[plan.key] || plan.features;
            const subLoading = loading === `${plan.key}-subscription`;
            const onceLoading = loading === `${plan.key}-one_time`;

            return (
              <div key={plan.key} className={`bg-[#16161f] border rounded-3xl p-6 flex flex-col relative ${plan.popular ? "border-purple-500 shadow-lg shadow-purple-500/20" : "border-white/10"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-black px-4 py-1 rounded-full">{txt.popular}</div>
                )}

                <div className="font-black text-2xl mb-1">{plan.name}</div>
                <div className="text-4xl font-black mb-1">
                  ${price}<span className="text-zinc-500 text-base font-normal">/{interval === "yearly" ? txt.perYear : txt.perMonth}</span>
                </div>
                {interval === "yearly" && (
                  <div className="text-green-400 text-xs mb-4">${(price / 12).toFixed(0)} / {txt.perMonth} — {txt.yearlySave}</div>
                )}

                <ul className="space-y-2 mb-6 flex-1 mt-3">
                  {featureList.map((f: string, i: number) => (
                    <li key={i} className="text-zinc-400 text-sm flex items-center gap-2"><span className="text-green-400">✓</span> {f}</li>
                  ))}
                </ul>

                {/* Abonelik */}
                <button
                  onClick={() => handleCheckout(plan.key, "subscription")}
                  disabled={subLoading || isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition mb-2 ${isCurrentPlan ? "bg-zinc-700 text-zinc-400 cursor-default" : plan.popular ? "bg-purple-600 hover:bg-purple-500 text-white" : "bg-sky-600 hover:bg-sky-500 text-white"}`}
                >
                  {subLoading ? `⏳ ${txt.loading}` : isCurrentPlan ? `✓ ${txt.current}` : txt.subBtn}
                </button>

                <p className="text-center text-zinc-400 text-xs mt-1">{txt.subNote}</p>

                {/* Tek seferlik (kripto) */}
                <button
                  onClick={() => handleCheckout(plan.key, "one_time")}
                  disabled={onceLoading}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/15 hover:border-sky-500 text-white transition"
                >
                  {onceLoading ? `⏳ ${txt.loading}` : txt.onceBtn}
                </button>
                <p className="text-center text-zinc-500 text-[11px] mt-2">{txt.onceNote}</p>
              </div>
            );
          })}
        </div>

        <p className="text-center text-zinc-600 text-sm mt-8">{txt.secure}</p>
      </div>
    </main>
  );
}
