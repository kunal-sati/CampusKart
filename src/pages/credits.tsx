import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  Plus,
  BookOpen,
  Bike,
  Tag,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Data ─────────────────────────────────────────────────────────────────────

const transactions = [
  { id: 1, type: 'earned', title: 'Sold: Engineering Maths Vol. 1', amount: 90, date: 'Today, 2:30 PM', icon: BookOpen, from: 'Priya M.' },
  { id: 2, type: 'spent', title: 'Bought: Physics Irodov', amount: -45, date: 'Yesterday, 11:00 AM', icon: BookOpen, from: 'Nisha K.' },
  { id: 3, type: 'earned', title: 'Sold: Data Structures Notes', amount: 30, date: '3 Apr, 4:15 PM', icon: Tag, from: 'Kiran P.' },
  { id: 4, type: 'earned', title: 'Referral Bonus', amount: 50, date: '1 Apr, 9:00 AM', icon: Gift, from: 'CampusKart' },
  { id: 5, type: 'spent', title: 'Rented: Hero Cycle (3 days)', amount: -60, date: '28 Mar, 3:00 PM', icon: Bike, from: 'Rahul K.' },
  { id: 6, type: 'earned', title: 'Sold: Lab Coat', amount: 20, date: '25 Mar, 1:00 PM', icon: Tag, from: 'Meera T.' },
  { id: 7, type: 'earned', title: 'Welcome Bonus', amount: 100, date: '15 Aug 2023', icon: Gift, from: 'CampusKart' },
];

const earnWays = [
  { title: 'Sell an Item', credits: '+50–500 cr', desc: 'List and sell your books, equipment, or notes', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600' },
  { title: 'Refer a Friend', credits: '+50 cr', desc: 'Invite a classmate and earn when they join', icon: Gift, color: 'bg-purple-100 text-purple-600' },
  { title: 'Complete Profile', credits: '+25 cr', desc: 'Add your branch, year, and student ID', icon: ShieldCheck, color: 'bg-blue-100 text-blue-600' },
  { title: 'Get Verified', credits: '+100 cr', desc: 'Verify your student email to earn bonus credits', icon: ShieldCheck, color: 'bg-amber-100 text-amber-600' },
];

const spendWays = [
  { title: 'Buy Items', desc: 'Purchase books, calculators, lab equipment from peers', icon: BookOpen },
  { title: 'Rent Bikes', desc: 'Borrow cycles and vehicles for campus commute', icon: Bike },
  { title: 'Hire Services', desc: 'Pay for tutoring, coding help, design services', icon: Tag },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreditsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'earned' | 'spent'>('all');

  const balance = transactions.reduce((sum, t) => sum + t.amount, 0) + 155; // base
  const totalEarned = transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = Math.abs(transactions.filter(t => t.type === 'spent').reduce((sum, t) => sum + t.amount, 0));

  const filtered = transactions.filter(t => activeTab === 'all' || t.type === activeTab);

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  };

  return (
    <>
      <title>Campus Credits — CampusKart</title>
      <meta name="description" content="Manage your Campus Credits wallet. Earn by selling, spend to buy or borrow from verified students." />

      <div className="min-h-screen bg-background">
        {/* Hero Wallet Card */}
        <div style={{ background: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 60%, #6D28D9 100%)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.p variants={fadeUp} className="text-white/60 text-sm font-medium mb-1">Your Wallet</motion.p>
              <motion.div variants={fadeUp} className="flex items-end gap-3 mb-6">
                <Coins className="w-8 h-8 text-emerald-300 mb-1" />
                <span className="text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{balance}</span>
                <span className="text-xl text-white/60 mb-1">credits</span>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 max-w-sm">
                {[
                  { label: 'Total Earned', value: totalEarned, icon: TrendingUp, color: 'text-emerald-300' },
                  { label: 'Total Spent', value: totalSpent, icon: TrendingDown, color: 'text-rose-300' },
                  { label: 'Transactions', value: transactions.length, icon: ArrowUpRight, color: 'text-blue-300' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white/10 rounded-2xl p-3 text-center">
                    <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                    <p className="text-lg font-bold text-white">{value}</p>
                    <p className="text-[10px] text-white/50">{label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Earn & Spend */}
            <div className="flex flex-col gap-5">
              {/* Earn Credits */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' as const }}
                className="bg-card rounded-2xl border border-border p-5 shadow-sm"
              >
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} />
                  Ways to Earn
                </h3>
                <div className="flex flex-col gap-3">
                  {earnWays.map(way => (
                    <div key={way.title} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl ${way.color} flex items-center justify-center flex-shrink-0`}>
                        <way.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-foreground">{way.title}</p>
                          <span className="text-xs font-bold text-emerald-600 flex-shrink-0">{way.credits}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{way.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/post" className="block mt-4">
                  <Button className="w-full bg-primary text-white rounded-xl text-sm gap-2">
                    <Plus className="w-4 h-4" />
                    Post a Listing
                  </Button>
                </Link>
              </motion.div>

              {/* Spend Credits */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' as const }}
                className="bg-card rounded-2xl border border-border p-5 shadow-sm"
              >
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                  Ways to Spend
                </h3>
                <div className="flex flex-col gap-3">
                  {spendWays.map(way => (
                    <div key={way.title} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <way.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{way.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{way.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/browse" className="block mt-4">
                  <Button variant="outline" className="w-full rounded-xl text-sm">
                    Browse Listings
                  </Button>
                </Link>
              </motion.div>

              {/* FAQ */}
              <div className="bg-muted/50 rounded-2xl border border-border p-4">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">About Campus Credits</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Campus Credits are virtual tokens used only within CampusKart. They cannot be converted to real money. Credits expire after 1 year of inactivity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Transaction History */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                  Transaction History
                </h2>
                <div className="flex gap-1 bg-muted rounded-xl p-1">
                  {(['all', 'earned', 'spent'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                        activeTab === tab ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                className="flex flex-col gap-3"
              >
                {filtered.map(tx => (
                  <motion.div
                    key={tx.id}
                    variants={fadeUp}
                    className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'earned' ? 'bg-emerald-100' : 'bg-rose-100'
                    }`}>
                      {tx.type === 'earned'
                        ? <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                        : <ArrowUpRight className="w-5 h-5 text-rose-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                        {tx.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <p className="text-xs text-muted-foreground">{tx.from}</p>
                      </div>
                    </div>
                    <div className={`text-base font-bold flex-shrink-0 ${
                      tx.type === 'earned' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {tx.type === 'earned' ? '+' : ''}{tx.amount} cr
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
