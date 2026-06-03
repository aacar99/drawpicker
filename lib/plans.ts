// =============================================
// BURADAN FİYAT VE LİMİTLERİ DEĞİŞTİREBİLİRSİN
// =============================================

export const PLANS = {
  free: {
    name: "Free",
    drawsPerMonth: 1,       // aylık çekiliş hakkı
    maxParticipants: 200,   // max katılımcı
    monthlyPrice: 0,
    yearlyPrice: 0,
    dodoMonthlyId: "",
    dodoYearlyId: "",
    features: [
      "1 çekiliş (tek seferlik)",
      "200 katılımcıya kadar",
      "Temel özellikler",
    ],
  },
  starter: {
    name: "Starter",
    drawsPerMonth: 15,
    maxParticipants: 2000,
    monthlyPrice: 9,
    yearlyPrice: 75,
    dodoMonthlyId: "STARTER_MONTHLY_ID", // Dodo'dan aldığın Product ID
    dodoYearlyId: "STARTER_YEARLY_ID",
    features: [
      "Ayda 15 çekiliş",
      "2.000 katılımcıya kadar",
      "Yedek kazanan seçimi",
      "CSV export",
    ],
  },
  pro: {
    name: "Pro",
    drawsPerMonth: 60,
    maxParticipants: 20000,
    monthlyPrice: 24,
    yearlyPrice: 199,
    dodoMonthlyId: "PRO_MONTHLY_ID",
    dodoYearlyId: "PRO_YEARLY_ID",
    features: [
      "Ayda 60 çekiliş",
      "20.000 katılımcıya kadar",
      "Tüm özellikler",
      "Öncelikli destek",
    ],
  },
  business: {
    name: "Business",
    drawsPerMonth: 999999,  // sınırsız için çok yüksek sayı
    maxParticipants: 999999,
    monthlyPrice: 59,
    yearlyPrice: 490,
    dodoMonthlyId: "BUSINESS_MONTHLY_ID",
    dodoYearlyId: "BUSINESS_YEARLY_ID",
    features: [
      "Sınırsız çekiliş",
      "Sınırsız katılımcı",
      "Tüm özellikler",
      "Özel destek",
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
