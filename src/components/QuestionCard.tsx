'use client';

import { useState } from 'react';
import { Question, DomainKey } from '@/lib/types';
import { DOMAIN_MAP } from '@/lib/questions-data';
import VoteDistributionBar from './VoteDistributionBar';
import DiscussionThread from './DiscussionThread';
import { Star, Eye, EyeOff, AlertTriangle, CheckCircle2, RotateCcw, ExternalLink, Sparkles, MessageSquare, Compass } from 'lucide-react';

interface Props {
  question: Question;
  mode?: 'study' | 'exam' | 'review';
  selectedAnswer?: string;
  isFlagged?: boolean;
  isStarred?: boolean;
  onSelectAnswer?: (letter: string) => void;
  onToggleFlag?: () => void;
  onToggleStar?: () => void;
  onReset?: () => void;
}

export default function QuestionCard({
  question,
  mode = 'study',
  selectedAnswer,
  isFlagged = false,
  isStarred = false,
  onSelectAnswer,
  onToggleFlag,
  onToggleStar,
  onReset,
}: Props) {
  const [revealed, setRevealed] = useState(mode === 'review' || (mode === 'study' && !!selectedAnswer));
  const domainInfo = DOMAIN_MAP[question.domain as DomainKey];
  const official = (question.correct_answer || '').toUpperCase();
  const community = question.most_voted_answer || official;
  const isControversial = question.is_controversial;
  const isCertSafari = question.source === 'certsafari';

  const handleChoiceClick = (letter: string) => {
    if (mode === 'review') return;
    if (onSelectAnswer) onSelectAnswer(letter);
    if (mode === 'study') setRevealed(true);
  };

  const isUserCorrect = selectedAnswer ? official.includes(selectedAnswer.toUpperCase()) : false;

  return (
    <div
      id={`q-${question.question_number}`}
      className={`relative p-5 md:p-6 rounded-xl bg-card border transition-all duration-200 shadow-sm ${
        isFlagged
          ? 'border-amber-500/60 ring-1 ring-amber-500/20'
          : isStarred
          ? 'border-amber-500/40'
          : 'border-border hover:border-border/80'
      } border-l-4 ${
        isCertSafari ? 'border-l-amber-500' : isControversial ? 'border-l-rose-500' : 'border-l-primary'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-border/40 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-gradient-to-r from-primary to-orange-600 text-white shadow-sm">
            Question #{question.question_number}
          </span>

          {/* Question Bank Badge */}
          {isCertSafari ? (
            <span className="font-mono text-3xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 font-semibold">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" /> CertSafari Verified
            </span>
          ) : (
            <span className="font-mono text-3xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-semibold">
              <MessageSquare className="w-2.5 h-2.5 text-emerald-500" /> ExamTopics Community
            </span>
          )}

          {domainInfo && (
            <span className="font-mono text-3xs uppercase tracking-widest px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
              {domainInfo.code} · {domainInfo.name}
            </span>
          )}

          {/* Subdomain Tag */}
          {question.subdomain && (
            <span 
              className="font-mono text-3xs px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 max-w-[260px] truncate"
              title={question.subdomain}
            >
              <Compass className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{question.subdomain}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onToggleStar && (
            <button
              onClick={onToggleStar}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-2xs font-mono font-medium transition-colors border ${
                isStarred
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'text-muted-foreground border-border hover:text-amber-400'
              }`}
              title="Bookmark for review"
            >
              <Star className={`h-3 w-3 ${isStarred ? 'fill-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isStarred ? 'Starred' : 'Star'}</span>
            </button>
          )}

          {isControversial && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-3xs uppercase tracking-wider font-semibold">
              <AlertTriangle className="h-2.5 w-2.5" />
              Disputed ({community})
            </span>
          )}

          {question.comments_count > 0 && (
            <span className="font-mono text-3xs uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              💬 {question.comments_count}
            </span>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="my-4 text-sm md:text-base leading-relaxed text-foreground whitespace-pre-line font-normal">
        {question.question_text}
      </div>

      {/* Exhibits / Diagrams */}
      {question.images && question.images.length > 0 && (
        <div className="my-4 space-y-3">
          {question.images.map((img, i) => (
            <div key={i} className="p-2 rounded-lg bg-white border border-border overflow-hidden">
              <img
                src={img}
                alt={`Exhibit for Question ${question.question_number}`}
                className="max-w-full h-auto mx-auto"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Choices list */}
      <div className="space-y-2.5 my-4">
        {question.choices && question.choices.length > 0 ? (
          question.choices.map((choice) => {
            const letter = (choice.letter || '').trim().toUpperCase();
            const isSelected = selectedAnswer === letter;
            const isChoiceOfficial = choice.is_correct;

            let rowClass = 'bg-muted/30 border-border hover:bg-muted/60 hover:border-primary/40';
            let badgeHTML = null;

            if (mode === 'exam') {
              if (isSelected) {
                rowClass = 'bg-primary/10 border-primary text-primary font-semibold ring-1 ring-primary/30';
              }
            } else if (revealed || mode === 'review') {
              if (isChoiceOfficial) {
                rowClass = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500/30';
                badgeHTML = (
                  <span className="ml-auto font-mono text-3xs px-2 py-0.5 rounded bg-emerald-500 text-white font-bold uppercase tracking-wider">
                    Correct Answer
                  </span>
                );
              }
              if (isSelected) {
                if (isUserCorrect) {
                  rowClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/50';
                } else {
                  rowClass = 'bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-200 font-semibold ring-2 ring-rose-500/50';
                  badgeHTML = (
                    <span className="ml-auto font-mono text-3xs px-2 py-0.5 rounded bg-rose-500 text-white font-bold uppercase tracking-wider">
                      Your Pick (Incorrect)
                    </span>
                  );
                }
              }
            } else if (isSelected) {
              rowClass = 'bg-primary/10 border-primary text-primary font-semibold';
            }

            return (
              <div
                key={letter}
                onClick={() => handleChoiceClick(letter)}
                className={`flex flex-col p-3.5 rounded-lg border transition-all cursor-pointer select-none ${rowClass}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-primary text-white'
                        : isChoiceOfficial && (revealed || mode === 'review')
                        ? 'bg-emerald-500 text-white'
                        : 'bg-card border border-border text-muted-foreground'
                    }`}
                  >
                    {letter || '•'}
                  </div>
                  <div className="text-xs md:text-sm leading-snug flex-1 pt-0.5">
                    {choice.text}
                  </div>
                  {badgeHTML}
                </div>

                {/* Per-option Rationale Explanation (CertSafari format) */}
                {(revealed || mode === 'review') && choice.explanation && (
                  <div className={`mt-2.5 pt-2 text-xs border-t pl-9 ${
                    choice.is_correct
                      ? 'border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                      : 'border-border/50 text-muted-foreground'
                  }`}>
                    <span className="font-semibold">{choice.is_correct ? '✓ Why this is correct: ' : '✗ Why this is incorrect: '}</span>
                    {choice.explanation}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-3.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 text-xs text-muted-foreground">
            <em>📌 Drag & Drop / Case Study Interaction — Refer to the exhibit diagram above.</em>
          </div>
        )}
      </div>

      {/* Answer & Explanation Section (Study / Review mode) */}
      {mode !== 'exam' && revealed && (
        <div className="mt-5 pt-4 border-t border-border/60 flex flex-col gap-3.5 animate-fadeIn">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {question.correct_answer ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Verified Answer: {official}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-muted border border-border text-muted-foreground font-mono text-xs">
                  Case Study Interaction
                </div>
              )}

              {isControversial && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 font-mono text-xs font-semibold">
                  👥 Community Pick: {community}
                </div>
              )}
            </div>

            {selectedAnswer && (
              <span
                className={`font-mono text-xs font-bold ${
                  isUserCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {isUserCorrect ? '✓ Correct Choice' : '✗ Incorrect Choice'}
              </span>
            )}
          </div>

          {/* Architectural Rationale (Overall explanation if available) */}
          {question.overall_explanation && (
            <div className="p-3.5 rounded-lg bg-muted/40 border border-border text-xs sm:text-sm text-foreground leading-relaxed">
              <div className="font-semibold text-xs text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Architectural Analysis & Key Concept
              </div>
              <p>{question.overall_explanation}</p>
            </div>
          )}

          {/* Vote distribution bar (ExamTopics questions) */}
          {question.voted_stats && question.voted_stats.length > 0 && (
            <VoteDistributionBar stats={question.voted_stats} />
          )}

          {/* Practitioner Discussions (ExamTopics questions) */}
          {question.discussions && question.discussions.length > 0 && (
            <DiscussionThread
              comments={question.discussions}
              questionNumber={question.question_number}
            />
          )}
        </div>
      )}

      {/* Card Actions Footer */}
      {mode === 'study' && (
        <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between flex-wrap gap-2 text-2xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevealed(!revealed)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted hover:bg-muted/80 border border-border text-foreground font-medium transition-colors"
            >
              {revealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              <span>{revealed ? 'Hide Explanation' : 'Reveal Answer & Rationales'}</span>
            </button>

            {selectedAnswer && onReset && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-muted-foreground hover:text-foreground border border-border/50 hover:bg-muted transition-colors"
                title="Reset this question attempt"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            )}
          </div>

          {question.discussion_url && (
            <a
              href={question.discussion_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              <span>ExamTopics Discussion</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
