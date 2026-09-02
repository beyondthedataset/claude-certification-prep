import { DOMAINS } from '@/lib/questions-data';
import { ArrowRight, CheckCircle2, ShieldCheck, Flame, BookOpen, Clock, Users, Award, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const faqs = [
    {
      q: 'What is the Claude Certified Architect - Foundations (CCA-F / CCAR-F) Exam?',
      a: 'The Claude Certified Architect - Foundations exam validates expertise in designing, deploying, and optimizing Claude-powered agentic systems, Model Context Protocol (MCP) tool integrations, prompt architecture, and context reliability in production environments.',
    },
    {
      q: 'How realistic is the Mock Exam simulation?',
      a: 'The Mock Exam strictly mirrors the official Anthropic blueprint: 60 questions in 120 minutes proportionally sampled across all 5 domains, with a live countdown timer, question flagging, and detailed domain-by-domain diagnostic score reports with a 70%+ pass threshold.',
    },
    {
      q: 'What are the 5 domains in the CCA-F blueprint?',
      a: '1. Agentic Architecture & Orchestration (27%), 2. Tool Design & MCP Integration (18%), 3. Claude Code Configuration & Workflows (20%), 4. Prompt Engineering & Structured Output (20%), and 5. Context Management & Reliability (15%).',
    },
    {
      q: 'How is progress tracked for our team?',
      a: 'Every team member has their own account. All practiced questions, accuracy percentages, mock scores, and bookmarked questions are synced in real time to the Team Analytics dashboard and Leaderboard.',
    },
    {
      q: 'How do the discussions and community votes work?',
      a: 'Every question includes official solutions, community consensus distributions, controversy flags for disputed questions, and technical practitioner discussion explanations with real-world architecture tips.',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section matching claudecertificationguide.com */}
      <section className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-surface-lowest via-background to-background">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.35),transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 bg-surface-high rounded-full border border-border border-l-2 border-l-primary shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-3xs text-primary uppercase tracking-widest font-semibold">
              Claude Certified Architect (Foundations) · CCA-F / CCAR-F
            </span>
          </div>

          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-8">
            Practise until you <span className="text-primary italic">pass.</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Sit a timed, exam-realistic mock before you book the real thing, with all 134 verified actual exam questions, 60+ practitioner discussions, and full team progress analytics.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/mock-exam"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-bold technical-gradient text-white shadow-lg shadow-orange-600/25 hover:shadow-xl hover:shadow-orange-600/35 h-12 px-8 text-base transition-all"
            >
              <span>Take Timed Mock Exam (60Q)</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
            <a
              href="/learn"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium border border-border bg-surface-card hover:bg-surface-high text-foreground h-12 px-8 text-base transition-all"
            >
              Explore 134 Question Bank
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 pt-8 border-t border-border/40 font-mono text-2xs text-muted-foreground uppercase tracking-widest">
            <span>134 Questions</span>
            <span>·</span>
            <span>60-Question Mock</span>
            <span>·</span>
            <span>5 Exam Domains</span>
            <span>·</span>
            <span>Team Leaderboard</span>
          </div>
        </div>
      </section>

      {/* 5 Domains Curriculum Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 mb-2 font-mono text-3xs text-primary uppercase tracking-widest">
            Official Blueprint
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            5 Core Exam Domains
          </h2>
          <p className="text-muted-foreground max-w-2xl mt-2 text-sm md:text-base">
            Weighted strictly in accordance with Anthropic's official Claude Certified Architect - Foundations (CCAR-F) curriculum guide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOMAINS.map((domain) => (
            <a
              key={domain.key}
              href={`/learn?domain=${domain.key}`}
              className="group flex flex-col p-6 rounded-xl bg-surface-card border border-border hover:border-primary/50 transition-all duration-200 border-l-2 border-l-primary hover:-translate-y-1 shadow-card"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-2xs text-primary uppercase tracking-widest font-bold">
                  {domain.code}
                </span>
                <span className="font-mono text-3xs uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
                  {domain.weightPct}% Weight
                </span>
              </div>

              <h3 className="font-headline text-lg font-bold text-foreground mt-3 group-hover:text-primary transition-colors">
                {domain.name}
              </h3>

              <p className="text-xs text-muted-foreground mt-2 leading-relaxed flex-1">
                {domain.description}
              </p>

              <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Practice this domain →</span>
                <BookOpen className="h-3.5 w-3.5 text-primary opacity-70 group-hover:opacity-100" />
              </div>
            </a>
          ))}

          {/* Quick Mock Card */}
          <div className="flex flex-col p-6 rounded-xl bg-gradient-to-br from-surface-card via-surface-high to-surface-card border border-primary/40 border-l-2 border-l-amber-500 shadow-card justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xs text-amber-400 uppercase tracking-widest font-bold">
                  Exam Simulation
                </span>
                <span className="font-mono text-3xs uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                  120 Minutes
                </span>
              </div>
              <h3 className="font-headline text-lg font-bold text-foreground mt-3">
                Full 60-Question Mock
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Test your exam readiness with our full timed simulation. Passing score is 70%+. Includes domain analytics report.
              </p>
            </div>
            <a
              href="/mock-exam"
              className="mt-5 w-full py-2.5 rounded text-center technical-gradient text-white text-xs font-bold shadow-md shadow-orange-600/20 block"
            >
              Launch Mock Exam
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto w-full border-t border-border/30">
        <h2 className="font-headline text-3xl font-bold text-foreground mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border border-border bg-surface-card p-5 rounded-xl open:pb-5 transition-colors"
            >
              <summary className="cursor-pointer font-headline text-base font-bold text-foreground list-none flex justify-between items-center select-none">
                <span>{faq.q}</span>
                <span className="text-primary font-mono text-lg transition-transform group-open:rotate-45 ml-4">
                  +
                </span>
              </summary>
              <p className="mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
