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
    <div className="flex flex-col gap-3 p-5 rounded-xl bg-[#14161D] border border-white/[0.08] shadow-xl">
      <div className="flex items-center justify-between text-xs font-mono text-text-subtle uppercase tracking-wider pb-3 border-b border-white/[0.08]">
        <span className="flex items-center gap-1.5 text-white font-medium">
          <span className="material-symbols-outlined text-[15px] text-secondary">grid_view</span>
          Question Matrix
        </span>
        <span className="text-secondary font-medium">{answeredCount}/{total} Answered</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5 max-h-72 overflow-y-auto pr-1">
        {questionNumbers.map((qnum, idx) => {
          const isCurrent = currentIndex === idx;
          const isAnswered = !!answers[qnum];
          const isFlagged = !!flagged[qnum];

          let cellClass = 'bg-[#0D0E12] border border-white/[0.06] text-text-subtle hover:bg-[#1C202B] hover:text-white hover:border-white/20';

          if (isCurrent) {
            cellClass = 'bg-white text-black font-semibold border-white ring-1 ring-white/40';
          } else if (isFlagged) {
            cellClass = 'bg-amber-400/15 border border-amber-400/30 text-amber-300 font-medium';
          } else if (isAnswered) {
            cellClass = 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium';
          }

          return (
            <button
              key={qnum}
              onClick={() => onSelectIndex(idx)}
              type="button"
              className={`aspect-square rounded flex items-center justify-center font-mono text-xs transition-all ${cellClass}`}
              title={`Question ${idx + 1} (Exam Q#${qnum})`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.08] text-[11px] font-mono text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Flagged ({flaggedCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1E222D]" />
          <span>Remaining</span>
        </div>
      </div>
    </div>
  );
}
