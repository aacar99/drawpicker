import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const secret = process.env.WEBHOOK_SECRET;
    const incomingSecret = req.headers.get("x-webhook-secret");

    if (!secret) {
      return NextResponse.json(
        { error: "Webhook secret missing" },
        { status: 500 }
      );
    }

    if (incomingSecret !== secret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const supabase = getSupabaseAdmin();

    const eventType = body.type || body.event_type;
    const metadata = body.data?.metadata || body.metadata || {};
    const userId = metadata.user_id;
    const plan = metadata.plan;
    const subscriptionId = body.data?.id || body.subscription_id;
    const validPlans = ["starter", "pro", "business", "free"];
    const normalizedPlan = typeof plan === "string" ? plan.toLowerCase().trim() : undefined;

    if (!userId || !normalizedPlan || !validPlans.includes(normalizedPlan)) {
      return NextResponse.json({ received: true });
    }

    // Ödeme başarılı veya abonelik aktif
    if (
      eventType === "payment.succeeded" ||
      eventType === "subscription.active" ||
      eventType === "subscription.activated" ||
      eventType === "checkout.completed"
    ) {
      const interval = metadata.interval || "monthly";
      const now = new Date();
      const periodEnd = new Date(now);
      if (interval === "yearly") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      await supabase.from("users").update({
        plan: normalizedPlan,
        subscription_id: subscriptionId,
        subscription_status: "active",
        current_period_end: periodEnd.toISOString(),
        credits: 0,
        free_used: true,
      }).eq("id", userId);
    }

    // Abonelik iptal
    if (
      eventType === "subscription.cancelled" ||
      eventType === "subscription.canceled"
    ) {
      await supabase.from("users").update({
        plan: "free",
        subscription_status: "cancelled",
      }).eq("id", userId);
    }

    // Abonelik yenilendi
    if (eventType === "subscription.renewed" || eventType === "subscription.renewed") {
      const interval = metadata.interval || "monthly";
      const now = new Date();
      const periodEnd = new Date(now);
      if (interval === "yearly") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      await supabase.from("users").update({
        subscription_status: "active",
        current_period_end: periodEnd.toISOString(),
        draws_this_month: 0,
        draws_reset_at: now.toISOString(),
      }).eq("id", userId);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("WEBHOOK ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
