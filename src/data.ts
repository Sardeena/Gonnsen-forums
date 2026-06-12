/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, ForumCategory, Thread, Post, MarketplaceListing, AppTemplate, SubmittedApplication, PrivateMessageConversation, Notification, AuditLog, ReportTicket } from './types';

export const mockUsers: User[] = [
  {
    id: 'user_sardena',
    username: 'Tony_Gonnsen',
    role: 'Senior Administrator',
    badgeColor: 'bg-amber-600 dark:bg-amber-500 text-white border-amber-700',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    title: 'Server Founder',
    xp: 6850,
    level: 18,
    coins: 1450,
    signature: '🎮 Script Developer | "Welcome to Gonnsen Territory!"',
    repPoints: 342,
    trophyPoints: 120,
    joinDate: 'Jan 15, 2025',
    lastActive: 'Just now',
    dailyStreak: 12,
    bio: 'Lead scripts supervisor and co-founder of Gonnsen Territory. Let me know if you run into any server bugs or need forum help.',
    postsCount: 154,
    activeTitle: 'Server Founder',
    socialLinks: {
      discord: 'TonyG#1337',
      steam: 'tony_gonnsen'
    },
    achievements: [
      { id: 'ach_1', name: 'Starting Out', icon: '🎯', description: 'Posted your first discussion thread', dateUnlocked: 'Jan 16, 2025' },
      { id: 'ach_2', name: 'Safe Dealer', icon: '💎', description: 'Finished 5 successful trades in the market', dateUnlocked: 'Mar 10, 2025' },
      { id: 'ach_3', name: 'Constant Presence', icon: '🔥', description: 'Maintained an active login streak of 7+ days', dateUnlocked: 'May 04, 2025' },
      { id: 'ach_4', name: 'Good Citizen', icon: '🤝', description: 'Earned 100+ positive votes from players', dateUnlocked: 'Jun 01, 2025' }
    ],
    marketplaceRating: {
      positive: 24,
      negative: 0
    }
  },
  {
    id: 'user_xenon',
    username: 'Officer_Xenon',
    role: 'Owner',
    badgeColor: 'bg-red-600 dark:bg-red-500 text-white border-red-700 shadow-sm animate-pulse',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    title: 'Server Owner',
    xp: 45200,
    level: 99,
    coins: 99500,
    signature: '🔨 Coding the Pawn Script | "Report bugs using /report in game."',
    repPoints: 2405,
    trophyPoints: 450,
    joinDate: 'Oct 01, 2024',
    lastActive: '2 min ago',
    dailyStreak: 154,
    bio: 'Primary developer and host of Gonnsen Territory RolePlay. Responsible for server infrastructure, database, and client script performance.',
    postsCount: 1420,
    activeTitle: 'Chief Administrator',
    socialLinks: {
      discord: 'XenonDev#0001'
    },
    achievements: [
      { id: 'ach_owner', name: 'Creator of Gonnsen', icon: '👑', description: 'Created the Gonnsen roleplay platform', dateUnlocked: 'Oct 01, 2024' },
      { id: 'ach_legend', name: 'Old School Gamer', icon: '⚔️', description: 'Awarded to players reaching level 50+', dateUnlocked: 'Feb 12, 2025' }
    ],
    marketplaceRating: {
      positive: 158,
      negative: 1
    }
  },
  {
    id: 'user_kestrel',
    username: 'Dmitri_Kestrel',
    role: 'Community Manager',
    badgeColor: 'bg-orange-600 dark:bg-orange-500 text-white border-orange-700',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    title: 'Head Officer',
    xp: 18900,
    level: 42,
    coins: 14500,
    signature: '📅 Managing Players & Factions | "Play fair, respect other members."',
    repPoints: 910,
    trophyPoints: 280,
    joinDate: 'Nov 12, 2024',
    lastActive: '10 min ago',
    dailyStreak: 45,
    bio: 'Responsible for public relations, moderator supervision, whitelist submissions, and game events. Contact me if you have faction disputes.',
    postsCount: 685,
    activeTitle: 'Staff Supervisor',
    socialLinks: {
      discord: 'DmitriK#4422'
    },
    achievements: [
      { id: 'ach_lead', name: 'Community Leader', icon: '📣', description: 'Organized 5 major city roleplay events', dateUnlocked: 'Dec 20, 2024' }
    ],
    marketplaceRating: {
      positive: 45,
      negative: 0
    }
  },
  {
    id: 'user_blaze',
    username: 'Blaze_Grove',
    role: 'Veteran',
    badgeColor: 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-700',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    title: 'Grove Street Leader',
    xp: 9400,
    level: 25,
    coins: 3820,
    signature: '⚡ Families OG | Grove Street King | "We hold Ganton down."',
    repPoints: 410,
    trophyPoints: 170,
    joinDate: 'Jan 02, 2025',
    lastActive: '1 hour ago',
    dailyStreak: 8,
    bio: 'Representing Grove Street Families. Street boss, vehicle tuner, and guide writer. Check out my shooting and drift guides in tutorials!',
    postsCount: 218,
    activeTitle: 'Grove Street OG',
    socialLinks: {
      discord: 'BlazeGrove#0021'
    },
    achievements: [
      { id: 'ach_pro', name: 'Turf Defender', icon: '🏆', description: 'Defended Grove turf during active gang wars', dateUnlocked: 'Mar 15, 2025' }
    ],
    marketplaceRating: {
      positive: 31,
      negative: 0
    }
  },
  {
    id: 'user_mercenary',
    username: 'Marcus_Ballas',
    role: 'Regular Member',
    badgeColor: 'bg-slate-700 dark:bg-slate-600 text-white border-slate-800',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    title: 'Weapons Dealer',
    xp: 4120,
    level: 11,
    coins: 24800,
    signature: '💎 Selling custom car modifications, custom skins, and trade items! Pure quality.',
    repPoints: 512,
    trophyPoints: 95,
    joinDate: 'Feb 19, 2025',
    lastActive: '5 hours ago',
    dailyStreak: 3,
    bio: 'Custom 3D modeler and script modifier. Designing houses, clothing textures, and custom map models. 100% positive player feedback in the marketplace.',
    postsCount: 92,
    activeTitle: 'Rich Trader',
    socialLinks: {
      discord: 'MarcusBallas#9933'
    },
    achievements: [
      { id: 'ach_econ', name: 'Money Maker', icon: '💰', description: 'Earned over 10,000 marketplace coins', dateUnlocked: 'Apr 02, 2025' }
    ],
    marketplaceRating: {
      positive: 78,
      negative: 0
    }
  },
  {
    id: 'user_noobmaster',
    username: 'Fresh_Rookie',
    role: 'New Member',
    badgeColor: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-600',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    title: 'Recruit',
    xp: 450,
    level: 2,
    coins: 100,
    signature: 'Just a player learning the rules | Hoping to join a faction 🚗',
    repPoints: 8,
    trophyPoints: 10,
    joinDate: 'Jun 05, 2026',
    lastActive: '5 min ago',
    dailyStreak: 1,
    bio: 'Hello everyone! I just joined Gonnsen Territory RolePlay after watching server videos. I am filling out my whitelist application now and want to make friends.',
    postsCount: 6,
    activeTitle: 'New Player',
    socialLinks: {},
    achievements: [],
    marketplaceRating: {
      positive: 1,
      negative: 0
    }
  }
];

