/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Settings, 
  Map, 
  Users, 
  FolderPlus, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Activity, 
  Coins, 
  UserX, 
  Crown, 
  HelpCircle,
  Megaphone,
  Gamepad2,
  Lock,
  Unlock
} from 'lucide-react';
import { User, ForumCategory, AuditLog } from '../types';

interface AdminDashboardProps {
  categories: ForumCategory[];
  allUsers: User[];
  currentUser: User;
  onAddCategory: (category: ForumCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onUpdateUser: (userId: string, updated: Partial<User>) => void;
  onAddAuditLog: (log: Partial<AuditLog>) => void;
}

interface TurfSector {
  id: string;
  name: string;
  owner: 'Grove Street Families' | 'Ballas' | 'Los Santos Vagos' | 'LSPD Patrol' | 'Neutral';
  color: string;
  troops: number;
}

export default function AdminDashboard({
  categories,
  allUsers,
  currentUser,
  onAddCategory,
  onDeleteCategory,
  onUpdateUser,
  onAddAuditLog
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'turfs' | 'players' | 'boards'>('settings');

  // Server Settings local state (simulated)
  const [serverName, setServerName] = useState('Gonnsen Territory RolePlay #1');
  const [serverIp, setServerIp] = useState('gtr.gonnsen-rp.com:7777');
  const [maxPlayers, setMaxPlayers] = useState(500);
  const [activePlayers, setActivePlayers] = useState(142);
  const [whitelistMode, setWhitelistMode] = useState(true);
  const [lockServer, setLockServer] = useState(false);

  // Turf War state
  const [turfSectors, setTurfSectors] = useState<TurfSector[]>([
    { id: 't_ganton', name: 'Ganton Circle (Grove Street)', owner: 'Grove Street Families', color: 'bg-emerald-650 dark:bg-emerald-600 border-emerald-500 text-emerald-100', troops: 45 },
    { id: 't_idlewood', name: 'Idlewood Pizza Area', owner: 'Ballas', color: 'bg-purple-650 dark:bg-purple-600 border-purple-500 text-purple-100', troops: 35 },
    { id: 't_glenpark', name: 'Glen Park Lake & Mansion', owner: 'Ballas', color: 'bg-purple-650 dark:bg-purple-600 border-purple-500 text-purple-100', troops: 28 },
    { id: 't_vagos', name: 'East Los Santos (Vagos)', owner: 'Los Santos Vagos', color: 'bg-yellow-600 dark:bg-yellow-500 border-yellow-400 text-yellow-950', troops: 30 },
    { id: 't_pershing', name: 'Pershing Square (LSPD HQ)', owner: 'LSPD Patrol', color: 'bg-blue-600 dark:bg-blue-500 border-blue-400 text-blue-100', troops: 50 },
    { id: 't_beach', name: 'Santa Maria Beach Bar', owner: 'Neutral', color: 'bg-zinc-700 dark:bg-zinc-800 border-zinc-600 text-zinc-200', troops: 10 },
    { id: 't_temple', name: 'Temple & Vinewood Hills', owner: 'Neutral', color: 'bg-zinc-700 dark:bg-zinc-800 border-zinc-600 text-zinc-200', troops: 5 }
  ]);
  const [selectedTurfId, setSelectedTurfId] = useState<string | null>(null);

  // Player account edits state
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [editRole, setEditRole] = useState<string>('');
  const [coinAdjustment, setCoinAdjustment] = useState<number>(100);
  const [editWarningPoints, setEditWarningPoints] = useState<number>(0);

  // Forum Boards Manager state
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [newBoardType, setNewBoardType] = useState<'announcements' | 'general' | 'guides' | 'servers' | 'offtopic'>('general');

  const handleUpdateServerSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Server configurations applied successfully to Gonnsen database!');
    onAddAuditLog({
      actorId: currentUser.id,
      action: 'ADMIN_SETTING',
      target: 'Server Host Properties',
      timestamp: new Date().toISOString(),
      details: `Changed server properties: IP ${serverIp}, Whitelist: ${whitelistMode ? 'ON' : 'OFF'}, Lock: ${lockServer ? 'ON' : 'OFF'}`
    });
  };

  const handleChangeTurfOwner = (turfId: string, newOwner: TurfSector['owner']) => {
    const nextSectors = turfSectors.map(s => {
      if (s.id === turfId) {
        let color = '';
        if (newOwner === 'Grove Street Families') color = 'bg-emerald-650 dark:bg-emerald-600 border-emerald-500 text-emerald-100';
        else if (newOwner === 'Ballas') color = 'bg-purple-650 dark:bg-purple-600 border-purple-500 text-purple-100';
        else if (newOwner === 'Los Santos Vagos') color = 'bg-yellow-600 dark:bg-yellow-500 border-yellow-400 text-yellow-950';
        else if (newOwner === 'LSPD Patrol') color = 'bg-blue-600 dark:bg-blue-500 border-blue-400 text-blue-100';
        else color = 'bg-zinc-700 dark:bg-zinc-805 border-zinc-600 text-zinc-200';

        return { ...s, owner: newOwner, color };
      }
      return s;
    });

    setTurfSectors(nextSectors);
    alert(`Turf Owner of "${turfSectors.find(t => t.id === turfId)?.name}" changed to ${newOwner}!`);
    onAddAuditLog({
      actorId: currentUser.id,
      action: 'ADMIN_TURF_REASSIGN',
      target: turfSectors.find(t => t.id === turfId)?.name || 'Los Santos Turf',
      timestamp: new Date().toISOString(),
      details: `Reassigned gang territory owner to "${newOwner}"`
    });
  };

  const handlePlayerEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId) {
      alert('Please select a player to manage.');
      return;
    }

