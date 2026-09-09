'use client';

import { useState } from 'react';
import { DiscussionComment } from '@/lib/types';

interface Props {
  comments: DiscussionComment[];
  questionNumber: number;
}

export default function DiscussionThread({ comments, questionNumber }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  if (!comments || comments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 pt-3 border-t border-white/[0.08]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3.5 py-2 rounded-lg bg-[#0D0E12] hover:bg-[#1C202B] border border-white/[0.08] text-xs font-medium text-white transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[15px] text-secondary">forum</span>
          <span>Practitioner Explanations &amp; Community Debate ({comments.length})</span>
        </div>
        <span className="material-symbols-outlined text-[16px] text-text-subtle">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-2.5 mt-1">
          {comments.map((c, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#0D0E12] border border-white/[0.06] flex flex-col gap-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#1C202B] border border-white/10 text-white font-medium flex items-center justify-center text-[10px] font-mono">
                    {(c.user || 'A').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-white">{c.user}</span>
                  <span className="text-text-subtle font-mono text-[11px]">{c.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  {c.vote && (
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider bg-white/[0.06] text-white border border-white/10">
                      Voted {c.vote}
                    </span>
                  )}
                  {c.upvotes > 0 && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] bg-secondary/10 text-secondary border border-secondary/20">
                      <span className="material-symbols-outlined text-[11px]">thumb_up</span>
                      +{c.upvotes}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-text-muted leading-relaxed whitespace-pre-line font-sans">
                {c.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
