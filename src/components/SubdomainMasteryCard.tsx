'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DOMAINS, getSubdomainsByDomain, QUESTIONS_DATA } from '@/lib/questions-data';
import { DomainKey, UserProgress } from '@/lib/types';

interface Props {
  userProgress?: UserProgress | null;
  className?: string;
}

export default function SubdomainMasteryCard({ userProgress, className = '' }: Props) {
  const [expandedDomain, setExpandedDomain] = useState<DomainKey | null>('domain_1_agentic_architecture');

  const toggleDomain = (key: DomainKey) => {
    setExpandedDomain(prev => (prev === key ? null : key));
  };

  return (
    <div className={`bg-[#14161D] border border-white/[0.08] rounded-xl p-6 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              account_tree
            </span>
            <h2 className="text-base sm:text-lg font-headline font-semibold text-white tracking-tight">
              30 Subdomain Curriculum Mastery
            </h2>
          </div>
          <p className="text-xs text-text-muted mt-1 font-sans">
            Drill into granular task objectives across all 5 official blueprint domains with targeted scenario practice sets.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 30 Objectives
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 574 Questions
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {DOMAINS.map((domain, index) => {
          const isExpanded = expandedDomain === domain.key;
          const subdomains = getSubdomainsByDomain(domain.key);
          const totalSubQuestions = subdomains.reduce((sum, s) => sum + (s.questionCount || 0), 0);

          return (
            <div 
              key={domain.key} 
              className={`border rounded-lg transition-all duration-200 overflow-hidden ${
                isExpanded ? 'border-white/[0.18] bg-[#0D0E12]' : 'border-white/[0.06] bg-[#14161D] hover:border-white/[0.12]'
              }`}
            >
              {/* Domain Header */}
              <button
                type="button"
                onClick={() => toggleDomain(domain.key)}
                className="w-full px-5 py-3.5 flex items-center justify-between gap-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-medium text-xs flex-shrink-0 ${
                    isExpanded ? 'bg-white text-black' : 'bg-[#1C202B] text-text-muted'
                  }`}>
                    0{index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-sm text-white leading-snug">
                        {domain.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-secondary border border-secondary/20">
                        {domain.weightPct}% weight
                      </span>
                    </div>
                    <p className="text-xs text-text-muted truncate mt-0.5 font-sans">
                      {subdomains.length} Subdomains • {totalSubQuestions} Practice Scenarios
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-text-muted hidden sm:inline-block font-mono">
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </span>
                  <span className="material-symbols-outlined text-text-subtle text-[18px]">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </button>

              {/* Subdomains Grid */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-white/[0.06]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
                    {subdomains.map(sub => {
                      const subQuestions = QUESTIONS_DATA.filter(q => q.subdomain && q.subdomain.includes(sub.code));
                      const subAnswers = subQuestions
                        .map(q => userProgress?.answers[q.question_number])
                        .filter((a): a is NonNullable<typeof a> => !!a);
                      const subPracticed = subAnswers.length;
                      const subCorrect = subAnswers.filter(a => a.isCorrect).length;
                      const subAccuracy = subPracticed > 0 ? Math.round((subCorrect / subPracticed) * 100) : 0;
                      const totalCount = sub.questionCount || subQuestions.length;

                      return (
                        <div 
                          key={sub.code}
                          className="flex flex-col justify-between p-3 rounded-lg border border-white/[0.06] bg-[#14161D] hover:border-white/20 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2.5 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-[#0D0E12] text-[11px] font-mono font-medium text-secondary border border-secondary/20">
                                {sub.code}
                              </span>
                              {subPracticed > 0 ? (
                                <span className="text-[11px] font-mono font-medium text-emerald-400">
                                  {subAccuracy}% Acc ({subPracticed}/{totalCount})
                                </span>
                              ) : (
                                <span className="text-xs text-text-subtle font-mono">
                                  {totalCount} items
                                </span>
                              )}
                            </div>
                            <Link
                              href={`/learn?domain=${domain.key}&subdomain=${sub.code}`}
                              className="text-xs font-medium text-white hover:text-secondary inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Drill</span>
                              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                            </Link>
                          </div>

                          <h4 className="text-xs font-normal text-text-primary leading-snug line-clamp-2 mb-2 font-sans">
                            {sub.title}
                          </h4>

                          <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-text-subtle font-mono">
                            <span className="flex items-center gap-1">
                              {subPracticed > 0 ? (
                                <>
                                  <span className="material-symbols-outlined text-[12px] text-emerald-400">check_circle</span>
                                  <span>{subCorrect} of {subPracticed} correct</span>
                                </>
                              ) : (
                                <span className="text-outline">Unassessed</span>
                              )}
                            </span>
                            <span className="uppercase text-[10px]">
                              {domain.code}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

