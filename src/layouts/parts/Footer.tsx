import { Link } from 'react-router-dom';
import { BookOpen, Coins, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                Campus<span className="text-primary" style={{ color: '#818CF8' }}>Kart</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Buy, sell, or borrow inside your college. The hyperlocal marketplace built for students.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="mailto:hello@campuskart.in" aria-label="Email" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Platform</h4>
            <ul className="flex flex-col gap-2.5">
              {['Browse Listings', 'Categories', 'Post a Listing', 'How It Works'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-white/70 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Campus Credits */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Campus Credits</h4>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Coins className="w-4 h-4 text-accent" style={{ color: '#10B981' }} />
              </div>
              <span className="text-sm font-semibold text-white">Virtual Currency</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-3">
              Trade without real money. Earn credits by selling, spend them to buy or borrow.
            </p>
            <ul className="flex flex-col gap-2">
              {['Earn Credits', 'Spend Credits', 'Credit History', 'Top Up'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-white/70 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Safety Tips', href: '/safety' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/40">
            © 2026 CampusKart. Made with ❤️ for students.
          </p>
          <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ backgroundColor: '#10B981' }} />
            <span className="text-xs font-medium text-white/70">Verified Students Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
