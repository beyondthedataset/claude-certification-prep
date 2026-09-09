'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { QUESTIONS_DATA, DOMAINS, SUBDOMAINS, getSubdomainsByDomain } from '@/lib/questions-data';
import { Question, DomainKey, UserProgress, QuestionBank } from '@/lib/types';
import QuestionCard from '@/components/QuestionCard';
import FlashcardViewer from '@/components/FlashcardViewer';
import BankSelector from '@/components/BankSelector';

function LearnPageContent() {
  const searchParams = useSearchParams();
  const initialDomain = searchParams.get('domain') as DomainKey | null;
  const initialBank = (searchParams.get('bank') as QuestionBank) || 'all';
  const initialSubdomain = searchParams.get('subdomain') || '';

  const [questions] = useState<Question[]>(QUESTIONS_DATA);
  const [selectedBank, setSelectedBank] = useState<QuestionBank>(initialBank);
  const [selectedDomain, setSelectedDomain] = useState<DomainKey | 'all'>(initialDomain || 'all');
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>(initialSubdomain);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'discussions' | 'disputed' | 'exhibits' | 'starred' | 'wrong' | 'correct'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'feed' | 'flashcard'>('feed');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: '',
    answers: {},
    starred: {},
    notes: {},
    updatedAt: '',
  });

  useEffect(() => {
    const b = searchParams.get('bank') as QuestionBank;
    if (b && (b === 'all' || b === 'certsafari' || b === 'examtopics')) {
      setSelectedBank(b);
    }
    const d = searchParams.get('domain') as DomainKey;
    if (d) {
      setSelectedDomain(d);
    }
    const sub = searchParams.get('subdomain');
    if (sub !== null && sub !== '') {
      setSelectedSubdomain(sub);
    }
    const view = searchParams.get('view');
    if (view === 'flashcard') {
      setViewMode('flashcard');
    }
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/progress')
      .then(res => {
        if (res.ok) return res.json();
        return { progress: null };
      })
      .then(data => {
        if (data.progress) setUserProgress(data.progress);
      })
      .catch(() => {});
  }, []);

  const filteredQuestions = questions.filter(q => {
    const qnum = q.question_number;
    if (selectedBank !== 'all' && q.source !== selectedBank) return false;
    if (selectedDomain !== 'all' && q.domain !== selectedDomain) return false;
    if (selectedSubdomain && (!q.subdomain || !q.subdomain.includes(selectedSubdomain))) return false;
    if (selectedFilter === 'discussions' && (q.comments_count || 0) === 0) return false;
    if (selectedFilter === 'disputed' && !q.is_controversial) return false;
    if (selectedFilter === 'exhibits' && (!q.images || q.images.length === 0)) return false;
    if (selectedFilter === 'starred' && !userProgress.starred[qnum]) return false;
    if (selectedFilter === 'wrong') {
      const ans = userProgress.answers[qnum];
      if (!ans || ans.isCorrect) return false;
    }
    if (selectedFilter === 'correct') {
      const ans = userProgress.answers[qnum];
      if (!ans || !ans.isCorrect) return false;
    }
    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase().trim();
      const qnumMatch = qnum.toString() === s || `q${qnum}` === s || `q#${qnum}` === s;
      const textMatch = q.question_text.toLowerCase().includes(s);
      const choiceMatch = q.choices.some(c => c.text.toLowerCase().includes(s) || (c.explanation && c.explanation.toLowerCase().includes(s)));
      const discMatch = (q.discussions || []).some(d => d.content.toLowerCase().includes(s));
      const expMatch = q.overall_explanation?.toLowerCase().includes(s);
      if (!qnumMatch && !textMatch && !choiceMatch && !discMatch && !expMatch) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredQuestions.length / PAGE_SIZE) || 1;
  const pagedQuestions = filteredQuestions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSelectAnswer = async (qnum: number, letter: string) => {
    const q = questions.find(item => item.question_number === qnum);
    if (!q) return;

    const official = (q.correct_answer || '').toUpperCase().trim();
    const isCorrect = official.includes(letter.toUpperCase().trim());

    setUserProgress(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [qnum]: { selectedAnswer: letter, isCorrect, timestamp: new Date().toISOString() },
      },
    }));

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'answer',
          questionNumber: qnum,
          selectedAnswer: letter,
          isCorrect,
          domain: q.domain,
        }),
      });
    } catch {}
  };

  const handleToggleStar = async (qnum: number) => {
    const current = !!userProgress.starred[qnum];
    setUserProgress(prev => {
      const next = { ...prev.starred };
      if (current) delete next[qnum];
      else next[qnum] = true;
      return { ...prev, starred: next };
    });

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'star', questionNumber: qnum }),
      });
    } catch {}
  };

  const answeredList = Object.values(userProgress.answers || {});
  const answeredCount = answeredList.length;
  const correctCount = answeredList.filter(a => a.isCorrect).length;
  const accuracyPct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const volumePct = Math.min(100, Math.round((answeredCount / questions.length) * 100));
  const readinessScore = answeredCount > 0 ? Math.round((volumePct * 0.4) + (accuracyPct * 0.6)) : 0;
  const projectedPts = Math.round(500 + (readinessScore / 100) * 400);
  const deltaFromPass = projectedPts - 720;

  return (
    <div className="w-full min-h-screen bg-[#0D0E12] text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* 1. Top Master Overview Banner */}
        <section className="p-6 sm:p-8 rounded-xl bg-[#14161D] border border-white/[0.07] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-text-subtle">
              <span className="inline-flex items-center gap-1.5 text-secondary font-medium uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Anthropic Examination Standard
              </span>
              <span>/</span>
              <span>574 SCENARIOS</span>
              <span>/</span>
              <span>30 SUBDOMAINS</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl text-white font-medium tracking-tight">
              Claude Certified Architect (CCA-F)
            </h1>
            <p className="text-[14px] sm:text-[15px] leading-relaxed text-on-surface-variant font-sans">
              Comprehensive practice catalog spanning Agentic Systems, Prompt Engineering, Model Context Protocol (MCP), and Alignment. Verified by CertSafari rationales and ExamTopics community consensus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0 p-5 rounded-lg bg-[#0D0E12] border border-white/[0.06]">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Predictive Readiness</span>
              <span className="font-headline text-3xl text-white font-semibold mt-0.5">
                {answeredCount > 0 ? `${readinessScore}%` : '0%'}
              </span>
              <span className={`text-[11px] font-mono mt-0.5 ${answeredCount === 0 ? 'text-on-surface-variant' : deltaFromPass >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {answeredCount === 0
                  ? `0 of ${questions.length} practiced`
                  : deltaFromPass >= 0
                  ? `+${deltaFromPass} pts over cutoff`
                  : `${Math.abs(deltaFromPass)} pts below cutoff`}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/mock-exam"
                className="px-4 py-2 rounded-md bg-white text-black text-[13px] font-medium hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Full Simulation</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <Link
                href="/resources"
                className="px-3.5 py-2 rounded-md bg-[#1C202B] hover:bg-[#252B3A] text-white text-[13px] font-medium border border-white/[0.08] transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-secondary">style</span>
                <span>Flashcards</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Official 5-Domain Quick Switcher Strip */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-secondary">account_tree</span>
              Blueprint Domains ({DOMAINS.length})
            </span>
            <span className="text-xs font-mono text-text-muted">
              {filteredQuestions.length} Questions Filtered
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setSelectedDomain('all');
                setSelectedSubdomain('');
                setPage(1);
              }}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                selectedDomain === 'all'
                  ? 'bg-white text-black border-white font-medium shadow-sm'
                  : 'bg-[#14161D] text-on-surface-variant hover:text-white border-white/[0.06] hover:border-white/20'
              }`}
            >
              <span className="font-mono text-[10px] uppercase opacity-80">ALL DOMAINS</span>
              <span className="text-xs font-semibold mt-1">Full Curriculum</span>
              <span className="font-mono text-[11px] opacity-70 mt-1">574 Items</span>
            </button>

            {DOMAINS.map(d => {
              const isSelected = selectedDomain === d.key;
              const subCount = getSubdomainsByDomain(d.key).length;
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => {
                    setSelectedDomain(d.key);
                    setSelectedSubdomain('');
                    setPage(1);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white text-black border-white font-medium shadow-sm'
                      : 'bg-[#14161D] text-on-surface-variant hover:text-white border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[10px] uppercase opacity-80">{d.code}</span>
                    <span className="font-mono text-[10px] opacity-70">{d.weightPct}% wt</span>
                  </div>
                  <span className="text-xs font-semibold mt-1 truncate">{d.name}</span>
                  <span className="font-mono text-[11px] opacity-70 mt-1">{subCount} Subdomains</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Main Stage: Question Bank Feed + Weakness Radar Sidebar */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Main Feed / Flashcard Column (8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            {/* Precision Controls Toolbar */}
            <div className="flex flex-col gap-3.5 p-5 rounded-xl bg-[#14161D] border border-white/[0.08] shadow-sm">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-outline">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search MCP, XML tags, subagent context, Q#..."
                    className="w-full pl-9 pr-8 py-2 rounded-md bg-[#0D0E12] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-white/30 font-sans"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-white"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                {/* Feed vs Flashcard View Toggle */}
                <div className="flex items-center p-1 rounded-md bg-[#0D0E12] border border-white/[0.08] shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setViewMode('feed')}
                    className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all ${
                      viewMode === 'feed'
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">view_list</span>
                    <span>Feed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('flashcard')}
                    className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all ${
                      viewMode === 'flashcard'
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">style</span>
                    <span>Cards</span>
                  </button>
                </div>
              </div>

              {/* Question Bank Selector */}
              <BankSelector
                selectedBank={selectedBank}
                onSelectBank={b => {
                  setSelectedBank(b);
                  setPage(1);
                }}
                counts={{
                  all: questions.length,
                  certsafari: questions.filter(q => q.source === 'certsafari').length,
                  examtopics: questions.filter(q => q.source === 'examtopics').length,
                }}
              />

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-white/[0.06] pt-3">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'wrong', label: 'Needs Review' },
                  { id: 'starred', label: 'Starred' },
                  { id: 'discussions', label: 'With Discussions' },
                  { id: 'disputed', label: 'Disputed' },
                  { id: 'exhibits', label: 'With Exhibits' },
                  { id: 'correct', label: 'Mastered' },
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(f.id as any);
                      setPage(1);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors border ${
                      selectedFilter === f.id
                        ? 'bg-white text-black font-medium border-white'
                        : 'border-white/[0.06] text-text-muted hover:text-white hover:border-white/20'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Feed / Flashcard View */}
            {viewMode === 'flashcard' ? (
              <FlashcardViewer
                questions={filteredQuestions}
                userAnswers={userProgress.answers}
                starred={userProgress.starred}
                onAnswer={handleSelectAnswer}
                onToggleStar={handleToggleStar}
              />
            ) : (
              <div className="flex flex-col gap-6">
                {pagedQuestions.length > 0 ? (
                  pagedQuestions.map(question => (
                    <QuestionCard
                      key={question.question_number}
                      question={question}
                      mode="study"
                      selectedAnswer={userProgress.answers[question.question_number]?.selectedAnswer}
                      isStarred={!!userProgress.starred[question.question_number]}
                      onSelectAnswer={letter => handleSelectAnswer(question.question_number, letter)}
                      onToggleStar={() => handleToggleStar(question.question_number)}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center rounded-xl bg-[#14161D] border border-white/[0.08] space-y-3">
                    <span className="material-symbols-outlined text-3xl text-text-subtle">filter_list_off</span>
                    <h3 className="font-headline text-base text-white font-medium">No scenarios match your filter</h3>
                    <p className="text-xs text-text-muted">Try resetting search query, filters, or selected domain.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBank('all');
                        setSelectedDomain('all');
                        setSelectedSubdomain('');
                        setSelectedFilter('all');
                        setSearchQuery('');
                      }}
                      className="px-3.5 py-1.5 rounded bg-white text-black text-xs font-semibold mt-2"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs font-mono text-on-surface-variant">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => {
                        setPage(p => p - 1);
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded border border-white/10 hover:border-white/30 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => {
                        setPage(p => p + 1);
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded border border-white/10 hover:border-white/30 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Daily Weakness Radar & Objectives (4 cols) */}
          <aside className="xl:col-span-4 flex flex-col gap-6 w-full">
            {/* Daily Recommended Drill */}
            <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="font-headline text-[15px] text-white font-medium">Daily Recommended Drill</span>
                <span className="font-mono text-[11px] text-secondary">15 MIN</span>
              </div>

              <p className="text-[13px] leading-relaxed text-on-surface-variant font-sans">
                Targeted 15-question micro-session tuned directly to high-frequency mistakes in Model Context Protocol (MCP) JSON-RPC schemas, subagent context isolation, and prompt caching breakpoints.
              </p>

              <div className="p-3.5 rounded-lg bg-[#0D0E12] border border-white/[0.05] flex items-center justify-between font-mono text-[11px]">
                <span className="text-on-surface-variant">Estimated Gain</span>
                <span className="text-white font-medium">+35 PTS Projected Score</span>
              </div>

              <Link
                href="/mock-exam/session?type=quick&domain=domain_3_mcp_and_tools"
                className="w-full py-2.5 rounded-md bg-white text-black text-[13px] font-medium hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Start Daily Drill (15 Qs)</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Quick Curriculum Specs */}
            <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="font-headline text-[15px] text-white font-medium">Official Exam Specs</span>
                <span className="font-mono text-[11px] text-on-surface-variant">ANTHROPIC</span>
              </div>

              <div className="space-y-3 font-mono text-xs text-text-muted">
                <div className="flex items-center justify-between">
                  <span>Questions on Exam</span>
                  <span className="text-white">60 Scenarios</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Allocated Time</span>
                  <span className="text-white">120 Minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Passing Score</span>
                  <span className="text-white">720 / 1000 (72%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Question Types</span>
                  <span className="text-white">Scenario &amp; Case Study</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pool Coverage</span>
                  <span className="text-emerald-400">574 Items (100%)</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/resources"
                  className="w-full py-2 rounded-md bg-[#0D0E12] hover:bg-[#1C202B] text-white text-xs font-medium border border-white/[0.08] transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">menu_book</span>
                  <span>View Full Blueprint</span>
                </Link>
              </div>
            </div>
          </aside>
        </section>

      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D0E12] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            <span className="font-mono text-xs text-text-muted">Loading Claude Question Bank...</span>
          </div>
        </div>
      }
    >
      <LearnPageContent />
    </Suspense>
  );
}
