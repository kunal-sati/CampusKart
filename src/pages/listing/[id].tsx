import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Coins,
  Star,
  MessageCircle,
  HandshakeIcon,
  ChevronLeft,
  MapPin,
  Clock,
  Tag,
  Share2,
  Heart,
  AlertCircle,
  X,
  Send,
  CheckCheck,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  Gavel,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

import { listingsMap } from '@/data/listings';

// ─── Data ─────────────────────────────────────────────────────────────────────

const listings = listingsMap;

const conditionColors: Record<string, string> = {
  'Like New': 'bg-emerald-50 text-emerald-700',
  'Good': 'bg-blue-50 text-blue-700',
  'Fair': 'bg-amber-50 text-amber-700',
};

const typeLabels: Record<string, string> = {
  sell: 'For Sale',
  rent: 'For Rent',
  borrow: 'For Borrow',
  service: 'Service',
};

// ─── Chat Types ───────────────────────────────────────────────────────────────

interface Message {
  id: number;
  from: 'me' | 'seller';
  text: string;
  time: string;
  read: boolean;
}

function getInitialMessages(sellerName: string, itemTitle: string): Message[] {
  return [
    {
      id: 1,
      from: 'seller',
      text: `Hi! Thanks for your interest in "${itemTitle}". Feel free to ask any questions.`,
      time: '2:10 PM',
      read: true,
    },
  ];
}

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const sellerReplies = [
  "Sure, it's available! When would you like to meet?",
  "Yes, the condition is exactly as described. No issues at all.",
  "I'm usually free after 5 PM near the library. Works for you?",
  "You can pay in Campus Credits or cash, both are fine.",
  "Let me know if you'd like to inspect it before buying.",
  "Happy to negotiate a little. What's your budget?",
];

// ─── Chat Drawer ──────────────────────────────────────────────────────────────

