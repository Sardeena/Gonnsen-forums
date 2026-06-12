/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MessageCircle, 
  Eye, 
  CornerDownRight, 
  Send, 
  ShieldAlert, 
  Pin, 
  Lock, 
  Unlock, 
  Trash2, 
  Award, 
  Smile, 
  Star, 
  Bell, 
  Bookmark, 
  BarChart2, 
  CheckCircle,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { Thread, Post, User, UserRole } from '../types';
import { calculateUserRank, parseSimpleMarkdown } from '../utils';

interface ThreadViewProps {
  thread: Thread;
  allPosts: Post[];
  allUsers: User[];
  currentUser: User;
  onBack: () => void;
  onAddReply: (threadId: string, text: string) => void;
  onVotePoll: (threadId: string, optionId: string) => void;
  onToggleSticky: (threadId: string) => void;
  onToggleLock: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
  onDeletePost: (postId: string) => void;
  onReactThread: (threadId: string, reaction: string) => void;
}

export default function ThreadView({
  thread,
  allPosts,
  allUsers,
  currentUser,
  onBack,
  onAddReply,
  onVotePoll,
  onToggleSticky,
  onToggleLock,
  onDeleteThread,
  onDeletePost,
  onReactThread
}: ThreadViewProps) {
  const [replyText, setReplyText] = useState('');
  const [isWatched, setIsWatched] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null); // 'thread' or postId

  const threadAuthor = allUsers.find(u => u.id === thread.authorId);
  const threadReplies = allPosts.filter(p => p.threadId === thread.id);

  // Poll calculation
  const totalPollVotes = thread.poll
    ? thread.poll.options.reduce((acc, opt) => acc + opt.votes.length, 0)
    : 0;

  const hasVotedPoll = thread.poll?.options.some(opt => opt.votes.includes(currentUser.id));

  const handleVoteSubmit = (optionId: string) => {
    if (thread.isLocked) return;
    onVotePoll(thread.id, optionId);
  };

  const handleAddReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || thread.isLocked) return;
    onAddReply(thread.id, replyText);
    setReplyText('');
  };

  const availableReactions = [
    { type: 'Like', emoji: '👍' },
    { type: 'Upvote', emoji: '🔺' },
    { type: 'Haha', emoji: '😂' },
    { type: 'Love', emoji: '❤️' },
    { type: 'Fire', emoji: '🔥' },
    { type: 'GG', emoji: '🏆' }
  ];

  // Get active reactions on parent thread safely
  const parentReactionsMap = {
    ...(thread.reactions?.['thread'] || {}),
    ...(thread.reactions?.[thread.id] || {})
  };

  // Grouped reactions for parent thread
  const parentGroupedReactions: { [reactType: string]: User[] } = {};
  Object.entries(parentReactionsMap).forEach(([uId, reactType]) => {
    const reactedUser = allUsers.find(u => u.id === uId);
    if (reactedUser) {
      if (!parentGroupedReactions[reactType]) {
        parentGroupedReactions[reactType] = [];
      }
      parentGroupedReactions[reactType].push(reactedUser);
    }
  });

  const renderAuthorDetails = (author: User | undefined) => {
    if (!author) return null;
    const authorRank = calculateUserRank(author.xp, author.postsCount);

    return (
      <div className="flex flex-col items-center text-center space-y-2 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <div className="relative">
          <img src={author.avatar} alt={author.username} className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-500/20" />
          <span className="absolute -bottom-1 -right-1 bg-indigo-505 bg-indigo-600 text-[9px] font-bold text-white px-1.5 py-0.2 rounded font-mono">
            LVL {author.level}
          </span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-xs font-black text-zinc-850 dark:text-zinc-50 hover:underline block truncate max-w-[130px]">{author.username}</span>
          <span className={`inline-block text-[9px] font-black uppercase tracking-tight font-mono px-2 py-0.5 rounded border mt-1 ${author.badgeColor}`}>
            {author.role}
          </span>
          <span className={`inline-block text-[8px] font-bold uppercase tracking-tight font-mono px-1.5 py-0.5 rounded border mt-1 ${authorRank.badgeBg}`} title={`Forum Rank: ${authorRank.title}`}>
            {authorRank.title}
          </span>
        </div>

        {/* Rep and Post count stats mini-table */}
        <div className="w-full grid grid-cols-2 gap-1.5 pt-1.5 border-t border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500">
          <div className="text-left">
            <span className="block text-[8px] uppercase text-zinc-400 font-bold">Credits</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-bold">{author.coins}</span>
          </div>
          <div className="text-right">
            <span className="block text-[8px] uppercase text-zinc-400 font-bold">Reputation</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">+{author.repPoints}</span>
          </div>
          <div className="text-left mt-1">
            <span className="block text-[8px] uppercase text-zinc-400 font-bold">Ref Posts</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-bold">{author.postsCount}</span>
          </div>
          <div className="text-right mt-1">
            <span className="block text-[8px] uppercase text-zinc-400 font-bold">Streak</span>
            <span className="text-orange-500 font-bold">{author.dailyStreak}d</span>
          </div>
        </div>
      </div>
    );
  };

  const handleApplyReaction = (postId: string, reaction: string) => {
    onReactThread(postId, reaction);
    setShowReactionPicker(null);
  };

  // Convert raw text into basic highlighted HTML/Markdown representation
  const formatContent = (text: string) => {
    // Basic formatting list conversions
    let parsed = text
      .replace(/\n/g, '<br />')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/### (.*?)(<br \/>|$)/g, '<h3 class="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase font-mono mt-3">$1</h3>')
      .replace(/@everyone/g, '<span class="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold px-1 rounded animate-pulse">@everyone</span>');
    
    return <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-250 leading-relaxed font-sans space-y-2" dangerouslySetInnerHTML={{ __html: parsed }} />;
  };

  const isCurrentUserStaff = ['Owner', 'Administrator', 'Senior Administrator', 'Moderator'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      
      {/* Thread Action Controls and Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 hover:bg-zinc-150 transition self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discussions
        </button>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button 
            onClick={() => setIsWatched(!isWatched)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition ${isWatched ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-zinc-950 border-zinc-205 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700'}`}
          >
            <Bell className="h-3.5 w-3.5" />
            {isWatched ? 'Watching Topic' : 'Watch Thread'}
          </button>
          
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition ${isBookmarked ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-zinc-950 border-zinc-205 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700'}`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            {isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
          </button>

          {/* Render Admin Toolbar Controls (sticky toggle, locking) */}
          {isCurrentUserStaff && (
            <div className="inline-flex rounded-lg border border-amber-500/30 p-0.5 bg-amber-500/5 items-center gap-1 px-1 py-0.5">
              <span className="text-[9px] uppercase font-bold text-amber-600 dark:text-amber-450 mr-1.5 pl-1">Admin Tools:</span>
              <button 
                onClick={() => onToggleSticky(thread.id)}
                className={`p-1.5 rounded-md hover:bg-amber-500/15 ${thread.isSticky ? 'text-amber-600' : 'text-zinc-400'}`}
                title="Toggle Pinned Sticky topic status"
              >
                <Pin className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => onToggleLock(thread.id)}
                className={`p-1.5 rounded-md hover:bg-amber-500/15 ${thread.isLocked ? 'text-red-600' : 'text-zinc-400'}`}
                title="Toggle Locked/Closed status"
              >
                {thread.isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              </button>
              <button 
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to permanently delete this discussion thread?')) {
                    onDeleteThread(thread.id);
                  }
                }}
                className="p-1.5 rounded-md hover:bg-rose-500/10 text-rose-500"
                title="Delete Thread Permanently"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Core Parent post Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Left Column author Details (Desktop only) */}
        <div className="hidden md:block p-4 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950">
          {renderAuthorDetails(threadAuthor)}
        </div>

        {/* Right Column Core Thread Content representation */}
        <div className="md:col-span-3 p-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3.5">
            {/* Mobile Column author details */}
            <div className="flex md:hidden items-center gap-3 border-b border-zinc-150 dark:border-zinc-800 pb-3">
              <img src={threadAuthor?.avatar} alt={threadAuthor?.username} className="h-10 w-10 rounded-xl object-cover" />
              <div>
                <span className="text-xs font-bold text-zinc-900 dark:text-white block">{threadAuthor?.username}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className={`text-[8px] font-black tracking-tight font-mono px-1.5 py-0.5 uppercase rounded ${threadAuthor?.badgeColor}`}>
                    {threadAuthor?.role}
                  </span>
                  {threadAuthor && (
                    <span className={`text-[8px] font-bold tracking-tight font-mono px-1.5 py-0.5 uppercase rounded border ${calculateUserRank(threadAuthor.xp, threadAuthor.postsCount).badgeBg}`}>
                      {calculateUserRank(threadAuthor.xp, threadAuthor.postsCount).title}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Prefix banner */}
            <div className="flex gap-2 items-center text-[11px] font-mono text-zinc-400">
              {thread.prefix && (
                <span className="bg-indigo-500/15 text-indigo-600 px-1.5 py-0.2 rounded font-bold uppercase text-[9px]">
                  {thread.prefix}
                </span>
              )}
              <span>Published {new Date(thread.createdAt).toLocaleDateString([], {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
            </div>

            {/* Title */}
            <h1 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              {thread.title}
              {thread.isSticky && <Pin className="h-4 w-4 text-rose-500 inline shrink-0" />}
              {thread.isLocked && <Lock className="h-4 w-4 text-zinc-400 inline shrink-0" />}
            </h1>

            {/* Text details content */}
            <div className="pt-2 font-mono">
              {formatContent(thread.content)}
            </div>

            {/* Signature Render */}
            {threadAuthor?.signature && (
              <div className="mt-8 pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-805 text-zinc-450 dark:text-zinc-500 text-[11px] font-mono leading-relaxed max-w-full break-words">
                <div dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(threadAuthor.signature) }} />
              </div>
            )}
          </div>

          {/* Interactive Poll Component area */}
          {thread.poll && (
            <div className="border border-indigo-500/20 bg-indigo-500/5 rounded-2xl p-4 space-y-4 mt-6">
              <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-2">
                <BarChart2 className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase font-mono tracking-tight">Active Ballots Voting</span>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{thread.poll.question}</p>
                <div className="space-y-2.5 mt-3.5">
                  {thread.poll.options.map((opt) => {
                    const optionVotesLength = opt.votes.length;
                    const percentageValue = totalPollVotes > 0 
                      ? Math.round((optionVotesLength / totalPollVotes) * 105) 
                      : 0;
                    const didVoteThis = opt.votes.includes(currentUser.id);

                    return (
                      <div key={opt.id} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <button 
                            disabled={hasVotedPoll || thread.isLocked}
                            onClick={() => handleVoteSubmit(opt.id)}
                            className={`font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 text-left cursor-pointer flex items-center gap-1.5 ${didVoteThis ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-zinc-650 dark:text-zinc-300'}`}
                          >
                            {didVoteThis ? <CheckCircle className="h-3 w-3 text-indigo-500" /> : <span className="h-3 w-3 rounded-full border border-zinc-400 inline-block bg-white dark:bg-zinc-950" />}
                            {opt.text}
                          </button>
                          <span className="font-mono text-[10px] text-zinc-500 font-semibold">{optionVotesLength} votes ({percentageValue}%)</span>
                        </div>
                        <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden relative border border-zinc-200/50 dark:border-zinc-800">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${didVoteThis ? 'bg-indigo-500' : 'bg-zinc-400 dark:bg-zinc-600'}`} 
                            style={{ width: `${percentageValue}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono mt-3.5">
                  <span>Total Voting count: {totalPollVotes} players</span>
                  {hasVotedPoll && <span className="text-indigo-600 dark:text-indigo-400 font-bold">✓ Vote registered securely</span>}
                </div>
              </div>
            </div>
          )}

          {/* Social Reactions area - Unified Fast-reaction bar */}
          <div className="border-t border-zinc-150 dark:border-zinc-805 pt-4 space-y-3">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              ⚡ Fast Reaction Center
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Direct clickable inline emoji picker */}
              <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-2xl shadow-inner">
                {availableReactions.map((reactItem) => {
                  const isCurrentActive = parentReactionsMap[currentUser.id] === reactItem.type;
                  return (
                    <button
                      key={reactItem.type}
                      type="button"
                      onClick={() => handleApplyReaction('thread', reactItem.type)}
                      className={`h-8 w-8 text-base rounded-xl hover:scale-120 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 active:scale-95 transition flex items-center justify-center cursor-pointer select-none ${
                        isCurrentActive 
                          ? 'bg-amber-500/10 border border-amber-500/35 text-amber-500 shadow-sm' 
                          : 'border border-transparent'
                      }`}
                      title={`Quickly react with ${reactItem.type}`}
                    >
                      {reactItem.emoji}
                    </button>
                  );
                })}
              </div>

              {/* Grouped summary display badges */}
              <div className="flex flex-wrap gap-2 items-center">
                {Object.entries(parentGroupedReactions).map(([reactType, userList]) => {
                  const emojiRep = availableReactions.find(e => e.type === reactType)?.emoji || '👍';
                  const isSecMe = userList.some(u => u.id === currentUser.id);
                  const namesTip = userList.map(u => u.username).join(', ');
                  return (
                    <button
                      key={reactType}
                      onClick={() => handleApplyReaction('thread', reactType)}
                      className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-xl border font-mono text-xs transition cursor-pointer hover:border-zinc-350 dark:hover:border-zinc-700 ${
                        isSecMe
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 font-black'
                          : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-850 text-zinc-500 hover:bg-zinc-50'
                      }`}
                      title={`Reacted with ${reactType} by: ${namesTip}`}
                    >
                      <span>{emojiRep}</span>
                      <span className="text-[10px]">{userList.length}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Discussion Reply Subfeed List */}
      {threadReplies.length > 0 && (
        <div className="space-y-4">
          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest pl-1">Subsequent Reply Comments ({threadReplies.length})</span>
          
          {threadReplies.map((post) => {
            const postAuthor = allUsers.find(u => u.id === post.authorId);
            return (
              <div 
                key={post.id} 
                className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-150 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Author card left */}
                <div className="hidden md:block p-4 border-r border-zinc-150 dark:border-zinc-850 bg-zinc-100/10 dark:bg-zinc-950">
                  {renderAuthorDetails(postAuthor)}
                </div>

                {/* Reply body right */}
                <div className="md:col-span-3 p-5 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    {/* Mobile Author area */}
                    <div className="flex md:hidden items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-2.5">
                      <img src={postAuthor?.avatar} alt={postAuthor?.username} className="h-8 w-8 rounded-lg object-cover" />
                      <div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">{postAuthor?.username}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${postAuthor?.badgeColor}`}>{postAuthor?.role}</span>
                          {postAuthor && (
                            <span className={`text-[8px] font-bold tracking-tight font-mono px-1.5 py-0.5 uppercase rounded border ${calculateUserRank(postAuthor.xp, postAuthor.postsCount).badgeBg}`}>
                              {calculateUserRank(postAuthor.xp, postAuthor.postsCount).title}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                      <span className="flex items-center gap-1">
                        <CornerDownRight className="h-3.5 w-3.5 text-indigo-500" />
                        Reply Post Sync
                      </span>
                      <div className="flex items-center gap-2">
                        <span>{new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        {isCurrentUserStaff && (
                          <button 
                            onClick={() => {
                              if (confirm('Permanently delete this subscriber comment?')) {
                                onDeletePost(post.id);
                              }
                            }}
                            className="text-rose-500 hover:text-rose-600 p-1"
                            title="Delete comment post"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="font-mono">
                      {formatContent(post.content)}
                    </div>

                    {postAuthor?.signature && (
                      <div className="mt-4 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-805 text-zinc-450 dark:text-zinc-500 text-[10px] font-mono leading-relaxed max-w-full break-words">
                        <div dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(postAuthor.signature) }} />
                      </div>
                    )}
                       {/* Comment reactions - Fast Reaction Bar */}
                  <div className="border-t border-zinc-100 dark:border-zinc-805 pt-3 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Direct clickable inline emoji picker for quick reply commenting */}
                      <div className="flex items-center gap-1 bg-zinc-50/80 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/80 p-1 rounded-xl shadow-xs">
                        {availableReactions.map((reactItem) => {
                          const isCurrentActive = post.reactions?.[currentUser.id] === reactItem.type;
                          return (
                            <button
                              key={reactItem.type}
                              type="button"
                              onClick={() => handleApplyReaction(post.id, reactItem.type)}
                              className={`h-7 w-7 text-xs rounded-lg hover:scale-120 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 active:scale-95 transition flex items-center justify-center cursor-pointer select-none ${
                                isCurrentActive 
                                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-500 shadow-sm' 
                                  : 'border border-transparent'
                              }`}
                              title={`Quickly react with ${reactItem.type}`}
                            >
                              {reactItem.emoji}
                            </button>
                          );
                        })}
                      </div>

                      {/* Grouped summary display badges */}
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {post.reactions && (() => {
                          const postGrouped: { [type: string]: string[] } = {};
                          Object.entries(post.reactions).forEach(([uId, rType]) => {
                            if (!postGrouped[rType]) postGrouped[rType] = [];
                            postGrouped[rType].push(uId);
                          });

                          return Object.entries(postGrouped).map(([reactType, userIds]) => {
                            const emojiRep = availableReactions.find(e => e.type === reactType)?.emoji || '👍';
                            const isSecMe = userIds.includes(currentUser.id);
                            const namesTip = userIds.map(id => allUsers.find(u => u.id === id)?.username || 'User').join(', ');
                            return (
                              <button
                                key={reactType}
                                onClick={() => handleApplyReaction(post.id, reactType)}
                                className={`inline-flex items-center gap-1 h-7 px-2 rounded-lg border font-mono text-[10px] transition cursor-pointer hover:border-zinc-350 dark:hover:border-zinc-700 ${
                                  isSecMe
                                    ? 'bg-amber-500/10 border-amber-500/35 text-amber-600 dark:text-amber-400 font-extrabold'
                                    : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-850 text-zinc-455 hover:bg-zinc-50'
                                }`}
                                title={`Reacted with ${reactType} by: ${namesTip}`}
                              >
                                <span>{emojiRep}</span>
                                <span>{userIds.length}</span>
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Reply creation Editor input */}
      <div className="border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-150 dark:border-zinc-800 pb-2.5">
          <MessageCircle className="h-4.5 w-4.5 text-indigo-505 text-indigo-600" />
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase font-mono">Write Reply Draft (Autosaved)</span>
        </div>

        {thread.isLocked ? (
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-center text-xs text-zinc-500 font-mono border border-dashed flex flex-col items-center justify-center gap-2">
            <Lock className="h-5 w-5 text-zinc-455 text-zinc-400" />
            <p className="font-bold uppercase tracking-tight">This discussion board topic is locked</p>
            <p className="text-[11px] max-w-sm">Administrators or Moderators locked this thread. No new comments can be submitted at this node.</p>
          </div>
        ) : (
          <form onSubmit={handleAddReplySubmit} className="space-y-4">
            <div className="flex gap-2 text-[10px] text-zinc-400 font-mono">
              <span className="cursor-pointer hover:text-zinc-600" onClick={() => setReplyText(prev => prev + ' **bold text** ')}>Bold</span>
              <span>•</span>
              <span className="cursor-pointer hover:text-zinc-600" onClick={() => setReplyText(prev => prev + ' `inline-code` ')}>Code Block</span>
              <span>•</span>
              <span className="cursor-pointer hover:text-zinc-600" onClick={() => setReplyText(prev => prev + ' \n* list item ')}>Bullets</span>
              <span>•</span>
              <span className="cursor-pointer hover:text-zinc-600" onClick={() => setReplyText(prev => prev + ` @${currentUser.username} `)}>Tag Self</span>
            </div>

            <textarea 
              rows={4}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Provide constructive feedback, quote previous comments, or ask questions here. Support standard markdown shortcuts."
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm font-mono outline-none focus:border-indigo-505 focus:bg-white dark:focus:bg-zinc-950 transition"
            />

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                <FileCheck2 className="h-3.5 w-3.5 text-emerald-500" />
                Anti-Spam active: 10 second flood rate limit enabled.
              </span>
              <button 
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                Send Response
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
