'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, Key, ShieldCheck, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoUser: string) => {
    setUsername(demoUser);
    setPassword('claude2026');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl bg-surface-card border border-border shadow-card border-l-2 border-l-primary flex flex-col gap-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-orange-500/20 mx-auto mb-4">
            C
          </div>
          <h1 className="font-headline text-2xl font-bold text-foreground">
            Sign In to CCA-F Portal
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Access your mock exam scores, personal readiness, and team progress.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-2xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 font-bold">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. alex or admin"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-lowest border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 font-mono transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 font-bold">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-lowest border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg technical-gradient text-white text-xs font-bold shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In to Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Admin Access */}
        <div className="pt-4 border-t border-border/40 text-center">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-high hover:bg-surface-container border border-border text-2xs font-mono text-foreground hover:text-primary transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Fill Admin Credentials</span>
          </button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Don't have an account yet?{' '}
          <a href="/signup" className="text-primary font-semibold hover:underline">
            Register New Member
          </a>
        </div>
      </div>
    </div>
  );
}
