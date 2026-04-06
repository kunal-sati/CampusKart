import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShieldCheck,
  Coins,
  MapPin,
  Star,
  ChevronRight,
  BookOpen,
  FileText,
  Calculator,
  FlaskConical,
  Bike,
  Wrench,
  ArrowRight,
  Upload,
  Tag,
  MessageCircle,
  X,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listings as sharedListings, featuredListings as featuredData, recentListings as recentData } from '@/data/listings';

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  { label: 'Books', icon: BookOpen, color: 'bg-blue-100 text-blue-600', href: '/browse?cat=books' },
  { label: 'Notes', icon: FileText, color: 'bg-purple-100 text-purple-600', href: '/browse?cat=notes' },
  { label: 'Calculators', icon: Calculator, color: 'bg-amber-100 text-amber-600', href: '/browse?cat=calculators' },
  { label: 'Lab Equipment', icon: FlaskConical, color: 'bg-green-100 text-green-600', href: '/browse?cat=lab' },
  { label: 'Bikes', icon: Bike, color: 'bg-rose-100 text-rose-600', href: '/browse?cat=bikes' },
  { label: 'Services', icon: Wrench, color: 'bg-indigo-100 text-indigo-600', href: '/browse?cat=services' },
];

const featuredListings = featuredData.map(l => ({
  id: l.id, title: l.title, category: l.category, price: l.price, credits: l.credits,
  image: l.image, seller: l.seller.name.split(' ').map((n, i) => i === 0 ? n : n[0] + '.').join(' '),
  branch: `${l.seller.branch}, ${l.seller.year}`, rating: l.seller.rating,
  verified: l.seller.verified, type: l.type,
}));

const recentListings = recentData.map(l => ({
  id: l.id, title: l.title, category: l.category, credits: l.credits,
  image: l.image, seller: l.seller.name.split(' ').map((n, i) => i === 0 ? n : n[0] + '.').join(' '),
  verified: l.seller.verified, type: l.type,
}));

// ─── Search Pool ──────────────────────────────────────────────────────────────

const allItems = sharedListings.map(l => ({
  id: l.id,
  title: l.title,
  category: l.category,
  credits: l.credits,
  seller: l.seller.name.split(' ').map((n, i) => i === 0 ? n : n[0] + '.').join(' '),
  verified: l.seller.verified,
  type: l.type,
  image: l.image,
}));

const trendingSearches = ['Engineering Maths', 'Calculator', 'Cycle Rental', 'Lab Coat', 'GATE Notes'];

const categoryIconMap: Record<string, React.ElementType> = {
  Books: BookOpen, Notes: FileText, Calculators: Calculator,
  'Lab Equipment': FlaskConical, Bikes: Bike, Services: Wrench,
};

const typeColors: Record<string, string> = {
  sell: 'bg-blue-50 text-blue-600',
  rent: 'bg-amber-50 text-amber-600',
  borrow: 'bg-purple-50 text-purple-600',
  service: 'bg-indigo-50 text-indigo-600',
};

// ─── Search Bar with Dropdown ─────────────────────────────────────────────────

