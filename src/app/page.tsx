'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DOMAINS, QUESTIONS_DATA } from '@/lib/questions-data';
import { User, UserProgress, ExamAttempt, TeamMemberStats } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { RecentCompletion, CohortSummary } from '@/lib/db';

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

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [leaderboard, setLeaderboard] = useState<TeamMemberStats[]>([]);
  const [recentCompletions, setRecentCompletions] = useState<RecentCompletion[]>([]);
  const [cohortSummary, setCohortSummary] = useState<CohortSummary | null>(null);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [drillAnswered, setDrillAnswered] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(res => res.json()).catch(() => ({})),
      fetch('/api/exams/history').then(res => res.json()).catch(() => ({})),
      fetch('/api/team').then(res => res.json()).catch(() => ({})),
    ]).then(([authData, examsData, teamData]) => {
      if (authData?.user) setUser(authData.user);
      if (authData?.progress) setProgress(authData.progress);
      if (examsData?.attempts) setAttempts(examsData.attempts);
      if (teamData?.leaderboard) setLeaderboard(teamData.leaderboard);
      if (teamData?.recentCompletions) setRecentCompletions(teamData.recentCompletions);
      if (teamData?.cohortSummary) setCohortSummary(teamData.cohortSummary);
    });
  }, []);

  const microDrill = {
    question: "You are designing an enterprise multi-agent workflow using Claude 3.5 Sonnet where a primary coordinator delegates research and code generation sub-tasks to specialized subagents. Which architectural pattern provides the MOST reliable context management and fault tolerance across subagent invocations?",
    choices: [
      { letter: 'A', text: "Pass the coordinator's entire uncompressed conversation transcript into every subagent to ensure full conversational awareness." },
      { letter: 'B', text: 'Isolate subagent context with dedicated tool allowances, and have subagents persist structured manifests that the coordinator synthesizes upon handoff.' },
      { letter: 'C', text: 'Permit subagents to write mutations directly to the production database without returning structured status schemas to the coordinator.' },
      { letter: 'D', text: 'Persist all working state in client-side cookies and re-hydrate the global context on every agent turn.' }
    ],
    correctLetter: 'B',
    explanation: 'Correct! Subagents do not automatically inherit coordinator context. Isolating context with clear boundaries and structured manifests prevents context dilution, optimizes token consumption, and eliminates non-deterministic tool thrashing.'
  };

  // Real user calculations
  const answersList = Object.values(progress?.answers || {});
  const questionsPracticed = answersList.length;
  const correctCount = answersList.filter(a => a.isCorrect).length;
  const accuracyPct = questionsPracticed > 0 ? Math.round((correctCount / questionsPracticed) * 100) : 0;
  const totalMocks = attempts.length;
  const bestMockScore = totalMocks > 0 ? Math.max(...attempts.map(a => a.scorePct)) : 0;

  const hasData = questionsPracticed > 0 || totalMocks > 0;
  const volumeScore = Math.min(100, Math.round((questionsPracticed / 574) * 100));
  const readinessScore = hasData
    ? Math.round((volumeScore * 0.35) + (accuracyPct * 0.3) + (bestMockScore * 0.35))
    : 0;
  const projectedScore = hasData ? Math.round(500 + (readinessScore / 100) * 400) : 0;

  // Streak & Quests
  const streak = calculateStreak(progress?.answers);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAnswers = answersList.filter(a => a.timestamp?.startsWith(todayStr));
  const todayCount = todayAnswers.length;
  const quest1Pct = Math.min(100, Math.round((todayCount / 5) * 100));
  const quest1Done = todayCount >= 5;

  const todayWrong = todayAnswers.filter(a => !a.isCorrect).length;
  const hasReviewedMissed = todayWrong > 0 || Object.keys(progress?.starred || {}).length > 0 && todayCount > 0;
  const quest2Done = hasReviewedMissed;
  const quest3Done = streak > 0;

  const completedQuestsCount = (quest1Done ? 1 : 0) + (quest2Done ? 1 : 0) + (quest3Done ? 1 : 0);

  // 7-day cadence calculation from real answer timestamps
  const habitDays = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const isToday = i === 0;
    const count = answersList.filter(a => a.timestamp?.startsWith(dStr)).length;
    const hours = Math.round((count * 1.5 / 60) * 10) / 10;
    habitDays.push({
      day: dayNames[d.getDay()],
      dateStr: dStr,
      count,
      hours,
      isToday,
    });
  }
  const maxDayHours = Math.max(1, ...habitDays.map(h => h.hours));
  const totalWeekHours = Math.round(habitDays.reduce((sum, h) => sum + h.hours, 0) * 10) / 10;
  const totalWeekQuestions = habitDays.reduce((sum, h) => sum + h.count, 0);

  // Real domain mastery for top 3 cards
  const getDomainMastery = (domainKey: string) => {
    const domQuestions = QUESTIONS_DATA.filter(q => q.domain === domainKey);
    const domAnswers = domQuestions
      .map(q => progress?.answers[q.question_number])
      .filter((a): a is NonNullable<typeof a> => !!a);
    if (domAnswers.length === 0) return { pct: 0, count: 0, total: domQuestions.length };
    const correct = domAnswers.filter(a => a.isCorrect).length;
    return {
      pct: Math.round((correct / domAnswers.length) * 100),
      count: domAnswers.length,
      total: domQuestions.length,
    };
  };

  const dom1Stats = getDomainMastery('domain_1_agentic_architecture');
  const dom2Stats = getDomainMastery('domain_2_tool_design_mcp');
  const dom3Stats = getDomainMastery('domain_3_claude_code_config');

  // Voucher qualification tracker
  const qualifyingAttempts = attempts.filter(a => a.scorePct >= 80).length;
  const isVoucherQualified = qualifyingAttempts >= 2;

  // Latest mock attempt for the hero CTA
  const latestMock = attempts.length > 0 ? attempts[0] : null;

  // Circular gauge offset: 251.2 circumference
  const dashOffset = Math.round(251.2 - (251.2 * Math.min(100, Math.max(0, readinessScore))) / 100);

  return (
    <div className="w-full min-h-screen bg-[#0D0E12] text-on-surface">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">

        {/* 1. Inspiring Welcome Hero Section */}
        <section className="relative w-full overflow-hidden rounded-xl bg-[#08090C] border border-white/[0.07] p-6 sm:p-10 shadow-xl">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-bl from-[#7BD0FF]/10 via-[#00A6E0]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-gradient-to-tr from-[#1C202B]/40 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Welcome Copy & Targets */}
            <div className="flex flex-col max-w-[680px]">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wide bg-[#151821] text-on-surface-variant border border-white/[0.08]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7BD0FF] animate-pulse" />
                  ANTHROPIC BLUEPRINT STANDARD
                </span>
                <span className="text-outline text-[11px] font-mono">· 574 Verified Scenarios</span>
              </div>

              <h1 className="font-headline text-3xl sm:text-4xl text-white font-medium tracking-tight leading-[1.2]">
                {user ? `Welcome back, ${user.fullName || user.username}.` : 'Welcome to CertPulse.'} Ready to sharpen your Claude architecture craft?
              </h1>

              <p className="font-sans text-[15px] sm:text-[16px] text-on-surface-variant mt-3 leading-relaxed">
                Target: <span className="text-white font-medium">Claude Certified Architect (CCA-F)</span> · Foundational Exam.
                {hasData ? (
                  <>
                    {' '}You are <span className="text-[#7BD0FF] font-medium">{readinessScore}% exam-ready</span> across {questionsPracticed} practiced scenarios{' '}
                    <span className="text-white text-[11px] font-mono bg-[#151821] px-1.5 py-0.5 rounded border border-white/[0.06] ml-1">
                      {accuracyPct}% Accuracy
                    </span>.
                  </>
                ) : (
                  ' Begin your diagnostic evaluation across 574 vendor-aligned scenarios covering Agentic Systems, MCP, and Reliability.'
                )}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mt-7">
                <Link
                  href="/learn"
                  className="group inline-flex items-center gap-2 bg-white text-black font-medium text-[13px] px-5 py-2.5 rounded-md hover:bg-neutral-200 transition-all shadow-md active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span>Start Scenario Practice</span>
                  <span className="bg-black text-white font-mono text-[10px] px-1.5 py-0.5 rounded tracking-wider font-semibold ml-1">
                    574 Qs
                  </span>
                </Link>

                {latestMock ? (
                  <Link
                    href={`/mock-exam/result/${latestMock.id}`}
                    className="inline-flex items-center gap-2 bg-[#14161D] hover:bg-[#1C202B] text-on-surface text-[13px] px-4 py-2.5 rounded-md border border-white/[0.08] transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-outline">history</span>
                    <span>Review Latest Exam ({latestMock.scorePct}%)</span>
                    <span className="text-outline text-[11px] font-mono">{formatDate(latestMock.completedAt || latestMock.startedAt)}</span>
                  </Link>
                ) : (
                  <Link
                    href="/mock-exam"
                    className="inline-flex items-center gap-2 bg-[#14161D] hover:bg-[#1C202B] text-on-surface text-[13px] px-4 py-2.5 rounded-md border border-white/[0.08] transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-outline">quiz</span>
                    <span>Launch 60Q Full Simulation</span>
                    <span className="text-outline text-[11px] font-mono">120m Pacing</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Hero Visual Metric Tile */}
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#111319] p-5 rounded-xl border border-white/[0.07] shrink-0 lg:min-w-[320px] shadow-sm">
              <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-[#252B3A]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="6" />
                  <circle
                    className="text-[#7BD0FF] transition-all duration-700"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="251.2"
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    strokeWidth="6"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-headline text-2xl font-semibold text-white leading-none">
                    {readinessScore}%
                  </span>
                  <span className="font-mono text-[9px] text-outline tracking-wider mt-1 uppercase">
                    {readinessScore >= 70 ? 'PASS' : hasData ? 'PREP' : 'INIT'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full text-left">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-outline uppercase tracking-wider">Pass Status</span>
                  <span className={readinessScore >= 70 ? 'text-emerald-400 font-medium' : 'text-[#7BD0FF] font-medium'}>
                    {readinessScore >= 70 ? 'Pass Ready' : hasData ? 'Calibrating' : 'Unassessed'}
                  </span>
                </div>
                <p className="font-headline text-lg text-white font-semibold">
                  {projectedScore > 0 ? `${projectedScore} Projected Score` : 'Diagnostic Required'}
                </p>
                <div className="w-full bg-[#252B3A] h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-[#7BD0FF] h-full rounded-full transition-all duration-500"
                    style={{ width: `${projectedScore > 0 ? Math.min(100, Math.round((projectedScore / 1000) * 100)) : 0}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-on-surface-variant mt-1">
                  Passing cutoff: 720 / 1000 pts
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Daily Quests & 7-Day Habit Cadence */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Daily Quests Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-[#14161D] rounded-xl border border-white/[0.07] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7BD0FF] text-xl">verified</span>
                <h2 className="font-headline text-[17px] text-white font-semibold">Daily Quests</h2>
              </div>
              <span className="font-mono text-[11px] text-on-surface-variant bg-[#1F2430] border border-white/[0.06] px-2 py-0.5 rounded">
                {completedQuestsCount} / 3 Complete
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Quest 1 */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#111319] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                    quest1Done ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#1C202B] text-white'
                  }`}>
                    <span className="material-symbols-outlined text-base">quiz</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-white font-medium truncate">Solve 5 Scenario Questions</span>
                    <span className="text-xs text-on-surface-variant">{todayCount} of 5 resolved today</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 sm:w-28 bg-[#252B3A] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${quest1Done ? 'bg-emerald-400' : 'bg-white'}`}
                      style={{ width: `${quest1Pct}%` }}
                    />
                  </div>
                  <span className={`font-mono text-xs font-medium w-8 text-right ${quest1Done ? 'text-emerald-400' : 'text-white'}`}>
                    {quest1Pct}%
                  </span>
                </div>
              </div>

              {/* Quest 2 */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#111319] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                    quest2Done ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#1C202B] text-white'
                  }`}>
                    <span className="material-symbols-outlined text-base">auto_stories</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-white font-medium truncate">Audit &amp; Star Architectural Gotchas</span>
                    <span className="text-xs text-on-surface-variant">
                      {quest2Done ? 'Concept flagged for revision' : 'Star questions in Questions Hub'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 sm:w-28 bg-[#252B3A] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${quest2Done ? 'bg-emerald-400' : 'bg-white'}`}
                      style={{ width: `${quest2Done ? 100 : 0}%` }}
                    />
                  </div>
                  <span className={`font-mono text-xs font-medium w-8 text-right ${quest2Done ? 'text-emerald-400' : 'text-on-surface-variant'}`}>
                    {quest2Done ? '100%' : '0%'}
                  </span>
                </div>
              </div>

              {/* Quest 3 */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#111319] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                    quest3Done ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#1C202B] text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-base">local_fire_department</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-white font-medium truncate">Maintain Habit Cadence Streak</span>
                    <span className={`text-xs font-mono ${quest3Done ? 'text-emerald-400' : 'text-on-surface-variant'}`}>
                      {quest3Done ? `${streak}-Day active streak (+100 XP)` : 'Answer today to activate streak'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 sm:w-28 bg-[#252B3A] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${quest3Done ? 'bg-emerald-400' : 'bg-[#1C202B]'}`}
                      style={{ width: `${quest3Done ? 100 : 0}%` }}
                    />
                  </div>
                  <span className={`font-mono text-xs font-medium w-8 text-right ${quest3Done ? 'text-emerald-400' : 'text-on-surface-variant'}`}>
                    {quest3Done ? '100%' : '0%'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Habit Cadence Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#14161D] rounded-xl border border-white/[0.07] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline text-[17px] text-white font-semibold">Weekly Study Cadence</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {totalWeekHours} hrs logged ({totalWeekQuestions} questions practiced)
                </p>
              </div>
              <span className="font-mono text-[11px] text-[#7BD0FF] bg-[#00354A]/40 border border-[#7BD0FF]/20 px-2 py-0.5 rounded">
                {totalWeekQuestions > 0 ? 'Active Cadence' : 'Ready to Start'}
              </span>
            </div>

            {/* Habit Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-36 pt-4 pb-2 border-b border-white/[0.06]">
              {habitDays.map((item, idx) => {
                const heightPct = Math.max(6, Math.round((item.hours / maxDayHours) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-outline opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.hours}h
                    </span>
                    <div className="w-full bg-[#1C202B] rounded-sm overflow-hidden h-full flex items-end">
                      <div
                        className={`w-full rounded-sm transition-all duration-500 ${
                          item.isToday ? 'bg-white' : item.count > 0 ? 'bg-[#7BD0FF]/80' : 'bg-[#252B3A]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-mono ${item.isToday ? 'text-white font-bold' : 'text-outline'}`}>
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant pt-3">
              <span>Goal: 10 hrs/week</span>
              <span className={totalWeekHours >= 10 ? 'text-emerald-400 font-medium' : 'text-white font-medium'}>
                {Math.round((totalWeekHours / 10) * 100)}% of Weekly Target
              </span>
            </div>
          </div>
        </section>

        {/* 3. Claude Certified Architect Curriculum Domains */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-xl text-white font-semibold">CCA-F Core Architecture Domains</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Calibrated directly to the official 5-domain blueprint and 30 task objectives</p>
            </div>
            <Link href="/learn" className="text-xs font-mono text-white hover:text-[#7BD0FF] flex items-center gap-1">
              <span>View All 5 Domains</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Domain 1 */}
            <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] hover:border-white/[0.14] transition-all flex flex-col justify-between gap-4 group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">DOM-01 · 27% Weight</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Highest Yield
                  </span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-white group-hover:text-[#7BD0FF] transition-colors">
                  Agentic Architecture &amp; Orchestration
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  Subagent context isolation, coordinator handoff patterns, state manifests, and tool delegation.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-xs font-mono mb-1.5">
                  <span className="text-on-surface-variant">Mastery Level</span>
                  <span className="text-white font-semibold text-base">
                    {dom1Stats.count > 0 ? `${dom1Stats.pct}%` : 'Unassessed'}
                  </span>
                </div>
                <div className="w-full bg-[#1C202B] h-1.5 rounded-full overflow-hidden mb-4">
                  <div className="bg-[#7BD0FF] h-full rounded-full transition-all duration-500" style={{ width: `${dom1Stats.pct}%` }} />
                </div>
                <Link
                  href="/learn?domain=domain_1_agentic_architecture"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-md bg-white text-black text-xs font-medium hover:bg-neutral-200 transition-all"
                >
                  <span>Practice Domain ({dom1Stats.total} Qs)</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Domain 2 */}
            <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] hover:border-white/[0.14] transition-all flex flex-col justify-between gap-4 group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">DOM-02 · 18% Weight</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#00354A] text-[#7BD0FF] border border-[#7BD0FF]/30">
                    Core Focus
                  </span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-white group-hover:text-[#7BD0FF] transition-colors">
                  Tool Design &amp; MCP Integration
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  Model Context Protocol (MCP), JSON-RPC protocol error schemas, parameter types, and atomic tools.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-xs font-mono mb-1.5">
                  <span className="text-on-surface-variant">Mastery Level</span>
                  <span className="text-white font-semibold text-base">
                    {dom2Stats.count > 0 ? `${dom2Stats.pct}%` : 'Unassessed'}
                  </span>
                </div>
                <div className="w-full bg-[#1C202B] h-1.5 rounded-full overflow-hidden mb-4">
                  <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${dom2Stats.pct}%` }} />
                </div>
                <Link
                  href="/learn?domain=domain_2_tool_design_mcp"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#1C202B] hover:bg-[#252B3A] text-white text-xs font-medium border border-white/[0.08] transition-all"
                >
                  <span>Practice Domain ({dom2Stats.total} Qs)</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Domain 3 */}
            <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] hover:border-white/[0.14] transition-all flex flex-col justify-between gap-4 group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">DOM-03 · 20% Weight</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    High Coverage
                  </span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-white group-hover:text-[#7BD0FF] transition-colors">
                  Claude Code Configuration &amp; Workflows
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  Subagent tool allowances, terminal commands, engineering workflows, and system prompt parameters.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-xs font-mono mb-1.5">
                  <span className="text-on-surface-variant">Mastery Level</span>
                  <span className="text-white font-semibold text-base">
                    {dom3Stats.count > 0 ? `${dom3Stats.pct}%` : 'Unassessed'}
                  </span>
                </div>
                <div className="w-full bg-[#1C202B] h-1.5 rounded-full overflow-hidden mb-4">
                  <div className="bg-[#7BD0FF] h-full rounded-full transition-all duration-500" style={{ width: `${dom3Stats.pct}%` }} />
                </div>
                <Link
                  href="/learn?domain=domain_3_claude_code_config"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-md bg-white text-black text-xs font-medium hover:bg-neutral-200 transition-all"
                >
                  <span>Practice Domain ({dom3Stats.total} Qs)</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Embedded In-Place Micro-Drill */}
        <section className="p-6 sm:p-8 rounded-xl bg-[#14161D] border border-white/[0.07] shadow-sm flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider">
                  Instant Micro-Drill
                </span>
                <span className="text-xs font-mono text-outline">Under 2 Minutes · Claude Architecture</span>
              </div>
              <h2 className="font-headline text-lg text-white font-semibold mt-1">
                Scenario Challenge: Multi-Agent Context Isolation
              </h2>
            </div>
            <span className="text-xs font-mono text-[#7BD0FF]">+25 XP upon completion</span>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-white">
            {microDrill.question}
          </p>

          <div className="flex flex-col gap-2.5">
            {microDrill.choices.map(choice => {
              const isSelected = selectedOption === choice.letter;
              const isCorrectChoice = choice.letter === microDrill.correctLetter;

              let borderClass = 'border-white/[0.08] hover:border-white/[0.2] bg-[#111319]';
              if (drillAnswered) {
                if (isCorrectChoice) {
                  borderClass = 'border-emerald-500/60 bg-emerald-500/10 text-white';
                } else if (isSelected && !isCorrectChoice) {
                  borderClass = 'border-rose-500/60 bg-rose-500/10 text-white';
                } else {
                  borderClass = 'border-white/[0.05] bg-[#111319] opacity-50';
                }
              } else if (isSelected) {
                borderClass = 'border-white bg-[#1C202B] text-white';
              }

              return (
                <button
                  key={choice.letter}
                  type="button"
                  onClick={() => !drillAnswered && setSelectedOption(choice.letter)}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3.5 ${borderClass}`}
                >
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 border ${
                      isSelected
                        ? 'bg-white text-black border-white font-bold'
                        : 'border-white/20 text-on-surface-variant'
                    }`}
                  >
                    {choice.letter}
                  </div>
                  <span className="text-sm leading-relaxed flex-1">{choice.text}</span>
                  {drillAnswered && isCorrectChoice && (
                    <span className="material-symbols-outlined text-emerald-400 text-lg shrink-0">check_circle</span>
                  )}
                  {drillAnswered && isSelected && !isCorrectChoice && (
                    <span className="material-symbols-outlined text-rose-400 text-lg shrink-0">cancel</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            {!drillAnswered ? (
              <button
                type="button"
                disabled={!selectedOption}
                onClick={() => setDrillAnswered(true)}
                className="px-5 py-2 rounded-md bg-white text-black font-medium text-xs hover:bg-neutral-200 transition-colors disabled:opacity-40"
              >
                Check Answer
              </button>
            ) : (
              <div className="w-full flex flex-col gap-2 p-3.5 rounded-lg bg-[#08090C] border border-white/[0.08]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={selectedOption === microDrill.correctLetter ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {selectedOption === microDrill.correctLetter ? '✓ Correct! Excellent architectural judgment.' : '✕ Incorrect selection.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOption(null);
                      setDrillAnswered(false);
                    }}
                    className="text-outline hover:text-white underline underline-offset-4"
                  >
                    Reset Drill
                  </button>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {microDrill.explanation}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 5. Voucher Insurance & Live Community Ticker */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Voucher Insurance Card */}
          <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] flex flex-col justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <div>
                <h3 className="font-headline text-base font-semibold text-white">100% Exam Voucher Insurance</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Maintain an 800+ score across two full diagnostic simulations. If you do not pass on your official attempt, CertPulse will 100% reimburse your exam fee.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-xs font-mono text-on-surface-variant">
              <span>Qualification Status: <strong className={isVoucherQualified ? 'text-emerald-400' : 'text-amber-300'}>
                {isVoucherQualified ? 'Qualified & Active' : `${qualifyingAttempts} / 2 Qualifying Mocks`}
              </strong></span>
              <span>Passing Bar: 80%</span>
            </div>
          </div>

          {/* Live Community Pulse */}
          <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-headline text-base font-semibold text-white">Live Candidate Pulse</h3>
              </div>
              <span className="text-[11px] font-mono text-outline">Active Telemetry</span>
            </div>

            <div className="flex flex-col gap-2 text-xs font-mono">
              {recentCompletions.length > 0 ? (
                recentCompletions.slice(0, 3).map(comp => (
                  <div key={comp.id} className="flex items-center justify-between text-on-surface-variant">
                    <span className="text-white font-medium truncate max-w-[120px]">{comp.fullName || comp.username}</span>
                    <span>Completed {comp.examType === 'full' ? '60Q Full' : '25Q Quick'} ({comp.scorePct}%)</span>
                    <span className="text-outline">{formatDate(comp.completedAt)}</span>
                  </div>
                ))
              ) : leaderboard.length > 0 ? (
                leaderboard.slice(0, 3).map(member => (
                  <div key={member.userId} className="flex items-center justify-between text-on-surface-variant">
                    <span className="text-white font-medium truncate max-w-[130px]">{member.fullName || member.username}</span>
                    <span>{member.questionsPracticed} Practiced ({member.accuracyPct}% Acc)</span>
                    <span className="text-secondary font-semibold">{member.readinessPct}% Ready</span>
                  </div>
                ))
              ) : (
                <div className="text-on-surface-variant py-2">
                  Telemetry stream ready. Complete a practice drill to establish the cohort benchmark.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/[0.05] text-[11px] font-mono text-outline">
              {cohortSummary ? (
                `${cohortSummary.totalCandidates} registered architects · ${cohortSummary.totalQuestionsPracticed} scenario attempts across workspace.`
              ) : (
                'Calibrated strictly to Anthropic Claude Certified Architect (CCA-F) standards.'
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
