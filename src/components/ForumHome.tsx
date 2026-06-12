/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  GitBranch, 
  MessageSquare, 
  Lightbulb, 
  UserPlus, 
  ShieldAlert, 
  LayoutGrid, 
  BookOpen, 
  Image as ImageIcon, 
  Smile, 
  Flame, 
  Award, 
  Play, 
  TrendingUp, 
  User, 
  MessageCircle, 
  Eye, 
  Calendar, 
  FileText,
  Pin,
  Lock,
  PlusCircle,
  Clock,
  Sparkles,
  Search,
  Filter,
  BarChart4
} from 'lucide-react';
import { ForumCategory, Thread, User as UserType } from '../types';
import { motion } from 'motion/react';
import TopPlayersSidebar from './TopPlayersSidebar';

interface ForumHomeProps {
  categories: ForumCategory[];
  threads: Thread[];
  allUsers: UserType[];
  currentUser: UserType;
  onCreateThread: (threadData: Partial<Thread>) => void;
  onSelectThread: (threadId: string) => void;
  searchQuery?: string;
  onAddCategory?: (category: ForumCategory) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onSelectUser?: (user: UserType) => void;
}

// Helper to resolve Lucide component dynamically
export function CategoryIcon({ name, className = "h-5 w-5" }: { name: string, className?: string }) {
  switch (name) {
    case 'Megaphone': return <Megaphone className={className} />;
    case 'GitBranch': return <GitBranch className={className} />;
    case 'MessageSquare': return <MessageSquare className={className} />;
    case 'Lightbulb': return <Lightbulb className={className} />;
    case 'UserPlus': return <UserPlus className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'LayoutGrid': return <LayoutGrid className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'Image': return <ImageIcon className={className} />;
    case 'Smile': return <Smile className={className} />;
    default: return <MessageSquare className={className} />;
  }
}

