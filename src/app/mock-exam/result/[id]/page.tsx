'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QUESTIONS_DATA, DOMAIN_MAP } from '@/lib/questions-data';
import { ExamAttempt, Question, DomainKey } from '@/lib/types';
import DomainScoreCard from '@/components/DomainScoreCard';
import { formatTime, formatDate } from '@/lib/utils';

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterReview, setFilterReview] = useState<'all' | 'wrong' | 'flagged'>('wrong');
  const [selectedReviewIdx, setSelectedReviewIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [savedToDeck, setSavedToDeck] = useState(false);

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
          <div className="w-8 h-8 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          <span className="font-mono text-xs text-text-muted">Computing Diagnostic Audit Report...</span>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="font-headline text-xl font-semibold text-white">Exam Attempt Not Found</h2>
        <a href="/mock-exam" className="mt-4 inline-block px-4 py-2 rounded-md bg-white text-black text-xs font-semibold">
          Return to Mock Exam Hub
        </a>
      </div>
    );
  }

  const passed = attempt.passed;
  const examQuestions = attempt.questionNumbers
    .map(qnum => QUESTIONS_DATA.find(q => q.question_number === qnum))
    .filter(Boolean) as Question[];

  const scoredQuestions = examQuestions.map(q => {
    const qnum = q.question_number;
    const userAns = (attempt.answers[qnum] || '').toUpperCase();
    const official = (q.correct_answer || '').toUpperCase().replace(/[^A-Z]/g, '');
    const isCorrect = userAns && official.includes(userAns);
    const isFlagged = !!attempt.flagged[qnum];
    return { question: q, userAns, official, isCorrect, isFlagged };
  });

  const missedQuestions = scoredQuestions.filter(sq => !sq.isCorrect);
  const flaggedQuestions = scoredQuestions.filter(sq => sq.isFlagged);

  const displayList = filterReview === 'wrong'
    ? (missedQuestions.length > 0 ? missedQuestions : scoredQuestions)
    : filterReview === 'flagged'
    ? (flaggedQuestions.length > 0 ? flaggedQuestions : scoredQuestions)
    : scoredQuestions;

  const currentItem = displayList[selectedReviewIdx] || displayList[0] || scoredQuestions[0];
  const currQ = currentItem?.question;
  const currDomain = currQ ? DOMAIN_MAP[currQ.domain as DomainKey] : null;

  return (
    <div className="w-full min-h-screen bg-[#0D0E12] text-text-primary pb-24">
      {/* Editorial Audit Header */}
      <div className="border-b border-white/[0.08] bg-[#14161D]/70 py-6 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider text-text-subtle uppercase">
              <span className="text-secondary">{attempt.examType === 'full' ? '60Q FULL EXAM' : '25Q RAPID ASSESSMENT'}</span>
              <span>/</span>
              <span>Diagnostic Review</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.08] text-white font-medium text-[10px] ml-2">
                {missedQuestions.length} Missed Questions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-headline font-semibold tracking-tight text-white">
              Diagnostic Audit &amp; Explanations
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-[13px] text-text-muted font-mono bg-[#0D0E12] px-3.5 py-1.5 rounded-lg border border-white/[0.08]">
              <span className="text-white font-semibold">Score: {attempt.scorePct}%</span>
              <span className="text-white/20">•</span>
              <span className={passed ? 'text-emerald-300 font-medium' : 'text-rose-400 font-medium'}>
                {attempt.score} / {attempt.totalQuestions} ({passed ? 'PASSED' : 'NEEDS PRACTICE'})
              </span>
              <span className="text-white/20">•</span>
              <span className="text-text-subtle">{formatTime(attempt.timeSpentSeconds)}</span>
            </div>

            <button
              onClick={() => {
                setFilterReview(prev => (prev === 'wrong' ? 'all' : 'wrong'));
                setSelectedReviewIdx(0);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                filterReview === 'wrong'
                  ? 'bg-white text-black border-white'
                  : 'bg-[#14161D] text-text-muted border-white/[0.08] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">filter_list</span>
              <span>Missed Only ({missedQuestions.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Question Slider Strip */}
      <div className="border-b border-white/[0.06] bg-[#0D0E12] py-2.5">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-text-subtle uppercase tracking-wider text-[10px] mr-2 shrink-0">
              {filterReview === 'wrong' ? 'Missed Queue:' : 'Question Queue:'}
            </span>
            {displayList.map((item, idx) => {
              const isSelected = selectedReviewIdx === idx;
              const isWrong = !item.isCorrect;

              let pillStyle = 'text-text-muted hover:bg-[#14161D]';
              if (isSelected) {
                pillStyle = isWrong
                  ? 'bg-[#1C202B] border border-rose-400/60 text-rose-300 font-semibold'
                  : 'bg-white text-black font-semibold';
              } else if (isWrong) {
                pillStyle = 'text-rose-400/80 hover:bg-[#14161D]';
              }

              return (
                <button
                  key={item.question.question_number}
                  onClick={() => {
                    setSelectedReviewIdx(idx);
                    setFlashcardFlipped(false);
                    setSavedToDeck(false);
                  }}
                  className={`w-7 h-7 rounded text-xs shrink-0 transition-all ${pillStyle}`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-text-muted shrink-0 pl-4">
            <span className="text-xs">
              Item {selectedReviewIdx + 1} of {displayList.length}
            </span>
            {selectedReviewIdx < displayList.length - 1 && (
              <button
                onClick={() => {
                  setSelectedReviewIdx(prev => prev + 1);
                  setFlashcardFlipped(false);
                  setSavedToDeck(false);
                }}
                className="px-2.5 py-1 rounded bg-[#14161D] hover:bg-[#1C202B] text-white text-[11px] flex items-center gap-1 border border-white/[0.08] transition-colors"
              >
                <span>Next Item</span>
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Editorial Canvas */}
      <div className="max-w-[1280px] mx-auto px-6 pt-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left 8 Cols: Stem, Rationale, Topology, Flashcard */}
        <div className="xl:col-span-8 flex flex-col gap-6 min-w-0">
          {/* Question Stem & Choices */}
          <article className="bg-[#14161D] rounded-xl border border-white/[0.08] p-7 sm:p-8 space-y-6">
            <header className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-white text-black font-semibold">
                  QUESTION {currQ?.question_number}
                </span>
                <span className="text-secondary uppercase">{currDomain?.code || 'DOMAIN'}</span>
                <span>•</span>
                <span className="text-text-muted uppercase">{currDomain?.name}</span>
              </div>
              {currentItem?.isFlagged && (
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-mono">
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  <span>Flagged in Exam</span>
                </div>
              )}
            </header>

            {/* Question Text */}
            <div className="py-2">
              <h2 className="text-[20px] sm:text-[22px] leading-[1.6] text-white font-normal font-sans whitespace-pre-line">
                {currQ?.question_text}
              </h2>
            </div>

            {/* User Selection vs Solution Callout Banner */}
            <div className="py-3 px-4 rounded-lg bg-[#0D0E12] border border-white/[0.08] flex items-center justify-between text-xs sm:text-[13px]">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${currentItem?.isCorrect ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                <span className="text-text-muted leading-relaxed">
                  {currentItem?.isCorrect ? (
                    <>You selected <span className="font-mono font-semibold text-emerald-300">Option {currentItem.userAns} (Correct)</span>.</>
                  ) : (
                    <>You picked <span className="font-mono font-semibold text-rose-300">Option {currentItem.userAns || 'None'} (Incorrect)</span>. The recommended solution is <span className="font-mono font-semibold text-emerald-300">Option {currentItem.official}</span>.</>
                  )}
                </span>
              </div>
            </div>

            {/* Answer Choices Audit */}
            <div className="space-y-3 pt-2">
              {(['A', 'B', 'C', 'D', 'E'] as const).map(letter => {
                const choiceText = (currQ as any)?.[`option_${letter.toLowerCase()}`];
                if (!choiceText) return null;

                const isUserChoice = currentItem.userAns === letter;
                const isOfficialCorrect = currentItem.official.includes(letter);

                let cardBorder = 'border-white/[0.06] bg-[#0D0E12]/50 opacity-60';
                let badge = null;

                if (isOfficialCorrect) {
                  cardBorder = 'border-emerald-400/50 bg-[#0D0E12] opacity-100';
                  badge = (
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-300 font-medium">
                      <span>✓ Correct Answer — Recommended Solution</span>
                    </div>
                  );
                } else if (isUserChoice && !isOfficialCorrect) {
                  cardBorder = 'border-rose-400/50 bg-[#0D0E12] opacity-100';
                  badge = (
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-rose-300 font-medium">
                      <span>✕ Your Selection — Suboptimal / Incorrect</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={letter}
                    className={`p-4 rounded-lg border flex items-start gap-4 transition-all ${cardBorder}`}
                  >
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-medium shrink-0 mt-0.5 ${
                        isOfficialCorrect
                          ? 'border border-emerald-400/60 bg-emerald-500/10 text-emerald-300 font-bold'
                          : isUserChoice
                          ? 'border border-rose-400/60 bg-rose-500/10 text-rose-300 font-bold'
                          : 'border border-white/[0.1] text-text-subtle'
                      }`}
                    >
                      {letter}
                    </span>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm leading-relaxed text-text-primary">
                        {choiceText}
                      </p>
                      {badge}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Minimalist Architectural Topology Diagram */}
          <article className="bg-[#14161D] rounded-xl border border-white/[0.08] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <span className="material-symbols-outlined text-[17px] text-secondary">account_tree</span>
                <span>Architectural Pattern Topology</span>
              </div>
              <span className="text-[11px] font-mono text-text-subtle uppercase">
                {currDomain?.code || 'SYSTEM DESIGN'}
              </span>
            </div>

            <div className="w-full rounded-lg border border-white/[0.06] bg-[#0D0E12] p-6 flex flex-col items-center justify-center">
              <svg className="w-full h-auto max-h-52" fill="none" viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M170 55 L285 95" stroke="#4b5563" strokeDasharray="3 3" strokeWidth="1" />
                <path d="M170 145 L285 110" stroke="#4b5563" strokeDasharray="3 3" strokeWidth="1" />
                <path d="M415 95 L530 55" stroke="#4b5563" strokeDasharray="3 3" strokeWidth="1" />
                <path d="M415 110 L530 145" stroke="#4b5563" strokeDasharray="3 3" strokeWidth="1" />
                
                {/* Central Orchestrator / Hub */}
                <rect fill="#1C202B" height="75" rx="4" stroke="#474d5c" strokeWidth="1" width="130" x="285" y="65" />
                <text fill="#FFFFFF" fontFamily="Geist, sans-serif" fontSize="11" fontWeight="600" letterSpacing="0.02em" textAnchor="middle" x="350" y="98">
                  CORE HUB / ROUTER
                </text>
                <text fill="#7BD0FF" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="350" y="116">
                  Transitive Any-to-Any
                </text>

                {/* Node 1 */}
                <rect fill="#14161D" height="55" rx="4" stroke="#2e313d" strokeWidth="1" width="120" x="50" y="28" />
                <text fill="#E2E4E9" fontFamily="Geist, sans-serif" fontSize="11" fontWeight="500" textAnchor="middle" x="110" y="54">
                  Ingress Tier
                </text>
                <text fill="#8E95A5" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="110" y="70">
                  Spoke Node A
                </text>

                {/* Node 2 */}
                <rect fill="#14161D" height="55" rx="4" stroke="#2e313d" strokeWidth="1" width="120" x="50" y="118" />
                <text fill="#E2E4E9" fontFamily="Geist, sans-serif" fontSize="11" fontWeight="500" textAnchor="middle" x="110" y="144">
                  Compute Cluster
                </text>
                <text fill="#8E95A5" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="110" y="160">
                  Spoke Node B
                </text>

                {/* Node 3 */}
                <rect fill="#14161D" height="55" rx="4" stroke="#2e313d" strokeWidth="1" width="130" x="530" y="28" />
                <text fill="#E2E4E9" fontFamily="Geist, sans-serif" fontSize="11" fontWeight="500" textAnchor="middle" x="595" y="52">
                  Shared Services
                </text>
                <text fill="#8E95A5" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="595" y="68">
                  Security / Identity
                </text>

                {/* Node 4 */}
                <rect fill="#14161D" height="55" rx="4" stroke="#2e313d" strokeWidth="1" width="130" x="530" y="118" />
                <text fill="#E2E4E9" fontFamily="Geist, sans-serif" fontSize="11" fontWeight="500" textAnchor="middle" x="595" y="142">
                  Database Tier
                </text>
                <text fill="#8E95A5" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle" x="595" y="158">
                  High-Availability
                </text>
              </svg>

              <div className="w-full flex items-center justify-between pt-3 text-[11px] font-mono text-text-subtle border-t border-white/[0.06] mt-2">
                <span>Figure {currQ?.question_number}.1: Scalable Architectural Blueprint</span>
                <span className="text-emerald-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Verified Well-Architected Pattern
                </span>
              </div>
            </div>
          </article>

          {/* Deep Solution Rationale Breakdown */}
          <article className="bg-[#14161D] rounded-xl border border-white/[0.08] p-7 sm:p-8 space-y-6">
            <header className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
              <span className="material-symbols-outlined text-secondary text-[22px]">auto_stories</span>
              <div>
                <h3 className="text-base font-semibold text-white">Comprehensive Technical Solution Rationale</h3>
                <p className="text-xs text-text-muted font-mono">Architecture Framework • Trade-Off &amp; Failure Mode Audit</p>
              </div>
            </header>

            <section className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">check_circle</span>
                  Why Option {currentItem.official} is the Recommended Solution
                </h4>
                <p className="text-sm leading-relaxed text-text-muted font-sans">
                  {currQ?.overall_explanation ||
                    `Option ${currentItem.official} directly satisfies all performance and scalability constraints. In high-availability architectures, consolidating traffic through a unified data plane prevents exponential connection overhead while ensuring automated failover and telemetry logging.`}
                </p>
              </div>

              {currQ?.overall_explanation && (
                <div className="p-4 rounded-lg bg-[#0D0E12] border border-white/[0.06] space-y-2 text-xs">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Official Technical Deep Dive
                  </span>
                  <p className="text-text-muted leading-relaxed whitespace-pre-line">
                    {currQ.overall_explanation}
                  </p>
                </div>
              )}

              {/* Trade-Off Complexity Callout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-lg bg-[#0D0E12] border border-white/[0.06] text-xs">
                  <span className="font-mono text-[10px] text-text-subtle uppercase block mb-1">
                    Operational Overhead
                  </span>
                  <p className="text-text-muted leading-relaxed">
                    Zero manual routing tables required; centralized policy enforcement across all member partitions.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#0D0E12] border border-white/[0.06] text-xs">
                  <span className="font-mono text-[10px] text-text-subtle uppercase block mb-1">
                    Failure Resiliency
                  </span>
                  <p className="text-text-muted leading-relaxed">
                    Multi-AZ redundant endpoints eliminate single point of failure (SPOF) risks in enterprise tiers.
                  </p>
                </div>
              </div>
            </section>
          </article>

          {/* Interactive Active Recall Flashcard */}
          <article className="bg-[#14161D] rounded-xl border border-white/[0.08] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <span className="material-symbols-outlined text-[17px] text-secondary">style</span>
                <span>Active Recall Key Takeaway</span>
              </div>
              <span className="text-[11px] font-mono text-text-subtle">CARD #{currQ?.question_number}</span>
            </div>

            <div
              onClick={() => setFlashcardFlipped(prev => !prev)}
              className="cursor-pointer group"
            >
              <div className="p-6 rounded-lg border border-white/[0.08] bg-[#0D0E12] hover:border-white/20 transition-all">
                <div className="flex items-center justify-between text-[11px] font-mono text-text-subtle mb-2">
                  <span className="text-secondary uppercase">{currDomain?.code || 'BLUEPRINT KEY'}</span>
                  <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                    <span>{flashcardFlipped ? 'Click to show question' : 'Click to reveal core takeaway'}</span>
                  </span>
                </div>

                <div className="py-2">
                  {flashcardFlipped ? (
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold text-emerald-300">
                        Takeaway: Option {currentItem.official}
                      </h4>
                      <p className="text-xs text-text-muted leading-relaxed">
                        Whenever an architectural question asks for the most cost-effective and scalable approach for {currDomain?.name || 'this workload'}, prefer managed decoupled routing over point-to-point mesh architectures.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h4 className="text-base font-medium text-white">
                        {currDomain?.name || 'Architectural Strategy'}: Core Evaluation Rule
                      </h4>
                      <p className="text-xs text-text-muted">
                        How should you differentiate the winning option under high concurrency?
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-[11px] font-mono text-text-subtle mt-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#14161D]">#HighYield</span>
                    <span className="px-2 py-0.5 rounded bg-[#14161D]">#ArchitectExam</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSavedToDeck(true);
                    }}
                    className="flex items-center gap-1 text-white hover:text-secondary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {savedToDeck ? 'bookmark_added' : 'bookmark_add'}
                    </span>
                    <span>{savedToDeck ? 'Saved in Active Deck' : 'Add to Active Deck'}</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Right 4 Cols: Domain Breakdown & Navigation Controls */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Domain Breakdown */}
          <DomainScoreCard domainScores={attempt.domainScores} />

          {/* Quick Actions Card */}
          <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.08] flex flex-col gap-4">
            <h4 className="font-headline text-sm font-semibold text-white">
              Next Study Recommendation
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Based on this diagnostic attempt, we recommend focusing on your weakest domains to reach the 80%+ readiness threshold.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href="/mock-exam"
                className="w-full py-2.5 px-4 rounded-md bg-white text-black font-semibold text-xs text-center hover:bg-[#E2E8F0] transition-colors"
              >
                Take Another Mock Exam
              </a>
              <a
                href="/learn"
                className="w-full py-2.5 px-4 rounded-md bg-[#0D0E12] text-text-muted hover:text-white border border-white/[0.08] font-medium text-xs text-center transition-colors"
              >
                Browse Certification Catalog
              </a>
              <a
                href="/dashboard"
                className="w-full py-2 px-4 rounded-md text-text-subtle hover:text-white text-xs text-center transition-colors font-mono"
              >
                View Analytics &amp; Telemetry
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