export const mockCategories: ForumCategory[] = [
  // Announcements Category
  {
    id: 'cat_announcements',
    name: 'Official News & Server Rules',
    description: 'Official announcements, game rules, staff updates, and bulletins from the server administrators.',
    icon: 'Megaphone',
    type: 'announcements',
    threadCount: 14,
    postCount: 124
  },
  {
    id: 'cat_changelogs',
    name: 'Server Updates & Script Changelogs',
    description: 'Detailed lists of Pawn game script modifications, database changes, map additions, and bugs fixed.',
    icon: 'GitBranch',
    type: 'announcements',
    threadCount: 22,
    postCount: 188
  },
  // Community Category
  {
    id: 'cat_general',
    name: 'General Discussion',
    description: 'Talk with other players about the server, share ideas, and chat about general gaming.',
    icon: 'MessageSquare',
    type: 'general',
    threadCount: 145,
    postCount: 2450
  },
  {
    id: 'cat_suggestions',
    name: 'Suggestions & Feedback',
    description: 'Submit your ideas for script features, new map models, server rules, or forum updates.',
    icon: 'Lightbulb',
    type: 'general',
    threadCount: 89,
    postCount: 812
  },
  {
    id: 'cat_introductions',
    name: 'Player Introductions',
    description: 'New to Gonnsen Territory? Introduce your character and write your player background history.',
    icon: 'UserPlus',
    type: 'general',
    threadCount: 64,
    postCount: 382
  },
  // Servers Category
  {
    id: 'cat_gta_rp',
    name: 'Los Santos Municipal Government',
    description: 'Official boards for the Police Department (LSPD), Medical Services (LSFD), and City Laws.',
    icon: 'ShieldAlert',
    type: 'servers',
    threadCount: 96,
    postCount: 1480
  },
  {
    id: 'cat_minecraft',
    name: 'Factions, Gangs & Gang Territories',
    description: 'Street gang reports, families turf updates, mafia treaties, and faction recruitment boards.',
    icon: 'LayoutGrid',
    type: 'servers',
    threadCount: 48,
    postCount: 520
  },
  // Gaming
  {
    id: 'cat_guides',
    name: 'Roleplay Guides & Tutorials',
    description: 'Helpful tutorials for beginner players, explainers for commands (/me, /do), and character guides.',
    icon: 'BookOpen',
    type: 'guides',
    threadCount: 39,
    postCount: 450
  },
  {
    id: 'cat_media',
    name: 'Screenshots, Media & Creations',
    description: 'Post your custom skin mods, player screenshots, server videos, and trading details.',
    icon: 'Image',
    type: 'guides',
    threadCount: 74,
    postCount: 962
  },
  // Off Topic
  {
    id: 'cat_memes',
    name: 'Off-Topic & Jokes',
    description: 'Chat about general things unrelated to roleplay. Share memes, funny stories, or other games.',
    icon: 'Smile',
    type: 'offtopic',
    threadCount: 112,
    postCount: 1850
  }
];

