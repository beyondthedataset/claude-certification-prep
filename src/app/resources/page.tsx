import { DOMAINS } from '@/lib/questions-data';
import { BookOpen, ExternalLink, ShieldCheck, Code, Layers, FileText, Cpu, CheckCircle2 } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 w-full flex flex-col gap-10">
      {/* Header */}
      <div className="p-8 rounded-2xl bg-surface-card border border-border border-l-4 border-l-primary shadow-card">
        <div className="inline-flex items-center gap-2 mb-2 font-mono text-3xs text-primary uppercase tracking-widest font-semibold">
          Anthropic Reference Center
        </div>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          CCA-F Blueprint &amp; Technical Cheatsheet
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          Comprehensive exam objectives, domain breakdown, Model Context Protocol (MCP) specifications, and prompt architecture guides.
        </p>
      </div>

      {/* 5 Domains Blueprint Summary */}
      <div className="flex flex-col gap-4">
        <h2 className="font-headline text-2xl font-bold text-foreground">
          Official 5-Domain Exam Objectives
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOMAINS.map(d => (
            <div key={d.key} className="p-5 rounded-xl bg-surface-card border border-border flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary uppercase">
                  {d.code}
                </span>
                <span className="font-mono text-2xs uppercase bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                  {d.weightPct}% Weight
                </span>
              </div>
              <h3 className="font-headline text-base font-bold text-foreground">
                {d.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {d.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* High Yield Key Concepts */}
      <div className="flex flex-col gap-6">
        <h2 className="font-headline text-2xl font-bold text-foreground">
          High-Yield Exam Concept Cheatsheets
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agentic Systems & Context Management */}
          <div className="p-6 rounded-xl bg-surface-card border border-border border-l-2 border-l-primary flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="font-headline text-base font-bold text-foreground">
                Multi-Agent Architecture &amp; Context Handoff
              </h3>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <li>
                <strong className="text-foreground">• Context Isolation:</strong> Subagents do not automatically inherit coordinator context. The coordinator must explicitly pass structured summaries and relevant source mappings.
              </li>
              <li>
                <strong className="text-foreground">• State Management on Failure:</strong> Subagents should persist structured manifests/exports to disk or shared store. On resume, the coordinator loads the manifest rather than replaying raw transcripts.
              </li>
              <li>
                <strong className="text-foreground">• Tool Delegation Scope:</strong> Restrict each subagent to 4-5 specialized tools to prevent decision thrashing.
              </li>
            </ul>
          </div>

          {/* Model Context Protocol (MCP) */}
          <div className="p-6 rounded-xl bg-surface-card border border-border border-l-2 border-l-cyan-500 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-400" />
              <h3 className="font-headline text-base font-bold text-foreground">
                Model Context Protocol (MCP) Best Practices
              </h3>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <li>
                <strong className="text-foreground">• Error Handling Design:</strong> Protocol malformed requests trigger JSON-RPC errors; valid business failures or 404/503 external API errors return normal tool results with <code className="text-primary font-mono">isError: true</code>.
              </li>
              <li>
                <strong className="text-foreground">• Parameter Descriptions:</strong> Clear semantic descriptions in JSON schemas (e.g. format, requirement flags) are far more reliable than generic names.
              </li>
              <li>
                <strong className="text-foreground">• Atomic Tool Functions:</strong> Split multi-operation tools (refund, cancel, reship) into discrete single-purpose tools with explicit parameter contracts.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* External Official Resources */}
      <div className="p-6 rounded-xl bg-surface-card border border-border flex flex-col gap-4">
        <h3 className="font-headline text-lg font-bold text-foreground">
          Official Anthropic Documentation &amp; Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-lg bg-surface-lowest border border-border hover:border-primary/50 text-xs font-semibold text-foreground flex items-center justify-between group transition-colors"
          >
            <span>Prompt Engineering Guide</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
          </a>

          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-lg bg-surface-lowest border border-border hover:border-primary/50 text-xs font-semibold text-foreground flex items-center justify-between group transition-colors"
          >
            <span>MCP Official Spec</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
          </a>

          <a
            href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-lg bg-surface-lowest border border-border hover:border-primary/50 text-xs font-semibold text-foreground flex items-center justify-between group transition-colors"
          >
            <span>Prompt Caching Architecture</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
          </a>
        </div>
      </div>
    </div>
  );
}
