'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DOMAINS, QUESTIONS_DATA } from '@/lib/questions-data';
import { QuestionBank } from '@/lib/types';
import BankSelector from '@/components/BankSelector';

export default function MockExamHubPage() {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState<QuestionBank>('all');
  const [activeTrack, setActiveTrack] = useState<'cca' | 'aws' | 'azure'>('cca');

  const handleStartExam = (type: 'full' | 'quick' | 'domain', domainKey?: string) => {
    let url = `/mock-exam/session?type=${type}&bank=${selectedBank}`;
    if (domainKey) url += `&domain=${domainKey}`;
    router.push(url);
  };

  const poolCounts = {
    all: QUESTIONS_DATA.length,
    certsafari: QUESTIONS_DATA.filter(q => q.source === 'certsafari').length,
    examtopics: QUESTIONS_DATA.filter(q => q.source === 'examtopics').length,
  };

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-10 w-full flex flex-col gap-10">
      {/* Editorial Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-outline">
          <span className="inline-flex items-center gap-1.5 text-on-surface font-medium uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Practice Test Runner
          </span>
          <span>/</span>
          <span>STANDARD EXAM SIMULATOR</span>
          <span>/</span>
          <span>574 ITEMS LOADED</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-headline font-semibold text-white tracking-tight">
              Exam Simulation Engine
            </h1>
            <p className="text-sm text-text-muted mt-1 max-w-2xl font-sans leading-relaxed">
              Test under strict vendor exam pacing with timed countdowns, multi-domain weighted scenario questions, option elimination tools, and instantaneous diagnostic audit reports.
            </p>
          </div>

          {/* Track Switcher */}
          <div className="flex items-center p-1 rounded-lg bg-[#14161D] border border-white/[0.08] self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveTrack('cca')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                activeTrack === 'cca'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              Claude CCA-F
            </button>
            <button
              onClick={() => setActiveTrack('aws')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                activeTrack === 'aws'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              AWS SAA-C03
            </button>
            <button
              onClick={() => setActiveTrack('azure')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                activeTrack === 'azure'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              Azure AI-102
            </button>
          </div>
        </div>
      </div>

      {/* Question Bank Selection Pill Bar */}
      <div className="w-full">
        <BankSelector
          selectedBank={selectedBank}
          onSelectBank={setSelectedBank}
          counts={poolCounts}
        />
      </div>

      {/* Main Exam Simulation Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Simulation */}
        <div className="p-7 rounded-xl bg-[#14161D] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-secondary px-2.5 py-1 rounded bg-secondary/10 border border-secondary/20 font-medium">
                Official Blueprint Simulation
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span>120 Minutes</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-headline font-semibold text-white">
                Full Mock Exam (60 Questions)
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
                Standard 60-question test proportionally sampled across all blueprint domains. The benchmark passing score is 720 / 1000 (70%).
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-white/[0.06] text-xs text-text-muted">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                <span>60 realistic scenario-based architectural questions</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                <span>120-minute timer with real-time target pacing guidance</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                <span>Comprehensive domain diagnostic breakdown &amp; audit</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleStartExam('full')}
            className="mt-8 w-full py-2.5 px-4 rounded-md bg-white text-black font-semibold text-xs hover:bg-[#E2E8F0] transition-colors flex items-center justify-center gap-2"
          >
            <span>Start Full 60Q Exam</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Quick Practice */}
        <div className="p-7 rounded-xl bg-[#14161D] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-primary px-2.5 py-1 rounded bg-white/10 border border-white/20 font-medium">
                Rapid Assessment
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                <span className="material-symbols-outlined text-[15px]">timer</span>
                <span>50 Minutes</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-headline font-semibold text-white">
                Quick Mock (25 Questions)
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
                Fast 25-question session ideal for daily momentum sprints, lunchtime drills, and targeted knowledge verification.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-white/[0.06] text-xs text-text-muted">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                <span>25 randomized multi-domain scenario items</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                <span>50-minute exam timer with option elimination mode</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                <span>Immediate answer audit with topological rationale</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleStartExam('quick')}
            className="mt-8 w-full py-2.5 px-4 rounded-md bg-[#1C202B] hover:bg-[#252B3A] text-white border border-white/[0.12] font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Start Quick 25Q Mock</span>
          </button>
        </div>
      </div>

      {/* Domain Specific Drills */}
      <div className="flex flex-col gap-5 pt-4">
        <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-3">
          <div>
            <h3 className="font-headline text-lg font-semibold text-white">
              Targeted Domain Micro-Drills
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Focus your practice on specific blueprint domains where your confidence or accuracy is below 75%.
            </p>
          </div>
          <span className="font-mono text-xs text-text-subtle">5 BLUEPRINT DOMAINS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAINS.map(domain => {
            const domainQuestionsCount = QUESTIONS_DATA.filter(q => q.domain === domain.key).length;
            return (
              <div
                key={domain.key}
                className="p-5 rounded-xl bg-[#14161D] border border-white/[0.08] hover:border-white/20 transition-colors flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted px-2 py-0.5 rounded bg-[#0D0E12] border border-white/[0.06]">
                      {domain.code}
                    </span>
                    <span className="font-mono text-xs text-text-subtle">
                      {domainQuestionsCount} items
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white line-clamp-2">
                    {domain.name}
                  </h4>
                  <p className="text-xs text-text-muted line-clamp-2">
                    {domain.description}
                  </p>
                </div>

                <button
                  onClick={() => handleStartExam('domain', domain.key)}
                  className="w-full py-2 px-3 rounded-md bg-[#0D0E12] hover:bg-white/[0.06] text-xs font-medium text-text-muted hover:text-white border border-white/[0.08] transition-colors flex items-center justify-between"
                >
                  <span>Launch Drill</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
