import json
import os

with open("cca_f_questions.json", "r", encoding="utf-8") as f:
    questions = json.load(f)

# Domain mapping heuristic based on official Anthropic CCA-F 5-domain blueprint:
# Domain 1: Agentic Architecture & Orchestration (27%) - subagents, coordinator, orchestrat*, workflow, multi-agent, handoff, resume
# Domain 2: Tool Design & MCP Integration (18%) - mcp, model context protocol, tool, tools, parameters, json schema, execute, get_*, lookup_*, error
# Domain 3: Claude Code Configuration & Workflows (20%) - claude code, cli, slash command, git, terminal, file, config, repository
# Domain 4: Prompt Engineering & Structured Output (20%) - prompt, xml, system prompt, tags, few-shot, format, reasoning, temperature, cot
# Domain 5: Context Management & Reliability (15%) - context window, tokens, compaction, cache, caching, latency, cost, memory, limits

def classify_domain(q):
    text = (q.get("question_text", "") + " " + " ".join(c.get("text", "") for c in q.get("choices", []))).lower()
    
    if any(k in text for k in ["mcp", "model context protocol", "json schema", "tool definition", "tool call", "error handling in tool", "iserror"]):
        return "domain_2_tool_design_mcp"
    elif any(k in text for k in ["subagent", "coordinator", "multi-agent", "agentic", "synthesis agent", "delegat", "orchestrat"]):
        return "domain_1_agentic_architecture"
    elif any(k in text for k in ["claude code", "cli", "command line", "config.json", "terminal"]):
        return "domain_3_claude_code_config"
    elif any(k in text for k in ["cache", "caching", "token", "context window", "compaction", "latency", "cost"]):
        return "domain_5_context_management"
    elif any(k in text for k in ["xml", "system prompt", "few-shot", "cot", "chain-of-thought", "prompt"]):
        return "domain_4_prompt_engineering"
    else:
        # Fallback distribution
        qnum = q.get("question_number", 1)
        if qnum <= 35:
            return "domain_1_agentic_architecture"
        elif qnum <= 65:
            return "domain_2_tool_design_mcp"
        elif qnum <= 90:
            return "domain_3_claude_code_config"
        elif qnum <= 115:
            return "domain_4_prompt_engineering"
        else:
            return "domain_5_context_management"

for q in questions:
    q["domain"] = classify_domain(q)

domains_info = [
    {
        "key": "domain_1_agentic_architecture",
        "code": "Domain 1",
        "name": "Agentic Architecture & Orchestration",
        "weightPct": 27,
        "description": "Designing multi-agent systems, subagent delegation, state persistence, error propagation, and coordinator workflows."
    },
    {
        "key": "domain_2_tool_design_mcp",
        "code": "Domain 2",
        "name": "Tool Design & MCP Integration",
        "weightPct": 18,
        "description": "Model Context Protocol (MCP) server-client architectures, JSON schemas, parameter precision, and tool error handling."
    },
    {
        "key": "domain_3_claude_code_config",
        "code": "Domain 3",
        "name": "Claude Code Configuration & Workflows",
        "weightPct": 20,
        "description": "Claude Code workflows, subagent permissions, project context loading, terminal tools, and engineering automation."
    },
    {
        "key": "domain_4_prompt_engineering",
        "code": "Domain 4",
        "name": "Prompt Engineering & Structured Output",
        "weightPct": 20,
        "description": "XML structuring, prompt caching prefixes, system instructions, few-shot examples, chain-of-thought, and output consistency."
    },
    {
        "key": "domain_5_context_management",
        "code": "Domain 5",
        "name": "Context Management & Reliability",
        "weightPct": 15,
        "description": "Token optimization, prompt caching cost reduction, sliding context windows, uncertainty handling, and fallback strategies."
    }
]

ts_content = f"""import {{ Question, DomainInfo, DomainKey }} from './types';

export const DOMAINS: DomainInfo[] = {json.dumps(domains_info, indent=2)};

export const DOMAIN_MAP: Record<DomainKey, DomainInfo> = DOMAINS.reduce((acc, d) => {{
  acc[d.key] = d;
  return acc;
}}, {{}} as Record<DomainKey, DomainInfo>);

export const QUESTIONS_DATA: Question[] = {json.dumps(questions, indent=2, ensure_ascii=False)};
"""

output_path = os.path.join("cca-prep-app", "src", "lib", "questions-data.ts")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated {output_path} with {len(questions)} classified questions.")