function HeroSearchBar() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  const filtered = query.trim().length === 0 ? [] : allItems.filter(item => {
    const matchCat = category === 'All' || item.category === category;
    const matchQ = item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.seller.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  }).slice(0, 8);

  const showDropdown = open && (query.trim().length > 0 ? filtered.length > 0 : true);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const goToItem = useCallback((id: number) => {
    setOpen(false);
    setQuery('');
    navigate(`/listing/${id}`);
  }, [navigate]);

  const goToBrowse = useCallback(() => {
    setOpen(false);
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category !== 'All') params.set('cat', category.toLowerCase());
    navigate(`/browse?${params.toString()}`);
  }, [query, category, navigate]);

  const handleKey = (e: React.KeyboardEvent) => {
    const items = query.trim() ? filtered : [];
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && items[activeIndex]) goToItem(items[activeIndex].id);
      else goToBrowse();
    }
    else if (e.key === 'Escape') { setOpen(false); setActiveIndex(-1); }
  };

  return (
    <div ref={wrapperRef} className="relative max-w-xl w-full">
      {/* Input Row */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className={`flex flex-col sm:flex-row gap-2 bg-white p-2 shadow-2xl transition-all duration-200 ${
          showDropdown ? 'rounded-t-2xl rounded-b-none' : 'rounded-2xl'
        }`}
      >
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); inputRef.current?.focus(); }}
          className="sm:w-36 px-3 py-2.5 text-sm font-medium text-foreground bg-muted rounded-xl border-0 outline-none cursor-pointer"
        >
          {['All', 'Books', 'Notes', 'Calculators', 'Lab Equipment', 'Bikes', 'Services'].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for books, bikes, calculators..."
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKey}
            className="flex-1 text-sm outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => { setQuery(''); setActiveIndex(-1); inputRef.current?.focus(); }}>
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}
        </div>
        <Button
          onClick={goToBrowse}
          className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl px-6"
        >
          Search
        </Button>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' as const }}
            className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 rounded-b-2xl shadow-2xl z-50 overflow-hidden"
          >
            {query.trim() === '' ? (
              /* ── Empty state: trending ── */
              <div className="p-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> Trending on Campus
                </p>
                <div className="flex flex-wrap gap-2 px-1">
                  {trendingSearches.map(t => (
                    <button
                      key={t}
                      onClick={() => { setQuery(t); setOpen(true); inputRef.current?.focus(); }}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-foreground transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ── Results list ── */
              <ul ref={listRef} className="max-h-80 overflow-y-auto divide-y divide-border/40">
                {filtered.map((item, idx) => {
                  const CatIcon = categoryIconMap[item.category] ?? Tag;
                  const isActive = idx === activeIndex;
                  return (
                    <li key={item.id}>
                      <button
                        onMouseEnter={() => setActiveIndex(idx)}
                        onMouseLeave={() => setActiveIndex(-1)}
                        onClick={() => goToItem(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          isActive ? 'bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate leading-tight">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                              <CatIcon className="w-3 h-3" />
                              {item.category}
                            </span>
                            {item.verified && (
                              <span className="flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: '#059669' }}>
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: credits + type */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <Coins className="w-3 h-3" style={{ color: '#10B981' }} />
                            <span className="text-sm font-bold text-foreground">{item.credits}</span>
                            <span className="text-[10px] text-muted-foreground">cr</span>
                          </div>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeColors[item.type] ?? 'bg-muted text-muted-foreground'}`}>
                            {item.type}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}

                {/* View all results row */}
                <li>
                  <button
                    onClick={goToBrowse}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
                  >
                    <span>View all results for "{query}"</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </li>
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



function VerifiedBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 bg-accent/10 text-accent font-semibold rounded-full ${
        small ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
      }`}
      style={{ color: '#059669' }}
    >
      <ShieldCheck className={small ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      Verified
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    sell: 'bg-blue-50 text-blue-600',
    rent: 'bg-amber-50 text-amber-600',
    borrow: 'bg-purple-50 text-purple-600',
  };
  return (
    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${map[type] ?? 'bg-muted text-muted-foreground'}`}>
      {type}
    </span>
  );
}

function ListingCard({ listing }: { listing: typeof featuredListings[0] }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(79,70,229,0.12)' }}
      transition={{ duration: 0.2, ease: 'easeOut' as const }}
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm cursor-pointer group"
    >
      <Link to={`/listing/${listing.id}`}>
        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-muted">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Price badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 shadow-sm">
            <div className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-accent" style={{ color: '#10B981' }} />
              <span className="text-sm font-bold text-foreground">{listing.credits}</span>
              <span className="text-xs text-muted-foreground">cr</span>
            </div>
          </div>
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <TypeBadge type={listing.type} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-medium text-primary bg-primary/8 px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(79,70,229,0.08)' }}>
              {listing.category}
            </span>
          </div>
          <h3 className="font-semibold text-foreground text-sm leading-snug mb-3 line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {listing.title}
          </h3>

          {/* Seller */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {listing.seller[0]}
                </div>
                {listing.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-accent rounded-full flex items-center justify-center" style={{ backgroundColor: '#10B981' }}>
                    <ShieldCheck className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{listing.seller}</p>
                <p className="text-[10px] text-muted-foreground">{listing.branch}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-foreground">{listing.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function RecentCard({ listing }: { listing: typeof recentListings[0] }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' as const }}
      className="flex-shrink-0 w-48 bg-card rounded-xl overflow-hidden border border-border shadow-sm cursor-pointer group"
    >
      <Link to={`/listing/${listing.id}`}>
        <div className="h-28 overflow-hidden bg-muted relative">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <TypeBadge type={listing.type} />
          </div>
        </div>
        <div className="p-3">
          <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {listing.title}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Coins className="w-3 h-3 text-accent" style={{ color: '#10B981' }} />
              <span className="text-xs font-bold text-foreground">{listing.credits} cr</span>
            </div>
            {listing.verified && <VerifiedBadge small />}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  };

  return (
    <>
      <title>CampusKart — Buy, Sell & Borrow Inside Your College</title>
      <meta name="description" content="The hyperlocal college marketplace. Buy, sell, or borrow books, bikes, calculators, lab equipment and more — verified students only." />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 50%, #6D28D9 100%)' }}>
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 w-32 h-32 rounded-full border-2 border-white" />
          <div className="absolute top-20 right-20 w-20 h-20 rounded-full border border-white" />
          <div className="absolute bottom-10 left-1/4 w-16 h-16 rounded-full border border-white" />
          <div className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-white" />
          <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full border-2 border-white" />
        </div>

        {/* Floating decorative icons */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
          className="absolute top-12 right-16 hidden lg:flex w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl items-center justify-center shadow-lg"
        >
          <BookOpen className="w-7 h-7 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.5 }}
          className="absolute top-32 right-40 hidden lg:flex w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl items-center justify-center shadow-lg"
        >
          <Calculator className="w-5 h-5 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const, delay: 1 }}
          className="absolute bottom-16 right-24 hidden lg:flex w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl items-center justify-center shadow-lg"
        >
          <Bike className="w-6 h-6 text-white" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="max-w-2xl"
          >
            {/* Trust pill */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Verified Students Only — Your Campus, Your Marketplace
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Buy, Sell &amp; Borrow
              <span className="block text-emerald-300">Inside Your College.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-white/75 mb-8 leading-relaxed">
              The hyperlocal marketplace built for students. Trade books, bikes, calculators, and more — using Campus Credits, no real money needed.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={fadeUp}>
              <HeroSearchBar />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-5">
              <Link to="/browse">
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold rounded-xl">
                  Browse Listings
                </Button>
              </Link>
              <Link to="/post">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg" style={{ backgroundColor: '#10B981' }}>
                  + Post a Listing
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-medium text-muted-foreground">
            {[
              { icon: ShieldCheck, label: 'Verified Students Only', color: 'text-emerald-500' },
              { icon: MapPin, label: 'Campus-Only Listings', color: 'text-primary' },
              { icon: Coins, label: 'Campus Credits System', color: 'text-amber-500' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Find exactly what you need for campus life</p>
          </div>
          <Link to="/categories" className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <motion.div key={cat.label} variants={fadeUp}>
              <Link to={cat.href}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ duration: 0.2, ease: 'easeOut' as const }}
                  className="flex flex-col items-center gap-3 p-4 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-shadow cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-foreground text-center leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    {cat.label}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Featured Listings ─────────────────────────────────────────────── */}
      <section className="bg-muted/50 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                Featured Listings
              </h2>
              <p className="text-muted-foreground text-sm mt-1">Top picks from verified students on your campus</p>
            </div>
            <Link to="/browse" className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredListings.map((listing) => (
              <motion.div key={listing.id} variants={fadeUp}>
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Recently Added ────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Recently Added
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Fresh listings from your campus community</p>
          </div>
          <Link to="/browse?sort=recent" className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {recentListings.map((listing) => (
            <RecentCard key={listing.id} listing={listing} />
          ))}
        </div>
      </motion.section>

      {/* ── Post a Listing CTA ────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-7xl mx-auto rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 60%, #6D28D9 100%)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Text */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 w-fit border border-white/20">
                <Coins className="w-3.5 h-3.5 text-emerald-300" />
                Earn Campus Credits
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Got something to sell or lend?
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-8">
                Post your listing in under 2 minutes. Reach hundreds of verified students on your campus and earn Campus Credits for every successful trade.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/post">
                  <Button className="bg-white text-primary font-bold hover:bg-white/90 rounded-xl px-6 py-2.5 shadow-lg">
                    Post a Listing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-xl px-6 py-2.5">
                    Browse First
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Form Preview Card */}
            <div className="p-10 lg:p-14 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  <Tag className="w-4 h-4 text-primary" />
                  New Listing
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="h-9 bg-muted rounded-lg flex items-center px-3">
                    <span className="text-xs text-muted-foreground">Item name (e.g. Maths Textbook)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 bg-muted rounded-lg flex items-center px-3">
                      <span className="text-xs text-muted-foreground">Category</span>
                    </div>
                    <div className="h-9 bg-muted rounded-lg flex items-center px-3">
                      <span className="text-xs text-muted-foreground">Sell / Rent</span>
                    </div>
                  </div>
                  <div className="h-16 bg-muted rounded-lg flex items-start px-3 pt-2.5">
                    <span className="text-xs text-muted-foreground">Description...</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 bg-muted rounded-lg flex items-center px-3">
                      <Coins className="w-3 h-3 text-accent mr-1.5" style={{ color: '#10B981' }} />
                      <span className="text-xs text-muted-foreground">Credits</span>
                    </div>
                    <div className="h-9 bg-muted rounded-lg flex items-center px-3 border-2 border-dashed border-border">
                      <Upload className="w-3 h-3 text-muted-foreground mr-1.5" />
                      <span className="text-xs text-muted-foreground">Photo</span>
                    </div>
                  </div>
                  <Button className="w-full bg-primary text-white font-semibold rounded-lg text-sm mt-1">
                    Post Listing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Campus Credits Info ───────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="bg-muted/50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              How Campus Credits Work
            </h2>
            <p className="text-muted-foreground text-sm">Trade without real money — a fair, student-first system</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Verify Your Student ID',
                desc: 'Sign up with your college email and get the Verified Student badge.',
                color: 'bg-emerald-100 text-emerald-600',
              },
              {
                icon: Coins,
                title: 'Earn & Spend Credits',
                desc: 'Sell items to earn Campus Credits. Use them to buy or borrow from peers.',
                color: 'bg-amber-100 text-amber-600',
              },
              {
                icon: MessageCircle,
                title: 'Chat & Trade Safely',
                desc: 'Connect with verified sellers on campus. No strangers, no scams.',
                color: 'bg-blue-100 text-blue-600',
              },
            ].map((step) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center"
              >
                <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
}
