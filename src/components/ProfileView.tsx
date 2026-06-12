/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Award, 
  Gamepad, 
  Flame, 
  Coins, 
  Github, 
  Twitch, 
  Edit3, 
  Save, 
  Trophy, 
  Calendar, 
  Layers, 
  ChevronRight,
  Shield,
  Chrome,
  Users
} from 'lucide-react';
import { User, Achievement } from '../types';
import { calculateUserRank } from '../utils';

interface ProfileViewProps {
  currentUser: User;
  onUpdateProfile: (updated: Partial<User>) => void;
  allAchievements: Achievement[];
}

export default function ProfileView({
  currentUser,
  onUpdateProfile,
  allAchievements
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(currentUser.bio);
  const [signature, setSignature] = useState(currentUser.signature);
  const [coverPhoto, setCoverPhoto] = useState(currentUser.coverPhoto);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [selectedTitle, setSelectedTitle] = useState(currentUser.title);

  // Linked ids
  const [discord, setDiscord] = useState(currentUser.socialLinks?.discord || '');
  const [steam, setSteam] = useState(currentUser.socialLinks?.steam || '');
  const [twitch, setTwitch] = useState(currentUser.socialLinks?.twitch || '');

  const availableTitles = [
    'Nexus Pioneer',
    'Rookie Builder',
    'Sharpshooter',
    'Elite Warrior',
    'Roleplay Kingpin',
    'Market Legend',
    'Trophy Collector'
  ];

  const avatarOptions = [
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=80'
  ];

  const handleSaveProfile = () => {
    onUpdateProfile({
      bio,
      signature,
      coverPhoto,
      avatar,
      title: selectedTitle,
      socialLinks: {
        discord,
        steam,
        twitch
      }
    });
    setIsEditing(false);
    alert('Unified Gaming Identity updated successfully across all partner servers!');
  };

  // Level XP maths
  const xpBasis = 5000;
  const xpNeeded = currentUser.level * 1050;
  const xpPercentage = Math.round((currentUser.xp / (currentUser.xp + xpNeeded)) * 100);

  const userRank = calculateUserRank(currentUser.xp, currentUser.postsCount);

  return (
    <div className="space-y-6">
      
      {/* Profile Cover Photo Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-805 shadow-md bg-zinc-950">
        <div className="h-44 md:h-56 relative">
          <img src={coverPhoto} alt="profile banner" className="w-full h-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/40 to-transparent" />
        </div>

        {/* User absolute info block */}
        <div className="relative z-10 p-5 md:p-6 -mt-16 md:-mt-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
            <img 
              src={avatar} 
              alt={currentUser.username} 
              className="h-24 w-24 md:h-28 md:w-28 rounded-2xl object-cover border-4 border-zinc-950 bg-zinc-900 shadow-xl" 
            />
            
            <div className="space-y-1.5 pt-2">
              <div className="flex flex-wrap items-center gap-1.5 justify-center md:justify-start">
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider font-mono ${currentUser.badgeColor}`}>
                  {currentUser.role}
                </span>
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider font-mono border ${userRank.badgeBg}`}>
                  {userRank.title}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight font-sans">
                {currentUser.username}
              </h1>
              <p className="text-xs text-indigo-350 font-mono font-bold flex items-center md:justify-start justify-center gap-1">
                <Shield className="h-4 w-4 text-indigo-400" />
                {currentUser.title || 'Nexus Overlord'}
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto self-center md:self-end">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full md:w-auto px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Edit3 className="h-4 w-4" />
                Customize ID Banner
              </button>
            ) : (
              <button 
                onClick={handleSaveProfile}
                className="w-full md:w-auto px-4 py-2 bg-gradient-to-tr from-indigo-650 to-violet-650 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Save className="h-4 w-4" />
                Save Identity Modifications
              </button>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="bg-white dark:bg-zinc-900 border-2 border-indigo-505 border-indigo-500/20 rounded-2xl p-5 space-y-4 shadow-xl">
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Identity customization editor</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase font-black">Customize In-game Title</label>
              <select 
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="w-full mt-1.5 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-lg outline-none"
              >
                {availableTitles.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 uppercase font-black">Choose Presets Avatar</label>
              <div className="flex gap-2 mt-2">
                {avatarOptions.map((av, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`h-10 w-10 rounded-lg overflow-hidden border-2 transition ${avatar === av ? 'border-indigo-500' : 'border-transparent hover:border-zinc-350'}`}
                  >
                    <img src={av} alt="option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] text-zinc-500 uppercase font-black">Custom Header Cover URL (Unsplash/Direct image)</label>
              <input 
                type="text" 
                value={coverPhoto}
                onChange={(e) => setCoverPhoto(e.target.value)}
                className="w-full mt-1.5 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-lg text-xs" 
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase block">Personal Bio</label>
              <textarea 
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-900 border rounded-lg text-xs" 
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase block">Forums Post Signature line</label>
              <textarea 
                rows={3}
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-900 border rounded-lg text-xs" 
              />
            </div>
          </div>

          <div className="border-t border-zinc-150 pt-4 space-y-3.5">
            <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Linked Gaming Networks Handles</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="text-zinc-500">Discord handle</label>
                <input type="text" value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="Username#0000" className="w-full mt-1.5 p-2 bg-zinc-50 dark:bg-zinc-95k border border-zinc-200 rounded-lg" />
              </div>
              <div>
                <label className="text-zinc-500">Steam profile ID</label>
                <input type="text" value={steam} onChange={(e) => setSteam(e.target.value)} placeholder="steam_gamer_id" className="w-full mt-1.5 p-2 bg-zinc-50 dark:bg-zinc-95k border border-zinc-200 rounded-lg" />
              </div>
              <div>
                <label className="text-zinc-500">Twitch stream ID</label>
                <input type="text" value={twitch} onChange={(e) => setTwitch(e.target.value)} placeholder="twitch_streamer" className="w-full mt-1.5 p-2 bg-zinc-50 dark:bg-zinc-95k border border-zinc-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Overview Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column (XP PROGRESSION & GAMING ACCOUNTS) */}
        <div className="space-y-6 md:col-span-1">
          
          {/* XP PROGRESS CARD */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-190 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase font-mono text-zinc-400">Level Progression</span>
              <span className="text-indigo-605 text-indigo-600 dark:text-indigo-400 font-mono font-extrabold bg-indigo-500/10 px-2 py-0.5 rounded">LVL {currentUser.level}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span>XP earned:</span>
                <span className="text-zinc-900 dark:text-white font-bold">{currentUser.xp} XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200/50 dark:border-zinc-800">
                <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full" style={{ width: `${xpPercentage}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>{xpNeeded} XP to level {currentUser.level + 1}</span>
                <span>{xpPercentage}% completed</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-150 dark:border-zinc-850 space-y-2.5 text-xs text-zinc-650 dark:text-zinc-350 font-mono">
              <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/45 p-2 rounded-xl border border-zinc-150 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Dynamic Rank</span>
                <span className={`text-xs font-bold ${userRank.color}`}>{userRank.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Discussions written:</span>
                <span className="font-bold">{currentUser.postsCount} posts</span>
              </div>
              <div className="flex justify-between">
                <span>Reputation:</span>
                <span className="text-indigo-605 font-bold">+{currentUser.repPoints} RP</span>
              </div>
              <div className="flex justify-between">
                <span>Trophies Unlocked:</span>
                <span className="text-amber-500 font-bold">{currentUser.achievements.length} badges</span>
              </div>
            </div>
          </div>

          {/* LINKED GAMING ACCOUNTS */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-190 dark:border-zinc-850 p-5 rounded-2xl shadow-sm space-y-3.5">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Linked partner accounts</span>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2 bg-zinc-50 dark:bg-zinc-900/60 border rounded-xl">
                <div className="flex items-center gap-2">
                  <Chrome className="h-4.5 w-4.5 text-indigo-405 text-indigo-500" />
                  <span className="font-semibold text-zinc-650">Discord</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-500">{discord || '@not_linked'}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 bg-zinc-50 dark:bg-zinc-900/60 border rounded-xl">
                <div className="flex items-center gap-2">
                  <Gamepad className="h-4.5 w-4.5 text-zinc-650" />
                  <span className="font-semibold text-zinc-650">Steam ID</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-500">{steam || '@not_linked'}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 bg-zinc-50 dark:bg-zinc-900/60 border rounded-xl">
                <div className="flex items-center gap-2">
                  <Twitch className="h-4.5 w-4.5 text-purple-500" />
                  <span className="font-semibold text-zinc-655">Twitch TV</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-500">{twitch || '@not_linked'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns (BIO, ACHIEVEMENTS, REPUTATION LOGS) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* USER BIO CARD */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-190 dark:border-zinc-805 p-5 rounded-2xl shadow-sm space-y-4">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Character Biography</span>
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                {currentUser.bio || 'This pioneer has not documented their background bio yet. Customize your bio using the customization tools.'}
              </p>
              {currentUser.signature && (
                <div className="pt-3 border-t border-zinc-150 border-dashed">
                  <span className="text-[9px] font-mono text-zinc-405 block font-bold uppercase">Forum Signature Line</span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">"{currentUser.signature}"</p>
                </div>
              )}
            </div>
          </div>

          {/* UNLOCKED TROPHY SHELF */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-190 dark:border-zinc-805 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-150 dark:border-zinc-800">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">Unified Achieved Badge Wall ({currentUser.achievements.length})</span>
              <Trophy className="h-4.5 w-4.5 text-amber-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentUser.achievements.length === 0 ? (
                <p className="text-xs text-zinc-450 dark:text-zinc-500 col-span-full text-center">No achievements unlocked yet on connected servers.</p>
              ) : (
                currentUser.achievements.map((ach) => (
                  <div key={ach.id} className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-xl space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{ach.icon}</span>
                      <div>
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 block">{ach.name}</span>
                        <span className="text-[9px] text-zinc-400 font-mono">Unlocked {ach.dateUnlocked}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-450 leading-tight">
                      {ach.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
