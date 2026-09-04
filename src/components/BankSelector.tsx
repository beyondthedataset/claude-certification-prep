'use client';

import React from 'react';
import { QuestionBank } from '@/lib/types';
import { Layers, Sparkles, MessageSquare } from 'lucide-react';

interface BankSelectorProps {
  selectedBank: QuestionBank;
  onSelectBank: (bank: QuestionBank) => void;
  counts?: {
    all?: number;
    certsafari?: number;
    examtopics?: number;
  };
  className?: string;
}

export default function BankSelector({
  selectedBank,
  onSelectBank,
  counts = { all: 574, certsafari: 441, examtopics: 134 },
  className = ''
}: BankSelectorProps) {
  const banks: { id: QuestionBank; label: string; count: number; desc: string; icon: React.ReactNode; badgeColor: string }[] = [
    {
      id: 'all',
      label: 'All Question Banks',
      count: counts.all ?? 574,
      desc: 'Combined pool across both banks with deduplication',
      icon: <Layers className="w-4 h-4" />,
      badgeColor: 'bg-primary/10 text-primary border-primary/20'
    },
    {
      id: 'certsafari',
      label: 'CertSafari Verified',
      count: counts.certsafari ?? 441,
      desc: 'Deep rationales for all options + 30 subdomains',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    {
      id: 'examtopics',
      label: 'ExamTopics Community',
      count: counts.examtopics ?? 134,
      desc: 'Community votes, consensus & discussions',
      icon: <MessageSquare className="w-4 h-4 text-emerald-500" />,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    }
  ];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-primary" /> Select Question Bank
        </span>
        <span className="text-xs text-muted-foreground">
          {selectedBank === 'all' 
            ? '574 total questions' 
            : selectedBank === 'certsafari' 
            ? '441 verified scenario questions' 
            : '134 community discussion questions'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-muted/40 p-1.5 rounded-xl border border-border">
        {banks.map(bank => {
          const isSelected = selectedBank === bank.id;
          return (
            <button
              key={bank.id}
              onClick={() => onSelectBank(bank.id)}
              type="button"
              className={`flex items-start sm:items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-lg text-left transition-all relative ${
                isSelected
                  ? 'bg-card text-foreground shadow-sm border border-border font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                  {bank.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm leading-tight truncate font-semibold">
                    {bank.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate hidden md:block">
                    {bank.desc}
                  </div>
                </div>
              </div>

              <span className={`text-xs px-2 py-0.5 rounded-full border font-mono font-semibold ${
                isSelected ? bank.badgeColor : 'bg-muted text-muted-foreground border-transparent'
              }`}>
                {bank.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
