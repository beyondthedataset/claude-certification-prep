'use client';

import { useEffect, useState } from 'react';
import { Question } from '@/lib/types';
import QuestionCard from './QuestionCard';

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
      <div className="p-8 text-center rounded-xl bg-[#14161D] border border-white/[0.08]">
        <p className="text-text-muted text-sm font-sans">No questions available matching current filters.</p>
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
      {/* Top Precision Toolbar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#14161D] border border-white/[0.08] shadow-sm flex-wrap gap-4">
        <div className="flex items-center gap-3.5 flex-1 min-w-[220px]">
          {/* 2px Hairline Progress Track (Atelier Obsidian standard) */}
          <div className="flex-1 h-1.5 rounded-full bg-[#1E222D] overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="font-mono text-xs text-text-muted shrink-0">
            <span className="text-white font-medium">{safeIndex + 1}</span> / {total} ({progressPct}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0D0E12] hover:bg-[#1C202B] border border-white/[0.08] text-xs font-medium text-text-primary hover:text-white transition-colors"
            title="Previous (Left Arrow / K)"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span>Prev</span>
          </button>

          <button
            onClick={handleRandom}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0D0E12] hover:bg-[#1C202B] border border-white/[0.08] text-xs font-medium text-text-primary hover:text-white transition-colors"
            title="Random Question"
          >
            <span className="material-symbols-outlined text-[15px] text-secondary">shuffle</span>
            <span className="hidden sm:inline">Random</span>
          </button>

          <button
            onClick={handleNext}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-white hover:bg-[#E2E8F0] text-black text-xs font-medium transition-colors shadow-sm"
            title="Next (Right Arrow / J)"
          >
            <span>Next</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
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

      {/* Keyboard Shortcuts Hint Bar */}
      <div className="text-center font-mono text-[11px] text-text-subtle py-1">
        Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-[#0D0E12] border border-white/[0.08] text-white text-[10px]">1-4</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-[#0D0E12] border border-white/[0.08] text-white text-[10px]">A-D</kbd> Select Answer · <kbd className="px-1.5 py-0.5 rounded bg-[#0D0E12] border border-white/[0.08] text-white text-[10px]">← / →</kbd> Prev / Next · <kbd className="px-1.5 py-0.5 rounded bg-[#0D0E12] border border-white/[0.08] text-white text-[10px]">S</kbd> Star
      </div>
    </div>
  );
}