    const player = allUsers.find(u => u.id === selectedPlayerId);
    if (!player) return;

    if (player.role === 'Owner' && currentUser.role !== 'Owner') {
      alert('You cannot edit the main Server Owner.');
      return;
    }

    const updatedData: Partial<User> = {};
    if (editRole) {
      updatedData.role = editRole as any;
    }
    updatedData.coins = Math.max(0, player.coins + coinAdjustment);

    // Apply warn changes (mock update, we'll store points in bio or stats)
    onUpdateUser(selectedPlayerId, updatedData);

    alert(`Player "${player.username}" account updated successfully!`);
    onAddAuditLog({
      actorId: currentUser.id,
      action: 'ADMIN_PLAYER_EDIT',
      target: player.username,
      timestamp: new Date().toISOString(),
      details: `Aadjusted player profile: New role "${editRole || 'Unchanged'}", Added ${coinAdjustment} coins.`
    });

    // Reset fields
    setCoinAdjustment(100);
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim() || !newBoardDesc.trim()) return;

    const newCategory: ForumCategory = {
      id: `cat_admin_${Date.now()}`,
      name: newBoardName,
      description: newBoardDesc,
      icon: newBoardType === 'announcements' ? 'Megaphone' : 'MessageSquare',
      type: newBoardType,
      threadCount: 0,
      postCount: 0
    };

    onAddCategory(newCategory);
    setNewBoardName('');
    setNewBoardDesc('');
    alert(`New forum board "${newBoardName}" has been successfully added!`);
    
    onAddAuditLog({
      actorId: currentUser.id,
      action: 'ADMIN_BOARD_CREATE',
      target: newBoardName,
      timestamp: new Date().toISOString(),
      details: `Created new discussion board: "${newBoardName}" under category "${newBoardType}"`
    });
  };

  const handleDeleteBoardClick = (catId: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to delete the forum board "${name}"? This action cannot be undone.`)) {
      onDeleteCategory(catId);
      alert('Forum board removed successfully.');
      onAddAuditLog({
        actorId: currentUser.id,
        action: 'ADMIN_BOARD_DELETE',
        target: name,
        timestamp: new Date().toISOString(),
        details: `Deleted forum board: "${name}"`
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Panel Header Banner in GTA:SA styling */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-zinc-900 border-2 border-amber-500 rounded-2xl p-6 shadow-[0_4px_12px_rgba(243,156,18,0.15)] text-white">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500 text-zinc-950 font-mono text-[9px] font-black uppercase tracking-wider">
            ★ GTRP Staff Panel ★
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-zinc-50 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Impact, sans-serif' }}>
            <Crown className="h-6 w-6 text-amber-500" />
            Gonnsen Administration HQ
          </h1>
          <p className="text-xs text-zinc-300 max-w-2xl">
            Welcome, Head Administrator. Use these boards to manage the server live state, reassign gang land territories, tweak player profile roles, adjust cash (GTRP Coins), and manage open discussions.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-1 bg-zinc-950 p-1 border border-zinc-700 rounded-xl font-mono text-xs">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition ${activeTab === 'settings' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <Settings className="h-3.5 w-3.5" />
            Server Settings
          </button>
          <button 
            onClick={() => setActiveTab('turfs')}
            className={`px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition ${activeTab === 'turfs' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <Map className="h-3.5 w-3.5" />
            Gang Territories ({turfSectors.filter(s => s.owner !== 'Neutral').length})
          </button>
          <button 
            onClick={() => setActiveTab('players')}
            className={`px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition ${activeTab === 'players' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <Users className="h-3.5 w-3.5" />
            Player Manager
          </button>
          <button 
            onClick={() => setActiveTab('boards')}
            className={`px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition ${activeTab === 'boards' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <FolderPlus className="h-3.5 w-3.5" />
            Boards Manager ({categories.length})
          </button>
        </div>
      </div>

      {/* 1. SERVER SETTINGS VIEW */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Settings editing panel */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-amber-500 uppercase flex items-center gap-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <Settings className="h-4.5 w-4.5" />
              Configure Server Variables
            </h3>

            <form onSubmit={handleUpdateServerSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-zinc-500">Live Server Name</label>
                <input 
                  type="text" 
                  value={serverName} 
                  onChange={(e) => setServerName(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none" 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-500">Connection IP Address</label>
                <input 
                  type="text" 
                  value={serverIp} 
                  onChange={(e) => setServerIp(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none" 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-500">Maximum Players Cap</label>
                <input 
                  type="number" 
                  value={maxPlayers} 
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none" 
                  min={50}
                  max={1000}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-500">Simulate Active Players Online</label>
                <input 
                  type="number" 
                  value={activePlayers} 
                  onChange={(e) => setActivePlayers(Number(e.target.value))}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none" 
                  min={0}
                  max={maxPlayers}
                  required
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl md:col-span-2">
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-200 block">Required Approved Whitelist Profile</span>
                  <span className="text-[10px] text-zinc-400">Players must have an approved whitelist application before connecting.</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setWhitelistMode(!whitelistMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${whitelistMode ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-600 border border-rose-500/30'}`}
                >
                  {whitelistMode ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  {whitelistMode ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl md:col-span-2">
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-200 block">Lock Server Connection Sessions</span>
                  <span className="text-[10px] text-zinc-400">Block all new accounts from joining for offline maintenance.</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setLockServer(!lockServer)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${lockServer ? 'bg-rose-600 text-white' : 'bg-zinc-200 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300'}`}
                >
                  {lockServer ? 'Banned Entry' : 'Open Entry'}
                </button>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-650 hover:bg-amber-600 text-zinc-950 font-black rounded-xl md:col-span-2 transition cursor-pointer font-bold tracking-tight uppercase"
              >
                Save Server Changes
              </button>
            </form>
          </div>

          {/* Quick Stats Panel */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-405 dark:text-zinc-400 uppercase tracking-widest block pl-1">Live Host Information</h3>
            
            <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-5 text-white space-y-4 shadow-sm font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 block">GONNSEN SERVER STATE</span>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full animate-ping ${lockServer ? 'bg-rose-550' : 'bg-emerald-500'}`} />
                  <span className={`font-black uppercase tracking-wider text-sm ${lockServer ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {lockServer ? 'Server Locked' : 'Online & Active'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-3">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-500 block">Online Cap</span>
                  <p className="text-lg font-black text-amber-500">{activePlayers} / {maxPlayers}</p>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-500 block">Whitelist Mode</span>
                  <p className="text-lg font-black text-zinc-100">{whitelistMode ? 'Active' : 'Free Join'}</p>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[10px] text-zinc-500 block">PAWN SCRIPT REVISION</span>
                <div className="flex justify-between font-bold text-[11px]">
                  <span className="text-zinc-400">Main Core Scripts</span>
                  <span className="text-amber-500">v2.5.21 SQL</span>
                </div>
                <div className="flex justify-between font-bold text-[11px]">
                  <span className="text-zinc-400">Database Engine</span>
                  <span className="text-emerald-500">Local SQLite DB</span>
                </div>
                <div className="flex justify-between font-bold text-[11px]">
                  <span className="text-zinc-400">Active Factions</span>
                  <span className="text-blue-400">5 Registered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GANG TERRITORIES VIEW */}
      {activeTab === 'turfs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Map simulation */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-xs font-mono font-bold text-amber-500 uppercase flex items-center gap-1.5">
                <Map className="h-4.5 w-4.5" />
                Los Santos Faction Warfare Turf Map
              </h3>
              <span className="text-[10px] bg-red-500/15 text-red-650 px-2 py-0.5 rounded font-mono font-bold">LIVE TURF RADAR</span>
            </div>

            <p className="text-xs text-zinc-500 font-mono">
              Click on any sector below to view its statistics or to reassign its turf landlord.
            </p>

            {/* Tactical Grid map showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono text-xs">
              {turfSectors.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => setSelectedTurfId(s.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer hover:scale-[1.01] transition-all flex flex-col justify-between h-28 h-28 relative overflow-hidden ${s.color} ${selectedTurfId === s.id ? 'ring-2 ring-amber-500 scale-[1.01]' : ''}`}
                >
                  <div>
                    <span className="text-[9px] bg-black/20 px-1.5 py-0.5 rounded font-bold">SECTOR DETAILS</span>
                    <h4 className="font-bold text-sm mt-1">{s.name}</h4>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="block text-[8px] uppercase opacity-75">Owner</span>
                      <span className="font-black text-xs">{s.owner}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] uppercase opacity-75">Troops</span>
                      <span className="font-bold">{s.troops} Soldiers</span>
                    </div>
                  </div>

                  {/* Aesthetic Background Watermark icon */}
                  <span className="absolute right-2 top-2 text-6xl opacity-[0.05] pointer-events-none select-none font-black font-mono">★</span>
                </div>
              ))}
            </div>
          </div>

          {/* Turf adjustments sidebar */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-405 dark:text-zinc-400 tracking-widest uppercase pl-1 block">Turf Sector Control</h3>
            
            {selectedTurfId ? (
              (() => {
                const s = turfSectors.find(t => t.id === selectedTurfId);
                if (!s) return null;
                return (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 font-mono text-xs">
                    <div className="space-y-1 pb-3 border-b">
                      <span className="text-[10px] text-zinc-400 block">SELECTED REGION</span>
                      <h4 className="font-bold text-sm text-zinc-850 dark:text-white">{s.name}</h4>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <span className="block text-[10px] text-zinc-400 mb-1">Owner Faction:</span>
                        <select 
                          value={s.owner}
                          onChange={(e) => handleChangeTurfOwner(s.id, e.target.value as any)}
                          className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border rounded-lg h-9 font-mono"
                        >
                          <option value="Grove Street Families">Grove Street Families (Emerald Green)</option>
                          <option value="Ballas">Ballas (Purple Gangs)</option>
                          <option value="Los Santos Vagos">Los Santos Vagos (Yellow Latino Faction)</option>
                          <option value="LSPD Patrol">LSPD Patrol (Blue Division)</option>
                          <option value="Neutral">Neutral (No Claim)</option>
                        </select>
                      </div>

                      <div className="p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl space-y-1">
                        <span className="text-[10px] text-zinc-400 block">Live Command Dispatch</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <button 
                            onClick={() => {
                              const newAmount = s.troops + 10;
                              setTurfSectors(turfSectors.map(t => t.id === s.id ? { ...t, troops: newAmount } : t));
                              alert('Reinforcement troops dispatched to Ganton sector.');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-505 hover:bg-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded"
                          >
                            +10 Soldiers
                          </button>
                          <button 
                            onClick={() => {
                              setTurfSectors(turfSectors.map(t => t.id === s.id ? { ...t, troops: Math.max(0, s.troops - 10) } : t));
                              alert('Withdrew 10 troops from sector.');
                            }}
                            className="bg-zinc-650 hover:bg-zinc-600 text-white text-[9px] font-bold px-2 py-1 rounded"
                          >
                            -10 Soldiers
                          </button>
                        </div>
                      </div>

                      <button 
                        onClick={() => alert(`Siren dispatched: Red Alert broadcasted inside "${s.name}" chat feed!`)}
                        className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-center"
                      >
                        🚨 Broadcast Turf War Alert
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900 border border-dashed rounded-2xl text-xs text-zinc-400 font-mono">
                Select a sector on the radar map to start gang adjustments or send reinforcement backup troops.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. PLAYER ACCOUNTS VIEW */}
      {activeTab === 'players' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Player Selector & Actions */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-amber-500 uppercase flex items-center gap-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <Users className="h-4.5 w-4.5" />
              Player Accounts Controller
            </h3>

            <form onSubmit={handlePlayerEditSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-zinc-500">Select Character Profile</label>
                <select 
                  value={selectedPlayerId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    setSelectedPlayerId(pid);
                    const p = allUsers.find(u => u.id === pid);
                    if (p) {
                      setEditRole(p.role);
                    }
                  }}
                  className="w-full mt-1.5 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 h-9 rounded-lg"
                  required
                >
                  <option value="">-- Choose Account --</option>
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-500 font-mono">Set Server Member Role</label>
                <select 
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full mt-1.5 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 h-9 rounded-lg"
                >
                  <option value="">-- Keep Current --</option>
                  <option value="Owner">Owner (Server Lead)</option>
                  <option value="Administrator">Administrator (Staff)</option>
                  <option value="Senior Administrator">Senior Administrator (Co-Dev)</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Trial Moderator">Trial Moderator</option>
                  <option value="Community Manager">Community Manager</option>
                  <option value="Veteran">Veteran Player</option>
                  <option value="Regular Member">Regular Player</option>
                  <option value="New Member">New Player Registered</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-500 font-mono">Adjust Cash Balance (Coins)</label>
                <div className="flex gap-2 mt-1.5">
                  <input 
                    type="number" 
                    value={coinAdjustment} 
                    onChange={(e) => setCoinAdjustment(Number(e.target.value))}
                    className="flex-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 h-9 rounded-lg"
                  />
                  <span className="bg-zinc-100 dark:bg-zinc-805 text-zinc-500 font-bold p-2 text-xs rounded-lg flex items-center font-mono">GTRP$</span>
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 block">Specify positive values to gift cash, negative to deduct.</span>
              </div>

              <div className="pt-2 border-t">
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-lg text-center"
                >
                  Save Account Changes
                </button>
              </div>
            </form>
          </div>

          {/* Player accounts information listing */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-405 dark:text-zinc-400 tracking-widest uppercase pl-1 block">Accounts List & Integrity Levels</h3>
            
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden shadow-sm divide-y divide-zinc-150 dark:divide-zinc-850">
              {allUsers.map((p) => (
                <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt={p.username} className="h-9 w-9 rounded-xl border object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-800 dark:text-white text-sm">{p.username}</span>
                        {p.role === 'Owner' && <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-red-500/10 uppercase">Lead Owner</span>}
                      </div>
                      <span className="text-[11px] text-amber-500">{p.role}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-right">
                    <div className="px-2">
                      <span className="block text-[8px] uppercase text-zinc-450 text-left">Level</span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-bold block">{p.level}</span>
                    </div>
                    <div className="px-2">
                      <span className="block text-[8px] uppercase text-zinc-450 text-left">Wallet</span>
                      <span className="text-emerald-500 font-bold block">{p.coins} GTRP$</span>
                    </div>
                    <div className="px-2">
                      <span className="block text-[8px] uppercase text-zinc-450 text-left">Warning Level</span>
                      <span className="text-rose-500 font-bold block">
                        {p.id === 'user_noobmaster' ? '1 / 3 Warnings' : '0 / 3 Warnings'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. BOARDS MANAGER VIEW */}
      {activeTab === 'boards' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Create new board form */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-amber-500 uppercase flex items-center gap-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <Plus className="h-4.5 w-4.5" />
              Add Custom Discussion Board
            </h3>

            <form onSubmit={handleCreateBoard} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-zinc-500">Board Title Name</label>
                <input 
                  type="text" 
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="e.g. LSPD Whitelist Applications" 
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-500">Category Tag Group</label>
                <select 
                  value={newBoardType}
                  onChange={(e: any) => setNewBoardType(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 h-10 rounded-xl outline-none"
                >
                  <option value="announcements">News & Rules Announcements</option>
                  <option value="general">General Discussions</option>
                  <option value="guides">Roleplay Guides & Tutorials</option>
                  <option value="servers">Governments & Gang Territories</option>
                  <option value="offtopic">Off-Topic Talk</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-500">Board Description Summary</label>
                <textarea 
                  rows={3}
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  placeholder="e.g. Official submissions board for Cadets wishing to join the Police squad." 
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 rounded-xl outline-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-lg uppercase font-bold text-center transition cursor-pointer"
              >
                Launch Custom Board
              </button>
            </form>
          </div>

          {/* Active board lists and easy deleting */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-405 dark:text-zinc-400 tracking-widest uppercase pl-1 block">Active Boards & Descriptions</h3>
            
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden shadow-sm divide-y divide-zinc-150 dark:divide-zinc-850">
              {categories.map((c) => (
                <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
                  <div className="space-y-1 flex-1 pr-6">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-zinc-850 dark:text-white hover:underline text-sm block">{c.name}</span>
                      <span className="bg-zinc-100 dark:bg-zinc-805 text-zinc-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{c.type}</span>
                    </div>
                    <p className="text-zinc-550 dark:text-zinc-400 text-xs">{c.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-zinc-500 shrink-0 font-bold self-end sm:self-center">
                    <div className="text-right">
                      <span className="block text-[8px] uppercase">Discussions</span>
                      <span className="text-zinc-700 dark:text-zinc-300">{c.threadCount}</span>
                    </div>

                    {/* Delete button (only allow on custom boards to prevent breaking core templates) */}
                    <button 
                      onClick={() => handleDeleteBoardClick(c.id, c.name)}
                      className="p-2 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-lg text-rose-500 transition cursor-pointer"
                      title="Delete discussions board"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
