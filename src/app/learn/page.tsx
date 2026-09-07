'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { QUESTIONS_DATA, DOMAINS, SUBDOMAINS, getSubdomainsByDomain } from '@/lib/questions-data';
import { Question, DomainKey, UserProgress, QuestionBank } from '@/lib/types';
import QuestionCard from '@/components/QuestionCard';
import FlashcardViewer from '@/components/FlashcardViewer';
import BankSelector from '@/components/BankSelector';
import { Search, BookOpen, Layers, Star, X, ArrowRight, CheckCircle2 } from 'lucide-react';

function LearnPageContent() {
  const searchParams = useSearchParams();
  const initialDomain = searchParams.get('domain') as DomainKey | null;
  const initialBank = (searchParams.get('bank') as QuestionBank) || 'all';
  const initialSubdomain = searchParams.get('subdomain') || '';

  const [activeCategory, setActiveCategory] = useState<'all' | 'cloud' | 'ai' | 'security'>('all');
  const [drillView, setDrillView] = useState(false);

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
      setDrillView(true);
    }
    const d = searchParams.get('domain') as DomainKey;
    if (d) {
      setSelectedDomain(d);
      setDrillView(true);
    }
    const sub = searchParams.get('subdomain');
    if (sub !== null && sub !== '') {
      setSelectedSubdomain(sub);
      setDrillView(true);
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

  const tracks = [
    {
      id: 'aws-saa',
      title: 'AWS Solutions Architect Associate (SAA-C03)',
      category: 'cloud',
      provider: 'AWS · Architecture',
      status: 'Ready to Pass',
      statusType: 'success',
      desc: 'High-availability VPC design, decoupled microservices, and IAM delegation.',
      readiness: 82,
      timedSets: '6 Timed Sets',
      lastMock: '860/1000',
      avgTime: '54s / Question avg',
      action: 'Continue Practice',
      link: '/mock-exam',
    },
    {
      id: 'azure-ai',
      title: 'Azure AI Engineer Associate (AI-102)',
      category: 'ai',
      provider: 'Azure · AI & ML',
      status: 'Review Needed',
      statusType: 'warning',
      desc: 'Azure OpenAI Service integration, Cognitive Search semantic rankers, and Vision APIs.',
      readiness: 71,
      timedSets: '4 Timed Sets',
      lastMock: '695/1000',
      avgTime: 'Mock #3 Paused at Q34',
      action: 'Resume Test',
      link: '/mock-exam',
    },
    {
      id: 'claude-cca',
      title: 'Anthropic Claude Certified Architect (CCA-F)',
      category: 'ai',
      provider: 'Anthropic · LLM Architecture',
      status: 'Master Bank Loaded',
      statusType: 'success',
      desc: 'Agentic architecture, subagent orchestration, Model Context Protocol (MCP), and prompt engineering.',
      readiness: 84,
      timedSets: '574 Scenarios',
      lastMock: '30 Subdomains',
      avgTime: 'CertSafari & ExamTopics',
      action: 'Explore 574 Bank',
      isInternalQBank: true,
    },
    {
      id: 'gcp-pca',
      title: 'Google Cloud Professional Cloud Architect (PCA)',
      category: 'cloud',
      provider: 'Google Cloud · Infrastructure',
      status: 'Diagnostic Available',
      statusType: 'neutral',
      desc: 'Enterprise hybrid connectivity, Anthos multi-cloud clusters, and Cloud Spanner.',
      readiness: 64,
      timedSets: '4 Case Studies',
      lastMock: '680 Questions',
      avgTime: 'Focus: Spanner',
      action: 'Start Diagnostic',
      link: '/mock-exam',
    },
  ];

  const filteredTracks = tracks.filter(t => {
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

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
      const subMatch = q.subdomain?.toLowerCase().includes(s);
      if (!qnumMatch && !textMatch && !choiceMatch && !discMatch && !expMatch && !subMatch) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const pagedQuestions = filteredQuestions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSelectAnswer = async (qnum: number, letter: string) => {
    const q = questions.find(item => item.question_number === qnum);
    const official = (q?.correct_answer || '').toUpperCase().replace(/[^A-Z]/g, '');
    const userAns = letter.toUpperCase().replace(/[^A-Z]/g, '');
    const isCorrect = official.includes(userAns) || userAns === official;

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
        body: JSON.stringify({ action: 'answer', questionNumber: qnum, selectedAnswer: letter }),
      });
    } catch {}
  };

  const handleToggleStar = async (qnum: number) => {
    const nextStarred = !userProgress.starred[qnum];
    setUserProgress(prev => {
      const updatedStarred = { ...prev.starred };
      if (nextStarred) updatedStarred[qnum] = true;
      else delete updatedStarred[qnum];
      return { ...prev, starred: updatedStarred };
    });

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'star', questionNumber: qnum }),
      });
    } catch {}
  };

  return (
    <div className="w-full min-h-screen bg-[#0D0E12] text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* 1. Top Master Overview Banner */}
        <section className="p-6 sm:p-8 rounded-xl bg-[#14161D] border border-white/[0.07] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant/80">
              Certification Intelligence
            </span>
            <h1 className="font-headline text-3xl sm:text-4xl text-white font-medium tracking-tight">
              Master AI &amp; Cloud Certifications.
            </h1>
            <p className="text-[14px] sm:text-[15px] leading-relaxed text-on-surface-variant">
              Adaptive scenarios, architecture diagnostics, and predictive readiness calibrated to official examination standards.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 p-5 rounded-lg bg-[#0D0E12] border border-white/[0.06]">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Overall Readiness</span>
              <span className="font-headline text-3xl text-white font-semibold mt-0.5">78%</span>
              <span className="text-[11px] font-mono text-on-surface-variant/80 mt-0.5">Pass Probable · 16d Left</span>
            </div>
            <button
              onClick={() => {
                setDrillView(true);
                window.scrollTo({ top: 700, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-md bg-white text-black text-[13px] font-medium hover:bg-neutral-200 transition-all flex items-center gap-1.5"
            >
              <span>Rapid Drill</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* 2. Filter & Segmentation Deck */}
        <section className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/[0.07]">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Certifications' },
              { id: 'cloud', label: 'Cloud Architecture' },
              { id: 'ai', label: 'Generative AI & LLMs' },
              { id: 'security', label: 'DevOps & Security' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                  activeCategory === tab.id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-on-surface-variant hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-on-surface-variant">
              {filteredTracks.length} Enrolled Tracks
            </span>
            <button
              onClick={() => setDrillView(!drillView)}
              className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
                drillView
                  ? 'bg-[#1C202B] border-white/20 text-white'
                  : 'border-white/10 text-on-surface-variant hover:text-white'
              }`}
            >
              {drillView ? 'Hide Q-Bank Drill' : 'Open Q-Bank Drill'}
            </button>
          </div>
        </section>

        {/* 3. Main Stage: Catalog Grid + Diagnostics Hub */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Active Certification Tracks (8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1">
              <h2 className="font-headline text-[16px] text-white font-medium">Active Certification Tracks</h2>
              <span className="font-mono text-[11px] text-on-surface-variant/70">Priority Queue</span>
            </div>

            {filteredTracks.map(track => (
              <div
                key={track.id}
                className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] hover:border-white/[0.14] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        {track.provider}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                          track.statusType === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-white/5 text-white/80 border-white/10'
                        }`}
                      >
                        {track.status}
                      </span>
                    </div>

                    <h3 className="font-headline text-lg text-white font-semibold">{track.title}</h3>
                    <p className="text-xs sm:text-[13px] text-on-surface-variant leading-relaxed">{track.desc}</p>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end justify-between gap-2 shrink-0">
                    <div className="text-right">
                      <span className="font-headline text-2xl text-white font-semibold">{track.readiness}%</span>
                      <span className="block font-mono text-[10px] text-on-surface-variant">Readiness</span>
                    </div>

                    {track.isInternalQBank ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDrillView(true);
                          window.scrollTo({ top: 600, behavior: 'smooth' });
                        }}
                        className="px-4 py-1.5 rounded-md bg-white text-black text-xs font-medium hover:bg-neutral-200 transition-all flex items-center gap-1 mt-1"
                      >
                        <span>{track.action}</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    ) : (
                      <Link
                        href={track.link || '/mock-exam'}
                        className="px-4 py-1.5 rounded-md bg-white text-black text-xs font-medium hover:bg-neutral-200 transition-all flex items-center gap-1 mt-1"
                      >
                        <span>{track.action}</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-5 mt-4 pt-3 border-t border-white/[0.05] text-xs font-mono text-on-surface-variant">
                  <span className="text-white">{track.timedSets}</span>
                  <span>•</span>
                  <span>{track.lastMock}</span>
                  <span>•</span>
                  <span>{track.avgTime}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Recommended Drill Sidebar (4 cols) */}
          <aside className="xl:col-span-4 flex flex-col gap-6 w-full">
            <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.07] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="font-headline text-[15px] text-white font-medium">Daily Recommended Drill</span>
                <span className="font-mono text-[11px] text-on-surface-variant">15 MIN</span>
              </div>

              <p className="text-[13px] leading-relaxed text-on-surface-variant">
                Targeted 15-question micro-session tuned directly to high-frequency mistakes in AWS IAM Role Chaining, Transit Gateway routing, and Azure OpenAI model allocations.
              </p>

              <div className="p-3 rounded-lg bg-[#0D0E12] border border-white/[0.05] flex items-center justify-between font-mono text-[11px]">
                <span className="text-on-surface-variant">Estimated Gain</span>
                <span className="text-white font-medium">+35 PTS Score</span>
              </div>

              <Link
                href="/mock-exam"
                className="w-full py-2.5 rounded-md bg-white text-black text-[13px] font-medium hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Start Daily Drill</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </aside>
        </section>

        {/* 4. Deep Scenario Q-Bank Drill Engine (574 Questions) */}
        {drillView && (
          <section className="mt-8 pt-8 border-t border-white/[0.08] flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-[#7BD0FF] uppercase tracking-wider">
                  Deep Architectural Practice
                </span>
                <h2 className="font-headline text-2xl text-white font-semibold mt-1">
                  Claude Certified Architect (574 Verified Scenarios)
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  CertSafari detailed option rationales and ExamTopics practitioner consensus discussions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('feed')}
                  className={`px-3 py-1 rounded text-xs flex items-center gap-1.5 ${
                    viewMode === 'feed' ? 'bg-white text-black font-medium' : 'text-on-surface-variant hover:text-white border border-white/10'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Feed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('flashcard')}
                  className={`px-3 py-1 rounded text-xs flex items-center gap-1.5 ${
                    viewMode === 'flashcard' ? 'bg-white text-black font-medium' : 'text-on-surface-variant hover:text-white border border-white/10'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Cards</span>
                </button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#14161D] border border-white/[0.07]">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search topics, MCP, XML, Q#..."
                    className="w-full pl-9 pr-8 py-2 rounded-md bg-[#0D0E12] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-white/30"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <BankSelector
                  selectedBank={selectedBank}
                  onSelectBank={setSelectedBank}
                  counts={{
                    all: questions.length,
                    certsafari: questions.filter(q => q.source === 'certsafari').length,
                    examtopics: questions.filter(q => q.source === 'examtopics').length,
                  }}
                />
              </div>

              {/* Domain Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDomain('all');
                    setSelectedSubdomain('');
                  }}
                  className={`px-3 py-1 rounded border transition-colors whitespace-nowrap ${
                    selectedDomain === 'all'
                      ? 'bg-white text-black font-medium border-white'
                      : 'border-white/10 text-on-surface-variant hover:text-white'
                  }`}
                >
                  All Domains ({questions.length})
                </button>
                {DOMAINS.map(d => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => {
                      setSelectedDomain(d.key);
                      setSelectedSubdomain('');
                    }}
                    className={`px-3 py-1 rounded border transition-colors whitespace-nowrap ${
                      selectedDomain === d.key
                        ? 'bg-white text-black font-medium border-white'
                        : 'border-white/10 text-on-surface-variant hover:text-white'
                    }`}
                  >
                    {d.code} ({d.weightPct}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Feed */}
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
                {pagedQuestions.map(question => (
                  <QuestionCard
                    key={question.question_number}
                    question={question}
                    mode="study"
                    selectedAnswer={userProgress.answers[question.question_number]?.selectedAnswer}
                    isStarred={!!userProgress.starred[question.question_number]}
                    onSelectAnswer={letter => handleSelectAnswer(question.question_number, letter)}
                    onToggleStar={() => handleToggleStar(question.question_number)}
                  />
                ))}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs font-mono text-on-surface-variant">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => {
                        setPage(p => p - 1);
                        window.scrollTo({ top: 600, behavior: 'smooth' });
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
                        window.scrollTo({ top: 600, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded border border-white/10 hover:border-white/30 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-sm text-outline">Loading Catalog...</div>}>
      <LearnPageContent />
    </Suspense>
  );
}
