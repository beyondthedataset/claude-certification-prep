import json
import os
import re

with open("master_questions_all.json", "r", encoding="utf-8") as f:
    questions = json.load(f)

print(f"Loaded {len(questions)} master questions.")

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

subdomain_defs = [
    # Domain 1
    ("1.1", "Design and implement agentic loops for autonomous task execution", "domain_1_agentic_architecture", "Domain 1"),
    ("1.2", "Orchestrate multi-agent systems with coordinator-subagent patterns", "domain_1_agentic_architecture", "Domain 1"),
    ("1.3", "Configure subagent invocation, context passing, and spawning", "domain_1_agentic_architecture", "Domain 1"),
    ("1.4", "Implement multi-step workflows with enforcement and handoff patterns", "domain_1_agentic_architecture", "Domain 1"),
    ("1.5", "Apply Agent SDK hooks for tool call interception and data normalization", "domain_1_agentic_architecture", "Domain 1"),
    ("1.6", "Design task decomposition strategies for complex workflows", "domain_1_agentic_architecture", "Domain 1"),
    ("1.7", "Manage session state, resumption, and forking", "domain_1_agentic_architecture", "Domain 1"),
    # Domain 2
    ("2.1", "Design effective tool interfaces with clear descriptions and boundaries", "domain_2_tool_design_mcp", "Domain 2"),
    ("2.2", "Implement structured error responses for MCP tools", "domain_2_tool_design_mcp", "Domain 2"),
    ("2.3", "Distribute tools appropriately across agents and configure tool choice", "domain_2_tool_design_mcp", "Domain 2"),
    ("2.4", "Integrate MCP servers into Claude Code and agent workflows", "domain_2_tool_design_mcp", "Domain 2"),
    ("2.5", "Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively", "domain_2_tool_design_mcp", "Domain 2"),
    # Domain 3
    ("3.1", "Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization", "domain_3_claude_code_config", "Domain 3"),
    ("3.2", "Create and configure custom slash commands and skills", "domain_3_claude_code_config", "Domain 3"),
    ("3.3", "Apply path-specific rules for conditional convention loading", "domain_3_claude_code_config", "Domain 3"),
    ("3.4", "Determine when to use plan mode vs direct execution", "domain_3_claude_code_config", "Domain 3"),
    ("3.5", "Apply iterative refinement techniques for progressive improvement", "domain_3_claude_code_config", "Domain 3"),
    ("3.6", "Integrate Claude Code into CI/CD pipelines", "domain_3_claude_code_config", "Domain 3"),
    # Domain 4
    ("4.1", "Design prompts with explicit criteria to improve precision and reduce false positives", "domain_4_prompt_engineering", "Domain 4"),
    ("4.2", "Apply few-shot prompting to improve output consistency and quality", "domain_4_prompt_engineering", "Domain 4"),
    ("4.3", "Enforce structured output using tool use and JSON schemas", "domain_4_prompt_engineering", "Domain 4"),
    ("4.4", "Implement validation, retry, and feedback loops for extraction quality", "domain_4_prompt_engineering", "Domain 4"),
    ("4.5", "Design efficient batch processing strategies", "domain_4_prompt_engineering", "Domain 4"),
    ("4.6", "Design multi-instance and multi-pass review architectures", "domain_4_prompt_engineering", "Domain 4"),
    # Domain 5
    ("5.1", "Manage conversation context to preserve critical information across long interactions", "domain_5_context_management", "Domain 5"),
    ("5.2", "Design effective escalation and ambiguity resolution patterns", "domain_5_context_management", "Domain 5"),
    ("5.3", "Implement error propagation strategies across multi-agent systems", "domain_5_context_management", "Domain 5"),
    ("5.4", "Manage context effectively in large codebase exploration", "domain_5_context_management", "Domain 5"),
    ("5.5", "Design human review workflows and confidence calibration", "domain_5_context_management", "Domain 5"),
    ("5.6", "Preserve information provenance and handle uncertainty in multi-source synthesis", "domain_5_context_management", "Domain 5"),
]

# Calculate question counts per subdomain
subdomain_counts = {}
for q in questions:
    sd = q.get("subdomain", "")
    for code, title, dkey, dcode in subdomain_defs:
        if code in sd:
            subdomain_counts[code] = subdomain_counts.get(code, 0) + 1
            # Standardize subdomain on question
            q["subdomain"] = f"Subdomain {code}: {title}"
            break

subdomains_info = []
for code, title, dkey, dcode in subdomain_defs:
    subdomains_info.append({
        "code": code,
        "title": title,
        "domainKey": dkey,
        "domainCode": dcode,
        "questionCount": subdomain_counts.get(code, 0)
    })

# Format TypeScript output
ts_content = f"""import {{ Question, DomainInfo, DomainKey, SubdomainInfo, QuestionBank }} from './types';

export const DOMAINS: DomainInfo[] = {json.dumps(domains_info, indent=2)};

export const DOMAIN_MAP: Record<DomainKey, DomainInfo> = DOMAINS.reduce((acc, d) => {{
  acc[d.key] = d;
  return acc;
}}, {{}} as Record<DomainKey, DomainInfo>);

export const SUBDOMAINS: SubdomainInfo[] = {json.dumps(subdomains_info, indent=2)};

export const SUBDOMAIN_MAP: Record<string, SubdomainInfo> = SUBDOMAINS.reduce((acc, s) => {{
  acc[s.code] = s;
  return acc;
}}, {{}} as Record<string, SubdomainInfo>);

export const QUESTIONS_DATA: Question[] = {json.dumps(questions, indent=2, ensure_ascii=False)};

export function getQuestionsByBank(bank: QuestionBank): Question[] {{
  if (bank === 'all') return QUESTIONS_DATA;
  return QUESTIONS_DATA.filter(q => q.source === bank);
}}

export function getQuestionsByDomain(domainKey: DomainKey, bank?: QuestionBank): Question[] {{
  let list = QUESTIONS_DATA.filter(q => q.domain === domainKey);
  if (bank && bank !== 'all') {{
    list = list.filter(q => q.source === bank);
  }}
  return list;
}}

export function getQuestionsBySubdomain(subdomainCode: string, bank?: QuestionBank): Question[] {{
  let list = QUESTIONS_DATA.filter(q => q.subdomain && q.subdomain.includes(subdomainCode));
  if (bank && bank !== 'all') {{
    list = list.filter(q => q.source === bank);
  }}
  return list;
}}

export function getSubdomainsByDomain(domainKey: DomainKey): SubdomainInfo[] {{
  return SUBDOMAINS.filter(s => s.domainKey === domainKey);
}}
"""

out_path = os.path.join("cca-prep-app", "src", "lib", "questions-data.ts")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated {out_path} with {len(questions)} questions and {len(subdomains_info)} subdomains.")
