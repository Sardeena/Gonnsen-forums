/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, Star, Shield, Award, Sparkles, UserCheck } from 'lucide-react';
import { User } from '../types';
import { calculateUserRank } from '../utils';

interface TopPlayersSidebarProps {
  allUsers: User[];
  onSelectUser?: (user: User) => void;
}

export default function TopPlayersSidebar({ allUsers, onSelectUser }: TopPlayersSidebarProps) {
  const [sortBy, setSortBy] = useState<'xp' | 'rep'>('xp');

  // Sort and filter top 10 users
  const top10Users = [...allUsers]
    .sort((a, b) => {
      if (sortBy === 'rep') {
        const repDiff = (b.repPoints || 0) - (a.repPoints || 0);
        if (repDiff !== 0) return repDiff;
      }
      return b.xp - a.xp; // fall back to XP or sort by XP
    })
    .slice(0, 10);

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-150 dark:border-zinc-800/80">
        <div>
          <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5 text-amber-500 animate-bounce" />
            TOP PLAYERS
          </span>
          <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">Gonnsen Hall of Fame</h3>
        </div>
        
        {/* Sorting Toggles */}
        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200/55 dark:border-zinc-800">
          <button
            onClick={() => setSortBy('xp')}
            className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md transition ${sortBy === 'xp' ? 'bg-white dark:bg-zinc-800 text-indigo-650 dark:text-indigo-400 shadow-xs' : 'text-zinc-450 hover:text-zinc-700 dark:text-zinc-500'}`}
          >
            XP
          </button>
          <button
            onClick={() => setSortBy('rep')}
            className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md transition ${sortBy === 'rep' ? 'bg-white dark:bg-zinc-800 text-indigo-650 dark:text-indigo-400 shadow-xs' : 'text-zinc-450 hover:text-zinc-700 dark:text-zinc-500'}`}
          >
            REP
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
        {top10Users.map((user, index) => {
          const userRank = calculateUserRank(user.xp, user.postsCount);
          
          let rankColor = "text-zinc-400 dark:text-zinc-650";
          let rankBg = "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-850";
          let rankIcon = null;

          if (index === 0) {
            rankColor = "text-amber-500 font-extrabold";
            rankBg = "bg-amber-500/10 border-2 border-amber-500/30 text-amber-600 dark:text-amber-400";
            rankIcon = "👑";
          } else if (index === 1) {
            rankColor = "text-zinc-500 dark:text-zinc-300 font-bold";
            rankBg = "bg-zinc-500/10 border border-zinc-500/30 text-zinc-650 dark:text-zinc-350";
            rankIcon = "🥈";
          } else if (index === 2) {
            rankColor = "text-orange-500 dark:text-orange-400 font-bold";
            rankBg = "bg-orange-500/10 border border-orange-500/20 text-orange-650 dark:text-orange-400";
            rankIcon = "🥉";
          }

          const isPodium = index < 3;

          return (
            <div 
              key={user.id} 
              onClick={() => onSelectUser && onSelectUser(user)}
              className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 ${isPodium ? 'bg-zinc-50/30 dark:bg-zinc-900/10' : ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Ranking Emblem */}
                <div className={`h-6 w-6 rounded-lg font-mono font-black text-xs flex items-center justify-center shrink-0 ${rankBg}`}>
                  {rankIcon ? rankIcon : index + 1}
                </div>

                <div className="relative shrink-0">
                  <img src={user.avatar} alt={user.username} className="h-8 w-8 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800" />
                  {index === 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] border border-white dark:border-zinc-950">
                      ★
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-sans font-bold text-zinc-800 dark:text-zinc-200 text-xs truncate max-w-[100px]" title={user.username}>
                      {user.username}
                    </span>
                    {user.role === 'Owner' && <Award className="h-3 w-3 text-red-500 shrink-0" title="Community Owner" />}
                  </div>
                  
                  {/* Dynamic Rank Small Label */}
                  <span className={`text-[8.5px] uppercase font-mono font-bold tracking-tight block max-w-[110px] truncate ${userRank.color}`}>
                    {userRank.title}
                  </span>
                </div>
              </div>

              {/* Stats Value Block */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span>{user.xp.toLocaleString()}</span>
                  <span className="text-[8px] font-medium text-zinc-455 dark:text-zinc-500">XP</span>
                </div>
                <div className="flex items-center gap-0.5 justify-end font-mono text-[9px] text-zinc-500 dark:text-zinc-400">
                  <Star className="h-2.5 w-2.5 text-amber-500 shrink-0 fill-amber-500/20" />
                  <span className="font-bold">{user.repPoints || 0}</span>
                  <span className="text-[7.5px] text-zinc-400">REP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
