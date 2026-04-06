import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Coins,
  Star,
  BookOpen,
  FileText,
  Calculator,
  FlaskConical,
  Bike,
  Wrench,
  X,
  ChevronDown,
  MapPin,
  Clock,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listings as allListingsData } from '@/data/listings';

// ─── Data ─────────────────────────────────────────────────────────────────────

const categories = [
  { label: 'All', icon: null },
  { label: 'Books', icon: BookOpen },
  { label: 'Notes', icon: FileText },
  { label: 'Calculators', icon: Calculator },
  { label: 'Lab Equipment', icon: FlaskConical },
  { label: 'Bikes', icon: Bike },
  { label: 'Services', icon: Wrench },
];

const allListings = allListingsData.map(l => ({
  id: l.id,
  title: l.title,
  category: l.category,
  credits: l.credits,
  price: l.price,
  image: l.image,
  seller: l.seller.name.split(' ').map((n, i) => i === 0 ? n : n[0] + '.').join(' '),
  branch: `${l.seller.branch}, ${l.seller.year}`,
  rating: l.seller.rating,
  verified: l.seller.verified,
  type: l.type,
  location: l.location,
  postedAt: l.postedAt,
  tags: l.tags,
  views: l.views,
  condition: l.condition,
}));

const sortOptions = ['Newest First', 'Credits: Low to High', 'Credits: High to Low', 'Top Rated', 'Most Viewed'];

// ─── Components ───────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    sell: 'bg-blue-50 text-blue-600',
    rent: 'bg-amber-50 text-amber-600',
    borrow: 'bg-purple-50 text-purple-600',
    service: 'bg-rose-50 text-rose-600',
  };
  return (
    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${map[type] ?? 'bg-muted text-muted-foreground'}`}>
      {type}
    </span>
  );
}

function ListingCard({ listing }: { listing: typeof allListings[0] }) {
  const conditionColor: Record<string, string> = {
    'Like New': 'bg-emerald-50 text-emerald-700',
    'Good': 'bg-blue-50 text-blue-700',
    'Fair': 'bg-amber-50 text-amber-700',
    'Worn': 'bg-red-50 text-red-700',
  };
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(79,70,229,0.12)' }}
      transition={{ duration: 0.2, ease: 'easeOut' as const }}
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm cursor-pointer group"
    >
      <Link to={`/listing/${listing.id}`}>
        <div className="relative h-44 overflow-hidden bg-muted">
          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 shadow-sm">
            <div className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
              <span className="text-sm font-bold text-foreground">{listing.credits}</span>
              <span className="text-xs text-muted-foreground">cr</span>
            </div>
          </div>
          <div className="absolute top-3 left-3 flex gap-1.5">
            <TypeBadge type={listing.type} />
            {listing.condition && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${conditionColor[listing.condition] ?? 'bg-muted text-muted-foreground'}`}>
                {listing.condition}
              </span>
            )}
          </div>
          {/* Views pill */}
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-0.5 flex items-center gap-1">
            <Eye className="w-2.5 h-2.5 text-white/80" />
            <span className="text-[10px] text-white/90 font-medium">{listing.views}</span>
          </div>
        </div>
        <div className="p-4">
          <span className="text-xs font-medium text-primary px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(79,70,229,0.08)' }}>
            {listing.category}
          </span>
          <h3 className="font-semibold text-foreground text-sm leading-snug mt-2 mb-1 line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {listing.title}
          </h3>
          {/* Location + time */}
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" />{listing.location}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-2.5 h-2.5" />{listing.postedAt}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {listing.seller[0]}
                </div>
                {listing.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10B981' }}>
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
              <span className="text-xs font-semibold">{listing.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') ? 
    categories.find(c => c.label.toLowerCase() === searchParams.get('cat'))?.label ?? 'All' : 'All');
  const [activeType, setActiveType] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Newest First');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...allListings];
    if (activeCategory !== 'All') list = list.filter(l => l.category === activeCategory);
    if (query) list = list.filter(l => l.title.toLowerCase().includes(query.toLowerCase()));
    if (activeType.length > 0) list = list.filter(l => activeType.includes(l.type));
    if (verifiedOnly) list = list.filter(l => l.verified);
    if (sortBy === 'Credits: Low to High') list.sort((a, b) => a.credits - b.credits);
    if (sortBy === 'Credits: High to Low') list.sort((a, b) => b.credits - a.credits);
    if (sortBy === 'Top Rated') list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'Most Viewed') list.sort((a, b) => b.views - a.views);
    return list;
  }, [activeCategory, query, activeType, verifiedOnly, sortBy]);

  const toggleType = (t: string) =>
    setActiveType(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  return (
    <>
      <title>Browse Listings — CampusKart</title>
      <meta name="description" content="Browse books, bikes, calculators, lab equipment and more from verified students on your campus." />

      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Browse Listings
            </h1>
            {/* Search */}
            <div className="flex gap-2 max-w-2xl">
              <div className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5 border border-border">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
                {query && (
                  <button onClick={() => setQuery('')}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`gap-2 rounded-xl ${showFilters ? 'border-primary text-primary bg-primary/5' : ''}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-muted/50 rounded-2xl border border-border flex flex-wrap gap-6"
              >
                {/* Type filter */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Type</p>
                  <div className="flex flex-wrap gap-2">
                    {['sell', 'rent', 'borrow', 'service'].map(t => (
                      <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className={`text-xs font-semibold capitalize px-3 py-1.5 rounded-full border transition-colors ${
                          activeType.includes(t)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-foreground border-border hover:border-primary/40'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Verified filter */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Trust</p>
                  <button
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                    className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                      verifiedOnly
                        ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                        : 'bg-white text-foreground border-border hover:border-emerald-300'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Only
                  </button>
                </div>
                {/* Sort */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sort By</p>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="text-xs font-medium bg-white border border-border rounded-lg px-3 py-1.5 pr-7 outline-none cursor-pointer appearance-none"
                    >
                      {sortOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                  activeCategory === cat.label
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-foreground border-border hover:border-primary/40'
                }`}
              >
                {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> listings found
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
              <span>{filtered.filter(l => l.verified).length} verified</span>
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map(listing => (
                <motion.div
                  key={listing.id}
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } } }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-heading)' }}>No listings found</h3>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button variant="outline" onClick={() => { setQuery(''); setActiveCategory('All'); setActiveType([]); setVerifiedOnly(false); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
