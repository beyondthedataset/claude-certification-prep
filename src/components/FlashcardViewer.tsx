'use client';

import { useEffect, useState } from 'react';
import { Question } from '@/lib/types';
import QuestionCard from './QuestionCard';
import { ArrowLeft, ArrowRight, Shuffle, RotateCcw } from 'lucide-react';

interface Props {
  questions: Question[];
  userAnswers: Record<number, { selectedAnswer: string; isCorrect: boolean }>;
  starred: Record<number, boolean>;
  onAnswer: (qnum: number, letter: string) => void;
  onToggleStar: (qnum: number) => void;
  onResetAttempt?: (qnum: number) => void;
}

export default function FlashcardViewer({
  questions,
  userAnswers,
  starred,
  onAnswer,
  onToggleStar,
  onResetAttempt,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = questions.length;
  if (total === 0) {
    return (
      <div className="p-8 text-center rounded-xl bg-surface-card border border-border">
        <p className="text-muted-foreground text-sm">No questions available matching current filters.</p>
      </div>
    );
  }

  const safeIndex = Math.min(Math.max(0, currentIndex), total - 1);
  const currentQuestion = questions[safeIndex];
  const qnum = currentQuestion.question_number;
  const answerRecord = userAnswers[qnum];
  const isStarred = !!starred[qnum];

  const handleNext = () => {
    setCurrentIndex(prev => (prev < total - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleRandom = () => {
    if (total <= 1) return;
    const next = Math.floor(Math.random() * total);
    setCurrentIndex(next === safeIndex ? (next + 1) % total : next);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight' || e.key === 'j') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        handlePrev();
      } else if (['1', 'a', 'A'].includes(e.key)) {
        onAnswer(qnum, 'A');
      } else if (['2', 'b', 'B'].includes(e.key)) {
        onAnswer(qnum, 'B');
      } else if (['3', 'c', 'C'].includes(e.key)) {
        onAnswer(qnum, 'C');
      } else if (['4', 'd', 'D'].includes(e.key)) {
        onAnswer(qnum, 'D');
      } else if (e.key === 's' || e.key === 'S') {
        onToggleStar(qnum);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex, qnum, onAnswer, onToggleStar]);

  const progressPct = Math.round(((safeIndex + 1) / total) * 100);

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-card border border-border shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="flex-1 h-2 rounded-full bg-surface-lowest overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-foreground shrink-0">
            {safeIndex + 1} of {total} ({progressPct}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-surface-high hover:bg-surface-container border border-border text-xs font-semibold text-foreground transition-colors"
            title="Previous (Left Arrow / K)"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>
          <button
            onClick={handleRandom}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-surface-high hover:bg-surface-container border border-border text-xs font-semibold text-foreground transition-colors"
            title="Random Question"
          >
            <Shuffle className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Random</span>
          </button>
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md technical-gradient text-white text-xs font-bold shadow-md shadow-orange-600/20"
            title="Next (Right Arrow / J)"
          >
            <span>Next</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <QuestionCard
        question={currentQuestion}
        mode="study"
        selectedAnswer={answerRecord?.selectedAnswer}
        isStarred={isStarred}
        onSelectAnswer={(letter) => onAnswer(qnum, letter)}
        onToggleStar={() => onToggleStar(qnum)}
        onReset={onResetAttempt ? () => onResetAttempt(qnum) : undefined}
      />

      {/* Keyboard guide tip */}
      <div className="text-center font-mono text-3xs text-muted-foreground">
        Shortcuts: <kbd className="px-1 py-0.5 rounded bg-surface-card border border-border">1-4</kbd> / <kbd className="px-1 py-0.5 rounded bg-surface-card border border-border">A-D</kbd> Select Answer · <kbd className="px-1 py-0.5 rounded bg-surface-card border border-border">← / →</kbd> Prev / Next · <kbd className="px-1 py-0.5 rounded bg-surface-card border border-border">S</kbd> Star
      </div>
    </div>
  );
}
