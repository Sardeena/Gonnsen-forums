/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RankTitleInfo {
  title: string;
  color: string; // Tailwind text class
  minXp: number;
  minPosts: number;
  badgeBg: string; // Tailwind bg & border class
}

export const RANK_TITLES: RankTitleInfo[] = [
  {
    title: 'Community Legend',
    color: 'text-amber-500 dark:text-amber-400 font-extrabold',
    minXp: 10000,
    minPosts: 100,
    badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 border-amber-600'
  },
  {
    title: 'Nexus Veteran',
    color: 'text-emerald-500 dark:text-emerald-400 font-bold',
    minXp: 5000,
    minPosts: 50,
    badgeBg: 'bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-emerald-500/20'
  },
  {
    title: 'Elite Resident',
    color: 'text-rose-500 dark:text-rose-400 font-bold',
    minXp: 2500,
    minPosts: 25,
    badgeBg: 'bg-rose-500/10 text-rose-650 dark:text-rose-400 border-rose-500/20'
  },
  {
    title: 'Regular Member',
    color: 'text-indigo-505 text-indigo-600 dark:text-indigo-400 font-semibold',
    minXp: 1000,
    minPosts: 10,
    badgeBg: 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border-indigo-500/20'
  },
  {
    title: 'Active Poster',
    color: 'text-sky-500 dark:text-sky-450 font-medium',
    minXp: 300,
    minPosts: 3,
    badgeBg: 'bg-sky-500/10 text-sky-655 dark:text-sky-400 border-sky-500/20'
  },
  {
    title: 'New Member',
    color: 'text-zinc-500 dark:text-zinc-400',
    minXp: 0,
    minPosts: 0,
    badgeBg: 'bg-zinc-550/10 text-zinc-600 dark:text-zinc-400 border-zinc-250 dark:border-zinc-805'
  }
];

export function calculateUserRank(xp: number, postsCount: number): RankTitleInfo {
  // Sort from highest requirements to lowest to find the best match
  const matched = RANK_TITLES.find(rank => xp >= rank.minXp && postsCount >= rank.minPosts);
  return matched || RANK_TITLES[RANK_TITLES.length - 1];
}

export function parseSimpleMarkdown(text: string): string {
  if (!text) return '';
  // Light escape of html tags first to assert styling
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text* or _text_
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  // Underline: __text__
  html = html.replace(/__(.*?)__/g, '<span class="underline">$1</span>');
  // Code snippets: `text`
  html = html.replace(/`(.*?)`/g, '<code class="bg-zinc-100 dark:bg-zinc-800 text-amber-600 dark:text-amber-400 font-mono px-1 rounded text-[10px]">$1</code>');
  // Anchors: [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-amber-400 hover:underline font-bold">$1</a>');
  
  return html;
}
