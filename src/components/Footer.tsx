import { DOMAINS } from '@/lib/questions-data';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-lowest mt-20 border-t border-border/40">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="font-headline text-base font-bold text-foreground">
              Claude Certified Architect — Prep Guide
            </span>
            <span className="font-mono text-2xs text-muted-foreground uppercase tracking-wider">
              © 2026 CCA-F Team Prep Portal · CCAR-F v1.0
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground font-mono text-2xs uppercase tracking-wider">
            <a href="/learn" className="hover:text-primary transition-colors">
              Question Bank
            </a>
            <a href="/mock-exam" className="hover:text-primary transition-colors">
              Mock Exams
            </a>
            <a href="/dashboard" className="hover:text-primary transition-colors">
              Team Stats
            </a>
            <a href="/resources" className="hover:text-primary transition-colors">
              Blueprint
            </a>
            <a
              href="https://docs.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Anthropic Docs ↗
            </a>
            <a
              href="https://github.com/modelcontextprotocol"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              MCP Spec ↗
            </a>
          </div>
        </div>

        {/* 5 Domains footer strip */}
        <div className="mt-8 pt-6 border-t border-border/20">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-center">
            <span className="font-mono text-3xs text-muted-foreground/70 uppercase tracking-widest">
              CCAR-F 5 Domains:
            </span>
            {DOMAINS.map(d => (
              <a
                key={d.key}
                href={`/learn?domain=${d.key}`}
                className="font-mono text-3xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
              >
                {d.name} ({d.weightPct}%)
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-3xs text-muted-foreground/60 font-mono">
          Independent enterprise study resource designed for internal exam preparation.
        </p>
      </div>
    </footer>
  );
}
