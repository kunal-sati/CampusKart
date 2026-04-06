import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  BookOpen,
  FileText,
  Calculator,
  FlaskConical,
  Bike,
  Wrench,
  ChevronRight,
  ShieldCheck,
  Coins,
  TrendingUp,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const categories = [
  {
    label: 'Books',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-600',
    border: 'hover:border-blue-300',
    accent: '#2563EB',
    count: 48,
    avgCredits: 75,
    trending: true,
    description: 'Textbooks, reference books, novels, and academic literature from all branches and years.',
    examples: ['Engineering Maths', 'Organic Chemistry', 'Physics Irodov', 'Data Structures'],
    href: '/browse?cat=books',
  },
  {
    label: 'Notes',
    icon: FileText,
    color: 'bg-purple-100 text-purple-600',
    border: 'hover:border-purple-300',
    accent: '#7C3AED',
    count: 34,
    avgCredits: 40,
    trending: true,
    description: 'Handwritten and printed notes, study guides, previous year question papers, and GATE material.',
    examples: ['DSA Notes', 'GATE 2025 Bundle', 'Chem Lab Manual', 'OS Short Notes'],
    href: '/browse?cat=notes',
  },
  {
    label: 'Calculators',
    icon: Calculator,
    color: 'bg-amber-100 text-amber-600',
    border: 'hover:border-amber-300',
    accent: '#D97706',
    count: 19,
    avgCredits: 120,
    trending: false,
    description: 'Scientific calculators, graphing calculators, and basic calculators for exams and practicals.',
    examples: ['Casio FX-991ES', 'Casio FX-82MS', 'Texas TI-84', 'Sharp EL-W516'],
    href: '/browse?cat=calculators',
  },
  {
    label: 'Lab Equipment',
    icon: FlaskConical,
    color: 'bg-green-100 text-green-600',
    border: 'hover:border-green-300',
    accent: '#059669',
    count: 27,
    avgCredits: 90,
    trending: false,
    description: 'Glassware, instruments, safety gear, and electronic equipment for lab practicals.',
    examples: ['Chemistry Lab Kit', 'Oscilloscope', 'Vernier Caliper', 'Lab Coat'],
    href: '/browse?cat=lab',
  },
  {
    label: 'Bikes',
    icon: Bike,
    color: 'bg-rose-100 text-rose-600',
    border: 'hover:border-rose-300',
    accent: '#E11D48',
    count: 15,
    avgCredits: 35,
    trending: true,
    description: 'Bicycles and cycles available for daily campus commute — rent by the day or week.',
    examples: ['Hero Cycle', 'Atlas MTB', 'BSA SLR', 'Hercules Roadeo'],
    href: '/browse?cat=bikes',
  },
  {
    label: 'Services',
    icon: Wrench,
    color: 'bg-indigo-100 text-indigo-600',
    border: 'hover:border-indigo-300',
    accent: '#4F46E5',
    count: 22,
    avgCredits: 150,
    trending: false,
    description: 'Tutoring, coding help, design services, assignment assistance, and other peer skills.',
    examples: ['Python Tutoring', 'UI/UX Design', 'PCB Soldering', 'Resume Review'],
    href: '/browse?cat=services',
  },
];

const totalListings = categories.reduce((s, c) => s + c.count, 0);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  };

  return (
    <>
      <title>Categories — CampusKart</title>
      <meta name="description" content="Browse all categories on CampusKart — books, notes, calculators, lab equipment, bikes, and services from verified students." />

      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-white border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              <motion.p variants={fadeUp} className="text-sm font-medium text-muted-foreground mb-1">
                Marketplace
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-3xl font-bold text-foreground mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                All Categories
              </motion.h1>
              <motion.p variants={fadeUp} className="text-muted-foreground text-sm max-w-lg">
                {totalListings} active listings across {categories.length} categories — all from verified students on your campus.
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="bg-muted/40 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" style={{ color: '#10B981' }} />
                Verified students only
              </span>
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                Pay with Campus Credits
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" />
                {totalListings} listings live
              </span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {categories.map((cat) => (
              <motion.div key={cat.label} variants={fadeUp}>
                <Link to={cat.href}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.2, ease: 'easeOut' as const }}
                    className={`group bg-card rounded-2xl border-2 border-border ${cat.border} p-6 cursor-pointer transition-colors h-full flex flex-col`}
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        {cat.trending && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                            <TrendingUp className="w-2.5 h-2.5" />
                            Trending
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>

                    {/* Title & Count */}
                    <div className="mb-3">
                      <h2
                        className="text-lg font-bold text-foreground mb-0.5"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {cat.label}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{cat.count}</span> listings
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Coins className="w-3 h-3" style={{ color: '#10B981' }} />
                          avg {cat.avgCredits} cr
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                      {cat.description}
                    </p>

                    {/* Example Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {cat.examples.map((ex) => (
                        <span
                          key={ex}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground group-hover:bg-muted/80 transition-colors"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: 'easeOut' as const }}
            className="mt-10 rounded-2xl p-8 text-center border-2 border-dashed border-border bg-muted/30"
          >
            <p className="text-sm font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
              Don't see what you need?
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Post a "wanted" listing and let sellers come to you.
            </p>
            <Link to="/post">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm hover:bg-primary/90 transition-colors"
              >
                Post a Listing
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
