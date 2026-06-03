import { normalize } from "./utils";
import type { User } from "./types";

export function mapUser(u: any): User {
  const user = u.user || u.author || u;
  const username = normalize(user.screen_name || user.username);
  const userId = String(user.id_str || user.id || "");

  return {
    id: userId || username || crypto.randomUUID(),
    userId,
    username,
    author: user.name || user.full_name || username || "Unknown",
    text: "",
    profilePicture: user.profile_image_url_https || user.profile_image_url || "",
    isPrivate: Boolean(user.protected),
    followers: Number(user.followers_count || 0),
  };
}

export function mapComment(t: any): User {
  const username = normalize(
    t.user?.screen_name ||
      t.user?.username ||
      t.author?.screen_name ||
      t.author?.username
  );
  const userId = String(
    t.user?.id_str || t.user?.id || t.author?.id_str || t.author?.id || ""
  );

  return {
    id: userId || username || crypto.randomUUID(),
    userId,
    username,
    author: t.user?.name || t.author?.name || username || "Unknown",
    text: t.text || t.full_text || t.tweet_text || t.legacy?.full_text || t.legacy?.text || t.note_tweet?.note_tweet_results?.result?.text || "yorum",
    profilePicture:
      t.user?.profile_image_url_https || t.author?.profile_image_url || "",
    isPrivate: Boolean(t.user?.protected || t.author?.protected),
    followers: Number(t.user?.followers_count || t.author?.followers_count || 0),
  };
}

export function mapYoutubeComment(item: any): User {
  const s = item?.snippet?.topLevelComment?.snippet || {};
  const author = s.authorDisplayName || "Unknown";
  const channelId = s.authorChannelId?.value || "";
  const username = normalize(author);

  return {
    id: channelId || username || crypto.randomUUID(),
    userId: channelId,
    username,
    author,
    text: s.textOriginal || s.textDisplay || "",
    profilePicture: s.authorProfileImageUrl || "",
    isPrivate: false,
    followers: 0,
  };
}
