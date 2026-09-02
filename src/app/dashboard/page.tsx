'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserProgress, ExamAttempt, TeamMemberStats } from '@/lib/types';
import { DOMAINS } from '@/lib/questions-data';
import { formatTime, formatDate } from '@/lib/utils';
import { Award, BarChart3, Users, BookOpen, Clock, CheckCircle2, ArrowRight, ShieldCheck, Flame, RotateCcw, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [teamStats, setTeamStats] = useState<TeamMemberStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(res => res.json()),
      fetch('/api/exams/history').then(res => res.json()),
      fetch('/api/team').then(res => res.json()),
    ])
      .then(([authData, examsData, teamData]) => {
        if (!authData || !authData.user) {
          router.push('/login');
          return;
        }
        setUser(authData.user);
        setProgress(authData.progress);
        if (examsData?.attempts) setAttempts(examsData.attempts);
        if (teamData?.leaderboard) setTeamStats(teamData.leaderboard);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="font-mono text-xs text-muted-foreground">Loading Team Analytics...</span>
        </div>
      </div>
    );
  }

  const answersList = Object.values(progress?.answers || {});
  const questionsPracticed = answersList.length;
  const correctCount = answersList.filter(a => a.isCorrect).length;
  const accuracyPct = questionsPracticed > 0 ? Math.round((correctCount / questionsPracticed) * 100) : 0;
  const totalMocks = attempts.length;
  const bestMockScore = totalMocks > 0 ? Math.max(...attempts.map(a => a.scorePct)) : 0;

  // Readiness Score
  const volumeScore = Math.min(100, Math.round((questionsPracticed / 134) * 100));
  const readinessScore = Math.round((volumeScore * 0.35) + (accuracyPct * 0.3) + (bestMockScore * 0.35));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface-card border border-border border-l-4 border-l-primary shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2 font-mono text-3xs text-primary uppercase tracking-widest font-semibold">
            <span>Team Exam Prep Portal</span>
            <span>·</span>
            <span>Architect Foundations</span>
          </div>
          <h1 className="font-headline text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Welcome back, {user?.fullName || user?.username}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Track your individual question mastery, review past mock attempts, and compare progress with team members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/mock-exam"
            className="px-5 py-2.5 rounded-lg technical-gradient text-white text-xs font-bold shadow-lg shadow-orange-600/25 flex items-center gap-2"
          >
            <Award className="h-4 w-4" />
            <span>Take New Mock Exam</span>
          </a>
          <a
            href="/learn"
            className="px-4 py-2.5 rounded-lg bg-surface-high hover:bg-surface-container border border-border text-xs font-semibold text-foreground transition-colors"
          >
            Practice Q-Bank
          </a>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Readiness Metric */}
        <div className="p-5 rounded-xl bg-surface-card border border-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
            <span>Overall Readiness</span>
            <Flame className="h-4 w-4 text-orange-400" />
          </div>
          <div className="my-3">
            <span className="font-mono text-3xl font-extrabold text-primary">
              {readinessScore}%
            </span>
            <span className="text-3xs text-muted-foreground block mt-0.5 font-mono">
              {readinessScore >= 75 ? '🟢 Ready for live exam' : '🟡 Keep practicing'}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-lowest overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary to-orange-400"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        {/* Questions Practiced */}
        <div className="p-5 rounded-xl bg-surface-card border border-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
            <span>Questions Attempted</span>
            <BookOpen className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="my-3">
            <span className="font-mono text-3xl font-extrabold text-foreground">
              {questionsPracticed} <span className="text-sm font-normal text-muted-foreground">/ 134</span>
            </span>
            <span className="text-3xs text-muted-foreground block mt-0.5 font-mono">
              {Math.round((questionsPracticed / 134) * 100)}% of Question Bank
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-lowest overflow-hidden border border-border">
            <div
              className="h-full bg-cyan-500"
              style={{ width: `${Math.round((questionsPracticed / 134) * 100)}%` }}
            />
          </div>
        </div>

        {/* Practice Accuracy */}
        <div className="p-5 rounded-xl bg-surface-card border border-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
            <span>Practice Accuracy</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="my-3">
            <span className="font-mono text-3xl font-extrabold text-emerald-400">
              {accuracyPct}%
            </span>
            <span className="text-3xs text-muted-foreground block mt-0.5 font-mono">
              {correctCount} Correct / {questionsPracticed - correctCount} Incorrect
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-lowest overflow-hidden border border-border">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${accuracyPct}%` }}
            />
          </div>
        </div>

        {/* Best Mock Score */}
        <div className="p-5 rounded-xl bg-surface-card border border-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
            <span>Best Mock Score</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="my-3">
            <span className="font-mono text-3xl font-extrabold text-amber-400">
              {bestMockScore}%
            </span>
            <span className="text-3xs text-muted-foreground block mt-0.5 font-mono">
              {totalMocks} Total Mocks Completed
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-lowest overflow-hidden border border-border">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${bestMockScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Columns: Mock History & Team Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Mock Exam History Table */}
        <div className="p-6 rounded-2xl bg-surface-card border border-border shadow-card flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <h3 className="font-headline text-base font-bold text-foreground">
                Your Mock Exam Attempts
              </h3>
            </div>
            <a
              href="/mock-exam"
              className="font-mono text-2xs text-primary hover:underline"
            >
              Start New Mock →
            </a>
          </div>

          {attempts.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No mock exams taken yet.{' '}
              <a href="/mock-exam" className="text-primary font-bold hover:underline">
                Take your first 60Q or 25Q simulation now!
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.map(attempt => (
                <div
                  key={attempt.id}
                  className="p-4 rounded-xl bg-surface-lowest border border-border hover:border-primary/40 transition-colors flex items-center justify-between flex-wrap gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-2xs uppercase tracking-wider font-bold text-foreground">
                        {attempt.examType === 'full' ? 'Full 60Q Mock' : attempt.examType === 'quick' ? 'Quick 25Q Mock' : 'Domain Drill'}
                      </span>
                      <span
                        className={`font-mono text-3xs px-1.5 py-0.5 rounded uppercase font-bold ${
                          attempt.passed
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {attempt.passed ? 'Passed' : 'Needs Review'}
                      </span>
                    </div>
                    <span className="text-3xs text-muted-foreground font-mono">
                      {formatDate(attempt.completedAt || attempt.startedAt)} · {formatTime(attempt.timeSpentSeconds)} duration
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span
                        className={`text-sm font-bold block ${
                          attempt.passed ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {attempt.scorePct}%
                      </span>
                      <span className="text-3xs text-muted-foreground">
                        ({attempt.score}/{attempt.totalQuestions})
                      </span>
                    </div>

                    <a
                      href={`/mock-exam/result/${attempt.id}`}
                      className="px-2.5 py-1 rounded bg-surface-high hover:bg-surface-container border border-border text-2xs font-semibold text-foreground"
                    >
                      Report
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Leaderboard */}
        <div className="p-6 rounded-2xl bg-surface-card border border-border shadow-card flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400" />
              <h3 className="font-headline text-base font-bold text-foreground">
                Team Exam Readiness Leaderboard
              </h3>
            </div>
            <span className="font-mono text-3xs text-muted-foreground uppercase">
              {teamStats.length} Members
            </span>
          </div>

          <div className="space-y-3">
            {teamStats.map((member, idx) => {
              const isCurrentUser = member.userId === user?.id;

              return (
                <div
                  key={member.userId}
                  className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                    isCurrentUser
                      ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                      : 'bg-surface-lowest border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        idx === 0
                          ? 'bg-amber-400 text-black'
                          : idx === 1
                          ? 'bg-slate-300 text-black'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-surface-card border border-border text-muted-foreground'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span>{member.fullName}</span>
                        {isCurrentUser && (
                          <span className="text-3xs font-mono text-primary font-bold">(You)</span>
                        )}
                      </span>
                      <span className="text-3xs font-mono text-muted-foreground">
                        {member.questionsPracticed} Qs · {member.accuracyPct}% accuracy · {member.mocksTaken} mocks
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-mono text-sm font-extrabold text-primary">
                      {member.readinessPct}%
                    </span>
                    <span className="font-mono text-3xs text-muted-foreground uppercase tracking-wider">
                      Readiness
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
