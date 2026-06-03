"use client";

import GiveawayPage from "@/components/GiveawayPage";

const config = {
  platform: "twitter",
  accent: "sky",
  icon: "𝕏",

  titleKey: "tw_title",
  subKey: "tw_sub",

  inputKey: "tw_input",
  inputPhKey: "tw_inputPh",

  // FREE: sadece beğeni + retweet
  quickRules: [
    {
      key: "mustLike",
      icon: "❤️",
      plan: "free",
    },
    {
      key: "mustRetweet",
      icon: "🔁",
      plan: "free",
    },
    {
      key: "mustComment",
      icon: "💬",
      plan: "starter",
    },
    {
      key: "mustFollow",
      icon: "👤",
      plan: "starter",
    },
  ],

  // STARTER / PRO / BUSINESS gelişmiş kurallar
  advancedRules: [
    {
      key: "mustMention",
      icon: "🏷️",
      plan: "starter",
    },
    {
      key: "mustKeyword",
      icon: "🔑",
      plan: "starter",
    },
    {
      key: "mustExtraFollow",
      icon: "👥",
      plan: "pro",
      input: "extraFollowAccount",
    },
    {
      key: "mustProfile",
      icon: "📸",
      plan: "pro",
    },
    {
      key: "mustMinFollowers",
      icon: "👥",
      plan: "pro",
      input: "minFollowers",
    },
    {
      key: "mustMinLength",
      icon: "✍️",
      plan: "pro",
      input: "minLength",
    },
    {
      key: "uniqueComments",
      icon: "🔄",
      plan: "pro",
    },
    {
      key: "aiSafe",
      icon: "🤖",
      plan: "pro",
    },
    {
      key: "mustAccountAge",
      icon: "📅",
      plan: "business",
      input: "accountAgeDays",
    },
    {
      key: "blockHidden",
      icon: "🔓",
      plan: "business",
    },
    {
      key: "advancedBotFilter",
      icon: "🛡️",
      plan: "business",
    },
  ],

  // Eski sistemle uyum için bırakıyoruz
  ruleDefs: [
    { key: "mustLike" },
    { key: "mustRetweet" },
    { key: "mustComment" },
    { key: "mustFollow" },
    { key: "mustMention" },
    { key: "mustKeyword" },
    { key: "mustExtraFollow" },
    { key: "mustProfile" },
    { key: "mustMinFollowers" },
    { key: "mustMinLength" },
    { key: "uniqueComments" },
    { key: "aiSafe" },
    { key: "mustAccountAge" },
    { key: "blockHidden" },
    { key: "advancedBotFilter" },
  ],

  showKeyword: true,
  showMinLen: true,
};

export default function TwitterPage() {
  return <GiveawayPage config={config} />;
}