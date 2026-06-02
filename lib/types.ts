export type Platform = "twitter" | "youtube";

export type User = {
  id?: string;
  userId?: string;
  username?: string;
  author?: string;
  name?: string;
  text?: string;
  profilePicture?: string;
  avatar?: string;
  profileImage?: string;
  profile_image_url?: string;
  image?: string;
  isPrivate?: boolean;
  followers?: number;
};

export type Rules = {
  mustRetweet?: boolean;
  mustFollow?: boolean;
  mustLike?: boolean;
  mustComment?: boolean;
  mustMention?: boolean;
  mustKeyword?: boolean;
  mustMinLength?: boolean;
  mustProfile?: boolean;
  mustMinFollowers?: boolean;
  blockHidden?: boolean;
  aiSafe?: boolean;
  uniqueComments?: boolean;
  keyword?: string;
  minLen?: number;
  minFollowers?: number;
};

export type DrawRequest = {
  platform: Platform;
  input: string;
  winnerCount?: number;
  backupCount?: number;
  rules?: Rules;
  excluded?: string[];
};