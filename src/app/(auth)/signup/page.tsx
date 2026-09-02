'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, LogIn } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullName, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl bg-surface-card border border-border shadow-card border-l-2 border-l-primary flex flex-col gap-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-orange-500/20 mx-auto mb-4">
            C
          </div>
          <h1 className="font-headline text-2xl font-bold text-foreground">
            Join Team Exam Prep
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create an account to track your progress and practice mock exams.
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
              Your Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-lowest border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-2xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 font-bold">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. alex2026"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-lowest border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 font-mono transition-all"
            />
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
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Create Member Account</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/40">
          Already have an account?{' '}
          <a href="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
