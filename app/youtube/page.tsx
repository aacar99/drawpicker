"use client";

import GiveawayPage from "@/components/GiveawayPage";

const config = {
  platform: "youtube",
  accent: "purple",
  icon: "▶️",

  titleKey: "yt_title",
  subKey: "yt_sub",

  inputKey: "videoUrl",
  inputPhKey: "videoPlaceholder",

  ruleDefs: [
    { key: "mustComment", default: true },
    { key: "mustKeyword" },
    { key: "mustMinLength" },
  ],

  showKeyword: true,
  showMinLen: true,
};

export default function YoutubePage() {
  return <GiveawayPage config={config} />;
}