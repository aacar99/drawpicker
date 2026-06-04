// =============================================
// BURADAN FİYAT VE LİMİTLERİ DEĞİŞTİREBİLİRSİN
// =============================================

export const PLANS = {
  free: {
    name: "Free",
    drawsPerMonth: 1,
    maxParticipants: 200, // aylık işlenen katılımcı limiti
    monthlyPrice: 0,
    yearlyPrice: 0,
    dodoMonthlyId: "",
    dodoYearlyId: "",
    features: [
      "1 ücretsiz çekiliş",
      "200 aylık katılımcı işleme limiti",
      "Tweet beğeni kontrolü",
      "Retweet kontrolü",
      "Sonuç sertifikası",
    ],
    allowedRules: ["mustLike", "mustRetweet"],
  },

  starter: {
    name: "Starter",
    drawsPerMonth: 999999,
    maxParticipants: 5000, // aylık işlenen katılımcı limiti
    monthlyPrice: 8.99,
    yearlyPrice: 89,
    dodoMonthlyId: "pdt_0NgG5U0kp4o6A0gY11X6H",
    dodoYearlyId: "pdt_0NgG7MLWkcZetxB1Iabvg",
    features: [
      "Sınırsız çekiliş",
      "5.000 aylık katılımcı işleme limiti",
      "Tweet beğeni kontrolü",
      "Retweet kontrolü",
      "Yorum kontrolü",
      "Ana hesabı takip kontrolü",
      "Etiketleme kuralı",
      "Anahtar kelime kuralı",
      "Yedek kazanan seçimi",
      "CSV export",
      "Sonuç sertifikası",
    ],
    allowedRules: [
      "mustLike",
      "mustRetweet",
      "mustComment",
      "mustFollow",
      "mustMention",
      "mustKeyword",
    ],
  },

  pro: {
    name: "Pro",
    drawsPerMonth: 999999,
    maxParticipants: 40000, // aylık işlenen katılımcı limiti
    monthlyPrice: 17.99,
    yearlyPrice: 179,
    dodoMonthlyId: "pdt_0NgG7hDSAhJlPT8wqC8Be",
    dodoYearlyId: "pdt_0NgG8CoAcTJo4YvlBa3Jw",
    features: [
      "Sınırsız çekiliş",
      "40.000 aylık katılımcı işleme limiti",
      "Starter özellikleri",
      "Ek X hesabı takip kontrolü",
      "Çoklu hesap takibi",
      "Profil fotoğrafı kontrolü",
      "Minimum takipçi kuralı",
      "Minimum yorum uzunluğu",
      "Tekrarlanan yorum = 1 hak",
      "Bot / spam filtresi",
      "Geçmiş çekilişler",
      "Öncelikli tarama",
    ],
    allowedRules: [
      "mustLike",
      "mustRetweet",
      "mustComment",
      "mustFollow",
      "mustMention",
      "mustKeyword",
      "mustExtraFollow",
      "mustProfile",
      "mustMinFollowers",
      "mustMinLength",
      "uniqueComments",
      "aiSafe",
    ],
  },

  business: {
    name: "Business",
    drawsPerMonth: 999999,
    maxParticipants: 300000, // aylık işlenen katılımcı limiti
    monthlyPrice: 27.99,
    yearlyPrice: 279,
    dodoMonthlyId: "pdt_0NgG8R5pz4qs9SgFBZN1s",
    dodoYearlyId: "pdt_0NgG8vSR1omLndnKZ7pF2",
    features: [
      "Sınırsız çekiliş",
      "300.000 aylık katılımcı işleme limiti",
      "Pro özellikleri",
      "Hesap yaşı kontrolü",
      "Gizli hesap filtreleme",
      "Gelişmiş bot analizi",
      "Çoklu kullanıcı",
      "İstatistik paneli",
      "API erişimi",
      "White Label",
      "Özel destek",
    ],
    allowedRules: [
      "mustLike",
      "mustRetweet",
      "mustComment",
      "mustFollow",
      "mustMention",
      "mustKeyword",
      "mustExtraFollow",
      "mustProfile",
      "mustMinFollowers",
      "mustMinLength",
      "uniqueComments",
      "aiSafe",
      "mustAccountAge",
      "blockHidden",
      "advancedBotFilter",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlan(key: string) {
  return PLANS[key as PlanKey] || PLANS.free;
}

export function canDraw(
  plan: string,
  drawsThisMonth: number,
  participantCount: number
): { allowed: boolean; reason?: string } {
  const p = getPlan(plan);

  if (drawsThisMonth >= p.drawsPerMonth) {
    return { allowed: false, reason: "monthly_limit" };
  }

  if (participantCount > p.maxParticipants) {
    return { allowed: false, reason: "participant_limit" };
  }

  return { allowed: true };
}

export function canUseRule(plan: string, ruleKey: string): boolean {
  const p = getPlan(plan);
  return (p.allowedRules as readonly string[]).includes(ruleKey);
}