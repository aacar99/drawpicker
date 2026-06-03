import { sleep, getCursor } from "./utils";
import { mapUser, mapComment } from "./mappers";
import type { Rules, User } from "./types";

const BASE = "https://api.socialdata.tools";

export function getTweetId(input: string) {
  const c = input.trim();
  const m = c.match(/status\/(\d+)/);
  if (m) return m[1];
  if (/^\d+$/.test(c)) return c;
  return null;
}

function getTweetText(tweet: any) {
  return (
    tweet?.full_text ||
    tweet?.text ||
    tweet?.tweet_text ||
    tweet?.content ||
    tweet?.body ||
    tweet?.legacy?.full_text ||
    tweet?.legacy?.text ||
    tweet?.note_tweet?.text ||
    tweet?.note_tweet?.note_tweet_results?.result?.text ||
    ""
  );
}

function getAuthorName(user: any) {
  return (
    user?.name ||
    user?.display_name ||
    user?.full_name ||
    user?.legacy?.name ||
    ""
  );
}

function getAuthorUsername(user: any) {
  return String(
    user?.username ||
      user?.screen_name ||
      user?.handle ||
      user?.legacy?.screen_name ||
      ""
  ).replace("@", "");
}

function getAuthorAvatar(user: any) {
  return (
    user?.profile_image_url_https ||
    user?.profile_image_url ||
    user?.avatar ||
    user?.image ||
    user?.profilePicture ||
    user?.legacy?.profile_image_url_https ||
    user?.legacy?.profile_image_url ||
    ""
  );
}

async function fetchJson(url: string, apiKey: string, attempt = 0): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (res.status === 429 && attempt < 6) {
      const retryAfter = Number(res.headers.get("retry-after")) || 0;
      const wait =
        retryAfter > 0
          ? retryAfter * 1000
          : Math.min(1000 * 2 ** attempt, 8000);

      await sleep(wait);
      return fetchJson(url, apiKey, attempt + 1);
    }

    const text = await res.text();

    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("API bozuk cevap döndürdü.");
    }

    if (res.status === 429) {
      throw new Error("API limiti aşıldı. Biraz bekleyip tekrar deneyin.");
    }

    if (!res.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `SocialData API hatası (${res.status})`
      );
    }

    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      if (attempt < 3) {
        await sleep(1000 * (attempt + 1));
        return fetchJson(url, apiKey, attempt + 1);
      }

      throw new Error("API çok geç cevap verdi. Lütfen tekrar deneyin.");
    }

    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getTwitterTweetStats(input: string, apiKey: string) {
  const tweetId = getTweetId(input);
  if (!tweetId) throw new Error("Geçerli bir Tweet linki veya ID girin.");

  const tweetData = await fetchJson(
    `${BASE}/twitter/tweets/${tweetId}`,
    apiKey
  );

  const tweet = tweetData.tweet || tweetData.data || tweetData.result || tweetData;
  const user = tweet?.user || tweet?.author || {};

  const text = getTweetText(tweet);

  return {
    text,
    title: text,
    tweetText: text,

    authorName: getAuthorName(user),
    authorUsername: getAuthorUsername(user),
    authorAvatar: getAuthorAvatar(user),

    retweetCount:
      Number(
        tweet?.retweet_count ??
          tweet?.retweets_count ??
          tweet?.public_metrics?.retweet_count ??
          tweet?.legacy?.retweet_count ??
          0
      ) || 0,

    likeCount:
      Number(
        tweet?.favorite_count ??
          tweet?.like_count ??
          tweet?.likes_count ??
          tweet?.public_metrics?.like_count ??
          tweet?.legacy?.favorite_count ??
          0
      ) || 0,

    replyCount:
      Number(
        tweet?.reply_count ??
          tweet?.replies_count ??
          tweet?.public_metrics?.reply_count ??
          tweet?.legacy?.reply_count ??
          0
      ) || 0,

    authorFollowers:
      Number(
        user?.followers_count ??
          user?.followers ??
          user?.public_metrics?.followers_count ??
          user?.legacy?.followers_count ??
          0
      ) || 0,
  };
}

async function streamPaged(
  baseUrl: string,
  apiKey: string,
  mapper: (x: any) => User,
  onUsers: (users: User[]) => void,
  deadline: number
): Promise<boolean> {
  let cursor = "";
  let pages = 0;
  const maxPages = 500;
  let truncated = false;

  while (pages < maxPages) {
    if (Date.now() > deadline) {
      truncated = true;
      break;
    }

    const url =
      baseUrl +
      (cursor
        ? `${baseUrl.includes("?") ? "&" : "?"}cursor=${encodeURIComponent(
            cursor
          )}`
        : "");

    const data = await fetchJson(url, apiKey);

    const items =
      data.users ||
      data.data ||
      data.retweeters ||
      data.followers ||
      data.results ||
      data.replies ||
      data.tweets ||
      [];

    if (items.length) onUsers(items.map(mapper));

    const next = getCursor(data);
    if (!next || next === cursor) break;

    cursor = next;
    pages++;
    await sleep(120);
  }

  return truncated;
}

export async function collectTwitter(
  input: string,
  rules: Rules,
  apiKey: string,
  onUsers: (users: User[]) => void,
  deadline: number
): Promise<boolean> {
  const tweetId = getTweetId(input);
  if (!tweetId) throw new Error("Geçerli bir Tweet linki veya ID girin.");

  const useComments =
    rules.mustComment ||
    rules.mustMention ||
    rules.mustKeyword ||
    rules.mustMinLength ||
    rules.aiSafe ||
    rules.uniqueComments;

  if (useComments) {
    return streamPaged(
      `${BASE}/twitter/search?query=conversation_id%3A${tweetId}&type=Latest`,
      apiKey,
      mapComment,
      onUsers,
      deadline
    );
  }

  if (rules.mustRetweet) {
    return streamPaged(
      `${BASE}/twitter/tweets/${tweetId}/retweeted_by`,
      apiKey,
      mapUser,
      onUsers,
      deadline
    );
  }

  if (rules.mustFollow || rules.mustLike) {
    const tweetData = await fetchJson(
      `${BASE}/twitter/tweets/${tweetId}`,
      apiKey
    );

    const tweet = tweetData.tweet || tweetData.data || tweetData.result || tweetData;

    const authorId = String(
      tweet?.user?.id_str ||
        tweet?.user?.id ||
        tweet?.author?.id_str ||
        tweet?.author?.id ||
        ""
    );

    if (!authorId) throw new Error("Tweet sahibi bulunamadı.");

    return streamPaged(
      `${BASE}/twitter/followers/list?user_id=${authorId}`,
      apiKey,
      mapUser,
      onUsers,
      deadline
    );
  }

  throw new Error("En az bir kural seçmelisin.");
}