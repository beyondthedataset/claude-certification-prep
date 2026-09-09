'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserProgress, ExamAttempt, TeamMemberStats } from '@/lib/types';
import { DOMAINS, QUESTIONS_DATA } from '@/lib/questions-data';
import { formatTime, formatDate } from '@/lib/utils';
import SubdomainMasteryCard from '@/components/SubdomainMasteryCard';

const TOTAL_QUESTIONS_COUNT = QUESTIONS_DATA.length || 574;

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
          <div className="w-8 h-8 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          <span className="font-mono text-xs text-text-muted">Streaming Candidate Telemetry Model...</span>
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

  // Real or projected readiness metric
  const hasData = questionsPracticed > 0 || totalMocks > 0;
  const volumeScore = Math.min(100, Math.round((questionsPracticed / TOTAL_QUESTIONS_COUNT) * 100));
  const readinessScore = hasData
    ? Math.round((volumeScore * 0.35) + (accuracyPct * 0.3) + (bestMockScore * 0.35))
    : 0;
  const projectedScore = hasData
    ? Math.round(500 + (readinessScore / 100) * 400)
    : 0;

  // Cohort rank/percentile
  let cohortBadge = 'Active Candidate';
  if (teamStats.length > 1 && user) {
    const userRank = teamStats.findIndex(m => m.userId === user.id);
    if (userRank !== -1) {
      cohortBadge = `Rank #${userRank + 1} of ${teamStats.length}`;
    }
  }

  // Domain Competency Breakdown
  const domainStats = DOMAINS.map((domain, index) => {
    const domainQuestions = QUESTIONS_DATA.filter(q => q.domain === domain.key);
    const totalInDomain = domainQuestions.length;
    const answeredInDomain = domainQuestions
      .map(q => progress?.answers[q.question_number])
      .filter((a): a is NonNullable<typeof a> => !!a);
    const practiced = answeredInDomain.length;
    const correct = answeredInDomain.filter(a => a.isCorrect).length;
    const accuracy = practiced > 0 ? Math.round((correct / practiced) * 100) : 0;
    const delta = accuracy - 70;

    return {
      domain,
      index,
      totalInDomain,
      practiced,
      correct,
      accuracy,
      delta,
      isCleared: practiced >= 3 && accuracy >= 70,
    };
  });

  const clearedDomainsCount = domainStats.filter(d => d.isCleared).length;

  // AI Guidance insight
  const practicedDomains = domainStats.filter(d => d.practiced > 0);
  const weakestDomain = practicedDomains.length > 0
    ? [...practicedDomains].sort((a, b) => a.accuracy - b.accuracy)[0]
    : domainStats[0];

  // Targeted Remediation Queue from actual wrong answers
  const wrongByDomain = domainStats
    .map(d => {
      const wrongCount = d.practiced - d.correct;
      return { ...d, wrongCount };
    })
    .filter(d => d.wrongCount > 0)
    .sort((a, b) => b.wrongCount - a.wrongCount);

  // Score progression SVG calculation
  const sortedAttempts = [...attempts].sort(
    (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
  );
  const recentAttempts = sortedAttempts.slice(-6);

  // SVG dimensions: 500x180
  // Y-axis: 0 to 100% -> Y mapped from 160 (0%) to 30 (100%)
  const getY = (pct: number) => Math.round(160 - (Math.min(100, Math.max(0, pct)) / 100) * 130);
  const getX = (index: number, total: number) => {
    if (total <= 1) return 250;
    return Math.round(40 + (index / (total - 1)) * 420);
  };

  const chartPoints = recentAttempts.map((att, i) => ({
    x: getX(i, recentAttempts.length),
    y: getY(att.scorePct),
    score: att.scorePct,
    label: `M${i + 1}`,
  }));

  const linePath = chartPoints.length > 0
    ? chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  const areaPath = chartPoints.length > 0
    ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} 170 L ${chartPoints[0].x} 170 Z`
    : '';

  return (
    <div className="w-full min-h-screen bg-[#0D0E12] text-text-primary pb-24">
      {/* Executive Telemetry Header */}
      <div className="w-full bg-[#0D0E12] border-b border-white/[0.08] py-6 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-text-subtle">
              <span className="inline-flex items-center gap-1.5 text-white font-medium uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Candidate Telemetry Engine
              </span>
              <span>/</span>
              <span>USER: {user?.username}</span>
              <span>/</span>
              <span>{questionsPracticed} SOLVED</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Candidate Readiness &amp; Telemetry
            </h1>
          </div>

          {/* Active Specification Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#14161D] border border-white/[0.08] text-xs font-medium text-white self-start md:self-auto shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary">terminal</span>
            <span>Claude Certified Architect (CCA-F)</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">Active Telemetry</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto w-full px-6 py-8 flex flex-col gap-8">
        {/* 3-Metric Split Card with Hairline Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 rounded-xl border border-white/[0.08] bg-[#14161D] divide-y md:divide-y-0 md:divide-x divide-white/[0.08] shadow-sm overflow-hidden">
          {/* Readiness Metric */}
          <div className="p-6 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-text-subtle">
                Exam Readiness
              </span>
              <span className="text-[11px] font-mono uppercase text-secondary px-2 py-0.5 rounded border border-secondary/20 bg-secondary/10">
                {cohortBadge}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-headline font-light text-white tracking-tight">
                {readinessScore}<span className="text-xl text-text-muted font-normal">%</span>
              </span>
              <span className="text-xs text-white font-medium">
                {readinessScore >= 70
                  ? 'Exam Ready (Threshold 70%)'
                  : questionsPracticed === 0
                  ? 'Assessment Not Started'
                  : 'Developing Readiness (Cutoff 70%)'}
              </span>
            </div>
            <div className="w-full bg-[#0D0E12] h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>

          {/* Current Projected Score */}
          <div className="p-6 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-text-subtle">
                Projected Score
              </span>
              <span className="text-[11px] font-mono text-text-subtle">
                Passing Cutoff: 720
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-headline font-light text-white tracking-tight">
                {projectedScore > 0 ? projectedScore : '—'}
              </span>
              {projectedScore > 0 ? (
                <>
                  <span className="font-mono text-xs text-text-subtle">/ 1000 PTS</span>
                  <span className={`font-mono text-xs ml-auto ${projectedScore >= 720 ? 'text-emerald-300' : 'text-amber-400'}`}>
                    {projectedScore >= 720 ? `+${projectedScore - 720} safety margin` : `${720 - projectedScore} pts below cutoff`}
                  </span>
                </>
              ) : (
                <span className="font-mono text-xs text-text-subtle">Complete 1st mock to estimate</span>
              )}
            </div>
            <div className="w-full bg-[#0D0E12] h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
              <div
                className="bg-slate-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${projectedScore > 0 ? Math.min(100, Math.round((projectedScore / 1000) * 100)) : 0}%` }}
              />
            </div>
          </div>

          {/* Questions Practiced */}
          <div className="p-6 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-text-subtle">
                Questions Mastered
              </span>
              <span className="text-[11px] font-mono text-text-subtle">
                {questionsPracticed > 0 ? `${accuracyPct}% Accuracy` : '0% (Unassessed)'}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-headline font-light text-white tracking-tight">
                {questionsPracticed}
              </span>
              <span className="font-mono text-xs text-text-subtle">
                / {TOTAL_QUESTIONS_COUNT} items
              </span>
            </div>
            <div className="w-full bg-[#0D0E12] h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
              <div
                className="bg-slate-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round((questionsPracticed / TOTAL_QUESTIONS_COUNT) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic AI Guidance Callout Banner */}
        <div className="rounded-xl border border-white/[0.08] bg-[#14161D] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-secondary shrink-0 bg-[#0D0E12]">
              <span className="material-symbols-outlined text-[18px]">insights</span>
            </div>
            <div className="flex items-center gap-2 truncate text-xs sm:text-sm">
              <span className="font-mono text-xs text-text-subtle shrink-0">STITCH INSIGHT:</span>
              <span className="text-white truncate font-sans">
                {practicedDomains.length === 0 ? (
                  'Welcome to CertPulse. Complete your first practice drill or launch a rapid diagnostic mock to calibrate your candidate telemetry.'
                ) : weakestDomain.accuracy < 70 ? (
                  `${weakestDomain.domain.code} (${weakestDomain.domain.name}) is currently at ${weakestDomain.accuracy}% accuracy (${Math.abs(weakestDomain.delta)}% delta from passing bar). Focused practice will yield rapid point gains.`
                ) : (
                  `Strong performance across all evaluated domains. Maintain pacing with a 60Q Full Simulation to validate exam endurance.`
                )}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              if (practicedDomains.length === 0) {
                router.push('/learn');
              } else if (weakestDomain.accuracy < 70) {
                router.push(`/learn?domain=${weakestDomain.domain.key}`);
              } else {
                router.push('/mock-exam');
              }
            }}
            className="px-4 py-1.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-[#E2E8F0] transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <span>{practicedDomains.length === 0 ? 'Start Warmup Drill' : weakestDomain.accuracy < 70 ? 'Drill Weakest Area' : 'Launch 60Q Simulation'}</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Main Two-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Domain Breakdown & SVG Progression Chart (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Domain Competency Breakdown */}
            <div className="rounded-xl border border-white/[0.08] bg-[#14161D] p-6 flex flex-col gap-5">
              <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="font-headline text-base font-semibold text-white">
                    Domain Competency Breakdown
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5 font-sans">
                    Real-time benchmark evaluations against official certification passing bar (70%)
                  </p>
                </div>
                <span className="font-mono text-xs text-text-subtle">
                  {clearedDomainsCount} / 5 CLEARED
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {domainStats.map((item, index) => {
                  const isAssessed = item.practiced > 0;
                  const isPassing = item.accuracy >= 70;

                  return (
                    <div key={item.domain.key} className="flex flex-col gap-2 p-3 rounded-lg bg-[#0D0E12] border border-white/[0.04]">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs text-text-subtle shrink-0">0{index + 1}</span>
                          <span className="text-white font-medium truncate">{item.domain.name}</span>
                          <span className="font-mono text-[11px] text-text-subtle shrink-0">{item.domain.weightPct}% wt</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono shrink-0 ml-2">
                          {isAssessed ? (
                            <>
                              <span className="text-white font-semibold">{item.accuracy}%</span>
                              <span className="text-text-subtle text-[11px]">({item.correct}/{item.practiced})</span>
                              <span className={`text-[11px] ${isPassing ? 'text-emerald-300' : 'text-rose-400'}`}>
                                {item.delta >= 0 ? `+${item.delta}%` : `${item.delta}% deficit`}
                              </span>
                            </>
                          ) : (
                            <span className="text-outline text-[11px]">Unassessed (0/{item.totalInDomain})</span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-[#1C202B] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            !isAssessed ? 'bg-transparent' : isPassing ? 'bg-white' : 'bg-slate-400'
                          }`}
                          style={{ width: `${isAssessed ? item.accuracy : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Score Progression Trajectory SVG Line Chart */}
            <div className="rounded-xl border border-white/[0.08] bg-[#14161D] p-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="font-headline text-base font-semibold text-white">
                    Score Progression Trajectory
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5 font-sans">
                    Mock exam series benchmark progression across completed sessions
                  </p>
                </div>
                <div className="flex items-center gap-4 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="w-2.5 h-0.5 bg-white"></span>
                    <span>Candidate Score</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-subtle">
                    <span className="w-2.5 h-0.5 bg-text-subtle border-b border-dashed"></span>
                    <span>Cutoff (720 / 70%)</span>
                  </div>
                </div>
              </div>

              {recentAttempts.length === 0 ? (
                <div className="w-full h-56 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/[0.08] rounded-lg bg-[#0D0E12]/40">
                  <span className="material-symbols-outlined text-outline text-3xl mb-2">show_chart</span>
                  <h3 className="text-white text-sm font-medium">No Simulation Sessions Recorded</h3>
                  <p className="text-xs text-text-muted mt-1 max-w-sm font-sans">
                    Complete a 25Q Rapid Assessment or 60Q Full Simulation to map your score curve against the official 720 cutoff.
                  </p>
                  <a
                    href="/mock-exam"
                    className="mt-4 px-4 py-1.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-[#E2E8F0] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Take First Mock Exam</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              ) : (
                <div className="w-full h-56 relative mt-2">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 180">
                    <defs>
                      <linearGradient id="curveGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Gridlines */}
                    <line stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="30" />
                    <line stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="75" />
                    <line stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="120" />
                    <line stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="165" />

                    {/* 70% Cutoff Line at Y = 69 */}
                    <line stroke="#8E95A5" strokeDasharray="4 4" strokeWidth="1.5" x1="0" x2="500" y1="69" opacity="0.6" />
                    <text fill="#8E95A5" fontFamily="JetBrains Mono, monospace" fontSize="9" x="420" y="63">
                      70% PASS LINE
                    </text>

                    {/* Gradient Area Fill */}
                    {chartPoints.length > 1 && (
                      <path d={areaPath} fill="url(#curveGradient)" />
                    )}

                    {/* Candidate Score Curve */}
                    {chartPoints.length > 1 && (
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Data Points */}
                    {chartPoints.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} fill="#0D0E12" r="4.5" stroke="#FFFFFF" strokeWidth="2" />
                        <text
                          fill={p.score >= 70 ? '#7BD0FF' : '#E2E8F0'}
                          fontFamily="JetBrains Mono, monospace"
                          fontSize="9"
                          textAnchor="middle"
                          x={p.x}
                          y={p.y - 10}
                        >
                          {p.score}% ({p.label})
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Remediation Queue & Mock Exam History (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Targeted Remediation Queue */}
            <div className="rounded-xl border border-white/[0.08] bg-[#14161D] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="font-headline text-sm font-semibold text-white">
                    Targeted Remediation Queue
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Highest leverage gaps identified by your response history
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-secondary px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20">
                  {wrongByDomain.length > 0 ? `${wrongByDomain.length} Priority Areas` : 'Optimal'}
                </span>
              </div>

              {wrongByDomain.length === 0 ? (
                <div className="py-6 text-center text-xs text-text-muted">
                  {questionsPracticed === 0
                    ? 'No remediation gaps detected yet. Practice questions in the Questions Hub to pinpoint focus areas.'
                    : 'No knowledge deficits recorded! All answered questions are correct.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {wrongByDomain.slice(0, 3).map(item => (
                    <div key={item.domain.key} className="p-3 rounded-lg bg-[#0D0E12] border border-white/[0.06] flex items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <span className="font-mono text-[10px] text-text-subtle uppercase">
                          {item.domain.code} • {item.domain.weightPct}% Weight
                        </span>
                        <h4 className="text-xs font-medium text-white truncate">{item.domain.name}</h4>
                        <span className="text-[11px] font-mono text-rose-400 block">
                          Current Accuracy: {item.accuracy}% ({item.wrongCount} missed of {item.practiced})
                        </span>
                      </div>
                      <button
                        onClick={() => router.push(`/learn?domain=${item.domain.key}`)}
                        className="px-3 py-1.5 rounded bg-[#1C202B] hover:bg-white text-text-muted hover:text-black text-xs font-medium transition-colors shrink-0"
                      >
                        Drill 10Q
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mock Exam History Card */}
            <div className="rounded-xl border border-white/[0.08] bg-[#14161D] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-headline text-sm font-semibold text-white">
                  Completed Mock Attempts ({attempts.length})
                </h3>
                <a
                  href="/mock-exam"
                  className="font-mono text-xs text-text-muted hover:text-white transition-colors"
                >
                  + New Test
                </a>
              </div>

              {attempts.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-subtle">
                  No mock exams recorded yet. Launch a 25Q or 60Q simulation to generate telemetry.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {attempts.map(att => (
                    <div
                      key={att.id}
                      onClick={() => router.push(`/mock-exam/result/${att.id}`)}
                      className="p-3 rounded-lg bg-[#0D0E12] border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-semibold ${att.passed ? 'text-emerald-300' : 'text-rose-400'}`}>
                            {att.scorePct}%
                          </span>
                          <span className="text-text-subtle text-xs">•</span>
                          <span className="text-xs text-white">
                            {att.examType === 'full' ? '60Q Full Simulation' : '25Q Quick Mock'}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-text-subtle block">
                          {formatDate(att.completedAt || att.startedAt)} • {formatTime(att.timeSpentSeconds)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-text-muted hover:text-white">
                        <span>Audit</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Team Leaderboard Snapshot */}
            {teamStats.length > 0 && (
              <div className="rounded-xl border border-white/[0.08] bg-[#14161D] p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <h3 className="font-headline text-sm font-semibold text-white">
                    Workspace Candidate Leaderboard
                  </h3>
                  <span className="font-mono text-xs text-text-subtle">
                    {teamStats.length} Members
                  </span>
                </div>

                <div className="space-y-2">
                  {teamStats.slice(0, 5).map((member, i) => {
                    const isCurrentUser = member.userId === user?.id;
                    return (
                      <div
                        key={member.userId}
                        className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                          isCurrentUser
                            ? 'bg-white/[0.05] border-white/20'
                            : 'bg-[#0D0E12] border-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-text-subtle text-[11px] w-4">
                            0{i + 1}
                          </span>
                          <span className={`truncate font-medium ${isCurrentUser ? 'text-secondary font-semibold' : 'text-white'}`}>
                            {member.fullName || member.username}
                            {isCurrentUser && ' (You)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                          <span className="text-text-subtle">{member.questionsPracticed} items</span>
                          <span className="text-secondary font-semibold">{member.accuracyPct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 30 Subdomain Curriculum Mastery Widget */}
        <SubdomainMasteryCard userProgress={progress} />
      </div>
    </div>
  );
}
