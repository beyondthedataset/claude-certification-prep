'use client';

import { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { User } from '@/lib/types';
import { Menu, X, Award, BookOpen, BarChart3, FileText, User as UserIcon, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data && data.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  const navLinks = [
    { href: '/learn', label: 'Curriculum & Q-Bank', icon: BookOpen },
    { href: '/mock-exam', label: 'Mock Exams', icon: Award },
    { href: '/dashboard', label: 'Team Analytics', icon: BarChart3 },
    { href: '/resources', label: 'Blueprint', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-lowest/90 backdrop-blur-md border-b border-border/40">
      <nav className="flex items-center justify-between w-full px-4 md:px-8 py-3.5 max-w-screen-2xl mx-auto">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md lg:hidden text-foreground/70 hover:text-foreground hover:bg-surface-high mr-2"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-base md:text-lg font-bold text-foreground tracking-tight leading-none">
                Claude Certified
              </span>
              <span className="font-mono text-3xs text-muted-foreground uppercase tracking-widest mt-0.5">
                Architect Foundations (CCA-F)
              </span>
            </div>
          </a>
          <span className="hidden sm:inline-block font-mono text-4xs uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full ml-2">
            v1.0 · July 2026
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 ml-8">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <a
                key={link.href}
                href={link.href}
                className={`font-headline text-xs tracking-wide uppercase font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <a
            href="/mock-exam"
            className="items-center justify-center whitespace-nowrap rounded-sm technical-gradient text-white font-bold shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 h-8 px-3.5 text-xs hidden sm:inline-flex"
          >
            Take Mock Exam
          </a>

          {user ? (
            <div className="flex items-center gap-2">
              <a
                href="/dashboard"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-high border border-border text-xs text-foreground font-medium hover:border-primary/40 transition-colors"
                title="View Team Dashboard"
              >
                <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-3xs font-bold uppercase">
                  {user.username.charAt(0)}
                </div>
                <span>{user.username}</span>
              </a>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center p-2 rounded text-muted-foreground hover:text-rose-400 hover:bg-surface-high transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border text-xs text-foreground font-medium hover:bg-surface-high transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </a>
          )}

          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-surface-lowest px-4 py-4 space-y-3">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-foreground/80 hover:bg-surface-high hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </a>
            );
          })}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <a
              href="/mock-exam"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 rounded technical-gradient text-white text-xs font-bold"
            >
              Take Mock Exam
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
