import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
  ShieldCheck,
  Coins,
  Star,
  MessageCircle,
  Tag,
  BookOpen,
  Bike,
  Calculator,
  FlaskConical,
  Edit3,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  X,
  Save,
  CheckCircle2,
  User,
  GraduationCap,
  Building2,
  FileText,
  Eye,
  Gavel,
  Clock,
  CheckCheck as _CheckCheck,
  PauseCircle as _PauseCircle,
  PlusCircle,  MoreVertical,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  BarChart2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileData {
  name: string;
  branch: string;
  year: string;
  college: string;
  joined: string;
  verified: boolean;
  credits: number;
  rating: number;
  reviews: number;
  totalSales: number;
  totalPurchases: number;
  bio: string;
  badges: string[];
  phone: string;
  email: string;
}

interface MyListing {
  id: number;
  title: string;
  category: string;
  credits: number;
  image: string;
  type: string;
  status: 'active' | 'sold' | 'paused';
  postedAt: string;
  views: number;
  bids: number;
  messages: number;
  topBid: number | null;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialProfile: ProfileData = {
  name: 'Arjun Sharma',
  branch: 'Computer Science Engineering',
  year: '3rd Year',
  college: 'NIT Trichy',
  joined: 'August 2023',
  verified: true,
  credits: 340,
  rating: 4.8,
  reviews: 12,
  totalSales: 8,
  totalPurchases: 5,
  bio: 'CSE student passionate about algorithms and open source. Selling old textbooks and notes to fund new ones!',
  badges: ['Top Seller', 'Trusted Trader', 'Quick Responder'],
  phone: '+91 98765 43210',
  email: 'arjun.sharma@nitt.edu',
};

const initialMyListings: MyListing[] = [
  { id: 1, title: 'Engineering Mathematics Vol. 1 & 2', category: 'Books', credits: 90, image: '/airo-assets/images/listings/textbooks-stack', type: 'sell', status: 'active', postedAt: '2 days ago', views: 84, bids: 3, messages: 5, topBid: 75 },
  { id: 2, title: 'Data Structures Notes', category: 'Notes', credits: 30, image: '/airo-assets/images/listings/study-notes', type: 'sell', status: 'active', postedAt: '5 days ago', views: 42, bids: 1, messages: 2, topBid: 25 },
  { id: 3, title: 'Physics Irodov', category: 'Books', credits: 45, image: '/airo-assets/images/listings/textbooks-stack', type: 'sell', status: 'sold', postedAt: '3 weeks ago', views: 120, bids: 6, messages: 9, topBid: null },
  { id: 4, title: 'Lab Coat (M size)', category: 'Lab Equipment', credits: 20, image: '/airo-assets/images/listings/lab-equipment', type: 'sell', status: 'paused', postedAt: '1 week ago', views: 18, bids: 0, messages: 1, topBid: null },
];

const reviews = [
  { id: 1, reviewer: 'Priya M.', rating: 5, comment: 'Super smooth transaction! Book was exactly as described. Highly recommend.', date: '2 weeks ago' },
  { id: 2, reviewer: 'Rahul K.', rating: 5, comment: 'Very honest seller. Quick to respond and easy to coordinate with.', date: '1 month ago' },
  { id: 3, reviewer: 'Sneha R.', rating: 4, comment: 'Good condition notes, well organized. Slight delay in response but overall great.', date: '2 months ago' },
];

const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'PhD'];

const categoryIcons: Record<string, React.ElementType> = {
  Books: BookOpen,
  Notes: Tag,
  Bikes: Bike,
  Calculators: Calculator,
  'Lab Equipment': FlaskConical,
};

