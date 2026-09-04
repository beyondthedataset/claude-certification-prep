'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { QUESTIONS_DATA, DOMAINS, SUBDOMAINS, getSubdomainsByDomain } from '@/lib/questions-data';
import { Question, DomainKey, UserProgress, QuestionBank } from '@/lib/types';
import QuestionCard from '@/components/QuestionCard';
import FlashcardViewer from '@/components/FlashcardViewer';
import BankSelector from '@/components/BankSelector';
import { Search, BookOpen, Layers, Star, X, Compass, Filter } from 'lucide-react';

function LearnPageContent() {
  const searchParams = useSearchParams();
  const initialDomain = searchParams.get('domain') as DomainKey | null;
  const initialBank = (searchParams.get('bank') as QuestionBank) || 'all';
  const initialSubdomain = searchParams.get('subdomain') || '';

  const [questions, setQuestions] = useState<Question[]>(QUESTIONS_DATA);
  const [selectedBank, setSelectedBank] = useState<QuestionBank>(initialBank);
  const [selectedDomain, setSelectedDomain] = useState<DomainKey | 'all'>(initialDomain || 'all');
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>(initialSubdomain);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'discussions' | 'disputed' | 'exhibits' | 'starred' | 'wrong' | 'correct'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'feed' | 'flashcard'>('feed');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: '',
    answers: {},
    starred: {},
    notes: {},
    updatedAt: '',
  });

  // Sync with searchParams when user navigates
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
    if (sub !== null) {
      setSelectedSubdomain(sub);
    }
  }, [searchParams]);

  // Load user progress
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

  // Filter logic
  const filteredQuestions = questions.filter(q => {
    const qnum = q.question_number;

    // Bank match
    if (selectedBank !== 'all' && q.source !== selectedBank) return false;

    // Domain match
    if (selectedDomain !== 'all' && q.domain !== selectedDomain) return false;

    // Subdomain match
    if (selectedSubdomain) {
      if (!q.subdomain || !q.subdomain.includes(selectedSubdomain)) return false;
    }

    // Filter type match
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

    // Search query match
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

  const handleSelectAnswer = async (qnum: number, letter: string) => {
    const q = questions.find(item => item.question_number === qnum);
    const official = (q?.correct_answer || '').toUpperCase().replace(/[^A-Z]/g, '');
    const userAns = letter.toUpperCase().replace(/[^A-Z]/g, '');
    const isCorrect = official.includes(userAns) || userAns === official;

    // Optimistic UI update
    setUserProgress(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [qnum]: { selectedAnswer: letter, isCorrect, timestamp: new Date().toISOString() },
      },
    }));

    // Server update
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

  const handleResetAttempt = async (qnum: number) => {
    setUserProgress(prev => {
      const updated = { ...prev.answers };
      delete updated[qnum];
      return { ...prev, answers: updated };
    });
  };

  const answeredCount = Object.keys(userProgress.answers).length;
  const correctCount = Object.values(userProgress.answers).filter(a => a.isCorrect).length;
  const accuracyPct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface-card border border-border border-l-2 border-l-primary shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2 font-mono text-3xs text-primary uppercase tracking-widest font-semibold">
            <span>CCA-F Question Bank</span>
            <span>·</span>
            <span>574 Questions Across 2 Banks</span>
            <span>·</span>
            <span>30 Subdomains</span>
          </div>
          <h1 className="font-headline text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Curriculum &amp; Deep Practice
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl">
            Switch between verified CertSafari rationales and ExamTopics community discussions, or drill by 30 official subdomains.
          </p>
        </div>

        {/* Live Score Tracker Pill */}
        <div className="flex items-center gap-4 bg-surface-lowest p-3.5 rounded-xl border border-border shrink-0">
          <div className="flex flex-col text-right">
            <span className="font-mono text-base md:text-lg font-extrabold text-foreground">
              {correctCount} / {answeredCount || 574}
            </span>
            <span className="font-mono text-3xs text-muted-foreground uppercase tracking-widest">
              Practiced ({accuracyPct}% Accuracy)
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {accuracyPct}%
          </div>
        </div>
      </div>

      {/* Question Bank Selector */}
      <BankSelector
        selectedBank={selectedBank}
        onSelectBank={bank => {
          setSelectedBank(bank);
        }}
        counts={{
          all: questions.length,
          certsafari: questions.filter(q => q.source === 'certsafari').length,
          examtopics: questions.filter(q => q.source === 'examtopics').length,
        }}
      />

      {/* Control Bar: Mode switch & Domain filters */}
      <div className="flex flex-col gap-4">
        {/* View mode toggle & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-surface-card border border-border rounded-xl">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search topics, keywords, MCP, XML, Q#..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-surface-lowest border border-border text-foreground text-xs md:text-sm focus:outline-none focus:border-primary transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Mode Switch: Feed vs Flashcard */}
          <div className="flex items-center gap-1 bg-surface-lowest p-1 rounded-lg border border-border shrink-0">
            <button
              onClick={() => setViewMode('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'feed'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Full Feed</span>
            </button>
            <button
              onClick={() => setViewMode('flashcard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'flashcard'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Flashcard Focus</span>
            </button>
          </div>
        </div>

        {/* 5 Domains Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setSelectedDomain('all');
              setSelectedSubdomain('');
            }}
            className={`px-3 py-1.5 rounded-full font-mono text-2xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all border ${
              selectedDomain === 'all'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface-card text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            All Domains ({questions.filter(q => selectedBank === 'all' || q.source === selectedBank).length})
          </button>
          {DOMAINS.map(d => {
            const domainQCount = questions.filter(
              q => q.domain === d.key && (selectedBank === 'all' || q.source === selectedBank)
            ).length;
            return (
              <button
                key={d.key}
                onClick={() => {
                  setSelectedDomain(d.key);
                  setSelectedSubdomain('');
                }}
                className={`px-3 py-1.5 rounded-full font-mono text-2xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all border ${
                  selectedDomain === d.key
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-surface-card text-muted-foreground border-border hover:border-primary/40'
                }`}
              >
                {d.code} ({domainQCount})
              </button>
            );
          })}
        </div>

        {/* Subdomain Filter Strip when domain is chosen */}
        {selectedDomain !== 'all' && (
          <div className="flex flex-col gap-2 p-3 bg-surface-card border border-border/80 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-primary" />
                Subdomains in {DOMAINS.find(d => d.key === selectedDomain)?.code}:
              </span>
              {selectedSubdomain && (
                <button
                  onClick={() => setSelectedSubdomain('')}
                  className="text-3xs text-primary hover:underline flex items-center gap-1 font-mono"
                >
                  <X className="w-3 h-3" /> Clear Subdomain Filter
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedSubdomain('')}
                className={`px-2.5 py-1 rounded-full font-mono text-3xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all border ${
                  !selectedSubdomain
                    ? 'bg-primary/20 text-primary border-primary/40'
                    : 'bg-surface-lowest text-muted-foreground border-border hover:border-primary/40'
                }`}
              >
                All Subdomains
              </button>
              {getSubdomainsByDomain(selectedDomain as DomainKey).map(sub => (
                <button
                  key={sub.code}
                  onClick={() => setSelectedSubdomain(sub.code)}
                  title={sub.title}
                  className={`px-2.5 py-1 rounded-full font-mono text-3xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    selectedSubdomain === sub.code
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-surface-lowest text-muted-foreground border-border hover:border-primary/40'
                  }`}
                >
                  <span>{sub.code}</span>
                  <span className="text-[10px] opacity-75">({sub.questionCount})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Banner if subdomain is active while domain is 'all' */}
        {selectedDomain === 'all' && selectedSubdomain && (
          <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/30 rounded-xl text-xs">
            <span className="flex items-center gap-2 text-primary font-medium">
              <Compass className="w-4 h-4" />
              Drilling Subdomain <strong>{selectedSubdomain}</strong>: {SUBDOMAINS.find(s => s.code === selectedSubdomain)?.title || ''}
            </span>
            <button
              onClick={() => setSelectedSubdomain('')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear Filter
            </button>
          </div>
        )}

        {/* Sub-Filters: Discussions / Disputed / Exhibits / Starred */}
        <div className="flex items-center gap-2 overflow-x-auto text-2xs font-mono">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              selectedFilter === 'all'
                ? 'bg-surface-high text-foreground font-bold border-border'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            All Questions ({filteredQuestions.length})
          </button>
          <button
            onClick={() => setSelectedFilter('discussions')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              selectedFilter === 'discussions'
                ? 'bg-cyan-500/15 text-cyan-400 font-bold border-cyan-500/40'
                : 'text-muted-foreground border-transparent hover:text-cyan-400'
            }`}
          >
            💬 Discussions
          </button>
          <button
            onClick={() => setSelectedFilter('disputed')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              selectedFilter === 'disputed'
                ? 'bg-amber-500/15 text-amber-400 font-bold border-amber-500/40'
                : 'text-muted-foreground border-transparent hover:text-amber-400'
            }`}
          >
            ⚠️ Disputed
          </button>
          <button
            onClick={() => setSelectedFilter('exhibits')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              selectedFilter === 'exhibits'
                ? 'bg-surface-high text-foreground font-bold border-border'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            🖼️ Exhibits
          </button>
          <button
            onClick={() => setSelectedFilter('starred')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              selectedFilter === 'starred'
                ? 'bg-amber-500/15 text-amber-400 font-bold border-amber-500/40'
                : 'text-muted-foreground border-transparent hover:text-amber-400'
            }`}
          >
            ⭐ Starred ({Object.keys(userProgress.starred).length})
          </button>
          <button
            onClick={() => setSelectedFilter('wrong')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              selectedFilter === 'wrong'
                ? 'bg-rose-500/15 text-rose-400 font-bold border-rose-500/40'
                : 'text-muted-foreground border-transparent hover:text-rose-400'
            }`}
          >
            ❌ Review Incorrect
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'flashcard' ? (
        <FlashcardViewer
          questions={filteredQuestions}
          userAnswers={userProgress.answers}
          starred={userProgress.starred}
          onAnswer={handleSelectAnswer}
          onToggleStar={handleToggleStar}
          onResetAttempt={handleResetAttempt}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-surface-card border border-border">
              <p className="text-muted-foreground text-sm font-medium">
                No questions found matching your filter and search criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedBank('all');
                  setSelectedDomain('all');
                  setSelectedSubdomain('');
                  setSelectedFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-md technical-gradient text-white text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredQuestions.map(question => {
              const qnum = question.question_number;
              const ansRecord = userProgress.answers[qnum];
              const isStarred = !!userProgress.starred[qnum];

              return (
                <QuestionCard
                  key={qnum}
                  question={question}
                  mode="study"
                  selectedAnswer={ansRecord?.selectedAnswer}
                  isStarred={isStarred}
                  onSelectAnswer={letter => handleSelectAnswer(qnum, letter)}
                  onToggleStar={() => handleToggleStar(qnum)}
                  onReset={() => handleResetAttempt(qnum)}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="font-mono text-xs text-muted-foreground">Loading Question Bank...</span>
          </div>
        </div>
      }
    >
      <LearnPageContent />
    </Suspense>
  );
}
