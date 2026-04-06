import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, BookOpen, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Browse', href: '/browse' },
    { label: 'Categories', href: '/categories' },
    { label: 'Post Listing', href: '/post', highlight: true },
    { label: 'Credits', href: '/credits' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Campus<span className="text-primary">Kart</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.highlight ? (
                <Link key={link.href} to={link.href}>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold ml-2">
                    + Post Listing
                  </Button>
                </Link>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Credits Badge */}
            <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-semibold">
              <Coins className="w-3.5 h-3.5" />
              <span>250 Credits</span>
            </div>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                <User className="w-5 h-5 text-muted-foreground" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                link.highlight
                  ? 'bg-primary text-white font-semibold text-center'
                  : isActive(link.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {link.highlight ? '+ Post Listing' : link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-semibold">
              <Coins className="w-3.5 h-3.5" />
              <span>250 Credits</span>
            </div>
            <Link to="/profile" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
