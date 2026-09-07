'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#0D0E12]">
      <div className="w-full max-w-md p-8 rounded-xl bg-[#14161D] border border-white/[0.08] shadow-2xl flex flex-col gap-6">
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-md bg-white text-black font-headline font-bold text-lg flex items-center justify-center">
              CP
            </div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-semibold text-lg text-white tracking-tight">CertPulse</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider text-text-subtle border border-white/[0.08] uppercase">
                PRO
              </span>
            </div>
          </div>
          <h1 className="font-headline text-xl font-semibold text-white">
            Register Candidate Account
          </h1>
          <p className="text-xs text-text-muted mt-1 font-sans">
            Create an account to track individual mastery, save flashcards, and simulate exams.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-text-subtle uppercase tracking-wider mb-1.5 font-medium">
              Candidate Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3.5 py-2.5 rounded-md bg-[#0D0E12] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-text-subtle uppercase tracking-wider mb-1.5 font-medium">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. alex2026"
              className="w-full px-3.5 py-2.5 rounded-md bg-[#0D0E12] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 font-mono transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-text-subtle uppercase tracking-wider mb-1.5 font-medium">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-md bg-[#0D0E12] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-white text-black text-xs font-semibold hover:bg-[#E2E8F0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>Create Candidate Profile</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-text-muted pt-2 border-t border-white/[0.06]">
          Already have an account?{' '}
          <a href="/login" className="text-white font-medium hover:underline">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
