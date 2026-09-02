import React from 'react';
import { VoteStat } from '@/lib/types';

interface Props {
  stats: VoteStat[];
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

export default function VoteDistributionBar({ stats }: Props) {
  if (!stats || stats.length === 0) return null;

  const totalVotes = stats.reduce((acc, s) => acc + (s.vote_count || 0), 0);
  if (totalVotes === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-3 bg-surface-lowest/70 border border-border/60 rounded-md">
      <div className="flex justify-between items-center text-3xs font-mono text-muted-foreground uppercase tracking-widest">
        <span>Community Vote Consensus</span>
        <span>{totalVotes} Total Votes</span>
      </div>

      {/* Segmented Bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden bg-surface-high gap-0.5">
        {stats.map((s, i) => {
          const pct = Math.round((s.vote_count / totalVotes) * 100);
          const color = COLORS[i % COLORS.length];
          return (
            <div
              key={i}
              style={{ width: `${pct}%`, backgroundColor: color }}
              title={`${s.voted_answers}: ${s.vote_count} votes (${pct}%)`}
              className="h-full transition-all duration-300"
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-2xs text-muted-foreground">
        {stats.map((s, i) => {
          const pct = Math.round((s.vote_count / totalVotes) * 100);
          const color = COLORS[i % COLORS.length];
          return (
            <div key={i} className="flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-bold text-foreground">{s.voted_answers}:</span>
              <span>{s.vote_count} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