export const mockThreads: Thread[] = [
  {
    id: 'thread_1',
    forumId: 'cat_announcements',
    title: 'Gonnsen Territory v2.5 Launch: Improved Whitelist, Store & Gang Wars',
    content: `Hello players,

We are excited to announce the release of **Gonnsen Territory v2.5**, our biggest game script update this year.

### What is new in v2.5?
*   **Simple Account Linking**: Link your forum profile to your in-game character instantly. Your level and warning points will update automatically.
*   **In-Game Stats Integration**: Your forum activity and server activity now award you XP and bonus GTRP coins.
*   **Aesthetic Responsive Client**: Built on clean black-and-orange colors that run incredibly fast on any device.
*   **In-Game Trading Market**: Create listings for weapons, modified vehicles, and real estate, allowing players to bid safely.

### Faction Updates:
1.  **LSPD Police Academy**: Newly expanded Cadet guidelines, patrol vehicle packs, and clear criminal warning rules.
2.  **Families (Grove Street)**: Rebuilt the Ganton circle map with custom interior modeling and higher client FPS.

To celebrate, we are hosting a 1.5x in-game job payout rate for the next 72 hours! If you wish to join the Moderation Team or the LSPD Force, please head to the **Applications** tab in the main navigation.

Play safe and have fun!
*- Tony, Xenon, Dmitri (Gonnsen Leads)*`,
    authorId: 'user_xenon',
    prefix: '[Update]',
    tags: ['GTRP v2.5', 'Launch', 'Double Pay'],
    repliesCount: 4,
    viewsCount: 1540,
    isSticky: true,
    isLocked: false,
    createdAt: '2026-06-10T11:00:00Z',
    reactions: {
      'thread_1': {
        'user_kestrel': '🔥',
        'user_blaze': 'GG',
        'user_sardena': 'Love',
        'user_noobmaster': 'Like'
      }
    }
  },
  {
    id: 'thread_2',
    forumId: 'cat_general',
    title: 'Show your custom modified Lowriders! Car Meet',
    content: `Hey everyone, 

I want to see what kind of modified cars you are driving in the server. 

I just customized a Blade lowrider with a chrome exhaust, hydraulic suspension, and gold wire wheels. The car looks amazing. Post your car specs and screenshots below! 🏎️🎮`,
    authorId: 'user_sardena',
    prefix: '[Discussion]',
    tags: ['Cars', 'Lowriders', 'Showcase'],
    repliesCount: 3,
    viewsCount: 342,
    isSticky: false,
    isLocked: false,
    createdAt: '2026-06-11T09:15:00Z',
    reactions: {
      'thread_2': {
        'user_blaze': 'Fire',
        'user_mercenary': 'Like'
      }
    }
  },
  {
    id: 'thread_3',
    forumId: 'cat_guides',
    title: 'ROLEPLAY SURVIVAL GUIDE: Whitelist approval, commands (/me, /do) & basic rules',
    content: `### Welcome to Gonnsen Territory RolePlay! 📚
Whether you want to join the Police Department, work as a taxi driver, or control a street gang, here are the simple golden rules.

#### Section 1: Passing the Whitelist Application
Submit an application inside the Whitelists panel in the top menu. To pass:
1.  **Make a realistic character backstory**: Your character should have realistic flaws (like being a bad driver or getting scared in gun battles). It makes roleplay 100 times better!
2.  **Understand terms like Powergaming and Metagaming**:
    *   *Metagaming*: Using out-of-character information inside the game (e.g. seeing a name tag over a player's head and saying their name without being introduced).
    *   *Powergaming*: Forcing actions on other players (e.g. typing "/me rolls over the car and punches the player into immediate sleep" without giving them a chance to react).

#### Section 2: Using the Core Commands
*   \`/me\`: Perform physical actions (e.g. \`/me reaches into pocket and gives the documents\`)
*   \`/do\`: Describe your environment or ask a physical question (e.g. \`/do is the car door locked?\`)

Good luck, and see you in game!`,
    authorId: 'user_sardena',
    prefix: '[Guides]',
    tags: ['Roleplay', 'Rules', 'Guide'],
    repliesCount: 1,
    viewsCount: 612,
    isSticky: true,
    isLocked: false,
    createdAt: '2026-06-11T14:30:00Z',
    reactions: {
      'thread_3': {
        'user_noobmaster': 'Love',
        'user_kestrel': 'Like'
      }
    }
  },
  {
    id: 'thread_4',
    forumId: 'cat_suggestions',
    title: 'Suggestion: Add custom music sounds to Lowrider events',
    content: `Hey team! It would be really cool to have custom old-school hip hop beats playing from boomboxes or car radios during lowrider hop contests.
    
    I added a ballot poll below to see what you guys think.`,
    authorId: 'user_blaze',
    prefix: '[Suggestions]',
    tags: ['Events', 'Music', 'Lowriders'],
    repliesCount: 2,
    viewsCount: 198,
    isSticky: false,
    isLocked: false,
    createdAt: '2026-06-11T16:00:00Z',
    reactions: {
      'thread_4': {
        'user_sardena': 'Like'
      }
    },
    poll: {
      question: 'Should we add customizable hip-hop music to lowrider matches?',
      options: [
         { id: 'opt_1', text: 'Yes, it perfectly matches the San Andreas vibe.', votes: ['user_sardena', 'user_blaze', 'user_noobmaster'] },
         { id: 'opt_2', text: 'No, it will create lag inside crowded meets.', votes: ['user_kestrel'] },
         { id: 'opt_3', text: 'Yes, but custom radios should only play in low volume.', votes: ['user_xenon', 'user_mercenary'] }
      ],
      isClosed: false
    }
  }
];

