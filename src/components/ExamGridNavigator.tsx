'use client';

interface Props {
  questionNumbers: number[];
  currentIndex: number;
  answers: Record<number, string>;
  flagged: Record<number, boolean>;
  onSelectIndex: (index: number) => void;
}

export default function ExamGridNavigator({
  questionNumbers,
  currentIndex,
  answers,
  flagged,
  onSelectIndex,
}: Props) {
  const answeredCount = questionNumbers.filter(qnum => !!answers[qnum]).length;
  const flaggedCount = questionNumbers.filter(qnum => !!flagged[qnum]).length;
  const total = questionNumbers.length;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-surface-card border border-border shadow-card">
      <div className="flex items-center justify-between text-2xs font-mono text-muted-foreground uppercase tracking-wider pb-2 border-b border-border/40">
        <span>Question Navigator</span>
        <span className="text-primary font-bold">{answeredCount}/{total} Answered</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5 max-h-72 overflow-y-auto pr-1">
        {questionNumbers.map((qnum, idx) => {
          const isCurrent = currentIndex === idx;
          const isAnswered = !!answers[qnum];
          const isFlagged = !!flagged[qnum];

          let cellClass = 'bg-surface-lowest border-border text-muted-foreground hover:bg-surface-high hover:border-primary/40';

          if (isCurrent) {
            cellClass = 'ring-2 ring-primary bg-primary/20 text-white font-bold border-primary';
          } else if (isFlagged) {
            cellClass = 'bg-amber-500/15 border-amber-500/50 text-amber-400 font-bold';
          } else if (isAnswered) {
            cellClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-semibold';
          }

          return (
            <button
              key={qnum}
              onClick={() => onSelectIndex(idx)}
              className={`aspect-square rounded flex items-center justify-center font-mono text-2xs transition-all ${cellClass}`}
              title={`Question ${idx + 1} (Exam Q#${qnum})`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/40 text-3xs font-mono text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-500" />
          <span>Flagged ({flaggedCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-surface-lowest border border-border" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}
