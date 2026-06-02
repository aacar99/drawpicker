"use client";

import GiveawayPage from "@/components/GiveawayPage";

const config = {
  platform: "twitter",
  accent: "sky",
  icon: "𝕏",

  titleKey: "tw_title",
  subKey: "tw_sub",

  inputKey: "tweetUrl",
  inputPhKey: "tweetPlaceholder",

  ruleDefs: [
    { key: "mustLike" },
    { key: "mustRetweet" },
    { key: "mustComment", default: true },
    { key: "mustFollow" },
    { key: "mustKeyword" },
    { key: "mustMention" },
    { key: "mustMinLength" },
    { key: "aiSafe" },
  ],

  showKeyword: true,
  showMinLen: true,
};

export default function TwitterPage() {
  return <GiveawayPage config={config} />;
}