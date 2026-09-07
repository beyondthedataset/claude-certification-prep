'use client';

import { useState } from 'react';
import { Question, DomainKey } from '@/lib/types';
import { DOMAIN_MAP } from '@/lib/questions-data';
import VoteDistributionBar from './VoteDistributionBar';
import DiscussionThread from './DiscussionThread';

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
      className={`relative p-6 rounded-xl bg-[#14161D] border transition-all duration-200 shadow-sm ${
        isFlagged
          ? 'border-amber-400/60 ring-1 ring-amber-400/20'
          : isStarred
          ? 'border-amber-400/40'
          : 'border-white/[0.08] hover:border-white/[0.16]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08] flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-white text-black">
            Q#{question.question_number}
          </span>

          {/* Question Bank Badge */}
          {isCertSafari ? (
            <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0D0E12] text-amber-300 border border-amber-400/20 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[13px] text-amber-400">verified</span> CertSafari
            </span>
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0D0E12] text-secondary border border-secondary/20 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[13px] text-secondary">forum</span> ExamTopics
            </span>
          )}

          {domainInfo && (
            <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0D0E12] text-text-muted border border-white/[0.06]">
              {domainInfo.code} · {domainInfo.name}
            </span>
          )}

          {/* Subdomain Tag */}
          {question.subdomain && (
            <span 
              className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#0D0E12] text-text-subtle border border-white/[0.06] flex items-center gap-1 max-w-[260px] truncate"
              title={question.subdomain}
            >
              <span className="material-symbols-outlined text-[12px]">explore</span>
              <span className="truncate">{question.subdomain}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onToggleStar && (
            <button
              onClick={onToggleStar}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono font-medium transition-colors border ${
                isStarred
                  ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                  : 'text-text-subtle border-white/[0.08] hover:text-white hover:border-white/20'
              }`}
              title="Bookmark for review"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isStarred ? 'star' : 'star_border'}
              </span>
              <span className="hidden sm:inline">{isStarred ? 'Starred' : 'Star'}</span>
            </button>
          )}

          {isControversial && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 font-mono text-[11px] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[13px]">warning</span>
              Disputed ({community})
            </span>
          )}

          {question.comments_count > 0 && (
            <span className="font-mono text-[11px] tracking-wider px-2 py-0.5 rounded bg-[#0D0E12] text-text-muted border border-white/[0.06]">
              💬 {question.comments_count}
            </span>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="my-4 text-base sm:text-[17px] leading-relaxed text-white whitespace-pre-line font-sans font-normal">
        {question.question_text}
      </div>

      {/* Exhibits / Diagrams */}
      {question.images && question.images.length > 0 && (
        <div className="my-4 space-y-3">
          {question.images.map((img, i) => (
            <div key={i} className="p-3 rounded-lg bg-[#0D0E12] border border-white/[0.08] overflow-hidden">
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

            let rowClass = 'bg-[#0D0E12] border-white/[0.06] hover:border-white/20 text-text-primary';
            let badgeHTML = null;

            if (mode === 'exam') {
              if (isSelected) {
                rowClass = 'bg-[#14161D] border-white text-white font-medium ring-1 ring-white/20';
              }
            } else if (revealed || mode === 'review') {
              if (isChoiceOfficial) {
                rowClass = 'bg-[#0D0E12] border-emerald-400/50 text-emerald-200 font-medium';
                badgeHTML = (
                  <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold uppercase tracking-wider">
                    Correct Answer
                  </span>
                );
              }
              if (isSelected) {
                if (isUserCorrect) {
                  rowClass = 'bg-[#0D0E12] border-emerald-400 text-white font-semibold ring-1 ring-emerald-400/40';
                } else {
                  rowClass = 'bg-[#0D0E12] border-rose-400/60 text-white font-semibold ring-1 ring-rose-400/30';
                  badgeHTML = (
                    <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold uppercase tracking-wider">
                      Your Pick (Incorrect)
                    </span>
                  );
                }
              }
            } else if (isSelected) {
              rowClass = 'bg-[#14161D] border-white text-white font-medium';
            }

            return (
              <div
                key={letter}
                onClick={() => handleChoiceClick(letter)}
                className={`flex flex-col p-3.5 rounded-lg border transition-all cursor-pointer select-none ${rowClass}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-semibold shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-white text-black'
                        : isChoiceOfficial && (revealed || mode === 'review')
                        ? 'bg-emerald-400 text-black'
                        : 'bg-[#1C202B] border border-white/[0.08] text-text-muted'
                    }`}
                  >
                    {letter || '•'}
                  </div>
                  <div className="text-sm leading-relaxed flex-1 pt-0.5 font-sans">
                    {choice.text}
                  </div>
                  {badgeHTML}
                </div>

                {/* Per-option Rationale Explanation (CertSafari format) */}
                {(revealed || mode === 'review') && choice.explanation && (
                  <div className={`mt-2.5 pt-2 text-xs border-t pl-9 leading-relaxed ${
                    choice.is_correct
                      ? 'border-emerald-500/20 text-emerald-300'
                      : 'border-white/[0.06] text-text-muted'
                  }`}>
                    <span className="font-semibold">{choice.is_correct ? '✓ Why this is correct: ' : '✗ Why this is incorrect: '}</span>
                    {choice.explanation}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-3.5 rounded-lg border border-dashed border-white/[0.12] bg-[#0D0E12] text-xs text-text-muted">
            <em>📌 Drag &amp; Drop / Case Study Interaction — Refer to exhibit diagram above.</em>
          </div>
        )}
      </div>

      {/* Answer & Explanation Section (Study / Review mode) */}
      {mode !== 'exam' && revealed && (
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col gap-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {question.correct_answer ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span>Verified Answer: {official}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0D0E12] border border-white/[0.08] text-text-muted font-mono text-xs">
                  Case Study Interaction
                </div>
              )}

              {isControversial && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary/10 border border-secondary/20 text-secondary font-mono text-xs font-medium">
                  👥 Community Consensus: {community}
                </div>
              )}
            </div>

            {selectedAnswer && (
              <span
                className={`font-mono text-xs font-semibold ${
                  isUserCorrect ? 'text-emerald-300' : 'text-rose-400'
                }`}
              >
                {isUserCorrect ? '✓ Correct Choice' : '✗ Incorrect Choice'}
              </span>
            )}
          </div>

          {/* Architectural Rationale */}
          {question.overall_explanation && (
            <div className="p-4 rounded-lg bg-[#0D0E12] border border-white/[0.06] text-xs sm:text-sm text-text-primary leading-relaxed space-y-1">
              <div className="font-semibold text-xs text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">auto_stories</span>
                <span>Architectural Analysis &amp; Key Takeaway</span>
              </div>
              <p className="text-text-muted pt-1">{question.overall_explanation}</p>
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
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevealed(!revealed)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1C202B] hover:bg-white hover:text-black border border-white/[0.08] text-white text-xs font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">
                {revealed ? 'visibility_off' : 'visibility'}
              </span>
              <span>{revealed ? 'Hide Explanation' : 'Reveal Answer & Rationales'}</span>
            </button>

            {selectedAnswer && onReset && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-text-muted hover:text-white border border-white/[0.08] hover:bg-[#1C202B] text-xs transition-colors"
                title="Reset this question attempt"
              >
                <span className="material-symbols-outlined text-[14px]">rotate_left</span>
                <span>Retry</span>
              </button>
            )}
          </div>

          {question.discussion_url && (
            <a
              href={question.discussion_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-text-subtle hover:text-white transition-colors font-mono text-[11px]"
            >
              <span>ExamTopics Discussion</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
