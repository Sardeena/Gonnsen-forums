/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Search, 
  User as UserIcon, 
  LogOut, 
  Coins, 
  Shield, 
  Users, 
  Menu, 
  X,
  Compass,
  Tv,
  Crown
} from 'lucide-react';
import { User, Notification } from '../types';

interface NavigationProps {
  currentUser: User;
  allUsers: User[];
  notifications: Notification[];
  onSelectUser: (user: User) => void;
  onSetView: (view: string) => void;
  currentView: string;
  onMarkNotificationsRead: () => void;
  onSearch: (query: string) => void;
}

export default function Navigation({
  currentUser,
  allUsers,
  notifications,
  onSelectUser,
  onSetView,
  currentView,
  onMarkNotificationsRead,
  onSearch
}: NavigationProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationTray, setShowNotificationTray] = useState(false);
  const [showSimSwitcher, setShowSimSwitcher] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onSetView('search');
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-zinc-200 dark:border-zinc-805 bg-white/95 dark:bg-zinc-950/95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* GTA:SA SA-MP Styled Logo & Brand Name */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none" 
            onClick={() => { onSetView('forums'); setMobileMenuOpen(false); }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-amber-500 shadow-md">
              <span className="text-amber-500 text-lg font-black animate-pulse">★</span>
            </div>
            <div className="flex flex-col">
              <span 
                className="text-lg font-black tracking-wide text-zinc-900 dark:text-zinc-50 uppercase leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" 
                style={{ fontFamily: 'Impact, sans-serif' }}
              >
                Gonnsen Territory
              </span>
              <span className="text-[9.5px] font-bold tracking-[0.16em] text-amber-500 uppercase leading-none mt-1">
                RolePlay Community
              </span>
            </div>
          </div>

          {/* Center Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm mx-6 relative">
            <input
              type="text"
              placeholder="Search forums, player auctions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-zinc-100 dark:bg-zinc-900 border border-transparent rounded-lg text-xs outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-950 text-zinc-850 dark:text-zinc-100 transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <button type="submit" className="hidden" />
          </form>

          {/* Desktop Right items */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Active Character Selector (Simple words for Sim Switcher) */}
            <button 
              onClick={() => setShowSimSwitcher(!showSimSwitcher)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold hover:bg-amber-500/20 transition cursor-pointer"
              title="Change your simulated character to test staff permissions"
            >
              <Users className="h-3.5 w-3.5" />
              Character: {currentUser.username}
            </button>

            {/* In-game Cash Indicator (Simpler labels) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-mono font-bold" title="Your live game money">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              <span>{currentUser.coins} GTRP$</span>
            </div>

            {/* Direct Messages Shortcut */}
            <button 
              onClick={() => { onSetView('dms'); }}
              className={`p-2 rounded-lg relative cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors ${currentView === 'dms' ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-650 dark:text-zinc-400'}`}
              title="Private Messages"
            >
              <MessageSquare className="h-5 w-5" />
            </button>

            {/* Notifications Alert Bell */}
            <div className="relative border-r border-zinc-200 dark:border-zinc-800 pr-2">
              <button 
                onClick={() => {
                  setShowNotificationTray(!showNotificationTray);
                  if (!showNotificationTray && unreadNotifications.length > 0) {
                    onMarkNotificationsRead();
                  }
                }}
                className={`p-2 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors ${showNotificationTray ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-650 dark:text-zinc-400'}`}
                title="My Alerts"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-red-600 text-[9px] font-black text-white flex items-center justify-center animate-bounce">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification Box */}
              {showNotificationTray && (
                <div id="notification-popover" className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-90 shadow-xl overflow-hidden z-50">
                  <div className="p-3 border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">MY NOTIFICATIONS</span>
                    {unreadNotifications.length > 0 && (
                      <span className="text-[10px] uppercase font-bold text-amber-500 font-mono font-black">NEW ACTIVITY</span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
                        No recent updates.
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const sender = allUsers.find(u => u.id === n.senderId);
                        return (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              setShowNotificationTray(false);
                              if (n.targetType === 'thread') onSetView('forums');
                              else if (n.targetType === 'conversation') onSetView('dms');
                              else if (n.targetType === 'app') onSetView('apps');
                            }}
                            className={`p-3 text-xs cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition ${!n.isRead ? 'bg-amber-500/5' : ''}`}
                          >
                            <div className="flex gap-2">
                              {sender && (
                                <img src={sender.avatar} alt={sender.username} className="h-6 w-6 rounded-full border object-cover" />
                              )}
                              <div className="flex-1">
                                <p className="text-zinc-700 dark:text-zinc-300">
                                  {n.text}
                                </p>
                                <span className="text-[9px] text-zinc-400 block mt-1 font-mono">
                                  {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Options and Avatar */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.username} 
                  className="h-9 w-9 rounded-xl border-2 border-amber-500/50 object-cover"
                />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-90 shadow-xl overflow-hidden z-50">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950 text-xs border-b border-zinc-150 dark:border-zinc-800">
                    <div className="font-bold text-zinc-800 dark:text-zinc-200">{currentUser.username}</div>
                    <div className="text-[10px] font-mono text-amber-500 font-bold mt-0.5">{currentUser.role}</div>
                  </div>
                  <div className="p-1.5">
                    
                    {/* Simplified Labels */}
                    <button 
                      onClick={() => { onSetView('profile'); setShowProfileDropdown(false); }} 
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-zinc-700 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition cursor-pointer"
                    >
                      <UserIcon className="h-4 w-4 text-zinc-400" />
                      My Character Profile
                    </button>

                    {/* Highly Requested Admin Dashboard Path */}
                    {['Owner', 'Administrator', 'Senior Administrator'].includes(currentUser.role) && (
                      <button 
                        onClick={() => { onSetView('admin'); setShowProfileDropdown(false); }} 
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-100/10 hover:text-amber-700 text-left transition font-black cursor-pointer"
                      >
                        <Crown className="h-4 w-4" />
                        Admin Dashboard
                      </button>
                    )}

                    {['Owner', 'Administrator', 'Senior Administrator', 'Moderator', 'Community Manager'].includes(currentUser.role) && (
                      <button 
                        onClick={() => { onSetView('modconsole'); setShowProfileDropdown(false); }} 
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-105/10 hover:text-blue-500 text-left transition font-bold cursor-pointer font-mono"
                      >
                        <Shield className="h-4 w-4" />
                        Moderator Panel
                      </button>
                    )}

                    <button 
                      onClick={() => { onSetView('logout_modal'); setShowProfileDropdown(false); }} 
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50/10 text-left transition font-bold cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 animate-pulse" />
                      Exit Forums (Log Out)
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Core Mobile menu triggers */}
          <div className="flex lg:hidden items-center gap-2">
            <button 
              onClick={() => setShowSimSwitcher(!showSimSwitcher)}
              className="px-2 py-1 border border-amber-500/30 bg-amber-500/5 text-amber-500 rounded text-[10px] font-mono font-bold"
            >
              Char: {currentUser.username.split('_')[0]}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-650 dark:text-zinc-400 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Profile/Role simulation switcher popover */}
      {showSimSwitcher && (
        <div className="fixed inset-x-0 top-16 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-500/20 p-4 transition-all z-50 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-450 font-mono uppercase tracking-wide">Select Active Character Profile</p>
              <p className="text-[11px] text-amber-600 dark:text-amber-500">Change your logged-in character perspective to instantly test forums, whitelist candidate panels vs full helper dashboards.</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2 sm:mt-0">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u);
                    setShowSimSwitcher(false);
                  }}
                  className={`px-2.5 py-1.5 rounded text-xs font-bold border transition font-mono cursor-pointer ${currentUser.id === u.id ? 'bg-amber-500 border-amber-600 text-zinc-950' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-750 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-805'}`}
                >
                  <span className="text-[9px] opacity-75 mr-1 bg-black/5 px-1 rounded">{u.role}</span>
                  {u.username}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Responsive Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-1">
          <form onSubmit={handleSearchSubmit} className="relative py-2">
            <input
              type="text"
              placeholder="Search forums, player auctions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-zinc-100 dark:bg-zinc-900 border border-transparent rounded-lg text-xs outline-none focus:border-amber-500 text-zinc-850 dark:text-zinc-100"
            />
            <Search className="absolute left-3 top-4.5 h-4 w-4 text-zinc-400" />
            <button type="submit" className="hidden" />
          </form>

          <button 
            onClick={() => { onSetView('forums'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg font-bold text-left ${currentView === 'forums' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
          >
            <Compass className="h-4 w-4 text-zinc-400" />
            General Forums & Boards
          </button>
          
          <button 
            onClick={() => { onSetView('marketplace'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg font-bold text-left ${currentView === 'marketplace' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
          >
            <Coins className="h-4 w-4 text-zinc-400" />
            Member Shop & Auction
          </button>

          <button 
            onClick={() => { onSetView('apps'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg font-bold text-left ${currentView === 'apps' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
          >
            <Tv className="h-4 w-4 text-zinc-400" />
            Applications (Admin, Whitelist)
          </button>

          <button 
            onClick={() => { onSetView('dms'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg font-bold text-left ${currentView === 'dms' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
          >
            <MessageSquare className="h-4 w-4 text-zinc-400" />
            Private Messages
          </button>

          <button 
            onClick={() => { onSetView('profile'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg font-bold text-left ${currentView === 'profile' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
          >
            <UserIcon className="h-4 w-4 text-zinc-400" />
            My Character Profile
          </button>

          {/* Mobile Admin Path */}
          {['Owner', 'Administrator', 'Senior Administrator'].includes(currentUser.role) && (
            <button 
              onClick={() => { onSetView('admin'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg font-bold text-left text-amber-600 dark:text-amber-400`}
            >
              <Crown className="h-4 w-4" />
              Admin Dashboard
            </button>
          )}

          {['Owner', 'Administrator', 'Senior Administrator', 'Moderator'].includes(currentUser.role) && (
            <button 
              onClick={() => { onSetView('modconsole'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg font-bold text-left text-blue-500`}
            >
              <Shield className="h-4 w-4" />
              Moderator Panel
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
