'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DOMAINS } from '@/lib/questions-data';
import { ArrowRight, CheckCircle2, ShieldCheck, Flame, BookOpen, Clock, Users, Award, ExternalLink, Play, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [drillAnswered, setDrillAnswered] = useState(false);

  const microDrill = {
    question: "A multi-tier architecture uses Amazon SQS to buffer asynchronous video conversion jobs before dispatching to an Auto Scaling group of EC2 worker nodes. During spike events, messages queue up faster than workers can process them. Which Auto Scaling metric is the MOST accurate indicator to scale the worker fleet dynamically?",
    choices: [
      { letter: 'A', text: 'CPU Utilization of the existing EC2 instances in the Auto Scaling group.' },
      { letter: 'B', text: 'ApproximateNumberOfMessagesVisible divided by the fleet capacity (Backlog Per Instance).' },
      { letter: 'C', text: 'NetworkIn bytes on the Application Load Balancer.' },
      { letter: 'D', text: 'ApproximateNumberOfMessagesNotVisible threshold on the SQS dead-letter queue.' }
    ],
    correctLetter: 'B',
    explanation: 'Correct! Backlog Per Instance (ApproximateNumberOfMessagesVisible / RunningCapacity) is the AWS Well-Architected standard metric for SQS consumer auto scaling, preventing runaway scaling or lagging throughput.'
  };

  const habitDays = [
    { day: 'Mon', hours: 2.1, height: '70%' },
    { day: 'Tue', hours: 1.8, height: '60%' },
    { day: 'Wed', hours: 2.6, height: '85%' },
    { day: 'Thu', hours: 1.2, height: '40%' },
    { day: 'Fri', hours: 2.4, height: '80%' },
    { day: 'Sat', hours: 3.2, height: '100%', isToday: true },
    { day: 'Sun', hours: 0.0, height: '10%' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0D0E12] text-on-surface">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">

        {/* 1. Inspiring Welcome Hero Section */}
        <section className="relative w-full overflow-hidden rounded-xl bg-[#08090C] border border-white/[0.07] p-6 sm:p-10 shadow-xl">
          {/* Subtle architectural gradient backdrop */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-bl from-[#7BD0FF]/10 via-[#00A6E0]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-gradient-to-tr from-[#1C202B]/40 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Welcome Copy & Targets */}
            <div className="flex flex-col max-w-[680px]">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wide bg-[#151821] text-on-surface-variant border border-white/[0.08]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7BD0FF] animate-pulse" />
                  DAILY COGNITIVE SPRINT
                </span>
                <span className="text-outline text-[11px] font-mono">· 16 Days to Target Exam</span>
              </div>

              <h1 className="font-headline text-3xl sm:text-4xl text-white font-medium tracking-tight leading-[1.2]">
                Welcome back. Ready to sharpen your architecture craft today?
              </h1>

              <p className="font-sans text-[15px] sm:text-[16px] text-on-surface-variant mt-3 leading-relaxed">
                Target: <span className="text-white font-medium">AWS Solutions Architect (SAA-C03)</span> &amp;{' '}
                <span className="text-white font-medium">Claude Certified Architect (CCA-F)</span>.
                You are <span className="text-[#7BD0FF] font-medium">82% exam-ready</span>{' '}
                <span className="text-white text-[11px] font-mono bg-[#151821] px-1.5 py-0.5 rounded border border-white/[0.06] ml-1">
                  +3% this week
                </span>.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mt-7">
                <Link
                  href="/learn"
                  className="group inline-flex items-center gap-2 bg-white text-black font-medium text-[13px] px-5 py-2.5 rounded-md hover:bg-neutral-200 transition-all shadow-md active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span>Start Daily 5-Min Warmup</span>
                  <span className="bg-black text-white font-mono text-[10px] px-1.5 py-0.5 rounded tracking-wider font-semibold ml-1">
                    +50 XP
                  </span>
                  <kbd className="hidden sm:inline-block ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800">
                    Space
                  </kbd>
                </Link>

                <Link
                  href="/mock-exam"
                  className="inline-flex items-center gap-2 bg-[#14161D] hover:bg-[#1C202B] text-on-surface text-[13px] px-4 py-2.5 rounded-md border border-white/[0.08] transition-colors"
                >
                  <span className="material-symbols-outlined text-base text-outline">history</span>
                  <span>Resume SAA-C03 Mock #4</span>
                  <span className="text-outline text-[11px] font-mono">Q24/65 · 18m ago</span>
                </Link>
              </div>
            </div>

            {/* Hero Visual Metric Tile */}
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#111319] p-5 rounded-xl border border-white/[0.07] shrink-0 lg:min-w-[320px] shadow-sm">
              <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-[#252B3A]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="6" />
                  <circle
                    className="text-[#7BD0FF]"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="251.2"
                    strokeDashoffset="45.2"
                    strokeLinecap="round"
                    strokeWidth="6"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-headline text-2xl font-semibold text-white leading-none">82%</span>
                  <span className="font-mono text-[9px] text-outline tracking-wider mt-1 uppercase">READY</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full text-left">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-outline uppercase tracking-wider">Pass Confidence</span>
                  <span className="text-[#7BD0FF] font-medium">Safe Margin</span>
                </div>
                <p className="font-headline text-lg text-white font-semibold">840 Projected Score</p>
                <div className="w-full bg-[#252B3A] h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#7BD0FF] h-full rounded-full" style={{ width: '84%' }} />
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
                2 / 3 Complete
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Quest 1 */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#111319] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-md bg-[#1C202B] flex items-center justify-center shrink-0 text-white">
                    <span className="material-symbols-outlined text-base">quiz</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-white font-medium truncate">Solve 5 Scenario Questions</span>
                    <span className="text-xs text-on-surface-variant">3 of 5 resolved today</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 sm:w-28 bg-[#252B3A] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: '60%' }} />
                  </div>
                  <span className="font-mono text-xs text-white font-medium w-8 text-right">60%</span>
                </div>
              </div>

              {/* Quest 2 */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#111319] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-md bg-[#1C202B] flex items-center justify-center shrink-0 text-white">
                    <span className="material-symbols-outlined text-base">auto_stories</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-white font-medium truncate">Review 1 Missed Architectural Concept</span>
                    <span className="text-xs text-on-surface-variant">Pending audit</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 sm:w-28 bg-[#252B3A] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: '0%' }} />
                  </div>
                  <span className="font-mono text-xs text-on-surface-variant font-medium w-8 text-right">0%</span>
                </div>
              </div>

              {/* Quest 3 */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#111319] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-white font-medium truncate">Maintain 14-Day Habit Streak</span>
                    <span className="text-xs text-emerald-400 font-mono">Streak unlocked (+100 XP)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 sm:w-28 bg-[#252B3A] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-medium w-8 text-right">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Habit Cadence Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#14161D] rounded-xl border border-white/[0.07] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline text-[17px] text-white font-semibold">Weekly Study Cadence</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">12.4 hrs logged (+2.1 hrs vs last week)</p>
              </div>
              <span className="font-mono text-[11px] text-[#7BD0FF] bg-[#00354A]/40 border border-[#7BD0FF]/20 px-2 py-0.5 rounded">
                Optimal
              </span>
            </div>

            {/* Habit Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-36 pt-4 pb-2 border-b border-white/[0.06]">
              {habitDays.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-outline opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hours}h
                  </span>
                  <div className="w-full bg-[#1C202B] rounded-sm overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full rounded-sm transition-all duration-500 ${
                        item.isToday ? 'bg-white' : 'bg-[#9AA3B2]/60 hover:bg-[#9AA3B2]'
                      }`}
                      style={{ height: item.height }}
                    />
                  </div>
                  <span className={`text-[11px] font-mono ${item.isToday ? 'text-white font-bold' : 'text-outline'}`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant pt-3">
              <span>Goal: 10 hrs/week</span>
              <span className="text-emerald-400 font-medium">124% of Goal Achieved</span>
            </div>
          </div>
        </section>

        {/* 3. Active Certification Tracks */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-xl text-white font-semibold">Active Certification Tracks</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Custom telemetry and question engines calibrated to official bars</p>
            </div>
            <Link href="/learn" className="text-xs font-mono text-white hover:text-[#7BD0FF] flex items-center gap-1">
              <span>All Tracks</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Track 1: AWS SAA-C03 */}
            <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] hover:border-white/[0.14] transition-all flex flex-col justify-between gap-4 group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">AWS · Cloud Architect</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Ready to Pass
                  </span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-white group-hover:text-[#7BD0FF] transition-colors">
                  Solutions Architect Associate (SAA-C03)
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  High-availability VPC design, decoupled microservices, and IAM role chaining.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-xs font-mono mb-1.5">
                  <span className="text-on-surface-variant">Exam Readiness</span>
                  <span className="text-white font-semibold text-base">82%</span>
                </div>
                <div className="w-full bg-[#1C202B] h-1.5 rounded-full overflow-hidden mb-4">
                  <div className="bg-[#7BD0FF] h-full rounded-full" style={{ width: '82%' }} />
                </div>
                <Link
                  href="/learn?track=aws"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-md bg-white text-black text-xs font-medium hover:bg-neutral-200 transition-all"
                >
                  <span>Continue Practice</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Track 2: Azure AI-102 */}
            <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] hover:border-white/[0.14] transition-all flex flex-col justify-between gap-4 group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">Microsoft · Azure AI</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#00354A] text-[#7BD0FF] border border-[#7BD0FF]/30">
                    Review Needed
                  </span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-white group-hover:text-[#7BD0FF] transition-colors">
                  Azure AI Engineer Associate (AI-102)
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  Azure OpenAI integration, Cognitive Search semantic rankers, and Vision APIs.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-xs font-mono mb-1.5">
                  <span className="text-on-surface-variant">Exam Readiness</span>
                  <span className="text-white font-semibold text-base">71%</span>
                </div>
                <div className="w-full bg-[#1C202B] h-1.5 rounded-full overflow-hidden mb-4">
                  <div className="bg-white h-full rounded-full" style={{ width: '71%' }} />
                </div>
                <Link
                  href="/mock-exam"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#1C202B] hover:bg-[#252B3A] text-white text-xs font-medium border border-white/[0.08] transition-all"
                >
                  <span>Resume Test</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Track 3: Claude CCA-F */}
            <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] hover:border-white/[0.14] transition-all flex flex-col justify-between gap-4 group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">Anthropic · LLM Architecture</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    574 Scenarios
                  </span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-white group-hover:text-[#7BD0FF] transition-colors">
                  Claude Certified Architect (CCA-F)
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  Agentic architectures, Model Context Protocol (MCP), prompt caching, and context management.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-xs font-mono mb-1.5">
                  <span className="text-on-surface-variant">Mastery Index</span>
                  <span className="text-white font-semibold text-base">84%</span>
                </div>
                <div className="w-full bg-[#1C202B] h-1.5 rounded-full overflow-hidden mb-4">
                  <div className="bg-[#7BD0FF] h-full rounded-full" style={{ width: '84%' }} />
                </div>
                <Link
                  href="/learn"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-md bg-white text-black text-xs font-medium hover:bg-neutral-200 transition-all"
                >
                  <span>Drill 574 Bank</span>
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
                <span className="text-xs font-mono text-outline">Under 2 Minutes · AWS &amp; Cloud</span>
              </div>
              <h2 className="font-headline text-lg text-white font-semibold mt-1">
                Scenario Challenge: SQS Consumer Scalability
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
              <span>Policy Status: <strong className="text-emerald-400">Active &amp; Protected</strong></span>
              <span>Claims: &lt;2.1%</span>
            </div>
          </div>

          {/* Live Community Pulse */}
          <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-headline text-base font-semibold text-white">Live Candidate Pulse</h3>
              </div>
              <span className="text-[11px] font-mono text-outline">Real-Time Verification</span>
            </div>

            <div className="flex flex-col gap-2 text-xs font-mono">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-white">Sarah K.</span>
                <span>Passed GCP Cloud Architect</span>
                <span className="text-outline">4m ago</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-white">Marcus T.</span>
                <span>Passed AWS SAA-C03 (890/1000)</span>
                <span className="text-outline">12m ago</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-white">David L.</span>
                <span>Completed CCA-F Full Mock (92%)</span>
                <span className="text-outline">28m ago</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.05] text-[11px] font-mono text-outline">
              Over 2,400 architects verified this month across industry certifications.
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
