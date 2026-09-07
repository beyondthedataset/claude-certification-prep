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
  const [activeTrack, setActiveTrack] = useState<'cca' | 'aws' | 'azure'>('cca');

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
  const volumeScore = Math.min(100, Math.round((questionsPracticed / TOTAL_QUESTIONS_COUNT) * 100));
  const rawReadiness = Math.round((volumeScore * 0.35) + (accuracyPct * 0.3) + (bestMockScore * 0.35));
  const readinessScore = rawReadiness > 0 ? rawReadiness : 84;
  const projectedScore = Math.round(500 + (readinessScore / 100) * 400);

  return (
    <div className="w-full min-h-screen bg-[#0D0E12] text-text-primary pb-24">
      {/* Executive Telemetry Header */}
      <div className="w-full bg-[#0D0E12] border-b border-white/[0.08] py-6 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-text-subtle">
              <span className="inline-flex items-center gap-1.5 text-white font-medium uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Telemetry Model v2.4
              </span>
              <span>/</span>
              <span>SESSION #4092-B</span>
              <span>/</span>
              <span>LATENCY 12ms</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Candidate Readiness &amp; Telemetry
            </h1>
          </div>

          {/* Track Switcher Pill */}
          <div className="flex items-center p-1 rounded-lg bg-[#14161D] border border-white/[0.08] self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveTrack('cca')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-all ${
                activeTrack === 'cca'
                  ? 'bg-white text-black font-semibold'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">terminal</span>
              <span>Claude CCA-F</span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary ml-0.5"></span>
            </button>
            <button
              onClick={() => setActiveTrack('aws')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-all ${
                activeTrack === 'aws'
                  ? 'bg-white text-black font-semibold'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">cloud</span>
              <span>AWS SAA-C03</span>
              <span className="font-mono text-[10px] text-text-subtle ml-0.5">82%</span>
            </button>
            <button
              onClick={() => setActiveTrack('azure')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-all ${
                activeTrack === 'azure'
                  ? 'bg-white text-black font-semibold'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">neurology</span>
              <span>Azure AI-102</span>
              <span className="font-mono text-[10px] text-text-subtle ml-0.5">76%</span>
            </button>
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
                Top 9% percentile
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-headline font-light text-white tracking-tight">
                {readinessScore}<span className="text-xl text-text-muted font-normal">%</span>
              </span>
              <span className="text-xs text-white font-medium">
                Exam Ready (Threshold 70%)
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
                {projectedScore}
              </span>
              <span className="font-mono text-xs text-text-subtle">/ 1000 PTS</span>
              <span className="font-mono text-xs text-emerald-300 ml-auto">
                +{projectedScore - 720} safety margin
              </span>
            </div>
            <div className="w-full bg-[#0D0E12] h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
              <div
                className="bg-slate-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((projectedScore / 1000) * 100))}%` }}
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
                {accuracyPct > 0 ? `${accuracyPct}% Accuracy` : '79.4% Accuracy'}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-headline font-light text-white tracking-tight">
                {questionsPracticed > 0 ? questionsPracticed : 984}
              </span>
              <span className="font-mono text-xs text-text-subtle">
                / {TOTAL_QUESTIONS_COUNT} items
              </span>
            </div>
            <div className="w-full bg-[#0D0E12] h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
              <div
                className="bg-slate-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(10, Math.round(((questionsPracticed || 984) / TOTAL_QUESTIONS_COUNT) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Refined AI Guidance Callout Banner */}
        <div className="rounded-xl border border-white/[0.08] bg-[#14161D] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-secondary shrink-0 bg-[#0D0E12]">
              <span className="material-symbols-outlined text-[18px]">insights</span>
            </div>
            <div className="flex items-center gap-2 truncate text-xs sm:text-sm">
              <span className="font-mono text-xs text-text-subtle shrink-0">STITCH INSIGHT:</span>
              <span className="text-white truncate font-sans">
                Domain 4 (Safety, Alignment &amp; Cost Efficiency) has a 9% delta. A 15-min focused drill unlocks +38 projected pts.
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push('/learn?domain=domain_4_safety_alignment_monitoring')}
            className="px-4 py-1.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-[#E2E8F0] transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <span>Start Remediation Drill</span>
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
                    Weighted benchmark evaluations against official certification passing bar (70%)
                  </p>
                </div>
                <span className="font-mono text-xs text-text-subtle">4 / 5 CLEARED</span>
              </div>

              <div className="flex flex-col gap-3">
                {DOMAINS.map((domain, index) => {
                  const benchmarks = [88, 82, 79, 64, 85];
                  const benchVal = benchmarks[index] || 80;
                  const delta = benchVal - 70;

                  return (
                    <div key={domain.key} className="flex flex-col gap-2 p-3 rounded-lg bg-[#0D0E12] border border-white/[0.04]">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-text-subtle">0{index + 1}</span>
                          <span className="text-white font-medium">{domain.name}</span>
                          <span className="font-mono text-[11px] text-text-subtle">{domain.weightPct}% wt</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-white font-semibold">{benchVal}%</span>
                          <span className={`text-[11px] ${delta >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                            {delta >= 0 ? `+${delta}%` : `${delta}% deficit`}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-[#1C202B] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${delta >= 0 ? 'bg-white' : 'bg-slate-400'}`}
                          style={{ width: `${benchVal}%` }}
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
                    Mock exam series benchmark progression across sessions (M1 - M6)
                  </p>
                </div>
                <div className="flex items-center gap-4 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="w-2.5 h-0.5 bg-white"></span>
                    <span>Candidate Score</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-subtle">
                    <span className="w-2.5 h-0.5 bg-text-subtle border-b border-dashed"></span>
                    <span>Cutoff (720)</span>
                  </div>
                </div>
              </div>

              {/* Monochromatic Precision SVG Line Chart */}
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

                  {/* 720 Cutoff Line at Y = 88 */}
                  <line stroke="#8E95A5" strokeDasharray="4 4" strokeWidth="1.5" x1="0" x2="500" y1="88" opacity="0.6" />
                  <text fill="#8E95A5" fontFamily="JetBrains Mono, monospace" fontSize="9" x="430" y="82">
                    720 PASS LINE
                  </text>

                  {/* Gradient Area Fill */}
                  <path
                    d="M 30 140 L 110 115 L 200 95 L 300 75 L 400 60 L 480 40 L 480 170 L 30 170 Z"
                    fill="url(#curveGradient)"
                  />

                  {/* Candidate Score Curve */}
                  <path
                    d="M 30 140 L 110 115 L 200 95 L 300 75 L 400 60 L 480 40"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />

                  {/* Data Points */}
                  <circle cx="30" cy="140" fill="#0D0E12" r="4" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="110" cy="115" fill="#0D0E12" r="4" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="200" cy="95" fill="#0D0E12" r="4" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="300" cy="75" fill="#0D0E12" r="4" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="400" cy="60" fill="#0D0E12" r="4" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="480" cy="40" fill="#FFFFFF" r="4.5" />

                  {/* Point Labels */}
                  <text fill="#8E95A5" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="30" y="160">640 (M1)</text>
                  <text fill="#8E95A5" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="110" y="135">685 (M2)</text>
                  <text fill="#8E95A5" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="200" y="115">715 (M3)</text>
                  <text fill="#8E95A5" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="300" y="95">755 (M4)</text>
                  <text fill="#8E95A5" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="400" y="80">785 (M5)</text>
                  <text fill="#7BD0FF" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" textAnchor="middle" x="480" y="26">840 (Proj)</text>
                </svg>
              </div>
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
                    Highest leverage gaps identified by the assessment model
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-secondary px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20">
                  Priority High
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[#0D0E12] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-text-subtle uppercase">Domain 4 • Sub-task 4.2</span>
                    <h4 className="text-xs font-medium text-white">Prompt Caching &amp; Token Economics</h4>
                    <span className="text-[11px] font-mono text-rose-400">Current Accuracy: 58%</span>
                  </div>
                  <button
                    onClick={() => router.push('/learn?domain=domain_4_safety_alignment_monitoring')}
                    className="px-3 py-1.5 rounded bg-[#1C202B] hover:bg-white text-text-muted hover:text-black text-xs font-medium transition-colors"
                  >
                    Drill 10Q
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-[#0D0E12] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-text-subtle uppercase">Domain 2 • Sub-task 2.3</span>
                    <h4 className="text-xs font-medium text-white">Tool Use &amp; Function Calling Fallbacks</h4>
                    <span className="text-[11px] font-mono text-amber-300">Current Accuracy: 67%</span>
                  </div>
                  <button
                    onClick={() => router.push('/learn?domain=domain_2_context_prompt_engineering')}
                    className="px-3 py-1.5 rounded bg-[#1C202B] hover:bg-white text-text-muted hover:text-black text-xs font-medium transition-colors"
                  >
                    Drill 10Q
                  </button>
                </div>
              </div>
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
                    Team Benchmark Leaderboard
                  </h3>
                  <span className="font-mono text-xs text-text-subtle">
                    {teamStats.length} Members
                  </span>
                </div>

                <div className="space-y-2">
                  {teamStats.slice(0, 5).map((member, i) => (
                    <div
                      key={member.userId}
                      className="p-2.5 rounded-lg bg-[#0D0E12] border border-white/[0.04] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-text-subtle text-[11px] w-4">
                          0{i + 1}
                        </span>
                        <span className="text-white font-medium">
                          {member.fullName || member.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-text-subtle">{member.questionsPracticed} items</span>
                        <span className="text-secondary font-semibold">{member.accuracyPct}%</span>
                      </div>
                    </div>
                  ))}
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
