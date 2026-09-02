import { DOMAINS, DOMAIN_MAP } from '@/lib/questions-data';
import { DomainKey } from '@/lib/types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  domainScores: Record<DomainKey, { correct: number; total: number; pct: number }>;
}

export default function DomainScoreCard({ domainScores }: Props) {
  if (!domainScores) return null;

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl bg-surface-card border border-border shadow-card">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <h3 className="font-headline text-sm font-bold text-foreground uppercase tracking-wide">
          CCA-F 5-Domain Performance Breakdown
        </h3>
        <span className="font-mono text-2xs text-muted-foreground">Target: 70%+ per domain</span>
      </div>

      <div className="space-y-4">
        {DOMAINS.map(domain => {
          const score = domainScores[domain.key] || { correct: 0, total: 0, pct: 0 };
          const isPassing = score.pct >= 70;

          return (
            <div key={domain.key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  {isPassing ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  )}
                  <span className="font-semibold text-foreground">
                    {domain.code}: {domain.name}
                  </span>
                  <span className="text-3xs font-mono text-muted-foreground">
                    ({domain.weightPct}% weight)
                  </span>
                </div>
                <div className="font-mono text-xs">
                  <span className={isPassing ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {score.pct}%
                  </span>{' '}
                  <span className="text-muted-foreground text-3xs">
                    ({score.correct}/{score.total})
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-surface-lowest overflow-hidden border border-border/40">
                <div
                  className={`h-full transition-all duration-500 ${
                    isPassing ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-rose-500'
                  }`}
                  style={{ width: `${Math.max(4, score.pct)}%` }}
                />
              </div>

              <p className="text-3xs text-muted-foreground leading-tight">
                {domain.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
