/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Key, 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ShieldAlert, 
  Coins, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthPortalProps {
  allUsers: User[];
  onLoginSuccess: (user: User) => void;
  onRegisterUser: (newUser: User) => void;
  onUpdateUserPassword: (username: string, nextPass: string) => void;
}

export default function AuthPortal({
  allUsers,
  onLoginSuccess,
  onRegisterUser,
  onUpdateUserPassword
}: AuthPortalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register Fields
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('New Member');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

  // Forgot Fields
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  // Avatar Options
  const avatarOptions = [
    { name: 'Casual Cap', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    { name: 'Business Exec', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80' },
    { name: 'Street Elite', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Officer Hat', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { name: 'Gamer Green', url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=80' }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    if (!username.trim()) {
      setErrorText('Please specify your registered IC username.');
      return;
    }

    // Look for matching user case-insensitively
    const formattedUser = username.trim().replace(/\s+/g, '_');
    const existing = allUsers.find(
      u => u.username.toLowerCase() === formattedUser.toLowerCase()
    );

    if (!existing) {
      setErrorText(`Account "${formattedUser}" not found. Try registering below!`);
      return;
    }

    // Simple pass matching
    onLoginSuccess(existing);
    setSuccessText(`Logged in successfully as ${existing.username}!`);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    const formattedUser = regUsername.trim().replace(/\s+/g, '_');
    if (formattedUser.length < 3) {
      setErrorText('Character username must contain at least 3 letters (Use Name_Surname style).');
      return;
    }

    if (!regEmail.trim()) {
      setErrorText('Please enter your email address.');
      return;
    }

    const collision = allUsers.find(
      u => u.username.toLowerCase() === formattedUser.toLowerCase()
    );

    if (collision) {
      setErrorText(`Username "${formattedUser}" is already registered. Choose another one.`);
      return;
    }

    // Badge styling for roles
    let badgeColor = 'bg-slate-700 dark:bg-slate-650 text-white border-slate-700';
    if (regRole === 'Owner') badgeColor = 'bg-red-650 dark:bg-red-500 text-white border-red-700 shadow-sm';
    else if (regRole.includes('Admin')) badgeColor = 'bg-amber-600 dark:bg-amber-500 text-white border-amber-700';
    else if (regRole === 'Community Manager') badgeColor = 'bg-orange-655 dark:bg-orange-500 text-white border-orange-700';
    else if (regRole === 'Moderator') badgeColor = 'bg-indigo-650 dark:bg-indigo-500 text-white border-indigo-700';
    else if (regRole === 'Veteran') badgeColor = 'bg-emerald-650 dark:bg-emerald-500 text-white border-emerald-700';

    const newUser: User = {
      id: `user_registered_${Date.now()}`,
      username: formattedUser,
      role: regRole,
      badgeColor,
      avatar: regAvatar,
      coverPhoto: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      title: regRole === 'Owner' || regRole.includes('Admin') ? 'Official Staff Council' : 'GTRP Resident',
      xp: 0,
      level: 1,
      coins: regRole === 'Owner' ? 10000 : 500, // starting funds
      signature: `Member of the Gonnsen Territory RP board community.`,
      repPoints: 0,
      trophyPoints: 0,
      joinDate: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      lastActive: 'Just registered',
      dailyStreak: 1,
      bio: regBio.trim() || `No custom IC backhistory has been formulated for ${formattedUser} yet.`,
      postsCount: 0,
      activeTitle: regRole === 'Owner' || regRole.includes('Admin') ? 'Official Staff' : 'Registered Resident',
      socialLinks: {},
      achievements: [
        { id: `ach_reg_${Date.now()}`, name: 'Joined Territory', icon: '🚗', description: 'Registered your formal account on GTRP', dateUnlocked: new Date().toLocaleDateString() }
      ],
      marketplaceRating: {
        positive: 0,
        negative: 0
      }
    };

    onRegisterUser(newUser);
    setSuccessText(`Awesome! Account "${formattedUser}" registered successfully. You are now logged in!`);
    
    // Clear registration fields
    setRegUsername('');
    setRegPassword('');
    setRegEmail('');
    setRegBio('');
  };

  const handleForgotVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    const checkUser = forgotUsername.trim().replace(/\s+/g, '_');
    const existing = allUsers.find(
      u => u.username.toLowerCase() === checkUser.toLowerCase()
    );

    if (!existing) {
      setErrorText(`No registered user name "${checkUser}" matched our records.`);
      return;
    }

    setForgotStep(2);
    setSuccessText(`Code Sent! Simulating email dispatched to "${forgotEmail || 'linked inbox'}". Complete security verification below.`);
  };

  const handleForgotResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    if (!newPassword.trim()) {
      setErrorText('Please designate a safe new password.');
      return;
    }

    const checkUser = forgotUsername.trim().replace(/\s+/g, '_');
    onUpdateUserPassword(checkUser, newPassword);

    setSuccessText(`Success! Character Password reset applied for ${checkUser}. Please return to Login page.`);
    
    // reset forgot sequence
    setForgotStep(1);
    setRegUsername('');
    setUsername(checkUser); // auto-fill username in login
    setMode('login');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-900 border-2 border-amber-500 rounded-2xl shadow-[0_10px_25px_rgba(243,156,18,0.15)] overflow-hidden text-white font-mono">
        
        {/* Banner with retro SA-MP styling */}
        <div className="bg-zinc-950 p-6 border-b border-zinc-805 text-center relative overflow-hidden">
          <div className="absolute top-1 right-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500 text-zinc-950 font-mono text-[9px] font-black uppercase tracking-wider">
            ★ AUTHENTICATION HUB ★
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-amber-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Impact, sans-serif' }}>
            Gonnsen Territory RP
          </h1>
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">
            Server Verification & Account Services
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-5">
          
          {/* Status Banners */}
          {errorText && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-450 text-xs rounded-xl flex items-start gap-2 animate-shake">
              <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorText}</span>
            </div>
          )}

          {successText && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-450 text-xs rounded-xl flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successText}</span>
            </div>
          )}

          {/* 1. LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-450 uppercase font-black tracking-wider text-[10px]">In-Game Character Username</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Tony_Gonnsen" 
                    className="w-full p-3 pl-10 bg-zinc-950 border border-zinc-805 rounded-xl outline-none focus:border-amber-500 text-white"
                    required
                  />
                  <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                </div>
                <span className="text-[9px] text-zinc-500">Character names are formatted as Name_Surname (e.g. Carl_Johnson)</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-zinc-450 uppercase font-black tracking-wider text-[10px]">IC Master Password</label>
                  <button 
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorText(null); }}
                    className="text-[9.5px] text-amber-500 hover:text-white transition font-black hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••" 
                    className="w-full p-3 pl-10 bg-zinc-950 border border-zinc-805 rounded-xl outline-none focus:border-amber-500 text-white"
                    required
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-xl uppercase tracking-tight transition cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                Access Character Forums
                <ArrowRight className="h-4 w-4 text-zinc-950" />
              </button>

              <div className="text-center pt-2">
                <span className="text-zinc-400">Need a simulated character profile? </span>
                <button 
                  type="button" 
                  onClick={() => { setMode('register'); setErrorText(null); setSuccessText(null); }}
                  className="text-amber-500 font-extrabold hover:underline"
                >
                  Register Profile
                </button>
              </div>
            </form>
          )}

          {/* 2. REGISTER MODE */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-450 uppercase font-black tracking-wider text-[10px]">In-Game Username</label>
                  <input 
                    type="text" 
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. Cesar_Vialpando" 
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-805 rounded-xl outline-none focus:border-amber-500 text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-450 uppercase font-black tracking-wider text-[10px]">Email Address</label>
                  <input 
                    type="email" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="cesar@grovemail.com" 
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-805 rounded-xl outline-none focus:border-amber-500 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-455 uppercase font-black tracking-wider text-[10px]">Security Password</label>
                  <input 
                    type="password" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••••" 
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-805 rounded-xl outline-none focus:border-amber-500 text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-455 uppercase font-black tracking-wider text-[10px]">Simulated Character Role</label>
                  <select 
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-805 rounded-xl outline-none focus:border-amber-500 text-white"
                  >
                    <option value="New Member">New Registered Member</option>
                    <option value="Regular Member">Regular Player Resident</option>
                    <option value="Veteran">Veteran GTRP Clan</option>
                    <option value="Moderator">Testing Moderator (Staff)</option>
                    <option value="Administrator">Testing Administrator (Dev)</option>
                  </select>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-1.5">
                <label className="text-zinc-450 uppercase font-black tracking-[0.05em] text-[10px] block">Select Face ID Representation</label>
                <div className="flex flex-wrap gap-2.5">
                  {avatarOptions.map((av, idx) => (
                    <button 
                      key={idx}
                      type="button"
                      onClick={() => setRegAvatar(av.url)}
                      className={`h-10 w-10 rounded-xl overflow-hidden border-2 transition ${regAvatar === av.url ? 'border-amber-500 scale-105 shadow-sm shadow-amber-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
                      title={av.name}
                    >
                      <img src={av.url} alt="option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-450 uppercase font-black tracking-wider text-[10px]">Character Biography Backstory</label>
                <textarea 
                  rows={2}
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  placeholder="Summarize your character background or gang ties here..." 
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-805 rounded-xl outline-none focus:border-amber-500 text-white"
                />
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500/90 text-[10px] rounded-lg">
                ⚠️ REGISTERING GRANTS: Fresh citizens receive +500 GTRP Credits, 1 Active daily stamp, and an Elite Launcher Badge automatically.
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-xl uppercase tracking-tight transition cursor-pointer text-xs"
              >
                Register & Authenticate Account
              </button>

              <div className="text-center pt-2">
                <span className="text-zinc-450">Already have an registered account? </span>
                <button 
                  type="button" 
                  onClick={() => { setMode('login'); setErrorText(null); setSuccessText(null); }}
                  className="text-amber-500 font-extrabold hover:underline"
                >
                  Return to Login
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD MODE */}
          {mode === 'forgot' && (
            <div className="space-y-4 text-xs">
              {forgotStep === 1 ? (
                <form onSubmit={handleForgotVerify} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-450 uppercase font-black tracking-wider text-[10px]">Forgotten Account Username</label>
                    <input 
                      type="text" 
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value)}
                      placeholder="e.g. Officer_Xenon" 
                      className="w-full p-3 bg-zinc-950 border border-zinc-805 rounded-xl outline-none focus:border-amber-500 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-450 uppercase font-black tracking-wider text-[10px]">Registered Account Email</label>
                    <input 
                      type="email" 
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. xenon@gonnsen-rp.com" 
                      className="w-full p-3 bg-zinc-950 border border-zinc-805 rounded-xl outline-none focus:border-amber-500 text-white"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-xl uppercase tracking-tight transition cursor-pointer"
                  >
                    Simulate Password Password recovery Verification Link
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotResetSubmit} className="space-y-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-lg">
                    <span>🔑 Verification Override: Enter reset code <strong>GTR-2026</strong> or any code, then specify your target master password replacement.</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-450 uppercase font-black tracking-wider text-[10px]">Security Pin Verification Code</label>
                    <input 
                      type="text" 
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="GTR-2026" 
                      className="w-full p-3 bg-zinc-950 border border-zinc-805 rounded-xl outline-none focus:border-amber-500 text-white text-center font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-450 uppercase font-black tracking-wider text-[10px]">Next Replacement Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new master password" 
                      className="w-full p-3 bg-zinc-950 border border-zinc-805 rounded-xl outline-none focus:border-amber-500 text-white"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-xl uppercase tracking-tight transition cursor-pointer font-bold"
                  >
                    Commit Password Replacement
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => { setMode('login'); setForgotStep(1); setErrorText(null); setSuccessText(null); }}
                  className="text-amber-500 font-extrabold hover:underline"
                >
                  Return to Login
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Tactical diagnostics */}
        <div className="p-3 bg-zinc-950/60 border-t border-zinc-805 text-[9.5px] font-mono text-zinc-500 flex justify-between">
          <span>HOST: gtr.gonnsen-rp.com:7777</span>
          <span>SYSTEM CODE: 0xSA_MP</span>
        </div>

      </div>
    </div>
  );
}
