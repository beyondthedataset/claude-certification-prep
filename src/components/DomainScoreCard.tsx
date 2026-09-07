import { DOMAINS } from '@/lib/questions-data';
import { DomainKey } from '@/lib/types';

interface Props {
  domainScores: Record<DomainKey, { correct: number; total: number; pct: number }>;
}

export default function DomainScoreCard({ domainScores }: Props) {
  if (!domainScores) return null;

  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl bg-[#14161D] border border-white/[0.08]">
      <div className="flex items-baseline justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <h3 className="font-headline text-base font-semibold text-white">
            Domain Competency Breakdown
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Weighted benchmark evaluations against passing standard (70% passing threshold)
          </p>
        </div>
        <span className="font-mono text-xs text-text-subtle">5 BLUEPRINT DOMAINS</span>
      </div>

      <div className="space-y-4 pt-1">
        {DOMAINS.map((domain, index) => {
          const score = domainScores[domain.key] || { correct: 0, total: 0, pct: 0 };
          const isPassing = score.pct >= 70;

          return (
            <div key={domain.key} className="flex flex-col gap-2 p-3.5 rounded-lg bg-[#0D0E12] border border-white/[0.06]">
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-text-subtle">
                    0{index + 1}
                  </span>
                  <span className="text-white font-medium">
                    {domain.code}: {domain.name}
                  </span>
                  <span className="text-[11px] font-mono text-text-subtle">
                    {domain.weightPct}% wt
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className={isPassing ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-semibold'}>
                    {score.pct}%
                  </span>
                  <span className="text-text-subtle text-[11px]">
                    ({score.correct}/{score.total})
                  </span>
                  <span className={`text-[11px] ${isPassing ? 'text-emerald-300/80' : 'text-rose-400'}`}>
                    {score.pct >= 70 ? `+${score.pct - 70}%` : `${score.pct - 70}% deficit`}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#1C202B] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPassing ? 'bg-white' : 'bg-slate-400'
                  }`}
                  style={{ width: `${Math.max(3, score.pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
