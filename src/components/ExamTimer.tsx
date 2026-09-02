'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface Props {
  initialSeconds: number; // e.g. 120 * 60 = 7200 for 120 mins
  onTimeUp: () => void;
  onTick?: (secondsRemaining: number) => void;
}

export default function ExamTimer({ initialSeconds, onTimeUp, onTick }: Props) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 1;
        if (onTick) onTick(next);
        if (next <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, onTimeUp, onTick]);

  const isWarning = remaining < 10 * 60; // < 10 mins
  const isCritical = remaining < 3 * 60; // < 3 mins

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all shadow-sm ${
        isCritical
          ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'
          : isWarning
          ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
          : 'bg-surface-high text-foreground border-border'
      }`}
      title="Exam Countdown Timer"
    >
      {isCritical ? (
        <AlertCircle className="h-4 w-4 text-rose-400 animate-spin" />
      ) : (
        <Clock className={`h-4 w-4 ${isWarning ? 'text-amber-400' : 'text-primary'}`} />
      )}
      <span>{formatTime(remaining)}</span>
    </div>
  );
}