export const mockPosts: Post[] = [
  // Replies for thread_1
  {
    id: 'post_1_1',
    threadId: 'thread_1',
    content: `Incredible work Officers! The account linking system works instantly. My character level loaded perfectly. Super excited!`,
    authorId: 'user_kestrel',
    createdAt: '2026-06-10T11:15:00Z',
    reactions: { 'user_xenon': 'Like' }
  },
  {
    id: 'post_1_2',
    threadId: 'thread_1',
    content: `Ganton Circle layout upgrade is great! No FPS drops. Respect from Grove Street!`,
    authorId: 'user_blaze',
    createdAt: '2026-06-10T11:45:00Z',
    reactions: { 'user_kestrel': 'GG' }
  },
  {
    id: 'post_1_3',
    threadId: 'thread_1',
    content: `Love the auction and store layout! Just listed my custom character designs here. Safe trading.`,
    authorId: 'user_mercenary',
    createdAt: '2026-06-10T12:30:00Z',
    reactions: { 'user_sardena': 'Like' }
  },
  {
    id: 'post_1_4',
    threadId: 'thread_1',
    content: `Just registered! Whitelist system looks clear, setting up my backstory now. Great work on this site!`,
    authorId: 'user_noobmaster',
    createdAt: '2026-06-10T15:00:00Z',
    reactions: { 'user_xenon': 'Like' }
  },

  // Replies for thread_2
  {
    id: 'post_2_1',
    threadId: 'thread_2',
    content: `We definitely need a big car meet this Saturday evening. Let's arrange it near the Santa Maria beach pier!`,
    authorId: 'user_blaze',
    createdAt: '2026-06-11T09:45:00Z',
    reactions: { 'user_sardena': 'Love' }
  },
  {
    id: 'post_2_2',
    threadId: 'thread_2',
    content: `I am bringing my custom slamvan! Hydraulics are already maxed out. See you there.`,
    authorId: 'user_mercenary',
    createdAt: '2026-06-11T11:00:00Z',
    reactions: {}
  },
  {
    id: 'post_2_3',
    threadId: 'thread_2',
    content: `I am currently looking for an active trader to paint some custom flames on my Glendale, message me Marcus!`,
    authorId: 'user_noobmaster',
    createdAt: '2026-06-11T11:30:00Z',
    reactions: { 'user_sardena': 'Like' }
  },

  // Replies for thread_3
  {
    id: 'post_3_1',
    threadId: 'thread_3',
    content: `Thanks for the tips about NLR (New Life Rule). I read some guides, and it is crystal clear now. App submitted!`,
    authorId: 'user_noobmaster',
    createdAt: '2026-06-11T14:55:00Z',
    reactions: { 'user_sardena': 'Love' }
  },

  // Replies for thread_4
  {
    id: 'post_4_1',
    threadId: 'thread_4',
    content: `Voted option 3. Volume controls are necessary otherwise lowrider battles get chaotic.`,
    authorId: 'user_kestrel',
    createdAt: '2026-06-11T16:15:00Z',
    reactions: { 'user_blaze': 'Like' }
  },
  {
    id: 'post_4_2',
    threadId: 'thread_4',
    content: `We can restrict boomboxes to only official factions. Let's draft a simple policy for Dmitri.`,
    authorId: 'user_xenon',
    createdAt: '2026-06-11T16:45:00Z',
    reactions: { 'user_blaze': 'Haha' }
  }
];

