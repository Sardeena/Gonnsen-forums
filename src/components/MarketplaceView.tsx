/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Search, 
  PlusCircle, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  User, 
  Star, 
  CheckCircle, 
  AlertTriangle, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  Gavel,
  Shield,
  FileCheck,
  Package
} from 'lucide-react';
import { MarketplaceListing, User as UserType, Bid } from '../types';

interface MarketplaceViewProps {
  listings: MarketplaceListing[];
  allUsers: UserType[];
  currentUser: UserType;
  onCreateListing: (listingData: Partial<MarketplaceListing>) => void;
  onModifyListing: (listingId: string, updated: Partial<MarketplaceListing>) => void;
  onSubmitReport: (reportData: { targetType: 'listing' | 'user'; targetId: string; targetTitle: string; reason: string }) => void;
  onChangeUserCoins: (userId: string, delta: number) => void;
  onAddNotification: (notifData: any) => void;
}

export default function MarketplaceView({
  listings,
  allUsers,
  currentUser,
  onCreateListing,
  onModifyListing,
  onSubmitReport,
  onChangeUserCoins,
  onAddNotification
}: MarketplaceViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeType, setActiveType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);

  // Form states for new listing
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(10);
  const [buyNowPrice, setBuyNowPrice] = useState(0);
  const [startingBid, setStartingBid] = useState(0);
  const [listCategory, setListCategory] = useState<'items' | 'accounts' | 'services' | 'development' | 'graphics' | 'other'>('items');
  const [listType, setListType] = useState<'sell' | 'buy' | 'trade' | 'auction'>('sell');
  const [imageUrl, setImageUrl] = useState('');

  // Bid option state
  const [bidAmount, setBidAmount] = useState<number>(0);

  // Dispute state inside detailed listing
  const [showReportForm, setShowReportForm] = useState(false);
  const [scamReason, setScamReason] = useState('');

  // Seller rating state
  const [hasRatedSeller, setHasRatedSeller] = useState(false);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'items', label: 'In-game items' },
    { id: 'accounts', label: 'Gaming accounts' },
    { id: 'services', label: 'Clans, services' },
    { id: 'development', label: 'Custom coding' },
    { id: 'graphics', label: 'Gaming graphics' },
    { id: 'other', label: 'Miscellaneous' }
  ];

  const types = [
    { id: 'all', label: 'All Trades' },
    { id: 'sell', label: 'Offering Sale' },
    { id: 'buy', label: 'Want to Buy (WTB)' },
    { id: 'trade', label: 'Barter Deals' },
    { id: 'auction', label: 'Active Auctions' }
  ];

  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;

    const listData: Partial<MarketplaceListing> = {
      title,
      description: desc,
      category: listCategory,
      type: listType,
      price: Number(price),
      isSold: false,
      images: [imageUrl.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80'],
      createdAt: new Date().toISOString(),
      authorId: currentUser.id
    };

    if (listType === 'auction') {
      listData.startingBid = Number(startingBid) || Number(price);
      listData.currentBid = Number(startingBid) || Number(price);
      listData.buyNowPrice = Number(buyNowPrice) || (Number(price) * 1.5);
      listData.bids = [];
    }

    onCreateListing(listData);

    // Reset Form
    setTitle('');
    setDesc('');
    setPrice(10);
    setBuyNowPrice(0);
    setStartingBid(0);
    setImageUrl('');
    setShowCreateModal(false);
  };

  const handleBuyNow = (listing: MarketplaceListing) => {
    if (currentUser.coins < listing.price) {
      alert(`Insufficient Nexus Credits (N$)! Standard price is ${listing.price} N$, but you only possess ${currentUser.coins} N$. Post discussions or claim daily streaks to earn more!`);
      return;
    }

    // Deduct coins from buyer
    onChangeUserCoins(currentUser.id, -listing.price);
    // Add coins to seller
    onChangeUserCoins(listing.authorId, listing.price);

    // Update listing status
    onModifyListing(listing.id, { isSold: true });

    // Send Notification to Seller
    onAddNotification({
      recipientId: listing.authorId,
      senderId: currentUser.id,
      type: 'marketplace',
      targetType: 'listing',
      targetId: listing.id,
      text: `🎉 Listing purchase: ${currentUser.username} bought "${listing.title}" for ${listing.price} N$! Credits transferred instantly.`,
      createdAt: new Date().toISOString()
    });

    // Update active modal representation
    setSelectedListing(prev => prev ? { ...prev, isSold: true } : null);
    alert(`Success! Deployed instant sync. ${listing.price} N$ has been debited. You received rights for this customized gameplay mod.`);
  };

  const handlePlaceBid = (listing: MarketplaceListing) => {
    const activeCurrentBid = listing.currentBid || listing.startingBid || listing.price;
    if (bidAmount <= activeCurrentBid) {
      alert(`Proposed bid of ${bidAmount} N$ must exceed current highest bid of ${activeCurrentBid} N$. Adjust and try again.`);
      return;
    }

    if (currentUser.coins < bidAmount) {
      alert(`Insufficient funds! Your bid requires ${bidAmount} N$, but you hold ${currentUser.coins} N$.`);
      return;
    }

    const newBid: Bid = {
      bidderId: currentUser.id,
      amount: bidAmount,
      time: new Date().toISOString()
    };

    const updatedBids = [...(listing.bids || []), newBid];
    onModifyListing(listing.id, {
      currentBid: bidAmount,
      bids: updatedBids
    });

    // Notify seller
    onAddNotification({
      recipientId: listing.authorId,
      senderId: currentUser.id,
      type: 'marketplace',
      targetType: 'listing',
      targetId: listing.id,
      text: `📈 New Bid alert: ${currentUser.username} bid ${bidAmount} N$ on your auction "${listing.title}".`,
      createdAt: new Date().toISOString()
    });

    // Update detail overlay state
    setSelectedListing(prev => prev ? { ...prev, currentBid: bidAmount, bids: updatedBids } : null);
    setBidAmount(0);
    alert(`Success! Bid registered at ${bidAmount} N$. You are currently lead bidder on this auction node.`);
  };

  const handleSellerRating = (listing: MarketplaceListing, positive: boolean) => {
    if (hasRatedSeller) return;

    const sellerUser = allUsers.find(u => u.id === listing.authorId);
    if (!sellerUser) return;

    const updatedRating = { ...sellerUser.marketplaceRating };
    if (positive) {
      updatedRating.positive += 1;
    } else {
      updatedRating.negative += 1;
    }

    // Simple mock update user list ratings or raise notification
    onAddNotification({
      recipientId: listing.authorId,
      senderId: currentUser.id,
      type: 'reaction',
      targetType: 'listing',
      targetId: listing.id,
      text: `⭐ Trust rating: ${currentUser.username} left a ${positive ? 'POSITIVE' : 'NEGATIVE'} feedback for transactions.`,
      createdAt: new Date().toISOString()
    });

    setHasRatedSeller(true);
    alert('Thank you! Your seller trust review was synced into the Unified Gaming Identity database.');
  };

  const handleScamReportSubmit = (e: React.FormEvent, listing: MarketplaceListing) => {
    e.preventDefault();
    if (!scamReason.trim()) return;

    onSubmitReport({
      targetType: 'listing',
      targetId: listing.id,
      targetTitle: `Marketplace item: ${listing.title}`,
      reason: `Dispute Report filed by ${currentUser.username}: ${scamReason}`
    });

    // Send notifications to core administrators
    const mods = allUsers.filter(u => ['Owner', 'Administrator', 'Moderator'].includes(u.role));
    mods.forEach(mod => {
      onAddNotification({
        recipientId: mod.id,
        senderId: currentUser.id,
        type: 'staff_app',
        targetType: 'app',
        targetId: 'admin_dispute',
        text: `🛡️ Scam Dispute filed against seller by ${currentUser.username} regarding: "${listing.title}".`,
        createdAt: new Date().toISOString()
      });
    });

    setShowReportForm(false);
    setScamReason('');
    alert('Security Alert Synced: Your dispute has been flagged for audit review. Admins will review logs momentarily.');
  };

  const filteredListings = listings.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesType = activeType === 'all' || item.type === activeType;
    const matchesQuery = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Marketplace Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">NEXUS ESCROW COMMERCE</span>
          <h1 className="text-xl font-extrabold text-zinc-800 dark:text-zinc-50 uppercase tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-5.5 w-5.5 text-indigo-505 text-indigo-550" />
            Global Gaming Trading Arena
          </h1>
          <p className="text-xs text-zinc-500 max-w-lg mt-0.5">Secure, local-escrow trading. Buy custom FiveM models, Minecraft plugins, discord overlays, or trade server credentials safely with ratings sync.</p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-505 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Create Trade Offer
        </button>
      </div>

      {/* Sorting & Filters bar */}
      <div className="flex flex-col xl:flex-row gap-4">
        
        {/* Left Category sidebar */}
        <div className="xl:w-64 space-y-4 shrink-0">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 p-4 rounded-2xl space-y-3 shadow-sm">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Market classifications</span>
            
            <div className="space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg font-medium transition ${activeCategory === c.id ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-800'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 p-4 rounded-2xl space-y-3 shadow-sm">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Trade agreements</span>
            
            <div className="space-y-1">
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveType(t.id)}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg font-medium transition ${activeType === t.id ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-800'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secure Escrow Protection badge */}
          <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl space-y-2 text-xs text-zinc-650 dark:text-zinc-400 font-sans">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
              <Shield className="h-4 w-4" />
              <span>Escrow Verified</span>
            </div>
            <p className="text-[10px] leading-relaxed">Purchases hold money in trust for 48 hours. Submit disputes to moderators if server keys fail.</p>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex-1 space-y-4">
          
          {/* Marketplace Search */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search listings (e.g., FiveM, police vest, Minecraft quest tool...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-xl text-zinc-850 dark:text-zinc-100 outline-none focus:border-indigo-550"
            />
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-400" />
          </div>

          {/* Active listings card list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredListings.length === 0 ? (
              <div className="col-span-full py-16 text-center border rounded-2xl bg-zinc-50 dark:bg-zinc-950/20 space-y-2 text-zinc-500">
                <Package className="h-8 w-8 mx-auto text-zinc-400" />
                <p className="font-bold">No active merchandise found.</p>
                <p className="text-xs">Adjust your category options or toggle filters to check older trades.</p>
              </div>
            ) : (
              filteredListings.map((listing) => {
                const author = allUsers.find(u => u.id === listing.authorId);
                const isWinner = listing.type === 'auction';

                return (
                  <div 
                    key={listing.id}
                    onClick={() => { setSelectedListing(listing); setHasRatedSeller(false); }}
                    className="bg-white dark:bg-zinc-90 w-full border border-zinc-200 dark:border-zinc-805 rounded-2xl overflow-hidden hover:shadow-md hover:border-indigo-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Image header */}
                      <div className="h-44 bg-zinc-100 dark:bg-zinc-900 relative">
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title} 
                          className="w-full h-full object-cover" 
                        />
                        {listing.isSold && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                            <span className="px-3 py-1.5 border-2 border-amber-500 text-amber-500 font-mono text-xs font-extrabold uppercase tracking-widest rounded-lg transform -rotate-6">
                              Sold Out
                            </span>
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 bg-zinc-950/80 text-white font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded backdrop-blur-xs tracking-wider">
                          {listing.category}
                        </span>
                        <span className="absolute bottom-2.5 right-2.5 bg-indigo-600 border border-indigo-700 text-white font-mono text-[10px] font-black uppercase px-2.5 py-1 rounded backdrop-blur-xs shadow">
                          {listing.type}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="p-4 space-y-2.5">
                        <h3 className="text-xs sm:text-sm font-bold text-zinc-850 dark:text-zinc-50 truncate">
                          {listing.title}
                        </h3>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {listing.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          {author && (
                            <img src={author.avatar} alt={author.username} className="h-4.5 w-4.5 rounded-full object-cover" />
                          )}
                          <span className="text-zinc-650 dark:text-zinc-350 font-bold">{author?.username}</span>
                          <span className="text-zinc-300">•</span>
                          <span className="text-emerald-500 font-mono font-bold">★ {author?.marketplaceRating.positive || 1} positives</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer status */}
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-805 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-tight block">Price Valuation</span>
                        <span className="font-mono text-xs font-extrabold text-indigo-605 text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                          {isWinner ? `${listing.currentBid || listing.startingBid} N$` : `${listing.price} N$`}
                        </span>
                      </div>
                      <span className="text-[9.5px] font-mono text-indigo-650 hover:underline flex items-center gap-0.5 font-bold">
                        Inspect Trade Item →
                      </span>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>

      {/* Creation Modal form */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-1.5 animate-pulse">
                <ShoppingBag className="h-4.5 w-4.5" />
                Upload Marketplace Advertisement
              </span>
              <button onClick={() => setShowCreateModal(false)} className="text-xs text-zinc-400 font-mono">✕ Close</button>
            </div>

            <form onSubmit={handleCreateListingSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Category</label>
                  <select 
                    value={listCategory} 
                    onChange={(e: any) => setListCategory(e.target.value)}
                    className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-lg"
                  >
                    <option value="items">In-game Item</option>
                    <option value="accounts">Gaming Account</option>
                    <option value="services">Clan & Esports Service</option>
                    <option value="development">Developer script code</option>
                    <option value="graphics">Photoshop / streaming frames</option>
                    <option value="other">Other details</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Commercial Agreement Type</label>
                  <select 
                    value={listType} 
                    onChange={(e: any) => setListType(e.target.value)}
                    className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-lg"
                  >
                    <option value="sell">Direct Sale</option>
                    <option value="buy">Want to Buy (WTB)</option>
                    <option value="trade">Barter Trade</option>
                    <option value="auction">Bidding Auction</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Asset Commercial Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="FiveM custom paramedic apparel bundle v2"
                  className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Asset Visual Cover Link (Unsplash recommended)</label>
                <input 
                  type="text" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct https:// images URL"
                  className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Detailed specifications description</label>
                <textarea 
                  rows={4} 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Item details: features list, compatibility checks, installation tutorial details, or license duration constraints..."
                  className="w-full mt-1 p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-lg text-xs font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Price valuation (N$)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-lg"
                    min={1}
                    required
                  />
                </div>

                {listType === 'auction' && (
                  <>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Starting Bid (N$)</label>
                      <input 
                        type="number" 
                        value={startingBid} 
                        onChange={(e) => setStartingBid(Number(e.target.value))}
                        className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Direct Buy-Now (N$)</label>
                      <input 
                        type="number" 
                        value={buyNowPrice} 
                        onChange={(e) => setBuyNowPrice(Number(e.target.value))}
                        className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-lg"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 text-xs pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-xl hover:bg-zinc-50">Cancel proposal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow">Deploy Item Advertisement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed listing item details overlay Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-2xl relative">
            
            <div className="p-4 border-b border-zinc-150 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">MERCHANDISE REPORT NODES #{selectedListing.id.split('_')[1] || '1'}</span>
              <button onClick={() => { setSelectedListing(null); setShowReportForm(false); }} className="text-xs text-zinc-400 font-mono">✕ Close</button>
            </div>

            <div className="p-5 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-52 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden shadow">
                  <img src={selectedListing.images[0]} alt={selectedListing.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="space-y-3.5">
                  <span className="bg-indigo-505 bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 rounded font-mono font-bold text-[9px] px-2.5 py-0.5 uppercase">
                    {selectedListing.category}
                  </span>
                  <h2 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-50">{selectedListing.title}</h2>
                  
                  {/* Price info table */}
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-zinc-400 font-bold uppercase text-[9px]">Sale price:</span>
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{selectedListing.price} N$</span>
                    </div>

                    {selectedListing.type === 'auction' && (
                      <>
                        <div className="flex justify-between font-mono mt-1">
                          <span className="text-zinc-400 font-bold uppercase text-[9px]">Current Leading bid:</span>
                          <span className="font-extrabold text-amber-600">{selectedListing.currentBid || selectedListing.startingBid} N$</span>
                        </div>
                        <div className="flex justify-between font-mono mt-1">
                          <span className="text-zinc-400 font-bold uppercase text-[9px]">Direct Buy now:</span>
                          <span className="font-extrabold text-emerald-600">{selectedListing.buyNowPrice} N$</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Operational triggers */}
                  {!selectedListing.isSold ? (
                    <div className="space-y-2 pt-1">
                      {selectedListing.type === 'auction' ? (
                        <div className="space-y-1.5 font-mono">
                          <div className="flex gap-2">
                            <input 
                              type="number" 
                              value={bidAmount} 
                              onChange={(e) => setBidAmount(Number(e.target.value))}
                              placeholder="Insert higher bid amount..." 
                              className="flex-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 text-xs rounded-xl outline-none"
                            />
                            <button 
                              onClick={() => handlePlaceBid(selectedListing)}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                            >
                              <Gavel className="h-4 w-4" />
                              Bid
                            </button>
                          </div>
                          <span className="text-[9px] text-zinc-400">Owner bidder cannot bids. Standard terms apply.</span>
                        </div>
                      ) : (
                        currentUser.id !== selectedListing.authorId && (
                          <button 
                            onClick={() => handleBuyNow(selectedListing)}
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow"
                          >
                            <DollarSign className="h-4.5 w-4.5" />
                            Purchase with Nexus Escrow Safeguard
                          </button>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-center rounded-xl font-mono text-xs text-amber-500 font-bold uppercase tracking-tight">
                      ✓ Trade successfully completed & archived
                    </div>
                  )}
                </div>
              </div>

              {/* Specs text detailed */}
              <div className="border-t pt-4 space-y-2">
                <label className="text-[10px] uppercase font-mono text-zinc-400 font-extrabold block">Asset description list & rules</label>
                <div className="text-xs p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-805 rounded-xl text-zinc-700 dark:text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed line-clamp-3">
                  {selectedListing.description}
                </div>
              </div>

              {/* Bids history timelines */}
              {selectedListing.type === 'auction' && (selectedListing.bids || []).length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono text-zinc-400 font-extrabold block">Bidding history timeline</label>
                  <div className="space-y-1.5 p-3.5 bg-zinc-55 dark:bg-zinc-950/20 border rounded-xl divide-y">
                    {(selectedListing.bids || []).map((b, bIdx) => {
                      const bidderUser = allUsers.find(u => u.id === b.bidderId);
                      return (
                        <div key={bIdx} className="flex justify-between items-center text-xs py-1.5 font-mono text-zinc-500">
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">★ {bidderUser?.username || 'Gamer'}</span>
                          <span className="text-[10px] text-zinc-400">{new Date(b.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">+{b.amount} N$</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seller Feedback system */}
              {selectedListing.isSold && currentUser.id !== selectedListing.authorId && (
                <div className="border-t pt-4 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-indigo-500" />
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 uppercase font-mono">Feedback trust survey on seller</span>
                  </div>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => handleSellerRating(selectedListing, true)}
                      disabled={hasRatedSeller}
                      className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100/50 text-indigo-600 border border-indigo-500/20 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Vote POSITIVE seller experience
                    </button>
                    <button 
                      onClick={() => handleSellerRating(selectedListing, false)}
                      disabled={hasRatedSeller}
                      className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100/50 text-rose-600 border border-rose-500/20 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Vote NEGATIVE Seller Experience
                    </button>
                  </div>
                </div>
              )}

              {/* SCAM REPORT DISPUTES PANEL */}
              {currentUser.id !== selectedListing.authorId && (
                <div className="border-t pt-4">
                  {!showReportForm ? (
                    <button 
                      onClick={() => setShowReportForm(true)}
                      className="text-[10px] font-mono font-bold text-rose-500 hover:underline flex items-center gap-1"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Report suspicious advertisement or billing scam?
                    </button>
                  ) : (
                    <form onSubmit={(e) => handleScamReportSubmit(e, selectedListing)} className="space-y-3 p-3.5 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                      <div className="flex justify-between items-center text-xs text-rose-605">
                        <span className="font-bold flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          Security Escrow Dispute logger
                        </span>
                        <button type="button" onClick={() => setShowReportForm(false)} className="text-[10px]">Cancel reporting</button>
                      </div>
                      <textarea 
                        required
                        rows={3}
                        value={scamReason}
                        onChange={(e) => setScamReason(e.target.value)}
                        placeholder="State why this listing is scamming or holds stolen system scripts (e.g. author selling leaked resources)..."
                        className="w-full p-2.5 bg-white border border-rose-200 rounded-lg text-xs font-mono outline-none"
                      />
                      <button type="submit" className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold font-mono">
                        Submit Dispute Ticket
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
