import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Upload,
  BookOpen,
  FileText,
  Calculator,
  FlaskConical,
  Bike,
  Wrench,
  Coins,
  ShieldCheck,
  ChevronLeft,
  Image as ImageIcon,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { label: 'Books', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
  { label: 'Notes', icon: FileText, color: 'bg-purple-100 text-purple-600' },
  { label: 'Calculators', icon: Calculator, color: 'bg-amber-100 text-amber-600' },
  { label: 'Lab Equipment', icon: FlaskConical, color: 'bg-green-100 text-green-600' },
  { label: 'Bikes', icon: Bike, color: 'bg-rose-100 text-rose-600' },
  { label: 'Services', icon: Wrench, color: 'bg-indigo-100 text-indigo-600' },
];

const listingTypes = [
  { value: 'sell', label: 'Sell', desc: 'Transfer ownership permanently' },
  { value: 'rent', label: 'Rent', desc: 'Lend for a period, get it back' },
  { value: 'borrow', label: 'Borrow', desc: 'Looking to borrow from someone' },
  { value: 'service', label: 'Service', desc: 'Offer a skill or service' },
];

const conditions = ['Like New', 'Good', 'Fair', 'For Parts'];

export default function PostListingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: '',
    type: 'sell',
    condition: 'Good',
    description: '',
    credits: '',
    price: '',
    imagePreview: null as string | null,
  });

  const update = (key: string, value: string | null) => setForm(prev => ({ ...prev, [key]: value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => update('imagePreview', ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const step1Valid = form.title.trim() && form.category && form.type;
  const step2Valid = form.description.trim() && (form.credits || form.price);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
          className="bg-card rounded-3xl border border-border shadow-lg p-10 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
            <CheckCircle2 className="w-8 h-8" style={{ color: '#10B981' }} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Listing Posted!
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            <span className="font-semibold text-foreground">"{form.title}"</span> is now live on CampusKart.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Verified students on your campus can now see and request your listing.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/browse">
              <Button className="w-full bg-primary text-white rounded-xl">Browse Listings</Button>
            </Link>
            <Button variant="outline" className="w-full rounded-xl" onClick={() => { setSubmitted(false); setStep(1); setForm({ title: '', category: '', type: 'sell', condition: 'Good', description: '', credits: '', price: '', imagePreview: null }); }}>
              Post Another Listing
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <title>Post a Listing — CampusKart</title>
      <meta name="description" content="Post your item or service on CampusKart and earn Campus Credits." />

      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          {/* Back */}
          <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
              Post a Listing
            </h1>
            <p className="text-sm text-muted-foreground">Reach verified students on your campus in minutes.</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  s < step ? 'bg-accent text-white' : s === step ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`} style={s < step ? { backgroundColor: '#10B981' } : {}}>
                  {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={`text-sm font-medium ${s === step ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s === 1 ? 'Item Details' : s === 2 ? 'Pricing & Description' : 'Photo'}
                </span>
                {s < 3 && <div className={`flex-1 h-0.5 w-8 ${s < step ? 'bg-accent' : 'bg-border'}`} style={s < step ? { backgroundColor: '#10B981' } : {}} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' as const }}
                className="flex flex-col gap-6"
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Item Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Engineering Maths Textbook, Casio Calculator..."
                    value={form.title}
                    onChange={e => update('title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Category *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => update('category', cat.label)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          form.category === cat.label
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-card hover:border-primary/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center`}>
                          <cat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Listing Type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {listingTypes.map(t => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => update('type', t.value)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          form.type === t.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-card hover:border-primary/30'
                        }`}
                      >
                        <p className="text-sm font-semibold text-foreground">{t.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Condition</label>
                  <div className="flex flex-wrap gap-2">
                    {conditions.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update('condition', c)}
                        className={`text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
                          form.condition === c
                            ? 'bg-primary text-white border-primary'
                            : 'bg-card text-foreground border-border hover:border-primary/40'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  disabled={!step1Valid}
                  onClick={() => setStep(2)}
                  className="w-full bg-primary text-white rounded-xl py-3 font-semibold"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' as const }}
                className="flex flex-col gap-6"
              >
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Description *</label>
                  <textarea
                    placeholder="Describe the item — condition, what's included, any defects, why you're selling..."
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                    required
                  />
                </div>

                {/* Pricing */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Pricing *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Campus Credits</label>
                      <div className="relative">
                        <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#10B981' }} />
                        <input
                          type="number"
                          placeholder="e.g. 80"
                          value={form.credits}
                          onChange={e => update('credits', e.target.value)}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          min="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Cash Price (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">₹</span>
                        <input
                          type="number"
                          placeholder="e.g. 160"
                          value={form.price}
                          onChange={e => update('price', e.target.value)}
                          className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Coins className="w-3 h-3" style={{ color: '#10B981' }} />
                    Tip: Listings with Campus Credits get 2x more views
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-xl">
                    Back
                  </Button>
                  <Button
                    type="button"
                    disabled={!step2Valid}
                    onClick={() => setStep(3)}
                    className="flex-1 bg-primary text-white rounded-xl font-semibold"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' as const }}
                className="flex flex-col gap-6"
              >
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Item Photo</label>
                  {form.imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted">
                      <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => update('imagePreview', null)}
                        className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                      <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">Click to upload a photo</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Listings with photos get 5x more responses</p>
                </div>

                {/* Summary */}
                <div className="bg-muted/50 rounded-2xl p-5 border border-border">
                  <h3 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Listing Summary
                  </h3>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title</span>
                      <span className="font-medium text-foreground text-right max-w-[60%] truncate">{form.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-foreground">{form.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium text-foreground capitalize">{form.type}</span>
                    </div>
                    {form.credits && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credits</span>
                        <span className="font-medium text-foreground">{form.credits} cr</span>
                      </div>
                    )}
                    {form.price && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cash Price</span>
                        <span className="font-medium text-foreground">₹{form.price}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trust note */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#10B981' }} />
                  Your listing will be visible only to verified students on your campus.
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 rounded-xl">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary text-white rounded-xl font-semibold gap-2">
                    <Upload className="w-4 h-4" />
                    Post Listing
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
