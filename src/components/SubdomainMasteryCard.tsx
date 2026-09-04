'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DOMAINS, getSubdomainsByDomain } from '@/lib/questions-data';
import { DomainKey, UserProgress } from '@/lib/types';
import { ChevronDown, ChevronUp, Compass, ArrowRight, CheckCircle2, Target } from 'lucide-react';

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
    <div className={`bg-card border border-border rounded-2xl p-6 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">30 Subdomain Curriculum Mastery</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Drill into granular task objectives across all 5 official Anthropic CCA-F domains with targeted practice sets.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 30 Target Subdomains
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> 574 Verified Scenarios
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {DOMAINS.map(domain => {
          const isExpanded = expandedDomain === domain.key;
          const subdomains = getSubdomainsByDomain(domain.key);
          const totalSubQuestions = subdomains.reduce((sum, s) => sum + (s.questionCount || 0), 0);

          return (
            <div 
              key={domain.key} 
              className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                isExpanded ? 'border-primary/40 bg-muted/20 shadow-sm' : 'border-border bg-card hover:border-border/80'
              }`}
            >
              {/* Domain Header Header */}
              <button
                type="button"
                onClick={() => toggleDomain(domain.key)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    isExpanded ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                  }`}>
                    {domain.code.replace('Domain ', 'D')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground leading-snug">
                        {domain.name}
                      </h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                        {domain.weightPct}% Exam Weight
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {subdomains.length} Subdomains • {totalSubQuestions} Targeted Practice Questions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-semibold text-primary hidden sm:inline-block">
                    {isExpanded ? 'Collapse' : 'Explore Subdomains'}
                  </span>
                  <div className="p-1 rounded-md text-muted-foreground hover:text-foreground">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </button>

              {/* Subdomains Grid */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {subdomains.map(sub => {
                      return (
                        <div 
                          key={sub.code}
                          className="flex flex-col justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/30 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2.5 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono font-bold text-primary">
                                {sub.code}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Target className="w-3 h-3 text-muted-foreground" />
                                {sub.questionCount || 0} questions
                              </span>
                            </div>
                            <Link
                              href={`/learn?domain=${domain.key}&subdomain=${sub.code}`}
                              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                            >
                              Drill <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>

                          <h4 className="text-xs sm:text-sm font-medium text-foreground leading-snug line-clamp-2 mb-3">
                            {sub.title}
                          </h4>

                          <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              Scenario-based
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
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
