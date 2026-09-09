'use client';

import React from 'react';
import { QuestionBank } from '@/lib/types';

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
  const banks: { id: QuestionBank; label: string; count: number; desc: string; icon: string }[] = [
    {
      id: 'all',
      label: 'All Question Banks',
      count: counts.all ?? 574,
      desc: 'Combined pool across both banks with deduplication',
      icon: 'layers',
    },
    {
      id: 'certsafari',
      label: 'CertSafari Verified',
      count: counts.certsafari ?? 441,
      desc: 'Deep rationales for all options + 30 subdomains',
      icon: 'verified',
    },
    {
      id: 'examtopics',
      label: 'ExamTopics Community',
      count: counts.examtopics ?? 134,
      desc: 'Community votes, consensus & practitioner debate',
      icon: 'forum',
    }
  ];

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="uppercase tracking-wider text-text-subtle flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-secondary">database</span>
          <span>Select Question Bank</span>
        </span>
        <span className="text-text-muted">
          {selectedBank === 'all' 
            ? '574 total questions' 
            : selectedBank === 'certsafari' 
            ? '441 verified scenario questions' 
            : '134 community discussion questions'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#0D0E12] p-1.5 rounded-xl border border-white/[0.08]">
        {banks.map(bank => {
          const isSelected = selectedBank === bank.id;
          return (
            <button
              key={bank.id}
              onClick={() => onSelectBank(bank.id)}
              type="button"
              className={`flex items-start sm:items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-left transition-all relative ${
                isSelected
                  ? 'bg-[#14161D] text-white border border-white/20 shadow-sm font-medium'
                  : 'text-text-muted hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-white text-black' : 'bg-[#1C202B] text-text-muted'}`}>
                  <span className="material-symbols-outlined text-[16px] block">{bank.icon}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-[13px] leading-tight truncate font-semibold font-sans">
                    {bank.label}
                  </div>
                  <div className="text-[11px] text-text-subtle truncate hidden md:block font-sans mt-0.5">
                    {bank.desc}
                  </div>
                </div>
              </div>

              <span className={`text-[11px] px-2 py-0.5 rounded font-mono font-medium border ${
                isSelected 
                  ? 'bg-white/[0.08] text-white border-white/20' 
                  : 'bg-[#14161D] text-text-subtle border-white/[0.06]'
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