function ChatDrawer({
  seller,
  itemTitle,
  onClose,
  buyerName,
}: {
  seller: typeof listings['1']['seller'];
  itemTitle: string;
  onClose: () => void;
  buyerName?: string;
}) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const initial = getInitialMessages(seller.name, itemTitle);
    if (buyerName) {
      // Prepend a system-style note and a pre-filled accept message
      const acceptMsg: Message = {
        id: Date.now() - 1,
        from: 'me',
        text: `Hi! I saw your bid of ${buyerName ? 'the top bid' : ''} on "${itemTitle}". I'd like to accept it — when can we meet to complete the exchange?`,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        read: false,
      };
      return [...initial, acceptMsg];
    }
    return initial;
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const myMsg: Message = { id: Date.now(), from: 'me', text, time: now(), read: false };
    setMessages(prev => [...prev, myMsg]);
    setInput('');

    // Simulate seller typing + reply
    setIsTyping(true);
    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      setIsTyping(false);
      const reply = sellerReplies[Math.floor(Math.random() * sellerReplies.length)];
      setMessages(prev => [
        ...prev.map(m => m.from === 'me' ? { ...m, read: true } : m),
        { id: Date.now() + 1, from: 'seller', text: reply, time: now(), read: true },
      ]);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = ['Is it still available?', 'Can you do 80 credits?', 'Where can we meet?'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="bg-card h-full w-full sm:w-[400px] flex flex-col shadow-2xl"
        style={{ maxHeight: '100dvh' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card flex-shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              {seller.avatar}
            </div>
            {seller.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10B981' }}>
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-foreground truncate">{seller.name}</p>
              {seller.verified && (
                <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: '#059669' }}>✓ Verified</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{seller.branch} · {seller.year}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors ml-1"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Item Context Banner */}
        <div className="px-4 py-2.5 bg-muted/50 border-b border-border flex-shrink-0">
          <p className="text-xs text-muted-foreground">
            Chatting about: <span className="font-semibold text-foreground truncate">{itemTitle}</span>
          </p>
        </div>

        {/* Accepting Bid Banner */}
        {buyerName && (
          <div className="px-4 py-2.5 border-b border-purple-100 flex-shrink-0 flex items-center gap-2" style={{ background: 'linear-gradient(90deg,rgba(109,40,217,0.08),rgba(79,70,229,0.06))' }}>
            <Gavel className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
            <p className="text-xs font-semibold text-purple-700">
              Accepting top bid — coordinate pickup &amp; payment below
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' as const }}
              className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.from === 'seller' && (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mr-2 mt-auto">
                  {seller.avatar}
                </div>
              )}
              <div className={`max-w-[75%] flex flex-col ${msg.from === 'me' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === 'me'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  {msg.from === 'me' && (
                    <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="flex items-end gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {seller.avatar}
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' as const }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Quick Replies */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 flex-shrink-0">
            {quickReplies.map(qr => (
              <button
                key={qr}
                onClick={() => { setInput(qr); inputRef.current?.focus(); }}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                {qr}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                input.trim()
                  ? 'bg-primary text-white hover:bg-primary/90 scale-100'
                  : 'bg-muted-foreground/20 text-muted-foreground scale-90'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Messages are only visible to you and the seller
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Bid Modal ────────────────────────────────────────────────────────────────

function BidModal({
  listing,
  onClose,
}: {
  listing: typeof listings['1'];
  onClose: () => void;
}) {
  const askingCredits = listing.credits;
  const minBid = Math.max(1, Math.floor(askingCredits * 0.5));
  const maxBid = Math.ceil(askingCredits * 1.3);

  const [bid, setBid] = useState(askingCredits);
  const [submitted, setSubmitted] = useState(false);

  const pct = ((bid - minBid) / (maxBid - minBid)) * 100;

  const bidLabel = () => {
    if (bid < askingCredits * 0.75) return { text: 'Low Offer', color: 'text-red-500', bg: 'bg-red-50', icon: TrendingDown };
    if (bid < askingCredits * 0.95) return { text: 'Below Asking', color: 'text-amber-500', bg: 'bg-amber-50', icon: Minus };
    if (bid <= askingCredits * 1.05) return { text: 'Fair Offer', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 };
    return { text: 'Above Asking', color: 'text-blue-600', bg: 'bg-blue-50', icon: TrendingUp };
  };

  const label = bidLabel();
  const LabelIcon = label.icon;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' as const }}
        className="bg-card rounded-3xl border border-border shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#4F46E5,#6D28D9)' }}>
              <Gavel className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                Place a Bid
              </h2>
              <p className="text-xs text-muted-foreground">Negotiate with Campus Credits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 flex flex-col gap-6">
              {/* Item Summary */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-2xl">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                    {listing.title}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Coins className="w-3 h-3" style={{ color: '#10B981' }} />
                    <span className="text-xs text-muted-foreground">Asking: <span className="font-bold text-foreground">{askingCredits} credits</span></span>
                  </div>
                </div>
              </div>

              {/* Bid Display */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Your Offer</p>
                <motion.div
                  key={bid}
                  initial={{ scale: 0.9, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Coins className="w-7 h-7" style={{ color: '#10B981' }} />
                  <span className="text-5xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    {bid}
                  </span>
                  <span className="text-lg text-muted-foreground font-medium self-end mb-1">credits</span>
                </motion.div>

                {/* Bid Label */}
                <motion.div
                  key={label.text}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold ${label.bg} ${label.color}`}
                >
                  <LabelIcon className="w-3 h-3" />
                  {label.text}
                </motion.div>
              </div>

              {/* Slider */}
              <div className="px-1">
                <Slider
                  min={minBid}
                  max={maxBid}
                  step={1}
                  value={[bid]}
                  onValueChange={([v]) => setBid(v)}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>{minBid} cr (min)</span>
                  <span className="text-primary font-semibold">{askingCredits} cr (asking)</span>
                  <span>{maxBid} cr (max)</span>
                </div>
              </div>

              {/* Progress Bar showing position */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: pct < 40 ? '#EF4444' : pct < 65 ? '#F59E0B' : pct < 80 ? '#10B981' : '#3B82F6',
                  }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.15 }}
                />
                {/* Asking price marker */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-primary/40"
                  style={{ left: `${((askingCredits - minBid) / (maxBid - minBid)) * 100}%` }}
                />
              </div>

              {/* Quick Bid Presets */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Quick select</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: '50%', val: Math.round(askingCredits * 0.5) },
                    { label: '75%', val: Math.round(askingCredits * 0.75) },
                    { label: 'Asking', val: askingCredits },
                    { label: '+10%', val: Math.round(askingCredits * 1.1) },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => setBid(Math.min(maxBid, Math.max(minBid, preset.val)))}
                      className={`flex-1 text-xs font-semibold py-2 rounded-xl border transition-colors ${
                        bid === preset.val
                          ? 'bg-primary text-white border-primary'
                          : 'bg-background text-foreground border-border hover:border-primary/40'
                      }`}
                    >
                      {preset.label}
                      <span className="block text-[10px] font-normal opacity-70">{preset.val} cr</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your bid will be sent to the seller. Credits are only deducted once the seller accepts.
                </p>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                className="w-full rounded-xl py-5 font-semibold gap-2 text-white"
                style={{ background: 'linear-gradient(135deg,#4F46E5,#6D28D9)' }}
              >
                <Gavel className="w-4 h-4" />
                Send Bid · {bid} Credits
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
              className="p-8 flex flex-col items-center text-center gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}
              >
                <CheckCircle2 className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  Bid Sent!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your offer of <span className="font-bold text-foreground">{bid} credits</span> has been sent to {listing.seller.name}.
                </p>
                <p className="text-xs text-muted-foreground mt-1">You'll be notified when they respond.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted rounded-xl w-full justify-center">
                <Coins className="w-4 h-4" style={{ color: '#10B981' }} />
                <span className="text-sm font-semibold text-foreground">{bid} credits reserved</span>
              </div>
              <Button variant="outline" onClick={onClose} className="w-full rounded-xl">
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const listing = id ? listings[id] : null;
  const [chatOpen, setChatOpen] = useState(() => searchParams.get('chat') === 'open');
  const [bidOpen, setBidOpen] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Listing not found</h2>
        <p className="text-muted-foreground text-sm">This listing may have been removed or doesn't exist.</p>
        <Link to="/browse">
          <Button>Browse All Listings</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <title>{listing.title} — CampusKart</title>
      <meta name="description" content={listing.description.slice(0, 160)} />

      {/* Chat Drawer */}
      <AnimatePresence>
        {chatOpen && (
          <ChatDrawer
            seller={listing.seller}
            itemTitle={listing.title}
            onClose={() => setChatOpen(false)}
            buyerName={searchParams.get('buyer') ?? undefined}
          />
        )}
      </AnimatePresence>

      {/* Bid Modal */}
      <AnimatePresence>
        {bidOpen && (
          <BidModal
            listing={listing}
            onClose={() => setBidOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Browse
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Image + Details */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' as const }}
                className="relative rounded-3xl overflow-hidden bg-muted aspect-video"
              >
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                    listing.type === 'sell' ? 'bg-blue-600 text-white' :
                    listing.type === 'rent' ? 'bg-amber-500 text-white' :
                    'bg-purple-600 text-white'
                  }`}>
                    {typeLabels[listing.type]}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>

              {/* Title & Meta */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' as const }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-primary px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(79,70,229,0.08)' }}>
                    {listing.category}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${conditionColors[listing.condition] ?? 'bg-muted text-muted-foreground'}`}>
                    {listing.condition}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4 leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
                  {listing.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {listing.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Posted {listing.postedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    ₹{listing.price} / {listing.credits} credits
                  </span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' as const }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h2 className="font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
              </motion.div>
            </div>

            {/* Right: Pricing + Seller */}
            <div className="flex flex-col gap-5">
              {/* Pricing Card */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' as const }}
                className="bg-card rounded-2xl border border-border p-6 shadow-sm"
              >
                <div className="flex items-end gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-5 h-5" style={{ color: '#10B981' }} />
                    <span className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                      {listing.credits}
                    </span>
                    <span className="text-base text-muted-foreground font-medium">credits</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-5">or ₹{listing.price} cash</p>

                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl py-5 gap-2"
                    onClick={() => setBidOpen(true)}
                  >
                    <HandshakeIcon className="w-4 h-4" />
                    Request {listing.type === 'rent' ? 'Rental' : listing.type === 'borrow' ? 'Borrow' : 'Purchase'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl py-5 gap-2 border-primary/30 text-primary hover:bg-primary/5"
                    onClick={() => setChatOpen(true)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat with Seller
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
                  Safe campus trade — verified students only
                </div>
              </motion.div>

              {/* Seller Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' as const }}
                className="bg-card rounded-2xl border border-border p-6 shadow-sm"
              >
                <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  Seller Profile
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                      {listing.seller.avatar}
                    </div>
                    {listing.seller.verified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10B981' }}>
                        <ShieldCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-sm">{listing.seller.name}</p>
                      {listing.seller.verified && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669' }}>
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{listing.seller.branch} · {listing.seller.year}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Rating', value: listing.seller.rating.toFixed(1), icon: Star },
                    { label: 'Reviews', value: listing.seller.reviews, icon: MessageCircle },
                    { label: 'Listings', value: listing.seller.totalListings, icon: Tag },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="text-center bg-muted rounded-xl p-2.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
                      <p className="text-sm font-bold text-foreground">{value}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mb-4">Member since {listing.seller.joined}</p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setChatOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message Seller
                  </button>
                  <Link to="/profile">
                    <Button variant="outline" className="w-full rounded-xl text-sm">
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Safety Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800 mb-1">Safety Tips</p>
                    <ul className="text-xs text-amber-700 space-y-0.5 list-disc list-inside">
                      <li>Meet in a public campus area</li>
                      <li>Inspect item before paying</li>
                      <li>Use Campus Credits for safety</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
