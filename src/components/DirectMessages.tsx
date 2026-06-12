/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Paperclip, 
  Smile, 
  CheckCheck, 
  Cpu, 
  User, 
  Clock, 
  PhoneCall, 
  Compass,
  FileCheck
} from 'lucide-react';
import { PrivateMessageConversation, User as UserType, Message } from '../types';

interface DMsProps {
  conversations: PrivateMessageConversation[];
  allUsers: UserType[];
  currentUser: UserType;
  onSendMessage: (convId: string, text: string, attachment?: any) => void;
  onAddConversation: (otherUserId: string) => void;
}

export default function DirectMessages({
  conversations,
  allUsers,
  currentUser,
  onSendMessage,
  onAddConversation
}: DMsProps) {
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [typedMessage, setTypedMessage] = useState('');
  const [convSearch, setConvSearch] = useState('');

  // Mock attachment trigger state
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);

  // New Chat selector
  const [showNewChatDropdown, setShowNewChatDropdown] = useState(false);

  const activeConv = conversations.find(c => c.id === activeConvId);

  // Get other participant information
  const getOtherParticipant = (conv: PrivateMessageConversation) => {
    const otherId = conv.participantIds.find(id => id !== currentUser.id);
    return allUsers.find(u => u.id === otherId);
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() && !attachedFile) return;

    const attachmentPayload = attachedFile 
      ? { name: attachedFile.name, size: attachedFile.size, url: '#' } 
      : undefined;

    onSendMessage(activeConvId, typedMessage, attachmentPayload);
    setTypedMessage('');
    setAttachedFile(null);

    // Dynamic AI Simulator Response Trigger (1.5 seconds delay to feel exceptionally natural)
    const otherMember = activeConv ? getOtherParticipant(activeConv) : null;
    if (otherMember) {
      setTimeout(() => {
        let triggerMsg = "Understood. Synchronizing server assets now.";
        if (otherMember.id === 'user_xenon') {
          triggerMsg = "Copy that. Just updated the Node 1 infrastructure configurations. Let me know if that lag resolves!";
        } else if (otherMember.id === 'user_kestrel') {
          triggerMsg = "Awesome, thanks for checking in. Deployed whitelist candidates reviews. I am going to vote on approvals momentarily.";
        } else if (otherMember.id === 'user_mercenary') {
          triggerMsg = "Hey! Sounds good, I can deliver that uniform package ZIP directly in the forums once transaction credits clear.";
        }
        onSendMessage(activeConvId, triggerMsg);
      }, 1500);
    }
  };

  const handleAttachedFileSim = () => {
    // Simulate uploading a file
    const fileOptions = [
      { name: 'FiveM_TacticalVest_V2.ytd', size: '4.2 MB' },
      { name: 'Minecraft_realms_quests.json', size: '154 KB' },
      { name: 'Esports_Logo_Branding_Final.psd', size: '12.8 MB' }
    ];
    const picked = fileOptions[Math.floor(Math.random() * fileOptions.length)];
    setAttachedFile(picked);
    alert(`Mock file attachment selected: ${picked.name} (${picked.size}). Press Send to direct message!`);
  };

  const handleStartConversation = (userId: string) => {
    // Check if conversation already exists
    const existing = conversations.find(c => 
      c.participantIds.includes(currentUser.id) && c.participantIds.includes(userId)
    );

    if (existing) {
      setActiveConvId(existing.id);
    } else {
      onAddConversation(userId);
    }
    setShowNewChatDropdown(false);
  };

  const filteredConversations = conversations.filter((c) => {
    const rec = getOtherParticipant(c);
    if (!rec) return false;
    return rec.username.toLowerCase().includes(convSearch.toLowerCase());
  });

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200. dark:border-zinc-805 rounded-3xl overflow-hidden shadow-sm h-[600px] flex">
      
      {/* Inbox Chats Rail sidebar (Left) */}
      <div className="w-72 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shrink-0 hidden md:flex bg-zinc-50/40 dark:bg-zinc-950">
        
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50 dark:bg-zinc-90 w/20">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest block">Direct Inbox</span>
            
            <div className="relative">
              <button 
                onClick={() => setShowNewChatDropdown(!showNewChatDropdown)}
                className="text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer"
              >
                + New Chat
              </button>

              {showNewChatDropdown && (
                <div className="absolute left-0 mt-1.5 w-48 rounded-xl border bg-white dark:bg-zinc-90 w shadow-2xl z-[150] p-1.5 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-zinc-455 p-1 w-full block font-mono">Select gamers:</span>
                  {allUsers
                    .filter(u => u.id !== currentUser.id)
                    .map(u => (
                      <button
                        key={u.id}
                        onClick={() => handleStartConversation(u.id)}
                        className="w-full text-left p-1.5 text-xs hover:bg-zinc-50 rounded font-semibold font-mono"
                      >
                        {u.username}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter chat threads..."
              value={convSearch}
              onChange={(e) => setConvSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-transparent rounded-lg outline-none" 
            />
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-150 dark:divide-zinc-850">
          {filteredConversations.map((conv) => {
            const partner = getOtherParticipant(conv);
            const isSelected = conv.id === activeConvId;
            const lastMsg = conv.messages[conv.messages.length - 1];

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3.5 cursor-pointer transition flex items-center gap-2.5 text-xs ${isSelected ? 'bg-indigo-500/10 dark:bg-indigo-950/20' : 'hover:bg-zinc-50'}`}
              >
                <img src={partner?.avatar} alt={partner?.username} className="h-8 w-8 rounded-xl object-cover border" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{partner?.username}</span>
                    <span className="text-[9px] text-zinc-400 font-mono">
                      {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate font-mono">
                    {lastMsg ? lastMsg.text : 'No messages found.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Foot indicator card balance of owner */}
        <div className="p-3 bg-zinc-50 border-t text-center text-[10px] text-zinc-400 font-mono">
          Credits: <span className="text-indigo-600 font-bold">{currentUser.coins} N$</span> • Streak: {currentUser.dailyStreak}d
        </div>
      </div>

      {/* Message Chat Room viewport area (Right) */}
      {activeConv ? (
        <div className="flex-1 flex flex-col justify-between h-full bg-zinc-50/10 dark:bg-zinc-950/40 relative">
          
          {/* Header */}
          <div className="p-4 border-b bg-white dark:bg-zinc-950 flex justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <img src={getOtherParticipant(activeConv)?.avatar} alt="logo" className="h-9 w-9 rounded-xl object-cover" />
              <div>
                <span className="font-extrabold text-zinc-800 dark:text-zinc-55 block">Chat with {getOtherParticipant(activeConv)?.username}</span>
                <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Synced • Dynamic Response Simulator Active
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-400 hidden sm:block">
              {getOtherParticipant(activeConv)?.role}
            </span>
          </div>

          {/* Messages Feed body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeConv.messages.map((msg, mIdx) => {
              const fromMe = msg.senderId === currentUser.id;
              const sender = allUsers.find(u => u.id === msg.senderId);

              return (
                <div key={msg.id || mIdx} className={`flex items-start gap-2.5 text-xs ${fromMe ? 'flex-row-reverse' : ''}`}>
                  <img src={sender?.avatar} alt="av" className="h-7 w-7 rounded-lg shrink-0 object-cover" />
                  
                  <div className="space-y-1">
                    <div className={`p-3 rounded-2xl max-w-sm font-mono text-[11.5px] leading-relaxed shadow-sm ${
                      fromMe 
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-zinc-900 border text-zinc-800 dark:text-zinc-200 rounded-tl-none'
                    }`}>
                      {msg.text}

                      {/* Render simulated file attachment inside messages bubble */}
                      {msg.attachment && (
                        <div className="mt-3.5 p-2 bg-black/10 rounded-lg flex items-center gap-2 text-xs">
                          <Paperclip className="h-4 w-4 shrink-0 text-amber-500" />
                          <div className="min-w-0">
                            <span className="block font-bold truncate">{msg.attachment.name}</span>
                            <span className="text-[9px] opacity-75">{msg.attachment.size}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Receipts details */}
                    <div className={`flex items-center gap-1 text-[9px] text-zinc-400 font-mono ${fromMe ? 'justify-end' : ''}`}>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      {fromMe && <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attachment selection row preview */}
          {attachedFile && (
            <div className="px-4 py-2 bg-indigo-500/5 border-t border-indigo-500/10 flex justify-between items-center text-xs font-mono">
              <span className="text-indigo-600 flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5" />
                Selected package to upload: <span className="font-bold">{attachedFile.name} ({attachedFile.size})</span>
              </span>
              <button onClick={() => setAttachedFile(null)} className="text-rose-500 hover:text-rose-600">✕ Clear</button>
            </div>
          )}

          {/* Chat Form submission */}
          <form onSubmit={handleSendMessageSubmit} className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
            <button 
              type="button" 
              onClick={handleAttachedFileSim}
              className="p-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl border flex items-center justify-center cursor-pointer shrink-0"
              title="Locate graphics templates or scripts attachment file"
            >
              <Paperclip className="h-4.5 w-4.5 text-zinc-500" />
            </button>

            <input 
              type="text" 
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder={`Write private message to ${getOtherParticipant(activeConv)?.username}...`}
              className="flex-1 px-3.5 bg-zinc-50 dark:bg-zinc-90 w border text-xs sm:text-sm rounded-xl outline-none duration-250 focus:bg-white" 
            />

            <button 
              type="submit" 
              className="px-4 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl shadow font-semibold flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-50/20 text-center text-xs text-zinc-400 font-mono space-y-2">
          <MessageSquare className="h-10 w-10 text-zinc-350" />
          <p className="font-bold uppercase tracking-tight">Your Direct Message threads</p>
          <p>Click any contact sidebar to sync messaging chats logs with other forum players.</p>
        </div>
      )}

    </div>
  );
}
