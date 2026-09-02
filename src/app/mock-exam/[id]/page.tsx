'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QUESTIONS_DATA } from '@/lib/questions-data';
import { Question, DomainKey } from '@/lib/types';
import QuestionCard from '@/components/QuestionCard';
import ExamTimer from '@/components/ExamTimer';
import ExamGridNavigator from '@/components/ExamGridNavigator';
import { ArrowLeft, ArrowRight, Flag, Send, AlertTriangle } from 'lucide-react';

function LiveExamSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examType = (searchParams.get('type') as 'full' | 'quick' | 'domain') || 'quick';
  const domainKey = searchParams.get('domain') as DomainKey | null;

  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Initialize questions
  useEffect(() => {
    let pool = [...QUESTIONS_DATA];
    if (examType === 'domain' && domainKey) {
      pool = pool.filter(q => q.domain === domainKey);
    }

    // Deterministic or randomized shuffle
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count = examType === 'full' ? 60 : examType === 'quick' ? 25 : Math.min(pool.length, 30);
    setExamQuestions(shuffled.slice(0, count));
  }, [examType, domainKey]);

  const totalQuestions = examQuestions.length;
  const currentQuestion = examQuestions[currentIndex];
  const qnum = currentQuestion?.question_number;

  const handleSelectAnswer = (letter: string) => {
    if (!qnum) return;
    setAnswers(prev => ({
      ...prev,
      [qnum]: letter,
    }));
  };

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
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="font-mono text-xs text-muted-foreground">Preparing Mock Exam Session...</span>
        </div>
      </div>
    );
  }

  const durationSeconds = examType === 'full' ? 120 * 60 : 50 * 60;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full flex flex-col gap-6">
      {/* Top Header Bar */}
      <div className="p-4 rounded-xl bg-surface-card border border-border shadow-card flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20">
            {examType === 'full' ? 'Full 60Q Mock' : examType === 'quick' ? 'Quick 25Q Mock' : 'Domain Drill'}
          </span>
          <span className="font-headline text-sm font-bold text-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ExamTimer
            initialSeconds={durationSeconds}
            onTimeUp={handleSubmitExam}
            onTick={(secRemaining) => setTimeSpentSeconds(durationSeconds - secRemaining)}
          />

          <button
            onClick={() => setShowConfirmModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg technical-gradient text-white text-xs font-bold shadow-md shadow-orange-600/20"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Finish &amp; Submit</span>
          </button>
        </div>
      </div>

      {/* Main Exam Content: Question Card + Navigator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Question Card & Controls */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <QuestionCard
            question={currentQuestion}
            mode="exam"
            selectedAnswer={answers[qnum]}
            isFlagged={flagged[qnum]}
            onSelectAnswer={handleSelectAnswer}
          />

          {/* Bottom Exam Navigation Bar */}
          <div className="p-4 rounded-xl bg-surface-card border border-border flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={handleToggleFlag}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                flagged[qnum]
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                  : 'bg-surface-high text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              <Flag className={`h-3.5 w-3.5 ${flagged[qnum] ? 'fill-amber-400' : ''}`} />
              <span>{flagged[qnum] ? 'Flagged for Review' : 'Flag Question'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-high hover:bg-surface-container border border-border text-xs font-semibold text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === totalQuestions - 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg technical-gradient text-white text-xs font-bold shadow-md shadow-orange-600/20 disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>Next</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Grid Navigator */}
        <div className="flex flex-col gap-4">
          <ExamGridNavigator
            questionNumbers={examQuestions.map(q => q.question_number)}
            currentIndex={currentIndex}
            answers={answers}
            flagged={flagged}
            onSelectIndex={(idx) => setCurrentIndex(idx)}
          />

          <div className="p-4 rounded-xl bg-surface-card border border-border text-2xs text-muted-foreground space-y-2">
            <span className="font-mono uppercase tracking-wider font-bold text-foreground block">
              Exam Instructions
            </span>
            <p>• You can jump to any question using the navigator grid above.</p>
            <p>• Use "Flag Question" to mark difficult items and review before submitting.</p>
            <p>• When time expires, your exam will automatically submit for grading.</p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-surface-card border border-border shadow-2xl flex flex-col gap-4 animate-fadeIn">
            <h3 className="font-headline text-lg font-bold text-foreground">
              Submit Mock Exam?
            </h3>

            {unansweredCount > 0 ? (
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">You have {unansweredCount} unanswered questions.</span>
                  <p className="mt-0.5 text-muted-foreground">
                    Unanswered questions will be scored as incorrect. Are you sure you want to finish?
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                All {totalQuestions} questions have been answered. Ready to view your score and 5-domain performance breakdown?
              </p>
            )}

            <div className="flex items-center justify-end gap-3 mt-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-high border border-border text-xs font-semibold text-foreground hover:bg-surface-container"
              >
                Return to Exam
              </button>
              <button
                onClick={handleSubmitExam}
                disabled={submitting}
                className="px-4 py-2 rounded-lg technical-gradient text-white text-xs font-bold shadow-md shadow-orange-600/25"
              >
                {submitting ? 'Scoring Exam...' : 'Confirm Submission'}
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
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="font-mono text-xs text-muted-foreground">Initializing Exam Session...</span>
          </div>
        </div>
      }
    >
      <LiveExamSessionContent />
    </Suspense>
  );
}