export const mockMarketplaceListings: MarketplaceListing[] = [
  {
    id: 'list_1',
    title: 'Custom LSPD Police Officer Clothing Pack (FiveM/SA-MP)',
    description: `Selling a fully textured, realistic Police Officer uniform pack, complete with:
*   Standard patrol uniforms
*   Tactical vests with functional handcuffs
*   Riot helmet models and high-vis jackets.
*   Sheriff and Cadet options.

Optimized with clean textures to prevent game lag. Plugs directly into your character portfolio. Available for instant trade.`,
    category: 'graphics',
    type: 'sell',
    price: 450,
    authorId: 'user_mercenary',
    isSold: false,
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80'],
    createdAt: '2026-06-08T15:00:00Z'
  },
  {
    id: 'list_2',
    title: 'Ballas Gang Territory Mansion Custom Mapping (.map/.pwn)',
    description: `A custom-mapped compound layout for the Glen Park area. Details:
1.  **Fully Furnished Interior**: Custom lounge, weapon racks, and high-quality street textures.
2.  **Working Gates**: Action script gates (/gatedoor) with password access.
3.  **Low Poly Count**: Designed specifically to prevent client loading freezes in SA-life.
4.  **Auto-Anti-Glitch**: Safe zones preventing player bugging through walls.

Starting auction bids from 100 GTRP Coins. Includes free developer support and updates.`,
    category: 'development',
    type: 'auction',
    price: 180,
    startingBid: 100,
    currentBid: 180,
    buyNowPrice: 350,
    bids: [
      { bidderId: 'user_sardena', amount: 120, time: '2026-06-09T18:00:00Z' },
      { bidderId: 'user_xenon', amount: 150, time: '2026-06-09T20:15:00Z' },
      { bidderId: 'user_sardena', amount: 180, time: '2026-06-10T09:30:00Z' }
    ],
    authorId: 'user_mercenary',
    isSold: false,
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80'],
    createdAt: '2026-06-09T12:00:00Z'
  },
  {
    id: 'list_3',
    title: 'Custom Faction Poster Designs & Street Graphics',
    description: `Professional graphic illustrations for gangs, police academies, or medical squads. Includes:
*   High-resolution forum recruitment headers
*   Custom gang tag signature graphics for profiles.
*   Forum ranks badges.

Fast 3 days delivery with full changes included. Boost your gang rating!`,
    category: 'graphics',
    type: 'sell',
    price: 120,
    authorId: 'user_sardena',
    isSold: false,
    images: ['https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop&q=80'],
    createdAt: '2026-06-10T14:00:00Z'
  }
];

