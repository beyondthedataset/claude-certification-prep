'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { User, UserProgress } from '@/lib/types';

function calculateStreak(answers: Record<number, { timestamp?: string }> = {}): number {
  const dates = Object.values(answers)
    .map(a => a.timestamp?.split('T')[0])
    .filter(Boolean) as string[];
  
  if (dates.length === 0) return 0;
  const uniqueDates = Array.from(new Set(dates)).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  let streak = 0;
  const cursor = new Date(uniqueDates[0]);
  for (let i = 0; i < uniqueDates.length; i++) {
    const curStr = cursor.toISOString().split('T')[0];
    if (uniqueDates.includes(curStr)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          setUser(data.user);
          if (data.progress) setProgress(data.progress);
        } else {
          setUser(null);
          setProgress(null);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setProgress(null);
    router.push('/login');
  };

  const streak = calculateStreak(progress?.answers);
  const answeredCount = Object.keys(progress?.answers || {}).length;

  const navLinks = [
    { href: '/', label: 'Daily Quest' },
    { href: '/learn', label: 'Questions Hub' },
    { href: '/mock-exam', label: 'Practice Runner' },
    { href: '/dashboard', label: 'Readiness & Analytics' },
    { href: '/resources', label: 'Review & Flashcards' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/learn?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0D0E12]/90 backdrop-blur-md border-b border-white/[0.07]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand & Links */}
        <div className="flex items-center gap-8">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md xl:hidden text-on-surface-variant hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <span className="material-symbols-outlined text-xl">close</span> : <span className="material-symbols-outlined text-xl">menu</span>}
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="h-7 w-7 rounded-md bg-white text-[#0D0E12] flex items-center justify-center font-bold text-xs shadow-sm">
              CP
            </div>
            <div className="flex items-center gap-2">
              <span className="font-headline text-[17px] tracking-tight font-semibold text-white">
                CertPulse
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-widest text-on-surface-variant/80 border border-white/10 uppercase">
                PRO
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-7 h-16">
            {navLinks.map(link => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`h-full flex items-center text-[13px] tracking-wide transition-colors ${
                    isActive
                      ? 'text-white border-b-2 border-white font-medium'
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14161D] border border-white/[0.08] w-48 lg:w-56 text-[12px] text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-sm text-outline">search</span>
            <input
              type="text"
              placeholder="Search CCA topics, Q#…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white placeholder-on-surface-variant/60 focus:outline-none w-full text-xs font-sans"
            />
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] font-mono text-[10px] shrink-0 text-text-subtle">
              ↵
            </kbd>
          </form>

          {/* Streak Counter / Status */}
          {user ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#14161D] border border-white/[0.08]">
              <span className="material-symbols-outlined text-[#7BD0FF] text-[15px]">local_fire_department</span>
              <span className="font-mono text-[11px] text-on-surface">
                {streak > 0 ? `${streak}d Streak` : answeredCount > 0 ? `${answeredCount} Solved` : '0d Streak'}
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#14161D] border border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-[11px] text-on-surface">CCA-F 574 Qs</span>
            </div>
          )}


          {/* User Auth Controls */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
              <a
                href="/dashboard"
                className="flex items-center gap-2 text-[13px] text-on-surface hover:text-white"
                title="Candidate Profile"
              >
                <div className="w-7 h-7 rounded-full bg-white text-black font-semibold flex items-center justify-center text-xs">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline font-medium text-xs">{user.username}</span>
              </a>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded text-on-surface-variant hover:text-rose-400 transition-colors"
                title="Sign out"
              >
                <span className="material-symbols-outlined text-[17px]">logout</span>
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md bg-white text-black font-medium text-xs hover:bg-neutral-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In</span>
            </a>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-white/[0.07] bg-[#0D0E12] px-4 py-4 space-y-1">
          {navLinks.map(link => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm ${
                  isActive ? 'bg-white/10 text-white font-medium' : 'text-on-surface-variant hover:text-white'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
