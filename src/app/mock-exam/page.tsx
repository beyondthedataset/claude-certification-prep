'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DOMAINS, QUESTIONS_DATA } from '@/lib/questions-data';
import { QuestionBank } from '@/lib/types';
import BankSelector from '@/components/BankSelector';
import { Award, Clock, CheckCircle2, ShieldCheck, Zap, BookOpen, ArrowRight } from 'lucide-react';

export default function MockExamHubPage() {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState<QuestionBank>('all');

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
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 w-full flex flex-col gap-10">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-surface-high border border-border border-l-2 border-l-primary font-mono text-3xs text-primary uppercase tracking-widest font-semibold">
          Anthropic Exam Simulation Engine · 574 Questions
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
          Claude Certified Architect Mock Exams
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-3 leading-relaxed">
          Prepare under real exam conditions with full timer pacing, 5-domain weighted questions, question flagging, and instant diagnostic score reports.
        </p>
      </div>

      {/* Question Bank Selection Pill Bar */}
      <div className="max-w-3xl mx-auto w-full">
        <BankSelector
          selectedBank={selectedBank}
          onSelectBank={setSelectedBank}
          counts={poolCounts}
        />
      </div>

      {/* Main Exam Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full 60-Question Simulation */}
        <div className="p-8 rounded-2xl bg-surface-card border border-border border-l-4 border-l-primary shadow-card flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-2xs uppercase tracking-widest bg-primary/15 text-primary border border-primary/30 px-2.5 py-1 rounded font-bold">
                Official Blueprint Simulation
              </span>
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>120 Minutes</span>
              </span>
            </div>

            <h2 className="font-headline text-2xl font-bold text-foreground">
              Full Mock Exam (60 Questions)
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
              Standard 60-question test proportionally sampled across all 5 domains. Minimum passing score is 70% (42/60).
            </p>

            <ul className="mt-5 space-y-2 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>60 scenario-based actual exam questions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>120-minute countdown timer with pacing guidance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Comprehensive 5-domain diagnostic breakdown</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleStartExam('full')}
            className="mt-8 w-full py-3 rounded-lg technical-gradient text-white text-sm font-bold shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all flex items-center justify-center gap-2"
          >
            <span>Start Full 60Q Exam</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Quick 25-Question Practice */}
        <div className="p-8 rounded-2xl bg-surface-card border border-border border-l-4 border-l-cyan-500 shadow-card flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-2xs uppercase tracking-widest bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded font-bold">
                Rapid Assessment
              </span>
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>50 Minutes</span>
              </span>
            </div>

            <h2 className="font-headline text-2xl font-bold text-foreground">
              Quick Mock (25 Questions)
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
              Fast 25-question session ideal for daily team practice and rapid knowledge checks during coffee breaks.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>25 randomized exam questions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>50-minute exam timer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Instant results with full explanations</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleStartExam('quick')}
            className="mt-8 w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-bold shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="h-4 w-4" />
            <span>Start Quick 25Q Mock</span>
          </button>
        </div>
      </div>

      {/* Domain Specific Drills */}
      <div className="flex flex-col gap-4 pt-6 border-t border-border/40">
        <div>
          <h3 className="font-headline text-xl font-bold text-foreground">
            Targeted Domain Drills
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Focus your revision on specific blueprint areas where you need more practice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAINS.map(domain => (
            <div
              key={domain.key}
              className="p-5 rounded-xl bg-surface-card border border-border hover:border-primary/40 transition-colors flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between text-2xs font-mono">
                  <span className="text-primary font-bold uppercase">{domain.code}</span>
                  <span className="text-muted-foreground">{domain.weightPct}% weight</span>
                </div>
                <h4 className="font-headline text-sm font-bold text-foreground mt-2">
                  {domain.name}
                </h4>
                <p className="text-3xs text-muted-foreground mt-1 leading-relaxed">
                  {domain.description}
                </p>
              </div>

              <button
                onClick={() => handleStartExam('domain', domain.key)}
                className="w-full py-1.5 rounded bg-surface-high hover:bg-surface-container border border-border text-xs font-semibold text-foreground transition-colors"
              >
                Drill Domain ({domain.code})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