const statusConfig = {
  active:  { label: 'Active',  bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  sold:    { label: 'Sold',    bg: 'bg-muted',       text: 'text-muted-foreground', dot: 'bg-gray-400' },
  paused:  { label: 'Paused', bg: 'bg-amber-50',    text: 'text-amber-700', dot: 'bg-amber-400' },
};

// ─── Listing Row Card ─────────────────────────────────────────────────────────

function ListingRow({
  listing,
  onToggleStatus,
  onDelete,
  fadeUp,
}: {
  listing: MyListing;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
  fadeUp: Variants;
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const Icon = categoryIcons[listing.category] ?? Tag;
  const sc = statusConfig[listing.status];

  return (
    <motion.div
      variants={fadeUp}
      layout
      className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Main Row */}
      <div className="flex items-center gap-4 p-4">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 relative">
          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
          {listing.status === 'sold' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white uppercase tracking-wide">Sold</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {sc.label}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize">{listing.type}</span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" /> {listing.postedAt}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: 'var(--font-heading)' }}>
            {listing.title}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Icon className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{listing.category}</span>
          </div>
        </div>

        {/* Credits + Actions */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <Coins className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
            <span className="text-sm font-bold text-foreground">{listing.credits}</span>
            <span className="text-xs text-muted-foreground">cr</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowStats(s => !s)}
              className="h-7 px-2.5 rounded-lg text-xs font-semibold border border-border hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-1"
            >
              <BarChart2 className="w-3 h-3" />
              Stats
            </button>
            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-8 z-20 bg-card border border-border rounded-xl shadow-xl w-44 overflow-hidden"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    <Link
                      to={`/listing/${listing.id}`}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" /> View Listing
                    </Link>
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => { setMenuOpen(false); }}
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" /> Edit Listing
                    </button>
                    {listing.status !== 'sold' && (
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => { onToggleStatus(listing.id); setMenuOpen(false); }}
                      >
                        {listing.status === 'active'
                          ? <><ToggleLeft className="w-3.5 h-3.5 text-amber-500" /> Pause Listing</>
                          : <><ToggleRight className="w-3.5 h-3.5 text-emerald-500" /> Activate Listing</>
                        }
                      </button>
                    )}
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-border"
                      onClick={() => { onDelete(listing.id); setMenuOpen(false); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Drawer */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' as const }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border pt-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Listing Interactions
              </p>
              <div className="grid grid-cols-3 gap-3">
                {/* Views */}
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Eye className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{listing.views}</p>
                  <p className="text-[10px] text-muted-foreground">Views</p>
                </div>
                {/* Bids */}
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <Gavel className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{listing.bids}</p>
                  <p className="text-[10px] text-muted-foreground">Bids</p>
                  {listing.topBid && (
                    <p className="text-[9px] text-purple-600 font-semibold mt-0.5">Top: {listing.topBid} cr</p>
                  )}
                </div>
                {/* Messages */}
                <div className="bg-indigo-50 rounded-xl p-3 text-center">
                  <MessageCircle className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{listing.messages}</p>
                  <p className="text-[10px] text-muted-foreground">Messages</p>
                </div>
              </div>

              {/* Top bid highlight */}
              {listing.topBid && listing.status === 'active' && (
                <div className="mt-3 flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-3.5 h-3.5 text-purple-500" />
                    <span className="text-xs font-semibold text-purple-700">Highest Bid</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
                    <span className="text-sm font-bold text-foreground">{listing.topBid} credits</span>
                  </div>
                  <Button
                    size="sm"
                    className="h-7 text-xs rounded-lg px-3 gap-1"
                    style={{ background: 'linear-gradient(135deg,#4F46E5,#6D28D9)' }}
                    onClick={() => navigate(`/listing/${listing.id}?chat=open&buyer=TopBidder`)}
                  >
                    <MessageCircle className="w-3 h-3" /> Chat &amp; Accept
                  </Button>
                </div>
              )}

              {/* Engagement bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Engagement</span>
                  <span>{listing.views > 0 ? Math.round(((listing.bids + listing.messages) / listing.views) * 100) : 0}% interaction rate</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#4F46E5,#10B981)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${listing.views > 0 ? Math.min(100, Math.round(((listing.bids + listing.messages) / listing.views) * 100 * 5)) : 0}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.1 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditProfileModal({
  profile,
  onSave,
  onClose,
}: {
  profile: ProfileData;
  onSave: (data: ProfileData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const update = (key: keyof ProfileData, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
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
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: 'easeOut' as const }}
        className="bg-card rounded-3xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-card z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Edit Profile
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
          <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0">
              {form.name[0] || '?'}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{form.name || 'Your Name'}</p>
              <p className="text-xs text-muted-foreground">{form.branch} · {form.year}</p>
              {form.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold mt-1" style={{ color: '#059669' }}>
                  <ShieldCheck className="w-3 h-3" /> Verified Student
                </span>
              )}
            </div>
          </div>

          {[
            { key: 'name' as const, label: 'Full Name', icon: User, type: 'text', placeholder: 'e.g. Arjun Sharma', required: true },
            { key: 'email' as const, label: 'College Email', icon: FileText, type: 'email', placeholder: 'yourname@college.edu', required: true },
            { key: 'phone' as const, label: 'Phone Number', icon: User, type: 'tel', placeholder: '+91 XXXXX XXXXX', required: false },
            { key: 'branch' as const, label: 'Branch / Department', icon: GraduationCap, type: 'text', placeholder: 'e.g. Computer Science Engineering', required: true },
            { key: 'college' as const, label: 'College / University', icon: Building2, type: 'text', placeholder: 'e.g. NIT Trichy', required: true },
          ].map(({ key, label, icon: Icon, type, placeholder, required }) => (
            <div key={key}>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" /> {label} {required && '*'}
              </label>
              <input
                type={type}
                value={form[key] as string}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          ))}

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Year of Study *
            </label>
            <div className="flex flex-wrap gap-2">
              {yearOptions.map(y => (
                <button key={y} type="button" onClick={() => update('year', y)}
                  className={`text-xs font-semibold px-3 py-2 rounded-full border transition-colors ${form.year === y ? 'bg-primary text-white border-primary' : 'bg-background text-foreground border-border hover:border-primary/40'}`}>
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Bio
              <span className="text-muted-foreground font-normal ml-auto">{form.bio.length}/200</span>
            </label>
            <textarea value={form.bio} onChange={e => update('bio', e.target.value.slice(0, 200))}
              placeholder="Tell other students a bit about yourself..." rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none" />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" className="flex-1 rounded-xl font-semibold gap-2 relative overflow-hidden"
              style={{ backgroundColor: saved ? '#10B981' : undefined }}>
              {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'mylistings' | 'reviews'>('mylistings');
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [listings, setListings] = useState<MyListing[]>(initialMyListings);
  const [listingFilter, setListingFilter] = useState<'all' | 'active' | 'sold' | 'paused'>('all');

  const handleSave = (updated: ProfileData) => setProfile(updated);

  const handleToggleStatus = (id: number) => {
    setListings(prev => prev.map(l =>
      l.id === id ? { ...l, status: l.status === 'active' ? 'paused' : 'active' } : l
    ));
  };

  const handleDelete = (id: number) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const filteredListings = listingFilter === 'all' ? listings : listings.filter(l => l.status === listingFilter);

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  };

  // Summary counts
  const activeCount = listings.filter(l => l.status === 'active').length;
  const soldCount = listings.filter(l => l.status === 'sold').length;
  const pausedCount = listings.filter(l => l.status === 'paused').length;
  const totalViews = listings.reduce((s, l) => s + l.views, 0);
  const totalBids = listings.reduce((s, l) => s + l.bids, 0);
  const totalMessages = listings.reduce((s, l) => s + l.messages, 0);

  return (
    <>
      <title>{profile.name} — CampusKart Profile</title>
      <meta name="description" content={`${profile.name}'s CampusKart profile — ${profile.branch}, ${profile.year}`} />

      <AnimatePresence>
        {showEditModal && (
          <EditProfileModal profile={profile} onSave={handleSave} onClose={() => setShowEditModal(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background">
        {/* Profile Header */}
        <div className="bg-white border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="flex flex-col sm:flex-row gap-6 items-start"
            >
              <motion.div variants={fadeUp} className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary shadow-sm">
                  {profile.name[0]}
                </div>
                {profile.verified && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: '#10B981' }}>
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>{profile.name}</h1>
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669' }}>
                      <ShieldCheck className="w-3 h-3" /> Verified Student
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-1">{profile.branch} · {profile.year}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.college}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Joined {profile.joined}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{profile.bio}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.badges.map(badge => (
                    <span key={badge} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full text-primary" style={{ backgroundColor: 'rgba(79,70,229,0.08)' }}>
                      <Award className="w-3 h-3" /> {badge}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Button variant="outline" className="gap-2 rounded-xl" onClick={() => setShowEditModal(true)}>
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Stats */}
            <div className="flex flex-col gap-5">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' as const }}
                className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Rating', value: profile.rating.toFixed(1), icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Reviews', value: profile.reviews, icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Items Sold', value: profile.totalSales, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Purchases', value: profile.totalPurchases, icon: Tag, color: 'text-purple-500', bg: 'bg-purple-50' },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                      <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                      <p className="text-lg font-bold text-foreground">{value}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' as const }}
                className="rounded-2xl p-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #4F46E5, #6D28D9)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Campus Credits</h3>
                  <Coins className="w-5 h-5 text-emerald-300" />
                </div>
                <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{profile.credits}</p>
                <p className="text-xs text-white/60 mb-4">Available credits</p>
                <Link to="/credits">
                  <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-0 rounded-lg text-xs font-semibold">View Wallet</Button>
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' as const }}
                className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Contact</h3>
                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{profile.email}</span></div>
                  <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 flex-shrink-0" /><span>{profile.phone}</span></div>
                </div>
              </motion.div>
            </div>

            {/* Right: Tabs */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit">
                {([
                  { key: 'mylistings', label: `My Listings (${listings.length})` },
                  { key: 'reviews', label: `Reviews (${reviews.length})` },
                ] as const).map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab.key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── My Listings Tab ── */}
              {activeTab === 'mylistings' && (
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} className="flex flex-col gap-4">

                  {/* Summary Strip */}
                  <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Total Views', value: totalViews, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
                      { label: 'Total Bids', value: totalBids, icon: Gavel, color: 'text-purple-500', bg: 'bg-purple-50' },
                      { label: 'Messages', value: totalMessages, icon: MessageCircle, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                      <div key={label} className={`${bg} rounded-2xl p-3 text-center`}>
                        <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                        <p className="text-xl font-bold text-foreground">{value}</p>
                        <p className="text-[10px] text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </motion.div>

                  {/* Filter Pills */}
                  <motion.div variants={fadeUp} className="flex gap-2 flex-wrap">
                    {([
                      { key: 'all', label: `All (${listings.length})` },
                      { key: 'active', label: `Active (${activeCount})`, dot: 'bg-emerald-500' },
                      { key: 'paused', label: `Paused (${pausedCount})`, dot: 'bg-amber-400' },
                      { key: 'sold', label: `Sold (${soldCount})`, dot: 'bg-gray-400' },
                    ] as const).map(f => (
                      <button key={f.key} onClick={() => setListingFilter(f.key)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
                          listingFilter === f.key ? 'bg-primary text-white border-primary' : 'bg-background text-foreground border-border hover:border-primary/40'
                        }`}>
                        {'dot' in f && <span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />}
                        {f.label}
                      </button>
                    ))}
                  </motion.div>

                  {/* Listing Cards */}
                  <AnimatePresence mode="popLayout">
                    {filteredListings.length === 0 ? (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-center py-12 text-muted-foreground text-sm">
                        No listings in this category.
                      </motion.div>
                    ) : (
                      filteredListings.map(listing => (
                        <ListingRow
                          key={listing.id}
                          listing={listing}
                          onToggleStatus={handleToggleStatus}
                          onDelete={handleDelete}
                          fadeUp={fadeUp}
                        />
                      ))
                    )}
                  </AnimatePresence>

                  <Link to="/post">
                    <Button variant="outline" className="w-full rounded-2xl border-dashed border-2 py-4 text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 mt-1 gap-2">
                      <PlusCircle className="w-4 h-4" /> Post a New Listing
                    </Button>
                  </Link>
                </motion.div>
              )}

              {/* ── Reviews Tab ── */}
              {activeTab === 'reviews' && (
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="flex flex-col gap-4">
                  <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>{profile.rating}</p>
                      <div className="flex items-center gap-0.5 justify-center mt-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={`w-4 h-4 ${i <= Math.round(profile.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{profile.reviews} reviews</p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = reviews.filter(r => r.rating === star).length;
                        const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground w-3">{star}</span>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground w-3">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                  {reviews.map(review => (
                    <motion.div key={review.id} variants={fadeUp} className="bg-card rounded-2xl border border-border p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{review.reviewer[0]}</div>
                          <span className="text-sm font-semibold text-foreground">{review.reviewer}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

