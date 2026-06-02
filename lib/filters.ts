import type { Rules, User } from "./types";

export function applyLocalFilters(
  user: User,
  rules: Rules = {},
  excluded: string[] = []
) {
  const { minFollowers, blockHidden, blockPrevious, aiSafe } = rules;

  if (minFollowers && (user.followers || 0) < minFollowers) {
    return false;
  }

  if (blockHidden && user.isPrivate) {
    return false;
  }

  if (blockPrevious) {
    const key = user.userId || user.id || user.username || "";
    if (key && excluded.includes(key)) return false;
  }

  if (aiSafe) {
    const bad = ["spam", "fake", "bot", "scam"];
    const text = (user.name || user.author || user.username || "").toLowerCase();

    if (bad.some((w) => text.includes(w))) {
      return false;
    }
  }

  return true;
}