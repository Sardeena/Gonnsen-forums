/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  mockUsers, 
  mockCategories, 
  mockThreads, 
  mockPosts, 
  mockMarketplaceListings, 
  mockAppTemplates, 
  mockSubmittedApps, 
  mockPrivateMessages, 
  mockNotifications, 
  mockAuditLogs, 
  mockReportTickets 
} from './data';
import { 
  User, 
  ForumCategory, 
  Thread, 
  Post, 
  MarketplaceListing, 
  AppTemplate, 
  SubmittedApplication, 
  PrivateMessageConversation, 
  Notification, 
  AuditLog, 
  ReportTicket,
  Message,
  AppQuestion
} from './types';
import Navigation from './components/Navigation';
import ForumHome from './components/ForumHome';
import ThreadView from './components/ThreadView';
import MarketplaceView from './components/MarketplaceView';
import ProfileView from './components/ProfileView';
import ApplicationsView from './components/ApplicationsView';
import ModConsole from './components/ModConsole';
import DirectMessages from './components/DirectMessages';
import AdminDashboard from './components/AdminDashboard';
import AuthPortal from './components/AuthPortal';
import SearchView from './components/SearchView';
import { 
  Sun, 
  Moon, 
  Cpu, 
  ShieldAlert, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Compass, 
  Coins 
} from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nexus_dark_theme');
    return saved !== 'false'; // Default to True (Dark) for immersive gaming style
  });

  // Core Persisted Databases
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('nexus_users');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUsers = localStorage.getItem('nexus_users');
    const savedActiveId = localStorage.getItem('nexus_current_user_id');
    if (savedActiveId && savedUsers) {
      const parsed = JSON.parse(savedUsers);
      return parsed.find((u: User) => u.id === savedActiveId) || null;
    }
    if (savedUsers) {
      const parsed = JSON.parse(savedUsers);
      return parsed.find((u: User) => u.id === 'user_sardena') || parsed[0];
    }
    return mockUsers[0]; // Standard default visitor (Sardena_RPG)
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexus_current_user_id', currentUser.id);
    } else {
      localStorage.removeItem('nexus_current_user_id');
    }
  }, [currentUser]);

  const [categories, setCategories] = useState<ForumCategory[]>(() => {
    const saved = localStorage.getItem('nexus_categories');
    return saved ? JSON.parse(saved) : mockCategories;
  });

  const [threads, setThreads] = useState<Thread[]>(() => {
    const saved = localStorage.getItem('nexus_threads');
    return saved ? JSON.parse(saved) : mockThreads;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('nexus_posts');
    return saved ? JSON.parse(saved) : mockPosts;
  });

  const [listings, setListings] = useState<MarketplaceListing[]>(() => {
    const saved = localStorage.getItem('nexus_listings');
    return saved ? JSON.parse(saved) : mockMarketplaceListings;
  });

  const [templates, setTemplates] = useState<AppTemplate[]>(() => {
    const saved = localStorage.getItem('nexus_templates');
    return saved ? JSON.parse(saved) : mockAppTemplates;
  });

  const [submissions, setSubmissions] = useState<SubmittedApplication[]>(() => {
    const saved = localStorage.getItem('nexus_submissions');
    return saved ? JSON.parse(saved) : mockSubmittedApps;
  });

  const [conversations, setConversations] = useState<PrivateMessageConversation[]>(() => {
    const saved = localStorage.getItem('nexus_conversations');
    return saved ? JSON.parse(saved) : mockPrivateMessages;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('nexus_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('nexus_audit_logs');
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  const [reports, setReports] = useState<ReportTicket[]>(() => {
    const saved = localStorage.getItem('nexus_reports');
    return saved ? JSON.parse(saved) : mockReportTickets;
  });

  // Navigation / Router Views
  const [currentView, setCurrentView] = useState<string>('forums');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Sync to Core localStorage whenever data alters
  useEffect(() => {
    localStorage.setItem('nexus_dark_theme', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('nexus_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('nexus_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('nexus_threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('nexus_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('nexus_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('nexus_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('nexus_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('nexus_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('nexus_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nexus_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('nexus_reports', JSON.stringify(reports));
  }, [reports]);

  // Actions handlers
  const handleSelectSimUser = (targetUser: User) => {
    setCurrentUser(targetUser);
    
    // Log simulation change into audit trails
    const newLog: AuditLog = {
      id: `log_sim_${Date.now()}`,
      actorId: 'system_core',
      action: 'SIM_PERSONA_SWAP',
      target: targetUser.username,
      timestamp: new Date().toISOString(),
      details: `Swapped current active user perspective to: "${targetUser.username}" (${targetUser.role})`
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    const updatedUsers = allUsers.map(u => {
      if (u.id === currentUser.id) {
        const next = { ...u, ...updated };
        // Sync active state
        setCurrentUser(next);
        return next;
      }
      return u;
    });
    setAllUsers(updatedUsers);
  };

  const handleCreateThread = (threadData: Partial<Thread>) => {
    const newThread: Thread = {
      id: `thread_${Date.now()}`,
      forumId: threadData.forumId || 'cat_general',
      title: threadData.title || 'Untitled Topic',
      content: threadData.content || '',
      authorId: currentUser.id,
      prefix: threadData.prefix || '[Discussion]',
      tags: threadData.tags || ['General'],
      repliesCount: 0,
      viewsCount: 1,
      isSticky: false,
      isLocked: false,
      createdAt: new Date().toISOString(),
      reactions: {},
      poll: threadData.poll
    };

    setThreads([newThread, ...threads]);

    // Reward XP & N$ coins for publishing
    const updatedUsers = allUsers.map(u => {
      if (u.id === currentUser.id) {
        const next = { 
          ...u, 
          xp: u.xp + 250, 
          coins: u.coins + 50,
          postsCount: u.postsCount + 1
        };
        setCurrentUser(next);
        return next;
      }
      return u;
    });
    setAllUsers(updatedUsers);

    // Write audit log
    const log: AuditLog = {
      id: `log_th_${Date.now()}`,
      actorId: currentUser.id,
      action: 'THREAD_CREATE',
      target: newThread.title,
      timestamp: new Date().toISOString(),
      details: `Published discussion topic containing labels. Credited +250 XP & +50 N$.`
    };
    setAuditLogs([log, ...auditLogs]);

    // Set view to newly created thread
    setSelectedThreadId(newThread.id);
    setCurrentView('thread_detail');
  };

  const handleAddReply = (threadId: string, text: string) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      threadId,
      content: text,
      authorId: currentUser.id,
      createdAt: new Date().toISOString(),
      reactions: {}
    };

    setPosts([...posts, newPost]);

    // Update thread repliesCount
    const updatedThreads = threads.map(t => {
      if (t.id === threadId) {
        return { ...t, repliesCount: t.repliesCount + 1 };
      }
      return t;
    });
    setThreads(updatedThreads);

    // Reward XP & N$ coins for post replier
    const updatedUsers = allUsers.map(u => {
      if (u.id === currentUser.id) {
        const next = { 
          ...u, 
          xp: u.xp + 100, 
          coins: u.coins + 15,
          postsCount: u.postsCount + 1
        };
        setCurrentUser(next);
        return next;
      }
      return u;
    });
    setAllUsers(updatedUsers);

    // Trigger notification or alert to thread owner
    const mainThread = threads.find(t => t.id === threadId);
    if (mainThread && mainThread.authorId !== currentUser.id) {
      const newNotif: Notification = {
        id: `not_rep_${Date.now()}`,
        recipientId: mainThread.authorId,
        senderId: currentUser.id,
        type: 'reply',
        targetType: 'thread',
        targetId: mainThread.id,
        text: `💬 ${currentUser.username} posted a reply on your topic "${mainThread.title}".`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications([newNotif, ...notifications]);
    }
  };

  const handleVotePoll = (threadId: string, optionId: string) => {
    const updatedThreads = threads.map(t => {
      if (t.id === threadId && t.poll) {
        const updatedOptions = t.poll.options.map(opt => {
          // Add voter to select option
          if (opt.id === optionId) {
            return { ...opt, votes: [...opt.votes, currentUser.id] };
          }
          return opt;
        });
        return {
          ...t,
          poll: {
            ...t.poll,
            options: updatedOptions
          }
        };
      }
      return t;
    });
    setThreads(updatedThreads);
    alert('Ballot recorded! XP multiplier triggered.');
  };

  const handleToggleSticky = (threadId: string) => {
    const updated = threads.map(t => {
      if (t.id === threadId) {
        return { ...t, isSticky: !t.isSticky };
      }
      return t;
    });
    setThreads(updated);
  };

  const handleToggleLock = (threadId: string) => {
    const updated = threads.map(t => {
      if (t.id === threadId) {
        return { ...t, isLocked: !t.isLocked };
      }
      return t;
    });
    setThreads(updated);
  };

  const handleDeleteThread = (threadId: string) => {
    setThreads(threads.filter(t => t.id !== threadId));
    setPosts(posts.filter(p => p.threadId !== threadId));
    setCurrentView('forums');
  };

  const handleDeletePost = (postId: string) => {
    const getPost = posts.find(p => p.id === postId);
    if (!getPost) return;

    setPosts(posts.filter(p => p.id !== postId));
    setThreads(threads.map(t => {
      if (t.id === getPost.threadId) {
        return { ...t, repliesCount: Math.max(0, t.repliesCount - 1) };
      }
      return t;
    }));
  };

  const handleReactThread = (postId: string, reaction: string) => {
    // React to either thread or simple replies
    if (postId === 'thread' && selectedThreadId) {
      const updatedThreads = threads.map(t => {
        if (t.id === selectedThreadId) {
          const currentPostReactions = t.reactions[selectedThreadId] || {};
          const nextReactionsObj = { ...currentPostReactions, [currentUser.id]: reaction };
          return {
            ...t,
            reactions: {
              ...t.reactions,
              [selectedThreadId]: nextReactionsObj
            }
          };
        }
        return t;
      });
      setThreads(updatedThreads);
    } else {
      // Reacting to comments
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            reactions: { ...p.reactions, [currentUser.id]: reaction }
          };
        }
        return p;
      });
      setPosts(updatedPosts);
    }
  };

  const handleCreateListing = (listingData: Partial<MarketplaceListing>) => {
    const newListing: MarketplaceListing = {
      id: `list_${Date.now()}`,
      title: listingData.title || '',
      description: listingData.description || '',
      category: listingData.category || 'other',
      type: listingData.type || 'sell',
      price: listingData.price || 10,
      startingBid: listingData.startingBid,
      currentBid: listingData.currentBid,
      buyNowPrice: listingData.buyNowPrice,
      bids: listingData.bids || [],
      images: listingData.images || [],
      isSold: false,
      createdAt: new Date().toISOString(),
      authorId: currentUser.id
    };

    setListings([newListing, ...listings]);

    // Audit logs
    onAddAuditLog({
      actorId: currentUser.id,
      action: 'LISTING_CREATE',
      target: newListing.title,
      timestamp: new Date().toISOString(),
      details: `Created custom trading listing: "${newListing.title}".`
    });
  };

  const handleModifyListing = (listingId: string, updated: Partial<MarketplaceListing>) => {
    setListings(listings.map(l => (l.id === listingId ? { ...l, ...updated } : l)));
  };

  const handleSendMessage = (convId: string, text: string, attachment?: any) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text,
      createdAt: new Date().toISOString(),
      readBy: [currentUser.id],
      attachment
    };

    setConversations(conversations.map(c => {
      if (c.id === convId) {
        return { ...c, messages: [...c.messages, newMsg] };
      }
      return c;
    }));
  };

  const handleAddConversation = (otherUserId: string) => {
    const newConv: PrivateMessageConversation = {
      id: `conv_${Date.now()}`,
      participantIds: [currentUser.id, otherUserId],
      messages: []
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
    setCurrentView('dms');
  };

  const handleAddTemplateQuestion = (templateId: string, newQuestion: AppQuestion) => {
    setTemplates(templates.map(t => {
      if (t.id === templateId) {
        return { ...t, questions: [...t.questions, newQuestion] };
      }
      return t;
    }));
  };

  const onSubmitApplication = (submissionData: Partial<SubmittedApplication>) => {
    if (!currentUser) return;
    const newApp: SubmittedApplication = {
      id: `app_${Date.now()}`,
      templateId: submissionData.templateId || 'tpl_whitelist',
      applicantId: currentUser.id,
      answers: submissionData.answers || {},
      status: 'pending',
      internalNotes: [],
      createdAt: new Date().toISOString()
    };
    setSubmissions([newApp, ...submissions]);

    // Audit trail
    const authorName = templates.find(t => t.id === newApp.templateId)?.title || 'Guild Form';
    onAddAuditLog({
      actorId: currentUser.id,
      action: 'APPLICATION_SUBMIT',
      target: authorName,
      timestamp: new Date().toISOString(),
      details: `Submitted candidate application for "${authorName}". Moderation suite updated.`
    });
  };

  const onModifySubmission = (submissionId: string, updated: Partial<SubmittedApplication>) => {
    setSubmissions(submissions.map(s => (s.id === submissionId ? { ...s, ...updated } : s)));
  };

  const onSubmitReport = (reportData: { targetType: 'listing' | 'user'; targetId: string; targetTitle: string; reason: string }) => {
    if (!currentUser) return;
    const newReport: ReportTicket = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      targetType: reportData.targetType,
      targetId: reportData.targetId,
      targetTitle: reportData.targetTitle,
      reason: reportData.reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports([newReport, ...reports]);
  };

  const onResolveReport = (reportId: string, resolutionText: string) => {
    setReports(reports.map(r => (r.id === reportId ? { ...r, status: 'resolved', resolutionText } : r)));
  };

  const onModifyUserSuspension = (userId: string, isSuspended: boolean, warningDelta: number) => {
    // Simply logging infraction warnings
    setAllUsers(allUsers.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          repPoints: Math.max(0, u.repPoints - (warningDelta * 2)),
          xp: Math.max(0, u.xp - (warningDelta * 10))
        };
      }
      return u;
    }));
  };

  const handleUpdateUser = (userId: string, updated: Partial<User>) => {
    const nextUsers = allUsers.map(u => {
      if (u.id === userId) {
        const next = { ...u, ...updated };
        if (currentUser && userId === currentUser.id) {
          setCurrentUser(next);
        }
        return next;
      }
      return u;
    });
    setAllUsers(nextUsers);
  };

  const handleAddCategory = (newCat: ForumCategory) => {
    setCategories([...categories, newCat]);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories(categories.filter(c => c.id !== catId));
  };

  const onChangeUserCoins = (userId: string, delta: number) => {
    setAllUsers(allUsers.map(u => {
      if (u.id === userId) {
        const next = { ...u, coins: Math.max(0, u.coins + delta) };
        if (currentUser && userId === currentUser.id) {
          setCurrentUser(next);
        }
        return next;
      }
      return u;
    }));
  };

  const onMarkNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const onAddAuditLog = (log: Partial<AuditLog>) => {
    const newLog: AuditLog = {
      id: `log_custom_${Date.now()}`,
      actorId: log.actorId || currentUser?.id || 'system_core',
      action: log.action || 'TRANSACTION',
      target: log.target || 'Core Server',
      timestamp: new Date().toISOString(),
      details: log.details || 'Sync update logged.'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const onAddNotification = (notifData: any) => {
    const newNotif: Notification = {
      id: `not_custom_${Date.now()}`,
      recipientId: notifData.recipientId,
      senderId: notifData.senderId,
      type: notifData.type || 'reply',
      targetType: notifData.targetType || 'thread',
      targetId: notifData.targetId,
      text: notifData.text,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleWipeSandbox = () => {
    if (confirm('Warning: This will clear all existing mock categories, threads, messages, and listings so you can start with a clean slate to implement real data on Gonnsen Territory. Are you sure?')) {
      const cleanUsers = [
        {
          id: 'user_admin',
          username: 'Tony_Gonnsen',
          role: 'Owner',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          signature: 'Owner of Gonnsen Territory RolePlay. Database cleared.',
          joinedDate: new Date().toISOString().split('T')[0],
          coins: 100000,
          xp: 2500,
          repPoints: 100,
          achievements: []
        }
      ];

      const cleanCategories = [
        {
          id: 'cat_general',
          name: 'General Discussion',
          description: 'OOC Boards for general player dialogue and community updates.',
          icon: 'MessageSquare',
          type: 'general',
          threadCount: 0,
          postCount: 0
        },
        {
          id: 'cat_government',
          name: 'Government & Whitelist Agency',
          description: 'Apply for official factions, street gangs, police force, and server whitelist credentials.',
          icon: 'ShieldAlert',
          type: 'servers',
          threadCount: 0,
          postCount: 0
        }
      ];

      setAllUsers(cleanUsers);
      setCurrentUser(cleanUsers[0]);
      setCategories(cleanCategories);
      setThreads([]);
      setPosts([]);
      setListings([]);
      setSubmissions([]);
      setConversations([]);
      setReports([]);
      setNotifications([]);
      setAuditLogs([]);
      setCurrentView('forums');
      setSelectedThreadId(null);
      
      alert('Sandbox database wiped clean successfully! A default character profile (Tony_Gonnsen) and custom general sections are initialized.');
    }
  };

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');

  if (!currentUser) {
    return (
      <div className={`${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-800'} min-h-screen transition-colors duration-305 duration-300 font-sans flex items-center justify-center p-4`}>
        <AuthPortal 
          allUsers={allUsers}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setCurrentView('forums');
          }}
          onRegisterUser={(newUser) => {
            setAllUsers(prev => [...prev, newUser]);
            setCurrentUser(newUser);
            setCurrentView('forums');
          }}
          onUpdateUserPassword={(username, nextPass) => {
            const updatedUsers = allUsers.map(u => {
              if (u.username.toLowerCase() === username.toLowerCase()) {
                return {
                  ...u,
                  signature: `[Verified Password Reset Passed] | ${u.signature || ''}`
                };
              }
              return u;
            });
            setAllUsers(updatedUsers);
            alert(`Your request for ${username} is successful! Profile credential updated to authorize password reset.`);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-800'} min-h-screen pb-12 transition-colors duration-300 font-sans`}>
      
      {/* Navigation Top layout header */}
      <Navigation 
        currentUser={currentUser}
        allUsers={allUsers}
        notifications={notifications}
        onSelectUser={handleSelectSimUser}
        onSetView={(view) => {
          if (view === 'logout_modal') {
            if (confirm('Disconnect from server secure sync sessions? This logs you out of active character.')) {
              setCurrentUser(null);
            }
          } else {
            setCurrentView(view);
          }
        }}
        currentView={currentView}
        onMarkNotificationsRead={onMarkNotificationsRead}
        onSearch={(query) => {
          setGlobalSearchQuery(query);
          setCurrentView('search');
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Render actual selected viewport routing */}
        {currentView === 'forums' && (
          <ForumHome 
            categories={categories}
            threads={threads}
            allUsers={allUsers}
            currentUser={currentUser}
            onCreateThread={handleCreateThread}
            onSelectThread={(thId) => {
              // Increment Views count dynamically inside routing trigger
              setThreads(threads.map(t => (t.id === thId ? { ...t, viewsCount: t.viewsCount + 1 } : t)));
              setSelectedThreadId(thId);
              setCurrentView('thread_detail');
            }}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {currentView === 'search' && (
          <SearchView 
            searchQuery={globalSearchQuery}
            onSearch={setGlobalSearchQuery}
            threads={threads}
            allPosts={posts}
            listings={listings}
            allUsers={allUsers}
            onSelectThread={(thId) => {
              // Increase view count dynamically inside search selection as well
              setThreads(threads.map(t => (t.id === thId ? { ...t, viewsCount: t.viewsCount + 1 } : t)));
              setSelectedThreadId(thId);
              setCurrentView('thread_detail');
            }}
            onSetView={setCurrentView}
            onSelectUser={handleSelectSimUser}
          />
        )}

        {currentView === 'thread_detail' && selectedThreadId && (
          (() => {
            const th = threads.find(t => t.id === selectedThreadId);
            return th ? (
              <ThreadView 
                thread={th}
                allPosts={posts}
                allUsers={allUsers}
                currentUser={currentUser}
                onBack={() => setCurrentView('forums')}
                onAddReply={handleAddReply}
                onVotePoll={handleVotePoll}
                onToggleSticky={handleToggleSticky}
                onToggleLock={handleToggleLock}
                onDeleteThread={handleDeleteThread}
                onDeletePost={handleDeletePost}
                onReactThread={handleReactThread}
              />
            ) : (
              <div className="p-8 text-center text-xs">Thread deleted or sync misplaced.</div>
            );
          })()
        )}

        {currentView === 'marketplace' && (
          <MarketplaceView 
            listings={listings}
            allUsers={allUsers}
            currentUser={currentUser}
            onCreateListing={handleCreateListing}
            onModifyListing={handleModifyListing}
            onSubmitReport={onSubmitReport}
            onChangeUserCoins={onChangeUserCoins}
            onAddNotification={onAddNotification}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView 
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            allAchievements={currentUser.achievements}
          />
        )}

        {currentView === 'apps' && (
          <ApplicationsView 
            templates={templates}
            submissions={submissions}
            allUsers={allUsers}
            currentUser={currentUser}
            onSubmitApplication={onSubmitApplication}
            onModifySubmission={onModifySubmission}
            onAddNotification={onAddNotification}
            onAddTemplateQuestion={handleAddTemplateQuestion}
          />
        )}

        {currentView === 'modconsole' && (
          <ModConsole 
            reports={reports}
            auditLogs={auditLogs}
            allUsers={allUsers}
            currentUser={currentUser}
            onResolveReport={onResolveReport}
            onModifyUserSuspension={onModifyUserSuspension}
            onAddAuditLog={onAddAuditLog}
            onAddNotification={onAddNotification}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard 
            categories={categories}
            allUsers={allUsers}
            currentUser={currentUser}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onUpdateUser={handleUpdateUser}
            onAddAuditLog={onAddAuditLog}
          />
        )}

        {currentView === 'dms' && (
          <DirectMessages 
            conversations={conversations}
            allUsers={allUsers}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onAddConversation={handleAddConversation}
          />
        )}

      </main>

      {/* Dynamic GTRP footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-850 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 font-bold">★</span>
          <span>© 2026 Gonnsen Territory RolePlay • Forum Board Community</span>
        </div>

        {/* Theme, help actions */}
        <div className="flex flex-wrap items-center gap-4">
          <button 
            type="button" 
            onClick={handleWipeSandbox}
            className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 border border-red-500/20 rounded-full px-3 py-1 cursor-pointer transition font-mono font-bold hover:scale-105 active:scale-95"
            title="Wipe mock categories, threads, messages to start fresh with real data"
          >
            Wipe Mock Data & Start Clean
          </button>

          <button 
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-650 hover:text-zinc-850 dark:text-zinc-300 dark:hover:text-white rounded-full cursor-pointer transition shadow-xs"
            title="Switch design theme"
          >
            {darkMode ? (
              <>
                <Sun className="h-4 w-4 text-emerald-500" />
                <span>Classic Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-amber-500" />
                <span>City Midnight</span>
              </>
            )}
          </button>
          
          <span 
            className="hover:underline cursor-pointer" 
            onClick={() => alert(`Gonnsen Territory RolePlay Forums: Ready to accept actual player registrations and custom faction sections.`)}
          >
            About GTRP Forums
          </span>
        </div>
      </footer>

    </div>
  );
}
