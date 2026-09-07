'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QUESTIONS_DATA, DOMAIN_MAP } from '@/lib/questions-data';
import { Question, DomainKey, QuestionBank } from '@/lib/types';
import { formatTime } from '@/lib/utils';

function LiveExamSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examType = (searchParams.get('type') as 'full' | 'quick' | 'domain') || 'quick';
  const domainKey = searchParams.get('domain') as DomainKey | null;
  const bankParam = (searchParams.get('bank') as QuestionBank) || 'all';

  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [eliminated, setEliminated] = useState<Record<number, Record<string, boolean>>>({});
  const [eliminationMode, setEliminationMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(examType === 'full' ? 7200 : 3000);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showGridReviewModal, setShowGridReviewModal] = useState(false);

  // Initialize questions
  useEffect(() => {
    let pool = [...QUESTIONS_DATA];
    if (bankParam && bankParam !== 'all') {
      pool = pool.filter(q => q.source === bankParam);
    }
    if (examType === 'domain' && domainKey) {
      pool = pool.filter(q => q.domain === domainKey);
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count = examType === 'full' ? 60 : examType === 'quick' ? 25 : Math.min(pool.length, 30);
    setExamQuestions(shuffled.slice(0, count));
  }, [examType, domainKey, bankParam]);

  // Timer tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const totalQuestions = examQuestions.length;
  const currentQuestion = examQuestions[currentIndex];
  const qnum = currentQuestion?.question_number;

  const handleSelectAnswer = useCallback((letter: string) => {
    if (!qnum) return;
    if (eliminationMode) {
      // In elimination mode, toggle striking through the choice
      setEliminated(prev => ({
        ...prev,
        [qnum]: {
          ...(prev[qnum] || {}),
          [letter]: !prev[qnum]?.[letter],
        },
      }));
      return;
    }

    setAnswers(prev => ({
      ...prev,
      [qnum]: letter,
    }));
  }, [qnum, eliminationMode]);

  // Keyboard shortcut listener for A, B, C, D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        handleSelectAnswer(key);
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < totalQuestions - 1) setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalQuestions, handleSelectAnswer]);

  const handleToggleFlag = () => {
    if (!qnum) return;
    setFlagged(prev => ({
      ...prev,
      [qnum]: !prev[qnum],
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const questionNumbers = examQuestions.map(q => q.question_number);
      const durationTotal = examType === 'full' ? 7200 : 3000;
      const timeSpentSeconds = Math.max(0, durationTotal - secondsLeft);

      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examType,
          domainKey,
          questionNumbers,
          answers,
          flagged,
          timeSpentSeconds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      router.push(`/mock-exam/result/${data.attempt.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to submit exam');
      setSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          <span className="font-mono text-xs text-text-muted">Loading Examination Matrix...</span>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const remainingCount = totalQuestions - answeredCount;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);
  const domainInfo = DOMAIN_MAP[currentQuestion.domain as DomainKey];
  const currentEliminations = eliminated[qnum] || {};

  return (
    <div className="w-full min-h-screen bg-[#0D0E12] flex flex-col">
      {/* Sub-HUD: Fixed Under Nav with Precision Telemetry */}
      <div className="sticky top-15 z-30 w-full bg-[#0D0E12]/95 backdrop-blur-md border-b border-white/[0.08] py-2.5 px-6">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-white font-mono text-sm">{currentIndex + 1}</span>
              <span className="text-text-subtle font-mono text-xs">/ {totalQuestions}</span>
            </div>
            <div className="h-3.5 w-px bg-white/[0.12]"></div>
            <span className="text-text-muted font-mono text-xs hidden sm:inline">{progressPct}% Complete</span>
            <div className="h-3.5 w-px bg-white/[0.12] hidden sm:block"></div>
            <span className="text-text-subtle font-mono text-[11px] uppercase tracking-wider hidden md:inline">
              {examType === 'full' ? '60Q FULL EXAM' : examType === 'quick' ? '25Q QUICK MOCK' : 'DOMAIN DRILL'}
            </span>
          </div>

          {/* Countdown Clock with Pause/Resume */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14161D] border ${secondsLeft < 300 ? 'border-rose-500/50 text-rose-400' : 'border-white/[0.12] text-white'}`}>
              <span className="material-symbols-outlined text-text-subtle text-[15px]">schedule</span>
              <span className="font-mono text-xs tracking-wide font-medium">
                {formatTime(secondsLeft)}
              </span>
              <button
                onClick={() => setIsTimerRunning(prev => !prev)}
                className="ml-1 text-text-subtle hover:text-white transition-colors flex items-center"
                title={isTimerRunning ? 'Pause Clock' : 'Resume Clock'}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {isTimerRunning ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>
          </div>

          {/* HUD Action Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFlag}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                flagged[qnum]
                  ? 'bg-[#1C202B] border border-amber-400/60 text-amber-300'
                  : 'bg-[#14161D] border border-white/[0.08] text-text-muted hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">flag</span>
              <span className="hidden sm:inline font-normal">{flagged[qnum] ? 'Flagged' : 'Flag'}</span>
            </button>

            <button
              onClick={() => setEliminationMode(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                eliminationMode
                  ? 'bg-[#1C202B] border border-secondary text-secondary'
                  : 'bg-[#14161D] border border-white/[0.08] text-text-muted hover:text-white'
              }`}
              title="Click options to strike through eliminated answers"
            >
              <span className="material-symbols-outlined text-[15px]">strikethrough_s</span>
              <span className="hidden sm:inline font-normal">Eliminate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Examination Stage */}
      <div className="max-w-[1360px] mx-auto px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Column: Reading Stem & Answer Choices (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Stem Metadata */}
          <div className="flex items-center justify-between text-xs text-text-subtle border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-secondary">{domainInfo?.code || 'DOMAIN'}</span>
              <span>•</span>
              <span className="text-text-muted">{domainInfo?.name || 'Architectural Evaluation'}</span>
              {currentQuestion.subdomain && (
                <>
                  <span>•</span>
                  <span className="text-text-subtle truncate max-w-[200px]">{currentQuestion.subdomain}</span>
                </>
              )}
            </div>
            <span className="font-mono text-[11px] text-text-subtle">
              Single Choice • Hotkeys [A-D]
            </span>
          </div>

          {/* Scenario Stem Text */}
          <div className="py-2">
            <h1 className="text-[19px] sm:text-[22px] font-normal leading-[1.65] text-white tracking-[-0.015em] whitespace-pre-line font-sans">
              {currentQuestion.question_text}
            </h1>
          </div>

          {/* Question Exhibits / Images if present */}
          {currentQuestion.images && currentQuestion.images.length > 0 && (
            <div className="space-y-3">
              {currentQuestion.images.map((img, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#14161D] border border-white/[0.08] overflow-hidden">
                  <img src={img} alt={`Diagram ${i + 1}`} className="max-h-96 w-auto mx-auto object-contain" />
                </div>
              ))}
            </div>
          )}

          {/* Option Elimination Guidance banner when active */}
          {eliminationMode && (
            <div className="px-3.5 py-2 rounded-md bg-secondary/10 border border-secondary/20 flex items-center justify-between text-xs text-secondary">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Elimination Mode is ACTIVE: Click any choice to strike it through.</span>
              </div>
              <button
                onClick={() => setEliminationMode(false)}
                className="underline hover:text-white font-mono text-[11px]"
              >
                Disable
              </button>
            </div>
          )}

          {/* Answer Choices Deck */}
          <div className="flex flex-col gap-3 pt-2">
            {(['A', 'B', 'C', 'D', 'E'] as const).map(letter => {
              const choiceText = (currentQuestion as any)[`option_${letter.toLowerCase()}`];
              if (!choiceText) return null;

              const isSelected = answers[qnum] === letter;
              const isElim = currentEliminations[letter];

              let cardStyle = 'bg-[#14161D] border-white/[0.08] hover:border-white/[0.18] hover:bg-[#1C202B]';
              if (isSelected) {
                cardStyle = 'bg-[#14161D] border-white text-white ring-1 ring-white/20';
              } else if (isElim) {
                cardStyle = 'bg-[#0D0E12] opacity-40 border-white/[0.04] hover:opacity-60';
              }

              return (
                <div
                  key={letter}
                  id={`option-${letter}`}
                  onClick={() => handleSelectAnswer(letter)}
                  className={`group relative cursor-pointer rounded-lg p-5 transition-all border flex items-start gap-4 ${cardStyle}`}
                >
                  <div
                    className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-medium transition-colors mt-0.5 ${
                      isSelected
                        ? 'border border-white text-black bg-white'
                        : isElim
                        ? 'border border-white/[0.1] text-text-subtle'
                        : 'border border-white/[0.12] text-text-muted group-hover:text-white group-hover:border-white/30'
                    }`}
                  >
                    {letter}
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`text-base font-normal leading-relaxed ${
                          isSelected
                            ? 'text-white font-medium'
                            : isElim
                            ? 'text-text-subtle line-through'
                            : 'text-text-primary'
                        }`}
                      >
                        {choiceText}
                      </span>

                      {isSelected && (
                        <span className="material-symbols-outlined text-white text-[20px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                      )}

                      {isElim && !isSelected && (
                        <span className="text-[11px] font-mono text-text-subtle border border-white/[0.08] px-2 py-0.5 rounded shrink-0">
                          Eliminated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls Deck */}
          <div className="pt-8 mt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#14161D] border border-white/[0.08] text-text-muted hover:text-white hover:border-white/20 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  handleToggleFlag();
                  handleNext();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#14161D] border border-white/[0.08] text-text-muted hover:text-white hover:border-white/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">flag</span>
                <span>Flag &amp; Next</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleNext}
                disabled={currentIndex === totalQuestions - 1}
                className="px-5 py-2 rounded-md bg-white text-black font-semibold hover:bg-[#E2E8F0] transition-colors flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>Save &amp; Next</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 rounded-md bg-[#1C202B] border border-white/[0.12] text-text-muted hover:text-white hover:border-white/30 transition-colors"
              >
                Submit Section
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Status Matrix & Exam Telemetry (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="rounded-xl border border-white/[0.08] bg-[#14161D] p-5 flex flex-col gap-5">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.08]">
              <span className="font-semibold text-white">Exam Overview</span>
              <span className="font-mono text-text-subtle text-[11px]">
                {examType === 'full' ? 'CCA-F 60Q' : '25Q RAPID'}
              </span>
            </div>

            {/* Progress Meter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Progress</span>
                <span className="font-mono text-white">{answeredCount} of {totalQuestions} Answered</span>
              </div>
              <div className="relative w-full h-1.5 bg-[#0D0E12] rounded-full overflow-hidden border border-white/[0.04]">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* 3 Status Wells */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-3 rounded-lg bg-[#0D0E12] border border-white/[0.06] flex flex-col gap-0.5 text-center">
                <span className="font-mono text-base font-semibold text-white">{answeredCount}</span>
                <span className="text-[10px] text-text-subtle uppercase tracking-wider">Answered</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0D0E12] border border-white/[0.06] flex flex-col gap-0.5 text-center">
                <span className="font-mono text-base font-semibold text-amber-300">{flaggedCount}</span>
                <span className="text-[10px] text-text-subtle uppercase tracking-wider">Flagged</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0D0E12] border border-white/[0.06] flex flex-col gap-0.5 text-center">
                <span className="font-mono text-base font-semibold text-text-subtle">{remainingCount}</span>
                <span className="text-[10px] text-text-subtle uppercase tracking-wider">Remaining</span>
              </div>
            </div>

            {/* Benchmark Metrology */}
            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between text-text-muted">
                <span className="font-medium text-white text-[11px] uppercase tracking-wider">Pacing Telemetry</span>
                <span className="font-mono text-text-subtle text-[11px]">{formatTime(secondsLeft)} left</span>
              </div>
              <div className="flex items-center justify-between text-text-subtle py-1">
                <span>Passing Benchmark</span>
                <span className="font-mono text-text-muted">720 / 1000 (70%)</span>
              </div>
              <div className="flex items-center justify-between text-text-subtle py-1">
                <span>Estimated Cadence</span>
                <span className="font-mono text-emerald-300">On Target (+3m)</span>
              </div>
            </div>

            {/* Full Navigator Grid Trigger */}
            <div className="pt-2">
              <button
                onClick={() => setShowGridReviewModal(true)}
                className="w-full py-2 px-3 rounded-md bg-[#1C202B] hover:bg-[#252B3A] text-xs text-text-muted hover:text-white border border-white/[0.08] transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                <span>Review All {totalQuestions} Questions</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Full Question Navigator Grid */}
      {showGridReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl p-6 rounded-xl bg-[#14161D] border border-white/[0.12] shadow-2xl flex flex-col gap-5 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="font-headline text-lg font-semibold text-white">
                  Question Matrix Navigator
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Click any question cell to jump directly to that scenario.
                </p>
              </div>
              <button
                onClick={() => setShowGridReviewModal(false)}
                className="p-1 rounded text-text-muted hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 overflow-y-auto pr-1 max-h-96">
              {examQuestions.map((q, idx) => {
                const isCurrent = currentIndex === idx;
                const isAns = !!answers[q.question_number];
                const isFlg = !!flagged[q.question_number];

                let cellStyle = 'bg-[#0D0E12] border-white/[0.08] text-text-muted hover:text-white hover:border-white/20';
                if (isCurrent) {
                  cellStyle = 'bg-white text-black font-bold border-white';
                } else if (isFlg) {
                  cellStyle = 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold';
                } else if (isAns) {
                  cellStyle = 'bg-white/10 border-white/20 text-white';
                }

                return (
                  <button
                    key={q.question_number}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowGridReviewModal(false);
                    }}
                    className={`h-9 rounded border font-mono text-xs flex items-center justify-center transition-all ${cellStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs">
              <div className="flex items-center gap-4 text-text-muted font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-white/20 border border-white/30" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-500/50" />
                  <span>Flagged</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#0D0E12] border border-white/[0.08]" />
                  <span>Remaining</span>
                </div>
              </div>

              <button
                onClick={() => setShowGridReviewModal(false)}
                className="px-4 py-1.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-[#E2E8F0]"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Submission Confirmation */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-xl bg-[#14161D] border border-white/[0.12] shadow-2xl flex flex-col gap-4">
            <h3 className="font-headline text-lg font-semibold text-white">
              Submit Examination Section?
            </h3>

            {remainingCount > 0 ? (
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] shrink-0">warning</span>
                <div>
                  <span className="font-semibold">You have {remainingCount} unanswered questions.</span>
                  <p className="mt-0.5 text-text-muted">
                    Unanswered questions will be scored as incorrect. Are you ready to finalize and receive your diagnostic score report?
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-muted leading-relaxed">
                All {totalQuestions} scenario questions have been answered. You are ready to generate your official diagnostic audit and performance breakdown.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 mt-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-md bg-[#1C202B] border border-white/[0.08] text-xs font-medium text-text-muted hover:text-white transition-colors"
              >
                Return to Exam
              </button>
              <button
                onClick={handleSubmitExam}
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-white text-black font-semibold text-xs hover:bg-[#E2E8F0] transition-colors"
              >
                {submitting ? 'Auditing & Scoring...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveExamSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            <span className="font-mono text-xs text-text-muted">Initializing Exam Matrix...</span>
          </div>
        </div>
      }
    >
      <LiveExamSessionContent />
    </Suspense>
  );
}
