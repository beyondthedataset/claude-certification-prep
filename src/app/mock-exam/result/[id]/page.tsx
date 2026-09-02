'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QUESTIONS_DATA } from '@/lib/questions-data';
import { ExamAttempt, Question } from '@/lib/types';
import DomainScoreCard from '@/components/DomainScoreCard';
import QuestionCard from '@/components/QuestionCard';
import { formatTime, formatDate } from '@/lib/utils';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, BarChart3, Clock, AlertTriangle } from 'lucide-react';

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterReview, setFilterReview] = useState<'all' | 'wrong' | 'flagged'>('all');

  useEffect(() => {
    fetch(`/api/exams/history?id=${attemptId}`)
      .then(res => res.json())
      .then(data => {
        if (data.attempt) setAttempt(data.attempt);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="font-mono text-xs text-muted-foreground">Calculating Diagnostic Score Report...</span>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="font-headline text-xl font-bold text-foreground">Exam Attempt Not Found</h2>
        <a href="/mock-exam" className="mt-4 inline-block px-4 py-2 rounded-lg technical-gradient text-white text-xs font-bold">
          Return to Mock Exam Hub
        </a>
      </div>
    );
  }

  const passed = attempt.passed;
  const examQuestions = attempt.questionNumbers
    .map(qnum => QUESTIONS_DATA.find(q => q.question_number === qnum))
    .filter(Boolean) as Question[];

  const reviewQuestions = examQuestions.filter(q => {
    const qnum = q.question_number;
    const userAns = attempt.answers[qnum];
    const official = (q.correct_answer || '').toUpperCase().replace(/[^A-Z]/g, '');
    const isCorrect = userAns && official.includes(userAns.toUpperCase());

    if (filterReview === 'wrong') return !isCorrect;
    if (filterReview === 'flagged') return !!attempt.flagged[qnum];
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 w-full flex flex-col gap-8">
      {/* Top Score Banner */}
      <div
        className={`p-8 rounded-2xl border shadow-card border-l-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden ${
          passed
            ? 'bg-emerald-500/10 border-emerald-500/40 border-l-emerald-500'
            : 'bg-rose-500/10 border-rose-500/40 border-l-rose-500'
        }`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${
                passed
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}
            >
              {passed ? '🎉 PASSED — Exam Ready' : '📚 NEEDS REVIEW (Passing is >= 70%)'}
            </span>
            <span className="font-mono text-3xs text-muted-foreground uppercase">
              {formatDate(attempt.completedAt || attempt.startedAt)}
            </span>
          </div>

          <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Score: {attempt.scorePct}% ({attempt.score}/{attempt.totalQuestions})
          </h1>

          <p className="text-xs md:text-sm text-muted-foreground max-w-xl">
            {passed
              ? 'Excellent performance! You met the Anthropic CCA-F certification passing benchmark (>= 70%). Review your domain breakdown below.'
              : 'Keep practicing! Focus on your weakest domains highlighted below and review practitioner discussion explanations.'}
          </p>
        </div>

        {/* Big Score Dial Pill */}
        <div className="flex items-center gap-6 bg-surface-card/80 p-5 rounded-xl border border-border shrink-0">
          <div className="flex flex-col text-center">
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-foreground">
              {formatTime(attempt.timeSpentSeconds)}
            </span>
            <span className="font-mono text-3xs text-muted-foreground uppercase tracking-widest mt-1">
              Time Spent
            </span>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex flex-col text-center">
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-emerald-400">
              {attempt.score}
            </span>
            <span className="font-mono text-3xs text-muted-foreground uppercase tracking-widest mt-1">
              Correct
            </span>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex flex-col text-center">
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-rose-400">
              {attempt.totalQuestions - attempt.score}
            </span>
            <span className="font-mono text-3xs text-muted-foreground uppercase tracking-widest mt-1">
              Incorrect
            </span>
          </div>
        </div>
      </div>

      {/* 5 Domains Diagnostic Score Breakdown */}
      <DomainScoreCard domainScores={attempt.domainScores} />

      {/* Question by Question Review Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-border/40">
          <div>
            <h2 className="font-headline text-xl font-bold text-foreground">
              Detailed Question Review
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Inspect your answers against official solutions, community consensus, and verified technical discussions.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-2xs">
            <button
              onClick={() => setFilterReview('all')}
              className={`px-3 py-1.5 rounded border transition-colors ${
                filterReview === 'all'
                  ? 'bg-surface-high text-foreground font-bold border-border'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              All Items ({examQuestions.length})
            </button>
            <button
              onClick={() => setFilterReview('wrong')}
              className={`px-3 py-1.5 rounded border transition-colors ${
                filterReview === 'wrong'
                  ? 'bg-rose-500/15 text-rose-400 font-bold border-rose-500/40'
                  : 'text-muted-foreground border-transparent hover:text-rose-400'
              }`}
            >
              Incorrect Only ({attempt.totalQuestions - attempt.score})
            </button>
            <button
              onClick={() => setFilterReview('flagged')}
              className={`px-3 py-1.5 rounded border transition-colors ${
                filterReview === 'flagged'
                  ? 'bg-amber-500/15 text-amber-400 font-bold border-amber-500/40'
                  : 'text-muted-foreground border-transparent hover:text-amber-400'
              }`}
            >
              Flagged Only ({Object.keys(attempt.flagged).length})
            </button>
          </div>
        </div>

        {/* Review Cards list */}
        <div className="space-y-6">
          {reviewQuestions.map(question => {
            const qnum = question.question_number;
            const userAns = attempt.answers[qnum];
            const isFlagged = attempt.flagged[qnum];

            return (
              <QuestionCard
                key={qnum}
                question={question}
                mode="review"
                selectedAnswer={userAns}
                isFlagged={isFlagged}
              />
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-center gap-4 pt-6 border-t border-border/40">
        <a
          href="/mock-exam"
          className="px-5 py-2.5 rounded-lg bg-surface-high hover:bg-surface-container border border-border text-xs font-semibold text-foreground transition-colors flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Retake Mock Exam</span>
        </a>
        <a
          href="/dashboard"
          className="px-5 py-2.5 rounded-lg technical-gradient text-white text-xs font-bold shadow-md shadow-orange-600/25 flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span>View Team Dashboard</span>
        </a>
      </div>
    </div>
  );
}
