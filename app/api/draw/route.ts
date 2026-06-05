import { NextResponse } from "next/server";
import { collectTwitter, getTwitterTweetStats } from "@/lib/socialdata";
import { collectYoutube } from "@/lib/youtube";
import { Reservoir } from "@/lib/reservoir";
import { applyLocalFilters } from "@/lib/filters";
import { userKey } from "@/lib/utils";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPlan, canUseRule } from "@/lib/plans";
import type { DrawRequest, User } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function makeCertCode() {
  return "DP-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function normalizePlan(plan: string) {
  return String(plan || "free").toLowerCase().trim();
}

function isRuleKey(key: string) {
  return (
    key.startsWith("must") ||
    key.startsWith("block") ||
    key === "aiSafe" ||
    key === "uniqueComments" ||
    key === "advancedBotFilter"
  );
}

function makeDrawTitle(platform: string, input: string, twitterStats: any) {
  if (platform === "twitter") {
    return (
      twitterStats?.text ||
      twitterStats?.fullText ||
      twitterStats?.tweetText ||
      twitterStats?.title ||
      input
    );
  }

  return input;
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();

    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(c) {
            c.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "login_required" },
        { status: 401 }
      );
    }

    const admin = getSupabaseAdmin();

    let { data: dbUser } = await admin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!dbUser) {
      const { data: newUser } = await admin
        .from("users")
        .insert({
          id: user.id,
          email: user.email,
          plan: "free",
          credits: 0,
          free_used: false,
          draws_this_month: 0,
          draws_reset_at: new Date().toISOString(),
          participants_used_this_month: 0,
          participants_reset_at: new Date().toISOString(),
        })
        .select()
        .single();

      dbUser = newUser;
    }

    const resetAt = new Date(dbUser.draws_reset_at || 0);
    const now = new Date();

    if (
      resetAt.getMonth() !== now.getMonth() ||
      resetAt.getFullYear() !== now.getFullYear()
    ) {
      await admin
        .from("users")
        .update({
          draws_this_month: 0,
          draws_reset_at: now.toISOString(),
          participants_used_this_month: 0,
          participants_reset_at: now.toISOString(),
        })
        .eq("id", user.id);

      dbUser.draws_this_month = 0;
      dbUser.participants_used_this_month = 0;
    }

    const userPlanKey = normalizePlan(dbUser.plan);
    const plan = getPlan(userPlanKey);

    if (dbUser.draws_this_month >= plan.drawsPerMonth) {
      return NextResponse.json(
        { success: false, error: "upgrade_required", reason: "monthly_limit" },
        { status: 403 }
      );
    }

    const usedParticipants = Number(dbUser.participants_used_this_month || 0);
    let remainingParticipants = Number(plan.maxParticipants || 0) - usedParticipants;

    if (remainingParticipants <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "upgrade_required",
          reason: "participant_limit",
          message:
            "Aylık katılımcı işleme limitiniz doldu. Paketinizi yükseltin veya limit yenilenmesini bekleyin.",
        },
        { status: 403 }
      );
    }

    const body = (await req.json()) as DrawRequest;
    const {
      platform,
      input,
      winnerCount = 1,
      backupCount = 0,
      rules = {},
      excluded = [],
    } = body;

    if (!input) {
      return NextResponse.json(
        { success: false, error: "input gerekli" },
        { status: 400 }
      );
    }

    if (!platform || !["twitter", "youtube"].includes(platform)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz platform" },
        { status: 400 }
      );
    }

    const selectedRules = Object.entries(rules)
      .filter(([key, value]) => isRuleKey(key) && Boolean(value))
      .map(([key]) => key);

    const lockedRule = selectedRules.find(
      (ruleKey) => !canUseRule(userPlanKey, ruleKey)
    );

    if (lockedRule) {
      return NextResponse.json(
        {
          success: false,
          error: "upgrade_required",
          reason: "locked_rule",
          lockedRule,
        },
        { status: 403 }
      );
    }

    const winnerNum = Math.max(Number(winnerCount) || 1, 1);
    const backupNum =
      userPlanKey === "free" ? 0 : Math.max(Number(backupCount) || 0, 0);

    const need = Math.max(winnerNum + backupNum, 1);
    const reservoir = new Reservoir(need);
    const deadline = Date.now() + 30000;

    let total = 0;
    let eligible = 0;
    let truncated = false;
    let twitterStats: any = null;
    let participantLimitReached = false;

    const seen = new Set<string>();
    const dedupe = platform === "twitter" ? true : rules.uniqueComments !== false;

    const onUsers = (users: User[]) => {
      if (!Array.isArray(users)) return;

      for (const raw of users) {
        if (participantLimitReached) return;

        if (remainingParticipants <= 0) {
          participantLimitReached = true;
          truncated = true;
          return;
        }

        total++;
        remainingParticipants--;

        const u = {
          ...raw,
          id: raw.id ? String(raw.id) : undefined,
          username: raw.username
            ? String(raw.username).replace("@", "")
            : undefined,
          name: raw.name ?? raw.author ?? raw.username ?? "Bilinmeyen",
        } as User;

        if (!applyLocalFilters(u, rules, excluded)) continue;

        if (dedupe) {
          const key = userKey(u) || u.id || u.username || JSON.stringify(u);
          if (!key || seen.has(key)) continue;
          seen.add(key);
        }

        eligible++;
        reservoir.add(u);
      }
    };

    function displayTotal() {
      if (participantLimitReached) {
        return Number(plan.maxParticipants || 0);
      }

      if (platform !== "twitter" || !twitterStats) return total;

      if (
        rules.mustComment ||
        rules.mustMention ||
        rules.mustKeyword ||
        rules.mustMinLength ||
        rules.aiSafe ||
        rules.uniqueComments
      ) {
        return twitterStats.replyCount || total;
      }

      if (rules.mustLike) return twitterStats.likeCount || total;
      if (rules.mustFollow) return twitterStats.authorFollowers || total;
      if (rules.mustRetweet) return twitterStats.retweetCount || total;

      return total;
    }

    if (platform === "youtube") {
      const apiKey = process.env.YOUTUBE_API_KEY;

      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: "YOUTUBE_API_KEY eksik" },
          { status: 500 }
        );
      }

      truncated = await collectYoutube(input, apiKey, onUsers, deadline);
    }

    if (platform === "twitter") {
      const apiKey = process.env.SOCIALDATA_API_KEY;

      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: "SOCIALDATA_API_KEY eksik" },
          { status: 500 }
        );
      }

      twitterStats = await getTwitterTweetStats(input, apiKey);
      truncated = await collectTwitter(input, rules, apiKey, onUsers, deadline);
    }

    const picked = reservoir.shuffled();

    if (picked.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Uygun katılımcı bulunamadı.",
          truncated,
          totalParticipants: displayTotal(),
          eligibleCount: eligible,
        },
        { status: 200 }
      );
    }

    const drawId = crypto.randomUUID();
    const mainWinners = picked.slice(0, winnerNum);
    const backupWinners = picked.slice(winnerNum, winnerNum + backupNum);
    const certCode = makeCertCode();
    const resultUrl = `https://drawpicker.io/result/${drawId}`;
    const drawTitle = makeDrawTitle(platform, input, twitterStats);

    try {
      await admin.from("draw_results").insert({
        id: drawId,
        platform,
        input_url: input,
        title: drawTitle,

        author_name: twitterStats?.authorName || null,
        author_username: twitterStats?.authorUsername || null,
        author_avatar: twitterStats?.authorAvatar || null,

        total: displayTotal(),
        winners: mainWinners,
        backups: backupWinners,
        cert_code: certCode,
        rules: rules,
      });
    } catch (e) {
      console.error("SUPABASE SAVE ERROR:", e);
    }

    await admin
      .from("users")
      .update({
        draws_this_month: Number(dbUser.draws_this_month || 0) + 1,
        participants_used_this_month:
          Number(dbUser.participants_used_this_month || 0) + total,
        free_used: true,
      })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      drawId,
      resultUrl,
      shareUrl: resultUrl,
      certCode,
      truncated,
      totalParticipants: displayTotal(),
      eligibleCount: eligible,
      usedParticipantsThisDraw: total,
      remainingParticipants,
      monthlyParticipantLimit: plan.maxParticipants,
      mainWinners,
      backupWinners,
      title: drawTitle,
      authorName: twitterStats?.authorName || null,
      authorUsername: twitterStats?.authorUsername || null,
      authorAvatar: twitterStats?.authorAvatar || null,
    });
  } catch (err: any) {
    console.error("DRAW API ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
