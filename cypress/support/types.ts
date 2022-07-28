export interface Author {
  id: number;
  name: string;
  username: string;
  profileImageUrl: string | null;
}

export interface User {
  id: number;
  name: string;
  username: string;
  createdAt: string;
  description: string | null;
  pinnedId: number | null;
  profileImageUrl: string | null;
  profileBannerUrl: string | null;
  followerCount: number;
  followedCount: number;
  isFollowing: boolean;
}

export interface BaseScratch {
  id: number;
  authorId: number;
  parentId: number | null;
  body: string | null;
  mediaUrl: string | null;
  createdAt: string;
  author: Author;
  replyCount: number;
  rescratchCount: number;
  likeCount: number;
  isRescratched: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface DefaultScratch extends BaseScratch {
  rescratchedId: null;
  rescratchType: 'none';
}

export interface Rescratch extends BaseScratch {
  rescratchedId: number;
  rescratchType: 'direct' | 'quote';
}

export type Scratch = DefaultScratch | Rescratch;