export const mockAppTemplates: AppTemplate[] = [
  {
    id: 'tpl_staff',
    title: 'Forum Helper & Moderator Application',
    description: 'We are looking for active, helpful, and patient players to help moderate the forums. You must be available for 10+ hours a week-and agree to server moderation rules.',
    questions: [
      { id: 'q_staff_name', type: 'text', label: 'In-Game Character Name', required: true },
      { id: 'q_staff_age', type: 'text', label: 'How old are you? (Must be 16+)', required: true },
      { id: 'q_staff_timezone', type: 'select', label: 'Select your Timezone', options: ['EST (UTC-5)', 'CST (UTC-6)', 'PST (UTC-8)', 'GMT (UTC+0)', 'CET (UTC+1)', 'AEST (UTC+10)'], required: true },
      { id: 'q_staff_hours', type: 'text', label: 'How many hours can you dedicate weekly to helping players?', required: true },
      { id: 'q_staff_why', type: 'textarea', label: 'Why should we select you to join our administration team?', required: true },
      { id: 'q_staff_scenario', type: 'textarea', label: 'Rules Dilemma: A player is spamming bad words in global chat. They say it was their little brother at the computer. What action do you take?', required: true }
    ]
  },
  {
    id: 'tpl_whitelist',
    title: 'Official Player Whitelist Verification',
    description: 'Get whitelisted to play on our SA-MP server. Our servers require players to use realistic character names and behave in a realistic manner.',
    questions: [
      { id: 'q_wl_character', type: 'text', label: 'Your Character Name (First_Last - e.g. Carl_Johnson)', required: true },
      { id: 'q_wl_bio', type: 'textarea', label: 'Explain your character’s background, flaws, and plans in the city.', required: true },
      { id: 'q_wl_failrp', type: 'textarea', label: 'Explain "Powergaming" and give one clear example.', required: true },
      { id: 'q_wl_metagame', type: 'textarea', label: 'Explain "Metagaming" and how you will prevent it during gameplay.', required: true },
      { id: 'q_wl_rules', type: 'checkbox', label: 'I promise to follow all roleplay instructions and server rules.', required: true }
    ]
  }
];

export const mockSubmittedApps: SubmittedApplication[] = [
  {
    id: 'app_1',
    templateId: 'tpl_whitelist',
    applicantId: 'user_noobmaster',
    answers: {
      'q_wl_character': 'Fresh_Rookie',
      'q_wl_bio': 'Fresh Rookie is a young car repair apprentice who arrived in LS on a train with just $50. He wants to save money by doing mechanic work and eventually purchase a home in Temple. He has a weakness for street racing and easily gets panicked when police sirens sound.',
      'q_wl_failrp': 'Powergaming is roleplaying actions that are impossible or do not give other players a chance to escape. For example, doing /me handcuffs the target immediately without asking if they are resisting.',
      'q_wl_metagame': 'Metagaming is using out-of-character info in game. An example is reading the admin chat lines or twitch stream to find player properties.',
      'q_wl_rules': 'true'
    },
    status: 'pending',
    internalNotes: [
      { authorId: 'user_kestrel', note: 'Backstory is very realistic and logical. Excellent understanding of roleplay definitions. Let us approve him.', createdAt: '2026-06-11T12:00:00Z' }
    ],
    createdAt: '2026-06-11T10:00:00Z'
  }
];

