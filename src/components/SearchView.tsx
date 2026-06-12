/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Tag, 
  ShoppingBag, 
  ExternalLink, 
  Clock, 
  Bot, 
  ArrowLeft,
  DollarSign,
  Briefcase,
  ChevronRight,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { Thread, Post, MarketplaceListing, User } from '../types';

interface SearchViewProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  threads: Thread[];
  allPosts: Post[];
  listings: MarketplaceListing[];
  allUsers: User[];
  onSelectThread: (threadId: string) => void;
  onSetView: (view: string) => void;
  onSelectUser: (user: User) => void;
}

type FilterType = 'all' | 'threads' | 'posts' | 'listings';

export default function SearchView({
  searchQuery,
  onSearch,
  threads,
  allPosts,
  listings,
  allUsers,
  onSelectThread,
  onSetView,
  onSelectUser
}: SearchViewProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  const query = searchQuery.trim().toLowerCase();

  // 1. Thread matching
  const matchedThreads = threads.filter(t => {
    if (!query) return true;
    return (
      t.title.toLowerCase().includes(query) ||
      t.content.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (t.prefix && t.prefix.toLowerCase().includes(query))
    );
  });

  // 2. Posts matching
  const matchedPosts = allPosts.filter(p => {
    if (!query) return true;
    return p.content.toLowerCase().includes(query);
  });

  // 3. Listings matching
  const matchedListings = listings.filter(l => {
    if (!query) return true;
    return (
      l.title.toLowerCase().includes(query) ||
      l.description.toLowerCase().includes(query) ||
      l.category.toLowerCase().includes(query) ||
      l.type.toLowerCase().includes(query)
    );
  });

  const totalHits = 
    (activeFilter === 'all' || activeFilter === 'threads' ? matchedThreads.length : 0) +
    (activeFilter === 'all' || activeFilter === 'posts' ? matchedPosts.length : 0) +
    (activeFilter === 'all' || activeFilter === 'listings' ? matchedListings.length : 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Back Anchor */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onSetView('forums')}
          className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Forums
        </button>
        <div className="text-[10px] font-mono text-zinc-400">
          Search engine matching index compiled realtime
        </div>
      </div>

      {/* Hero title & Search Input */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-xl space-y-3">
          <span className="text-[9px] font-mono font-black uppercase text-amber-500 tracking-widest block">Unified Territory Indexes</span>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
            Search Registry Center
          </h1>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            Scan forums threads, players commentary posts, and LSPD whitelisted marketplace trades dynamically across Gonnsen territories.
          </p>

          <form onSubmit={handleLocalSubmit} className="flex gap-2 pt-2">
            <div className="relative flex-1">
              <input 
                type="text"
                placeholder="Types keywords (e.g. Police app, Elegy, custom, code)..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-90 w bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-950 text-zinc-850 dark:text-zinc-100 transition-all font-mono"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
            </div>
            <button 
              type="submit" 
              className="h-11 px-5 bg-zinc-900 text-amber-500 dark:bg-zinc-100 dark:text-zinc-950 font-mono font-bold text-xs rounded-xl shadow-md cursor-pointer hover:scale-103 active:scale-97 transition"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      {/* Tabs / Filter Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase border transition flex items-center gap-2 ${
              activeFilter === 'all' 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 border-zinc-900 dark:border-white' 
                : 'bg-white dark:bg-zinc-950 text-zinc-500 border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            All Outputs ({matchedThreads.length + matchedPosts.length + matchedListings.length})
          </button>

          <button
            onClick={() => setActiveFilter('threads')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase border transition flex items-center gap-2 ${
              activeFilter === 'threads' 
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/35' 
                : 'bg-white dark:bg-zinc-950 text-zinc-500 border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
            Threads ({matchedThreads.length})
          </button>

          <button
            onClick={() => setActiveFilter('posts')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase border transition flex items-center gap-2 ${
              activeFilter === 'posts' 
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-505/30 border-indigo-500/30' 
                : 'bg-white dark:bg-zinc-950 text-zinc-500 border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50'
            }`}
          >
            <Tag className="h-3.5 w-3.5 text-indigo-500" />
            Post Replies ({matchedPosts.length})
          </button>

          <button
            onClick={() => setActiveFilter('listings')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase border transition flex items-center gap-2 ${
              activeFilter === 'listings' 
                ? 'bg-emerald-505/10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                : 'bg-white dark:bg-zinc-950 text-zinc-500 border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5 text-emerald-500" />
            Marketplace Goods ({matchedListings.length})
          </button>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          Showing <span className="font-bold text-zinc-800 dark:text-white font-black">{totalHits}</span> results for &ldquo;{searchQuery || '*'}&rdquo;
        </div>
      </div>

      {/* Results grid or list */}
      <div className="space-y-4">
        {totalHits === 0 ? (
          <div className="border border-dashed border-zinc-250 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3.5">
            <Search className="h-10 w-10 text-zinc-350 dark:text-zinc-700 mx-auto" />
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-150 uppercase tracking-tight">System match not found</h3>
            <p className="text-xs text-zinc-400">
              No matching discussions, comments, or trades were extracted for keywords &ldquo;{searchQuery}&rdquo;. Try entering simpler terms like &quot;LSPD&quot;, &quot;Elegy&quot;, or &quot;RP&quot;.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* 1. Threads Output */}
            {(activeFilter === 'all' || activeFilter === 'threads') && matchedThreads.length > 0 && (
              <div className="space-y-2.5">
                {(activeFilter === 'all') && (
                  <h2 className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5 pt-2">
                    <MessageSquare className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    Forums Thread Matches ({matchedThreads.length})
                  </h2>
                )}
                
                <div className="grid grid-cols-1 gap-3">
                  {matchedThreads.map(th => {
                    const author = allUsers.find(u => u.id === th.authorId);
                    return (
                      <div 
                        key={th.id}
                        onClick={() => onSelectThread(th.id)}
                        className="bg-white dark:bg-zinc-950 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-850 p-4 rounded-2xl relative cursor-pointer shadow-xs transition group"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {th.prefix && (
                                <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold font-mono tracking-wide bg-indigo-500/10 text-indigo-600 dark:text-indigo-455">
                                  {th.prefix}
                                </span>
                              )}
                              <h3 className="text-xs sm:text-sm font-bold text-zinc-850 dark:text-zinc-50 group-hover:text-amber-500 transition-colors truncate">
                                {th.title}
                              </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                              {th.content.replace(/[#*`[\]]/g, '')}
                            </p>
                            
                            {/* Metadata list */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono text-zinc-400">
                              <div className="flex items-center gap-1 text-zinc-650 dark:text-zinc-350">
                                {author && <img src={author.avatar} className="h-4 w-4 rounded-full object-cover shrink-0" />}
                                <span className="font-semibold">{author?.username}</span>
                              </div>
                              <span>•</span>
                              <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {new Date(th.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>💬 {th.repliesCount} comments</span>
                              <span>•</span>
                              <span>👁 {th.viewsCount} reads</span>
                            </div>
                          </div>
                          
                          <div className="h-7 w-7 rounded-lg bg-zinc-50 dark:bg-zinc-90 w bg-zinc-900 border border-zinc-250 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-amber-500 group-hover:scale-105 transition-all self-center">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Posts Output */}
            {(activeFilter === 'all' || activeFilter === 'posts') && matchedPosts.length > 0 && (
              <div className="space-y-2.5">
                {(activeFilter === 'all') && (
                  <h2 className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5 pt-4">
                    <Tag className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    Commentary Post Matches ({matchedPosts.length})
                  </h2>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {matchedPosts.map(post => {
                    const author = allUsers.find(u => u.id === post.authorId);
                    const parentThread = threads.find(t => t.id === post.threadId);
                    return (
                      <div 
                        key={post.id}
                        onClick={() => onSelectThread(post.threadId)}
                        className="bg-white dark:bg-zinc-950 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-850 p-4 rounded-2xl relative cursor-pointer shadow-xs transition group"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <span className="text-[9px] font-mono font-bold tracking-tight text-indigo-505 text-indigo-600 uppercase flex items-center gap-1">
                              Comment in Thread: &ldquo;{parentThread?.title || 'Unknown Thread'}&rdquo; <ChevronRight className="h-3 w-3 inline shrink-0" />
                            </span>
                            <p className="text-xs text-zinc-650 dark:text-zinc-350 font-mono italic bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 p-2.5 rounded-lg line-clamp-2">
                              &ldquo;{post.content.replace(/[#*`[\]]/g, '')}&rdquo;
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono text-zinc-400">
                              <div className="flex items-center gap-1 text-zinc-650 dark:text-zinc-350">
                                {author && <img src={author.avatar} className="h-4 w-4 rounded-full object-cover shrink-0" />}
                                <span className="font-semibold">{author?.username}</span>
                              </div>
                              <span>•</span>
                              <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="h-7 w-7 rounded-lg bg-zinc-50 dark:bg-zinc-90 w bg-zinc-900 border border-zinc-250 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-500 group-hover:scale-105 transition-all self-center">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Listings Output */}
            {(activeFilter === 'all' || activeFilter === 'listings') && matchedListings.length > 0 && (
              <div className="space-y-2.5">
                {(activeFilter === 'all') && (
                  <h2 className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5 pt-4">
                    <ShoppingBag className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Marketplace Trades Matches ({matchedListings.length})
                  </h2>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {matchedListings.map(listing => {
                    const seller = allUsers.find(u => u.id === listing.authorId);
                    return (
                      <div 
                        key={listing.id}
                        onClick={() => onSetView('marketplace')}
                        className="bg-white dark:bg-zinc-950 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-850 p-4 rounded-2xl relative cursor-pointer shadow-sm transition group flex gap-3.5"
                      >
                        {listing.images && listing.images.length > 0 && (
                          <img src={listing.images[0]} className="h-16 w-16 rounded-xl object-cover border shrink-0 bg-zinc-100" />
                        )}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[8.5px] font-mono font-bold tracking-tight px-1.5 py-0.2 rounded uppercase ${
                              listing.type === 'sell' 
                                ? 'bg-red-500/10 text-red-650 dark:text-red-400' 
                                : listing.type === 'buy'
                                  ? 'bg-emerald-505/10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-amber-500/10 text-amber-600'
                            }`}>
                              {listing.type}
                            </span>
                            <span className="text-[8.5px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                              {listing.category}
                            </span>
                          </div>
                          
                          <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-50 group-hover:text-emerald-500 transition-colors truncate">
                            {listing.title}
                          </h3>
                          
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-black text-amber-500">
                              {listing.price.toLocaleString()} GTRP$
                            </span>
                            {listing.isSold && (
                              <span className="text-[8px] font-mono font-black px-1 rounded bg-zinc-200 text-zinc-650 uppercase">
                                Sold Out
                              </span>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 pt-1">
                            <span>By: {seller?.username}</span>
                            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="h-7 w-7 rounded-lg bg-zinc-50 dark:bg-zinc-90 w bg-zinc-900 border border-zinc-250 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-500 group-hover:scale-105 transition-all self-center">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
