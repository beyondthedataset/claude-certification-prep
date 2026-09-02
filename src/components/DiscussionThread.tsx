'use client';

import { useState } from 'react';
import { DiscussionComment } from '@/lib/types';
import { MessageSquare, ChevronDown, ChevronUp, ThumbsUp } from 'lucide-react';

interface Props {
  comments: DiscussionComment[];
  questionNumber: number;
}

export default function DiscussionThread({ comments, questionNumber }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  if (!comments || comments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-2.5 rounded-md bg-surface-high/50 hover:bg-surface-high border border-border/50 text-xs font-semibold text-foreground transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
          <span>Practitioner Explanations & Discussions ({comments.length})</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 mt-1">
          {comments.map((c, i) => (
            <div
              key={i}
              className="p-3.5 rounded-lg bg-surface-card border border-border/70 flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 text-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-3xs">
                    {(c.user || 'A').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-foreground">{c.user}</span>
                  <span className="text-muted-foreground font-mono">{c.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  {c.vote && (
                    <span className="px-1.5 py-0.5 rounded font-mono text-3xs uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      Voted {c.vote}
                    </span>
                  )}
                  {c.upvotes > 0 && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-3xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ThumbsUp className="h-2.5 w-2.5" />
                      +{c.upvotes}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {c.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