export const mockPrivateMessages: PrivateMessageConversation[] = [
  {
    id: 'conv_1',
    participantIds: ['user_sardena', 'user_xenon'],
    messages: [
      { id: 'msg_1_1', senderId: 'user_xenon', text: 'Hey Tony, did you look at the new lowrider mapping files I uploaded?', createdAt: '2026-06-10T14:00:00Z', readBy: ['user_sardena', 'user_xenon'] },
      { id: 'msg_1_2', senderId: 'user_sardena', text: 'Yes, Xenon! They load extremely fast. Did you configure the trading forum script?', createdAt: '2026-06-10T14:10:00Z', readBy: ['user_sardena', 'user_xenon'] },
      { id: 'msg_1_3', senderId: 'user_xenon', text: 'Yes, player coin listings are 100% synchronized with the database.', createdAt: '2026-06-10T14:30:00Z', readBy: ['user_sardena', 'user_xenon'] }
    ]
  },
  {
    id: 'conv_2',
    participantIds: ['user_sardena', 'user_kestrel'],
    messages: [
      { id: 'msg_2_1', senderId: 'user_kestrel', text: 'Hey Tony, can you design an official police recruitment bulletin design for Dmitri?', createdAt: '2026-06-11T11:00:00Z', readBy: ['user_sardena'] },
      { id: 'msg_2_2', senderId: 'user_sardena', text: 'Sure thing, I can use the classic navy blue background with silver badge emblems.', createdAt: '2026-06-11T11:20:00Z', readBy: ['user_kestrel'] }
    ]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'not_1',
    recipientId: 'user_sardena',
    senderId: 'user_xenon',
    type: 'reaction',
    targetType: 'thread',
    targetId: 'thread_1',
    text: 'Officer_Xenon liked your reply on the Server Launch updates thread.',
    isRead: false,
    createdAt: '2026-06-11T12:30:00Z'
  },
  {
    id: 'not_2',
    recipientId: 'user_sardena',
    senderId: 'user_noobmaster',
    type: 'reply',
    targetType: 'thread',
    targetId: 'thread_3',
    text: 'Fresh_Rookie posted a reply to your guide on passing character whitelists.',
    isRead: false,
    createdAt: '2026-06-11T14:55:00Z'
  },
  {
    id: 'not_3',
    recipientId: 'user_sardena',
    senderId: 'user_kestrel',
    type: 'message',
    targetType: 'conversation',
    targetId: 'conv_2',
    text: 'Dmitri_Kestrel sent you a direct layout message about graphics work.',
    isRead: true,
    createdAt: '2026-06-11T11:00:00Z'
  }
];

export const mockReportTickets: ReportTicket[] = [
  {
    id: 'rep_1',
    reporterId: 'user_noobmaster',
    targetType: 'user',
    targetId: 'user_mercenary',
    targetTitle: 'Marcus_Ballas',
    reason: 'Suspicious in-game trading activity without a proper staff escrow. Wanted to notify the moderators.',
    status: 'pending',
    createdAt: '2026-06-11T15:10:00Z'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log_1',
    actorId: 'user_xenon',
    action: 'SERVER_UPGRADE',
    target: 'Gonnsen Pawn Script v2.5',
    timestamp: '2026-06-10T10:00:00Z',
    details: 'Completed main database security checks and linked active players.'
  },
  {
    id: 'log_2',
    actorId: 'user_kestrel',
    action: 'THREAD_MODIFY',
    target: 'Whitelist Rules & Instructions',
    timestamp: '2026-06-11T11:15:00Z',
    details: 'Set rules and guide thread as sticky.'
  }
];
