/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 
  | 'Owner' 
  | 'Administrator' 
  | 'Senior Administrator' 
  | 'Moderator' 
  | 'Trial Moderator' 
  | 'Community Manager' 
  | 'Veteran' 
  | 'Elite Member' 
  | 'Regular Member' 
  | 'New Member';

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  dateUnlocked: string;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  badgeColor: string;
  avatar: string;
  coverPhoto: string;
  title: string;
  xp: number;
  level: number;
  coins: number;
  signature: string;
  repPoints: number;
  trophyPoints: number;
  joinDate: string;
  lastActive: string;
  dailyStreak: number;
  bio: string;
  postsCount: number;
  activeTitle: string;
  socialLinks: {
    discord?: string;
    steam?: string;
    twitch?: string;
    twitter?: string;
    youtube?: string;
  };
  achievements: Achievement[];
  marketplaceRating: {
    positive: number;
    negative: number;
  };
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'announcements' | 'general' | 'guides' | 'servers' | 'offtopic';
  threadCount: number;
  postCount: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // usernames or userIds who voted
}

export interface Poll {
  question: string;
  options: PollOption[];
  isClosed: boolean;
}

export interface Thread {
  id: string;
  forumId: string;
  title: string;
  content: string;
  authorId: string;
  prefix?: string; // '[News]', '[Changelog]', '[Staff Info]', '[Guides]', '[Suggestions]', '[WTB]', '[WTS]', '[Recruiting]', '[Trade]'
  tags: string[];
  repliesCount: number;
  viewsCount: number;
  isSticky: boolean;
  isLocked: boolean;
  createdAt: string;
  reactions: { [postId: string]: { [userId: string]: string } }; // postId/threadId -> userId -> reaction_type
  poll?: Poll;
}

export interface Post {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  createdAt: string;
  reactions: { [userId: string]: string }; // userId -> reaction_type
}

export interface Bid {
  bidderId: string;
  amount: number;
  time: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: 'accounts' | 'items' | 'services' | 'development' | 'graphics' | 'other';
  type: 'sell' | 'buy' | 'trade' | 'auction';
  price: number;
  startingBid?: number;
  currentBid?: number;
  buyNowPrice?: number;
  bids?: Bid[];
  authorId: string;
  isSold: boolean;
  images: string[];
  createdAt: string;
  sellerRatingDone?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  readBy: string[];
  attachment?: {
    name: string;
    url: string;
    size: string;
  };
}

export interface PrivateMessageConversation {
  id: string;
  participantIds: string[];
  messages: Message[];
  title?: string; // For group chat
}

export interface AppQuestion {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox';
  label: string;
  options?: string[];
  required: boolean;
}

export interface AppTemplate {
  id: string;
  title: string;
  description: string;
  questions: AppQuestion[];
}

export interface AppInternalNote {
  authorId: string;
  note: string;
  createdAt: string;
}

export interface SubmittedApplication {
  id: string;
  templateId: string;
  applicantId: string;
  answers: { [questionId: string]: string };
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  internalNotes: AppInternalNote[];
  createdAt: string;
}

export interface ReportTicket {
  id: string;
  reporterId: string;
  targetType: 'post' | 'thread' | 'user' | 'listing';
  targetId: string;
  targetTitle: string; // Excerpt/Title of the reported entity
  reason: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  resolutionText?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  type: 'mention' | 'quote' | 'reaction' | 'message' | 'reply' | 'watched_thread' | 'marketplace' | 'staff_app';
  targetType: 'thread' | 'post' | 'conversation' | 'listing' | 'app';
  targetId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}