export default function ForumHome({
  categories,
  threads,
  allUsers,
  currentUser,
  onCreateThread,
  onSelectThread,
  searchQuery = '',
  onAddCategory,
  onDeleteCategory,
  onSelectUser
}: ForumHomeProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showCreateThreadPanel, setShowCreateThreadPanel] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadPrefix, setNewThreadPrefix] = useState('[Discussion]');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadTags, setNewThreadTags] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState(categories[0]?.id || '');

  // Category dynamic creation state
  const [showCreateSectionPanel, setShowCreateSectionPanel] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionDesc, setNewSectionDesc] = useState('');
  const [newSectionType, setNewSectionType] = useState<'announcements' | 'general' | 'guides' | 'servers' | 'offtopic'>('general');
  const [newSectionIcon, setNewSectionIcon] = useState('MessageSquare');

  // Poll state inside thread creation
  const [hasPoll, setHasPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  // Filters
  const [activeTab, setActiveTab] = useState<'all' | 'sticky' | 'trending'>('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'views' | 'replies'>('latest');

  // Time Countdown state for mock events
  const [countdowns, setCountdowns] = useState({
    esports: '2d 04h 12m',
    whitelist: '04h 32m',
    gtaReset: '12h 15m'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate ticking down seconds
      setCountdowns(prev => {
        const parseMinutes = (mStr: string) => {
          if (mStr.includes('h')) {
            const parts = mStr.split(' ');
            return parts;
          }
          return [mStr];
        };
        return prev; // Stay relatively static for simulation simplicity
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreatePollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const handleSubmitThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    const parsedTags = newThreadTags
      ? newThreadTags.split(',').map(t => t.trim()).filter(Boolean)
      : ['General'];

    const threadData: Partial<Thread> = {
      title: newThreadTitle,
      content: newThreadContent,
      forumId: newThreadCategory,
      prefix: newThreadPrefix,
      tags: parsedTags,
      isSticky: false,
      isLocked: false,
      repliesCount: 0,
      viewsCount: 1,
      authorId: currentUser.id,
      createdAt: new Date().toISOString(),
      reactions: {}
    };

    if (hasPoll && pollQuestion.trim()) {
      threadData.poll = {
        question: pollQuestion,
        options: pollOptions
          .filter(opt => opt.trim() !== '')
          .map((text, i) => ({ id: `opt_${Date.now()}_${i}`, text, votes: [] })),
        isClosed: false
      };
    }

    onCreateThread(threadData);

    // Reset Form
    setNewThreadTitle('');
    setNewThreadContent('');
    setNewThreadTags('');
    setHasPoll(false);
    setPollQuestion('');
    setPollOptions(['', '']);
    setShowCreateThreadPanel(false);
  };

  const handleCreateSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim() || !newSectionDesc.trim() || !onAddCategory) return;

    const newCat: ForumCategory = {
      id: `cat_custom_${Date.now()}`,
      name: newSectionName.trim(),
      description: newSectionDesc.trim(),
      icon: newSectionIcon,
      type: newSectionType,
      threadCount: 0,
      postCount: 0
    };

    onAddCategory(newCat);
    setNewSectionName('');
    setNewSectionDesc('');
    setShowCreateSectionPanel(false);
    alert(`Board Section "${newCat.name}" created successfully!`);
    
    // auto select the new category
    setNewThreadCategory(newCat.id);
  };

  const safeSelectCategory = (targetId: string) => {
    const exists = categories.some(c => c.id === targetId);
    if (exists) {
      setSelectedCategoryId(targetId);
    } else if (categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  };

  const safeSelectThread = (targetId: string) => {
    const exists = threads.some(t => t.id === targetId);
    if (exists) {
      onSelectThread(targetId);
    } else if (threads.length > 0) {
      onSelectThread(threads[0].id);
    }
  };

  // Filter threads based on search or category
  const filteredThreads = threads
    .filter(t => {
      // Match category
      if (selectedCategoryId && t.forumId !== selectedCategoryId) return false;
      
      // Match query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesContent = t.content.toLowerCase().includes(query);
        const matchesTags = t.tags.some(tag => tag.toLowerCase().includes(query));
        return matchesTitle || matchesContent || matchesTags;
      }
      return true;
    })
    .filter(t => {
      if (activeTab === 'sticky') return t.isSticky;
      if (activeTab === 'trending') return t.viewsCount > 300;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'views') return b.viewsCount - a.viewsCount;
      if (sortOrder === 'replies') return b.repliesCount - a.repliesCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Calculate generic statistics
  const activeUsersCount = allUsers.length;
  const totalPostsHistory = threads.reduce((acc, t) => acc + t.repliesCount, 0) + threads.length;

  return (
    <div className="space-y-6">
      
      {/* GTA-Style Scrolling Marquee News Ticker */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex items-center h-10 shadow-md">
        <div className="flex items-center shrink-0 h-full bg-red-600 px-3.5 py-1 font-black text-white text-[10.5px] tracking-widest leading-none border-r border-amber-500 animate-pulse select-none font-mono">
          ★ BROADCAST ★
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center select-none bg-zinc-950 font-mono text-[11px] font-extrabold uppercase">
          <motion.div
            className="flex whitespace-nowrap gap-12 text-amber-500"
            animate={{ x: [0, -1800] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 38,
            }}
          >
            {[
              "NEXUS CORE UPGRADE 5.0 IS SUBMITTED LIVE ON MAIN NODES! ALL CLAN RANKING SCHEMAS RECOMPILED",
              "WHITELIST APPS ARE UNDER REVIEW BY STAFF DIRECTORS. STAGE 2 INTERVIEWS BEGIN FRIDAY PM!",
              "REDWOOD LIGHTS TRADING TAX REDUCED TO 2% ON PREMIUM VEHICLE TRADES. BARTER AUCTIONS TERMINATED!",
              "GTRP EXCEEDS 100K TOTAL ACCOUNTS IN TERRITORY SERVICES DATABASE. REDEEM PROMO CODE: 'GTRP100K' FOR +1000 XP!",
              "LSPD BULLET TRAFFIC RADARS DEPLOYED ON MISSION ROW AND GANTON CORNER TO MAINTAIN IC CIVIC CODES",
              "ROLEPLAY CONDUCT VIOLATIONS DETECTED ARE TO BE REPORTED VIA INTEGRATED FORUM DEPUTY CHANNELS"
            ].map((text, idx) => (
              <span key={idx} className="flex items-center gap-2 shrink-0">
                <span className="text-red-500">★</span>
                <span>{text}</span>
                <span className="text-red-500">★</span>
              </span>
            ))}
            {/* Same items for seamless loop */}
            {[
              "NEXUS CORE UPGRADE 5.0 IS SUBMITTED LIVE ON MAIN NODES! ALL CLAN RANKING SCHEMAS RECOMPILED",
              "WHITELIST APPS ARE UNDER REVIEW BY STAFF DIRECTORS. STAGE 2 INTERVIEWS BEGIN FRIDAY PM!",
              "REDWOOD LIGHTS TRADING TAX REDUCED TO 2% ON PREMIUM VEHICLE TRADES. BARTER AUCTIONS TERMINATED!",
              "GTRP EXCEEDS 100K TOTAL ACCOUNTS IN TERRITORY SERVICES DATABASE. REDEEM PROMO CODE: 'GTRP100K' FOR +1000 XP!",
              "LSPD BULLET TRAFFIC RADARS DEPLOYED ON MISSION ROW AND GANTON CORNER TO MAINTAIN IC CIVIC CODES",
              "ROLEPLAY CONDUCT VIOLATIONS DETECTED ARE TO BE REPORTED VIA INTEGRATED FORUM DEPUTY CHANNELS"
            ].map((text, idx) => (
              <span key={`dup-${idx}`} className="flex items-center gap-2 shrink-0">
                <span className="text-red-500">★</span>
                <span>{text}</span>
                <span className="text-red-500">★</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Middle Feed (Columns 1 to 3) */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Banner/Hero Card */}
        {!selectedCategoryId && !searchQuery && (
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 md:p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/80 via-zinc-950/60 to-violet-950/40 z-0" />
            
            {/* Ambient Graphic Effects */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl z-0" />
            <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl z-0" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3 max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 font-semibold font-mono">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  NEXUS CORE UPGRADE 5.0 LIVE
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-indigo-300 bg-clip-text text-transparent">
                  Where Elite Gaming Communities Connect
                </h1>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Join whitelisted GTA roleplay channels, verify clan rankings, trade mods inside our secure marketplace, and unlock achievements linked directly to your server profile.
                </p>
                <div className="flex gap-4 pt-1.5">
                  <button 
                    onClick={() => setShowCreateThreadPanel(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-indigo-500/20 transition-all duration-300 transform active:scale-95"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Publish Topic Draft
                  </button>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('servers-grid-target');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className="px-4 py-2 text-zinc-350 hover:text-white hover:bg-white/5 border border-zinc-750 hover:border-zinc-700 text-xs font-semibold rounded-lg transition"
                  >
                    View Game Nodes
                  </button>
                </div>
              </div>

              {/* Server Stats Dashboard Inside Header */}
              <div className="grid grid-cols-2 gap-3 w-full md:w-auto font-mono">
                <div className="bg-zinc-950/60 border border-zinc-800 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Total Accounts</span>
                  <span className="text-lg font-bold text-white tracking-tight">104,249</span>
                  <span className="text-[9px] text-emerald-400 block mt-0.5">● +142 today</span>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-800 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Survival Node 1</span>
                  <span className="text-lg font-bold text-white tracking-tight">185 ms</span>
                  <span className="text-[9px] text-emerald-400 block mt-0.5">● Deployed Live</span>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-800 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Total Activity</span>
                  <span className="text-lg font-bold text-white tracking-tight">5,410,518</span>
                  <span className="text-[9px] text-indigo-400 block mt-0.5">💬 Incremental Posts</span>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-800 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 font-semibold block uppercase">RP Active Gangs</span>
                  <span className="text-lg font-bold text-white tracking-tight">42 verified</span>
                  <span className="text-[9px] text-amber-400 block mt-0.5">🛡️ War logs synced</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Staff Announcements Ticker (Sticky announcements) */}
        {!selectedCategoryId && !searchQuery && (
          <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex gap-3 items-center">
            <div className="h-8 w-8 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 tracking-wider block">URGENT ANNOUNCEMENT</span>
              <p className="text-xs text-zinc-700 dark:text-zinc-350 truncate">
                Staff Candidate recruitment is actively OPEN under the <span className="underline font-semibold cursor-pointer" onClick={() => safeSelectThread('thread_1')}>Nexus Core 5.0 updates portal</span>. Application deadline is June 18th.
              </p>
            </div>
            <button 
              onClick={() => safeSelectThread('thread_1')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center shrink-0"
            >
              Analyze Plan
              <Play className="h-3 w-3 ml-1" />
            </button>
          </div>
        )}

        {/* Category filtering Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-200 dark:border-zinc-800 pb-2.5 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase text-xs font-mono">
              {selectedCategoryId 
                ? `Category: ${categories.find(c => c.id === selectedCategoryId)?.name}`
                : searchQuery 
                  ? `Search: "${searchQuery}"`
                  : 'Main Forum Core Boards'
              }
            </span>
            {selectedCategoryId && (
              <button 
                onClick={() => setSelectedCategoryId(null)}
                className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/20 text-rose-600 dark:text-rose-450 bg-rose-500/5 hover:bg-rose-500/10 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100 dark:bg-zinc-950">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 text-xs rounded-md cursor-pointer ${activeTab === 'all' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700'}`}
              >
                All Topics
              </button>
              <button 
                onClick={() => setActiveTab('sticky')}
                className={`px-2.5 py-1 text-xs rounded-md cursor-pointer ${activeTab === 'sticky' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700'}`}
              >
                <Pin className="h-3 w-3 inline mr-1" />
                Pinned
              </button>
              <button 
                onClick={() => setActiveTab('trending')}
                className={`px-2.5 py-1 text-xs rounded-md cursor-pointer ${activeTab === 'trending' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700'}`}
              >
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Popular
              </button>
            </div>

            <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100 dark:bg-zinc-950">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="text-xs bg-transparent text-zinc-700 dark:text-zinc-300 border-none outline-none px-2 cursor-pointer"
              >
                <option value="latest">Sort: Latest</option>
                <option value="views">Sort: Most Viewed</option>
                <option value="replies">Sort: Most Discussed</option>
              </select>
            </div>
            
            {onAddCategory && (
              <button 
                onClick={() => {
                  setShowCreateSectionPanel(!showCreateSectionPanel);
                  setShowCreateThreadPanel(false);
                }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Create Section
              </button>
            )}
            
            <button 
              onClick={() => {
                setShowCreateThreadPanel(!showCreateThreadPanel);
                setShowCreateSectionPanel(false);
              }}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-505 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Start Thread
            </button>
          </div>
        </div>

        {/* Create Section Category Panel Form */}
        {showCreateSectionPanel && onAddCategory && (
          <div className="bg-white dark:bg-zinc-90 w-full bg-white dark:bg-zinc-900 p-5 rounded-2xl border-2 border-emerald-500/20 shadow-xl space-y-4 font-mono text-zinc-800 dark:text-zinc-100">
            <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-800 pb-2.5">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                FORUM SECTION CREATOR (ADMIN/OWNER PRIVILEGES)
              </span>
              <button 
                type="button"
                onClick={() => setShowCreateSectionPanel(false)}
                className="text-xs text-zinc-400 hover:text-zinc-650"
              >
                Cancel Creation
              </button>
            </div>

            <form onSubmit={handleCreateSectionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-black block mb-1">Board Section Title</label>
                  <input 
                    type="text"
                    required
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="e.g., Gang Applications"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs outline-none focus:border-emerald-550"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-black block mb-1">Board Section Type/Category</label>
                  <select 
                    value={newSectionType}
                    onChange={(e) => setNewSectionType(e.target.value as any)}
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-955 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs outline-none"
                  >
                    <option value="announcements">Announcements Board</option>
                    <option value="general">General In-Character Forums</option>
                    <option value="guides">Guides, Faucets & FAQs</option>
                    <option value="servers">Game Nodes & Whitelist Systems</option>
                    <option value="offtopic">Out-Of-Character & Offtopic Discussions</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-black block mb-1">Lucide Symbol Icon</label>
                  <select
                    value={newSectionIcon}
                    onChange={(e) => setNewSectionIcon(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-955 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs outline-none"
                  >
                    <option value="Megaphone">Megaphone / Announcements</option>
                    <option value="MessageSquare">MessageSquare / Forums</option>
                    <option value="BookOpen">BookOpen / Guides</option>
                    <option value="GitBranch">GitBranch / Factions</option>
                    <option value="UserPlus">UserPlus / Applications</option>
                    <option value="ShieldAlert">ShieldAlert / Rules</option>
                    <option value="LayoutGrid">LayoutGrid / Server Nodes</option>
                    <option value="Image">ImageIcon / Showroom</option>
                    <option value="Smile">Smile / Lounge</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-black block mb-1">Visual Symbol Preview</label>
                  <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <CategoryIcon name={newSectionIcon} className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-sans font-semibold text-zinc-500">Section symbol active</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-black block mb-1">Section Purpose Description</label>
                <textarea 
                  required
                  rows={2}
                  value={newSectionDesc}
                  onChange={(e) => setNewSectionDesc(e.target.value)}
                  placeholder="Designate description bounds, e.g. 'Publish formal application templates to gain whitelist status inside official street gangs.'"
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => setShowCreateSectionPanel(false)}
                  className="px-4 py-2 border border-zinc-250 dark:border-zinc-750 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 rounded-xl"
                >
                  Discard Draft
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow"
                >
                  Deploy Board Section
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Create Thread Panel Form */}
        {showCreateThreadPanel && (
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border-2 border-indigo-500/20 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-800 pb-2.5">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-450 uppercase flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                New Thread Composer (Draft Saved)
              </span>
              <button 
                onClick={() => setShowCreateThreadPanel(false)}
                className="text-xs font-mono text-zinc-400 hover:text-zinc-650"
              >
                Close Editor
              </button>
            </div>

            <form onSubmit={handleSubmitThread} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Prefix Filter</label>
                  <select 
                    value={newThreadPrefix}
                    onChange={(e) => setNewThreadPrefix(e.target.value)}
                    className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                  >
                    <option value="[Discussion]">[Discussion] Neutral chat</option>
                    <option value="[Suggestions]">[Suggestions] Feedbacks</option>
                    <option value="[Guides]">[Guides] Walkthroughs</option>
                    <option value="[WTS]">[WTS] Want to Sell</option>
                    <option value="[WTB]">[WTB] Want to Buy</option>
                    <option value="[Changelog]">[Changelog] Staff notes</option>
                    <option value="[Recruiting]">[Recruiting] Guild recruitment</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Forum Board Section</label>
                  <select 
                    value={newThreadCategory}
                    onChange={(e) => setNewThreadCategory(e.target.value)}
                    className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                    required
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Comma-Separated Tags</label>
                  <input 
                    type="text"
                    value={newThreadTags}
                    onChange={(e) => setNewThreadTags(e.target.value)}
                    placeholder="FiveM, police, faction, mod"
                    className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Discussion Title</label>
                <input 
                  type="text"
                  required
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="Summarize your discussion topic or server issue clearly..."
                  className="w-full mt-1 p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Thread Composition Markup</label>
                  <div className="flex gap-2 text-[10px] text-zinc-400 font-mono">
                    <span className="cursor-pointer hover:text-zinc-600" onClick={() => setNewThreadContent(prev => prev + '\n**text** ')}>Bold</span>
                    <span>•</span>
                    <span className="cursor-pointer hover:text-zinc-600" onClick={() => setNewThreadContent(prev => prev + '\n### Heading ')}>Heading</span>
                    <span>•</span>
                    <span className="cursor-pointer hover:text-zinc-600" onClick={() => setNewThreadContent(prev => prev + '\n* Bullet point ')}>List</span>
                  </div>
                </div>
                <textarea 
                  required
                  rows={6}
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  placeholder="Compose your thread using markdown. Support bolding (**text**), lists (+ list item), headers (### label). Respect other players and follow staff guidelines."
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono outline-none focus:border-indigo-500"
                />
              </div>

              {/* Interactive Poll Builder Inside Thread Composer */}
              <div className="border border-zinc-150 dark:border-zinc-800 rounded-xl p-3.5 bg-zinc-50/50 dark:bg-zinc-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="enable-poll" 
                      checked={hasPoll}
                      onChange={(e) => setHasPoll(e.target.checked)}
                      className="rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <label htmlFor="enable-poll" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-1">
                      <BarChart4 className="h-4 w-4 text-indigo-500" />
                      Attach Interactive Voting Poll
                    </label>
                  </div>
                  {hasPoll && (
                    <button 
                      type="button" 
                      onClick={handleCreatePollOption}
                      disabled={pollOptions.length >= 5}
                      className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 disabled:opacity-50"
                    >
                      + Add Ballot Choice
                    </button>
                  )}
                </div>

                {hasPoll && (
                  <div className="mt-4 space-y-3 pl-6 border-l-2 border-indigo-500/20">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 uppercase block">Ballot Question</label>
                      <input 
                        type="text"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        placeholder="Should we reset server tax brackets for gangs?"
                        className="w-full mt-1 p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                        required={hasPoll}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase block">Choices (Min 2, Max 5)</label>
                      {pollOptions.map((opt, oIdx) => (
                        <div key={oIdx} className="flex gap-2 items-center">
                          <input 
                            type="text"
                            value={opt}
                            onChange={(e) => handlePollOptionChange(oIdx, e.target.value)}
                            placeholder={`Ballot option #${oIdx + 1}`}
                            className="flex-1 p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                            required={hasPoll && oIdx < 2}
                          />
                          {pollOptions.length > 2 && (
                            <button 
                              type="button" 
                              onClick={() => handleRemovePollOption(oIdx)}
                              className="text-xs text-rose-500 font-bold hover:text-rose-600 px-1"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => setShowCreateThreadPanel(false)}
                  className="px-4 py-2 border border-zinc-250 dark:border-zinc-750 hover:bg-zinc-50 rounded-xl"
                >
                  Clear Draft
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow"
                >
                  Launch Topic Now
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Explorer Rail (Grid horizontal list for desktop, clickable lists) */}
        {!selectedCategoryId && !searchQuery && (
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Core Forum Category Hubs</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 group-hover:text-indigo-500 text-zinc-650 dark:text-zinc-400 flex items-center justify-center transition">
                      <CategoryIcon name={cat.icon} className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white capitalize group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {cat.name}
                        </span>
                        <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-950 px-2 py-0.5 rounded text-zinc-500 dark:text-zinc-400 capitalize">
                          {cat.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-450 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                      <div className="flex gap-3 text-[10px] font-mono text-zinc-400 pt-1">
                        <span>💬 {cat.threadCount} threads</span>
                        <span>•</span>
                        <span>📝 {cat.postCount} posts</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thread List Table */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex justify-between items-center text-xs font-mono font-bold text-zinc-500">
            <span>DISCUSSIONS ({filteredThreads.length})</span>
            <div className="flex gap-4">
              <span className="hidden md:inline">VIEWS</span>
              <span className="hidden md:inline">REPLIES</span>
            </div>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-850">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-450 dark:text-zinc-400 space-y-2">
                <Search className="h-8 w-8 mx-auto text-zinc-350 dark:text-zinc-600" />
                <p className="font-semibold">No discussions matched your active filter tags.</p>
                <p className="text-xs max-w-sm mx-auto">Click "Clear Filters" or search another keywords to find roleplay tutorials or esports logs.</p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const author = allUsers.find(u => u.id === thread.authorId);
                const isSticky = thread.isSticky;
                const isLocked = thread.isLocked;

                return (
                  <div 
                    key={thread.id}
                    onClick={() => onSelectThread(thread.id)}
                    className="p-4 hover:bg-zinc-50/60 dark:hover:bg-zinc-950/40 cursor-pointer transition flex items-start gap-3.5 group"
                  >
                    {/* Prefix and Main Title area */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isSticky && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-rose-500/10 border border-rose-500/35 text-[9px] font-bold text-rose-600 dark:text-rose-450 rounded uppercase font-mono tracking-tight animate-pulse">
                            <Pin className="h-2 w-2" />
                            Pinned
                          </span>
                        )}
                        {thread.prefix && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                            thread.prefix.includes('News') || thread.prefix.includes('Changelog')
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : thread.prefix.includes('Guides')
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : thread.prefix.includes('Suggestions')
                                  ? 'bg-amber-500/10 text-amber-600'
                                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          }`}>
                            {thread.prefix}
                          </span>
                        )}
                        <span className="text-xs sm:text-sm font-semibold text-zinc-850 dark:text-zinc-50 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 truncate tracking-tight transition">
                          {thread.title}
                        </span>
                        {isLocked && (
                          <Lock className="h-3 w-3 text-zinc-400 self-center" />
                        )}
                      </div>

                      {/* Content Snippet */}
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 pr-6 pb-0.5 leading-relaxed font-sans">
                        {thread.content.replace(/[#*`[\]]/g, ' ')}
                      </p>

                      {/* Meta information tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px]">
                        <div className="flex items-center gap-1">
                          {author && (
                            <img src={author.avatar} alt={author.username} className="h-4.5 w-4.5 rounded-full object-cover border border-zinc-200 dark:border-zinc-800" />
                          )}
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium hover:underline">{author?.username}</span>
                        </div>
                        <span className="text-zinc-350 dark:text-zinc-650">•</span>
                        <div className="flex items-center gap-1 text-zinc-400 font-mono">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(thread.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                        {thread.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-150 text-zinc-500 font-mono px-1.5 py-0.2 rounded text-[9px] uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats columns */}
                    <div className="flex items-center gap-6 text-zinc-400 dark:text-zinc-550 shrink-0 font-mono text-[11px] self-center">
                      <div className="hidden md:flex flex-col items-center">
                        <span className="text-zinc-700 dark:text-zinc-200 font-bold">{thread.viewsCount}</span>
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">views</span>
                      </div>
                      <div className="flex flex-col items-center min-w-[35px]">
                        <span className="text-indigo-600 dark:text-indigo-450 font-bold">{thread.repliesCount}</span>
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">replies</span>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Server Nodes Active Grid (inspired by HZGaming) */}
        <div id="servers-grid-target" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">NEXUS ACTIVE NODE TILES</span>
              <h2 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">Active Gaming Servers Status</h2>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-tight">
              ● All Systems Functional
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-4 rounded-2xl space-y-3 shadow-sm hover:border-zinc-350 dark:hover:border-zinc-820 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Nexus GTA V Roleplay</h3>
                  <p className="text-[10px] text-zinc-400 font-mono">FIVEM • CITY CLANS NODE</p>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold">ONLINE</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Players Active</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-bold">128/150</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>Server Mod: Custom 5.0</span>
                <span className="underline cursor-pointer hover:text-indigo-505" onClick={() => safeSelectCategory('cat_gta_rp')}>View Section</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-4 rounded-2xl space-y-3 shadow-sm hover:border-zinc-350 dark:hover:border-zinc-820 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Nexus Survival Realms</h3>
                  <p className="text-[10px] text-zinc-400 font-mono">JAVA • MODDED RPG</p>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold">ONLINE</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Players Active</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-bold">42/100</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>Version: Java 1.20.4</span>
                <span className="underline cursor-pointer hover:text-indigo-505" onClick={() => safeSelectCategory('cat_minecraft')}>View Section</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-4 rounded-2xl space-y-3 shadow-sm hover:border-zinc-350 dark:hover:border-zinc-820 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Nexus Arena Esports</h3>
                  <p className="text-[10px] text-zinc-400 font-mono">TOURNAMENTS • FPS CORES</p>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 font-semibold">MATCHES</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Registered Squads</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-bold">16/24</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>Match: Apex Legends</span>
                <span className="underline cursor-pointer hover:text-indigo-505" onClick={() => safeSelectCategory('cat_guides')}>View Board</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right widgets panel */}
      <div className="space-y-6">

        {/* Global Clan Streaks Widget */}
        <div className="bg-gradient-to-tr from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white shadow-lg space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              Daily Streak Rewards
            </span>
            <span className="text-[9px] text-zinc-400 font-semibold">{currentUser.dailyStreak}d Active</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-100">Claim Daily Streak XP Bonus</h3>
            <p className="text-[10px] text-zinc-400">Maintain your daily login to multiply XP and credits! Next claim available in 4 hours.</p>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-400 h-full rounded-full" style={{ width: `${(currentUser.dailyStreak / 20) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-zinc-500">
              <span>Goal: 20 Days Streak</span>
              <span className="text-orange-400 font-bold">+500 XP Reward</span>
            </div>
          </div>
        </div>

        {/* Esports & Council Event Countdowns */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3.5 shadow-sm">
          <div>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Active Event Countdown</span>
            <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">Esports & City Deadlines</h3>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-150 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Esports Apex Cup Finals</span>
                  <span className="text-[9px] text-zinc-400 font-mono">Core-Clutch vs Team Apex</span>
                </div>
              </div>
              <span className="font-mono text-[10px] font-extrabold text-indigo-600 dark:text-indigo-450 bg-indigo-500/10 px-2 py-1 rounded">
                {countdowns.esports}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-150 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎫</span>
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">RP Whitelist Evaluation</span>
                  <span className="text-[9px] text-zinc-400 font-mono">By Community Managers</span>
                </div>
              </div>
              <span className="font-mono text-[10px] font-extrabold text-amber-600 bg-amber-500/10 px-2 py-1 rounded">
                {countdowns.whitelist}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-150 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Gang Tax Bracket adjustments</span>
                  <span className="text-[9px] text-zinc-400 font-mono">Economic council update</span>
                </div>
              </div>
              <span className="font-mono text-[10px] font-extrabold text-rose-600 bg-rose-500/10 px-2 py-1 rounded">
                {countdowns.gtaReset}
              </span>
            </div>
          </div>
        </div>

        {/* Top Players Sidebar Component */}
        <TopPlayersSidebar 
          allUsers={allUsers}
          onSelectUser={onSelectUser}
        />

        {/* Live Active Members List */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">ONLINE MEMBERS (5)</span>
            </div>
            <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-tight mt-0.5">Who is Currently Syncing</h3>
          </div>
          <div className="space-y-3">
            {allUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center gap-2.5">
                <div className="relative">
                  <img src={user.avatar} alt={user.username} className="h-7 w-7 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate">{user.username}</span>
                    <span className="text-[8px] font-mono font-semibold px-1 rounded-sm border bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 truncate scale-90">
                      {user.role.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[9px] text-zinc-400 truncate">{user.signature || 'No active signatures.'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>

  </div>
  );
}
