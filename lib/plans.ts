// =============================================
// BURADAN FİYAT VE LİMİTLERİ DEĞİŞTİREBİLİRSİN
// =============================================

export const PLANS = {
  free: {
    name: "Free",
    drawsPerMonth: 1,
    maxParticipants: 200,
    monthlyPrice: 0,
    yearlyPrice: 0,
    dodoMonthlyId: "",
    dodoYearlyId: "",
    features: [
      "1 ücretsiz çekiliş",
      "200 katılımcıya kadar",
      "Tweet beğeni kontrolü",
      "Retweet kontrolü",
      "Sonuç sertifikası",
    ],
    allowedRules: [
      "mustLike",
      "mustRetweet",
    ],
  },

  starter: {
    name: "Starter",
    drawsPerMonth: 50,
    maxParticipants: 5000,
    monthlyPrice: 5.99,
    yearlyPrice: 59,
    dodoMonthlyId: "pdt_0NgG5U0kp4o6A0gY11X6H",
    dodoYearlyId: "pdt_0NgG7MLWkcZetxB1Iabvg",
    features: [
      "Ayda 50 çekiliş",
      "5.000 katılımcıya kadar",
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
    maxParticipants: 20000,
    monthlyPrice: 11.99,
    yearlyPrice: 119,
    dodoMonthlyId: "pdt_0NgG7hDSAhJlPT8wqC8Be",
    dodoYearlyId: "pdt_0NgG8CoAcTJo4YvlBa3Jw",
    features: [
      "Sınırsız çekiliş",
      "20.000 katılımcıya kadar",
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
    maxParticipants: 100000,
    monthlyPrice: 29.99,
    yearlyPrice: 299,
    dodoMonthlyId: "pdt_0NgG8R5pz4qs9SgFBZN1s",
    dodoYearlyId: "pdt_0NgG8vSR1omLndnKZ7pF2",
    features: [
      "Sınırsız çekiliş",
      "100.000 katılımcıya kadar",
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
};

export type PlanKey = keyof typeof PLANS;

export function getPlan(key: string): typeof PLANS.free {
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
  return p.allowedRules.includes(ruleKey);
}