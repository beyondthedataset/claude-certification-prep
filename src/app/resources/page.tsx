import Link from 'next/link';
import { DOMAINS } from '@/lib/questions-data';

export default function ResourcesPage() {
  const flashcardDecks = [
    {
      title: 'Agentic Architecture & Context Handoff',
      domain: 'domain_1_agentic_architecture',
      code: 'DOM-01',
      cardsCount: 165,
      desc: 'Subagent context isolation, persistent manifests, and tool delegation scope.',
    },
    {
      title: 'Prompt Architecture & Evaluation',
      domain: 'domain_2_prompt_architecture',
      code: 'DOM-02',
      cardsCount: 142,
      desc: 'System prompt design, XML structure tags, few-shot calibration, and prompt caching.',
    },
    {
      title: 'Model Context Protocol (MCP) & Tools',
      domain: 'domain_3_mcp_and_tools',
      code: 'DOM-03',
      cardsCount: 128,
      desc: 'JSON-RPC error handling, atomic tool design, parameter schemas, and server-side state.',
    },
    {
      title: 'Safety, Guardrails & Production Observability',
      domain: 'domain_4_safety_and_alignment',
      code: 'DOM-04',
      cardsCount: 84,
      desc: 'Prompt injection defenses, constitutional AI alignment, telemetry pipelines, and rate limits.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0E12] text-text-primary pb-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
        {/* Editorial Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-text-subtle">
            <span className="inline-flex items-center gap-1.5 text-white font-medium uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Studio Vault
            </span>
            <span>/</span>
            <span>BLUEPRINT OBJECTIVES &amp; FLASHCARDS</span>
            <span>/</span>
            <span>HIGH-YIELD SPECIFICATIONS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-headline font-semibold text-white tracking-tight">
                Architecture Blueprint &amp; Active Recall Vault
              </h1>
              <p className="text-sm text-text-muted mt-1 max-w-2xl font-sans leading-relaxed">
                Vendor-aligned curriculum objectives, Model Context Protocol (MCP) specifications, multi-agent context handoff blueprints, and targeted active-recall flashcard study decks.
              </p>
            </div>

            <Link
              href="/learn?view=flashcard"
              className="inline-flex items-center gap-2 bg-white text-black font-medium text-xs px-4 py-2.5 rounded-md hover:bg-neutral-200 transition-colors shadow-sm self-start md:self-auto shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">style</span>
              <span>Launch All Flashcards (574 Qs)</span>
            </Link>
          </div>
        </div>

        {/* 1. Quick Flashcard Decks Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <h2 className="text-base font-headline font-semibold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">style</span>
              Targeted Active Recall Flashcard Decks
            </h2>
            <span className="font-mono text-xs text-text-subtle">4 HIGH-YIELD TOPICS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashcardDecks.map(deck => (
              <Link
                key={deck.domain}
                href={`/learn?view=flashcard&domain=${deck.domain}`}
                className="p-5 rounded-xl bg-[#14161D] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-[#0D0E12] font-mono text-[10px] text-secondary border border-secondary/20">
                      {deck.code}
                    </span>
                    <span className="font-mono text-xs text-text-subtle">
                      {deck.cardsCount} Cards
                    </span>
                  </div>
                  <h3 className="font-headline text-sm font-semibold text-white group-hover:text-secondary transition-colors line-clamp-2">
                    {deck.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed font-sans line-clamp-3">
                    {deck.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-text-subtle group-hover:text-white transition-colors">
                  <span className="font-mono text-[11px]">Start Deck</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 2. Official 5-Domain Exam Objectives */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <h2 className="text-base font-headline font-semibold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">menu_book</span>
              Official Blueprint Objectives
            </h2>
            <span className="font-mono text-xs text-text-subtle">100% EXAM COVERAGE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DOMAINS.map(d => (
              <div
                key={d.key}
                className="p-6 rounded-xl bg-[#14161D] border border-white/[0.08] flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-white">
                    {d.code}
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/[0.06] text-secondary border border-secondary/20">
                    {d.weightPct}% Exam Weight
                  </span>
                </div>
                <h3 className="font-headline text-base font-medium text-white">
                  {d.name}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-sans">
                  {d.description}
                </p>

                <div className="mt-2 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <Link
                    href={`/learn?domain=${d.key}`}
                    className="text-xs font-mono text-text-subtle hover:text-white inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Explore Questions</span>
                    <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                  </Link>
                  <Link
                    href={`/learn?view=flashcard&domain=${d.key}`}
                    className="text-xs font-mono text-secondary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Flashcards</span>
                    <span className="material-symbols-outlined text-[12px]">style</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. High Yield Cheatsheet Cards */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <h2 className="text-base font-headline font-semibold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
              High-Yield Architectural Cheatsheets
            </h2>
            <span className="font-mono text-xs text-text-subtle">EXAM GOTCHAS &amp; PATTERNS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Multi-Agent Systems */}
            <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.08] flex flex-col gap-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">hub</span>
                <h3 className="font-headline text-base font-medium text-white">
                  Multi-Agent Architecture &amp; Context Handoff
                </h3>
              </div>
              <ul className="text-xs text-text-muted space-y-2.5 leading-relaxed font-sans">
                <li>
                  <strong className="text-white font-medium">• Context Isolation:</strong> Subagents do not automatically inherit coordinator conversation context. The coordinator must explicitly pass structured summaries and relevant source references.
                </li>
                <li>
                  <strong className="text-white font-medium">• State Management on Failure:</strong> Subagents should persist structured manifests/exports to disk or shared store. On resume, the coordinator loads the manifest rather than replaying raw transcripts.
                </li>
                <li>
                  <strong className="text-white font-medium">• Tool Delegation Scope:</strong> Restrict each subagent to 4–5 specialized tools to prevent decision thrashing and reduce hallucinations.
                </li>
              </ul>
            </div>

            {/* Model Context Protocol (MCP) */}
            <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.08] flex flex-col gap-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">terminal</span>
                <h3 className="font-headline text-base font-medium text-white">
                  Model Context Protocol (MCP) Best Practices
                </h3>
              </div>
              <ul className="text-xs text-text-muted space-y-2.5 leading-relaxed font-sans">
                <li>
                  <strong className="text-white font-medium">• Error Handling Design:</strong> Protocol malformed requests trigger JSON-RPC errors; valid business failures or 404/503 external API errors return normal tool results with <code className="text-white font-mono bg-[#0D0E12] px-1 py-0.5 rounded border border-white/10">isError: true</code>.
                </li>
                <li>
                  <strong className="text-white font-medium">• Parameter Descriptions:</strong> Clear semantic descriptions in JSON schemas (e.g. format, requirement flags) are far more reliable than generic names.
                </li>
                <li>
                  <strong className="text-white font-medium">• Atomic Tool Functions:</strong> Split multi-operation tools (refund, cancel, reship) into discrete single-purpose tools with explicit parameter contracts.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. External Specifications & Docs */}
        <div className="p-6 rounded-xl bg-[#14161D] border border-white/[0.08] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h3 className="font-headline text-sm font-semibold text-white">
              Official Vendor Specifications &amp; Frameworks
            </h3>
            <span className="font-mono text-xs text-text-subtle">EXTERNAL REFERENCES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-lg bg-[#0D0E12] border border-white/[0.06] hover:border-white/20 text-xs font-medium text-white flex items-center justify-between group transition-colors"
            >
              <span>Prompt Engineering Guide</span>
              <span className="material-symbols-outlined text-text-subtle group-hover:text-white text-[14px]">open_in_new</span>
            </a>

            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-lg bg-[#0D0E12] border border-white/[0.06] hover:border-white/20 text-xs font-medium text-white flex items-center justify-between group transition-colors"
            >
              <span>MCP Protocol Specification</span>
              <span className="material-symbols-outlined text-text-subtle group-hover:text-white text-[14px]">open_in_new</span>
            </a>

            <a
              href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-lg bg-[#0D0E12] border border-white/[0.06] hover:border-white/20 text-xs font-medium text-white flex items-center justify-between group transition-colors"
            >
              <span>Prompt Caching Architecture</span>
              <span className="material-symbols-outlined text-text-subtle group-hover:text-white text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
