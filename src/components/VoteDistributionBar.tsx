import React from 'react';
import { VoteStat } from '@/lib/types';

interface Props {
  stats: VoteStat[];
}

// Atelier Obsidian monochromatic luminance palette (no rainbow saturation)
const MONOCHROME_SHADES = ['#FFFFFF', '#C5C6CB', '#7BD0FF', '#8E95A5', '#44474A'];

export default function VoteDistributionBar({ stats }: Props) {
  if (!stats || stats.length === 0) return null;

  const totalVotes = stats.reduce((acc, s) => acc + (s.vote_count || 0), 0);
  if (totalVotes === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 p-4 bg-[#0D0E12] border border-white/[0.08] rounded-xl">
      <div className="flex justify-between items-center text-[11px] font-mono text-text-subtle uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-text-muted">
          <span className="material-symbols-outlined text-[13px] text-secondary">analytics</span>
          Community Consensus Distribution
        </span>
        <span className="text-white font-medium">{totalVotes} Total Votes</span>
      </div>

      {/* Segmented Hairline Bar */}
      <div className="flex h-2 rounded-full overflow-hidden bg-[#1C202B] gap-0.5">
        {stats.map((s, i) => {
          const pct = Math.round((s.vote_count / totalVotes) * 100);
          const color = MONOCHROME_SHADES[i % MONOCHROME_SHADES.length];
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
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1 text-xs text-text-muted">
        {stats.map((s, i) => {
          const pct = Math.round((s.vote_count / totalVotes) * 100);
          const color = MONOCHROME_SHADES[i % MONOCHROME_SHADES.length];
          return (
            <div key={i} className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-semibold text-white">{s.voted_answers}:</span>
              <span className="text-text-subtle">{s.vote_count} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
