'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { QUESTIONS_DATA, DOMAINS } from '@/lib/questions-data';
import { Question, DomainKey, UserProgress } from '@/lib/types';
import QuestionCard from '@/components/QuestionCard';
import FlashcardViewer from '@/components/FlashcardViewer';
import { Search, BookOpen, Layers, Star, X } from 'lucide-react';

function LearnPageContent() {
  const searchParams = useSearchParams();
  const initialDomain = searchParams.get('domain') as DomainKey | null;

  const [questions, setQuestions] = useState<Question[]>(QUESTIONS_DATA);
  const [selectedDomain, setSelectedDomain] = useState<DomainKey | 'all'>(initialDomain || 'all');
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
    // Domain match
    if (selectedDomain !== 'all' && q.domain !== selectedDomain) return false;

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
      const choiceMatch = q.choices.some(c => c.text.toLowerCase().includes(s));
      const discMatch = q.discussions.some(d => d.content.toLowerCase().includes(s));
      if (!qnumMatch && !textMatch && !choiceMatch && !discMatch) return false;
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
            <span>All 134 Questions</span>
          </div>
          <h1 className="font-headline text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Curriculum &amp; Deep Practice
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl">
            Test any question, review community voting consensus, and explore verified architectural explanations.
          </p>
        </div>

        {/* Live Score Tracker Pill */}
        <div className="flex items-center gap-4 bg-surface-lowest p-3.5 rounded-xl border border-border shrink-0">
          <div className="flex flex-col text-right">
            <span className="font-mono text-base md:text-lg font-extrabold text-foreground">
              {correctCount} / {answeredCount || 134}
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
            onClick={() => setSelectedDomain('all')}
            className={`px-3 py-1.5 rounded-full font-mono text-2xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all border ${
              selectedDomain === 'all'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface-card text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            All Domains (134)
          </button>
          {DOMAINS.map(d => (
            <button
              key={d.key}
              onClick={() => setSelectedDomain(d.key)}
              className={`px-3 py-1.5 rounded-full font-mono text-2xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all border ${
                selectedDomain === d.key
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface-card text-muted-foreground border-border hover:border-primary/40'
              }`}
            >
              {d.code} ({d.weightPct}%)
            </button>
          ))}
        </div>

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
            💬 Discussions (40)
          </button>
          <button
            onClick={() => setSelectedFilter('disputed')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              selectedFilter === 'disputed'
                ? 'bg-amber-500/15 text-amber-400 font-bold border-amber-500/40'
                : 'text-muted-foreground border-transparent hover:text-amber-400'
            }`}
          >
            ⚠️ Disputed (15)
          </button>
          <button
            onClick={() => setSelectedFilter('exhibits')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              selectedFilter === 'exhibits'
                ? 'bg-surface-high text-foreground font-bold border-border'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            🖼️ Exhibits (46)
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
                  setSelectedDomain('all');
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
