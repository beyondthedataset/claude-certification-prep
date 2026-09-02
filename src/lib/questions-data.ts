import { Question, DomainInfo, DomainKey } from './types';

export const DOMAINS: DomainInfo[] = [
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
];

export const DOMAIN_MAP: Record<DomainKey, DomainInfo> = DOMAINS.reduce((acc, d) => {
  acc[d.key] = d;
  return acc;
}, {} as Record<DomainKey, DomainInfo>);

export const QUESTIONS_DATA: Question[] = [
  {
    "question_number": 1,
    "question_id": 1007729,
    "discussion_id": "419229",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419229-exam-cca-f-topic-1-question-1-discussion/",
    "topic": "Topic 1",
    "question_text": "The synthesis agent receives summarized findings from the web search and document analysis agents, then passes a consolidated summary to the report generator. During testing, you discover the generated reports make factual claims without proper citations – the report generator cannot attribute statements to their original sources because that metadata was lost during the summarization steps. What’s the most effective approach to ensure proper source attribution in the final reports?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Have the report generator query the web search agent to re-locate sources for claims in the final report.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Have each agent output structured data separating content summaries from source metadata (URLs, document names, page numbers).",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Skip summarization and pass full raw outputs from web search and document analysis directly to the report generator.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Instruct the synthesis agent to embed source references inline within its summary text using a consistent citation format.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [
      {
        "voted_answers": "B",
        "vote_count": 2,
        "is_most_voted": false
      }
    ],
    "most_voted_answer": "B",
    "total_community_votes": 2,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "dino_co",
        "date": "1 week, 5 days ago",
        "vote": "",
        "upvotes": 2,
        "content": "This is the architecturally correct answer because it:\n\n- Preserves metadata at the source — Each agent outputs:\njson\n   {\n     \"summary\": \"...\",\n     \"sources\": [\n       {\"url\": \"...\", \"doc_name\": \"...\", \"page_num\": 42}\n     ]\n   }\n- Maintains information integrity — Metadata never gets stripped; it travels alongside the content through each stage\n- Enables proper attribution downstream — The report generator receives both claims and their provenance\n- Follows RAG best practices — This is how retrieval-augmented systems maintain citations (content + source chunks)"
      }
    ],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 2,
    "question_id": 1007730,
    "discussion_id": "419227",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419227-exam-cca-f-topic-1-question-2-discussion/",
    "topic": "Topic 1",
    "question_text": "After the web search agent finds 25 sources (120K tokens of raw content), the document analysis agent extracts key insights (15K tokens), and the synthesis agent produces a coherent narrative draft (3K tokens), the coordinator must pass context to the report generation agent for the final output with proper source citations. What context-passing strategy provides the best balance of completeness and efficiency?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Pass the full accumulated context from all prior agents.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Pass the synthesis draft along with a structured source index that maps key claims to their source URLs and relevant excerpts.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Pass only the synthesis draft and have a separate post-processing pipeline match claims to sources and insert citations after the report is generated.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Pass a condensed summary of all prior stages that preserves the main findings and attributes them to sources by name only.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 3,
    "question_id": 1007731,
    "discussion_id": "419226",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419226-exam-cca-f-topic-1-question-3-discussion/",
    "topic": "Topic 1",
    "question_text": "Your multi-agent research pipeline crashed after processing12 of 28 documents. The web search agent had identified relevant sources, the document analyzer had partially completed extraction, and the synthesizer had begun pattern identification. You need to resume processing without repeating work or losing fidelity of prior findings. What state management approach best balances information fidelity with context efficiency when restoring agent state?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Have each agent persist a structured export to a known location. On resume, the coordinator loads the manifest and injects relevant state into agent prompts.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Index all agent outputs in a shared vector store. When resuming, each agent queries the store using semantic search to retrieve relevant prior findings.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Have each agent maintain its own persistent state file and reload it independently at the start of each session.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Persist the coordinator’s conversation log containing all task delegations and responses, providing this to agents when resuming.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 4,
    "question_id": 1007732,
    "discussion_id": "419223",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419223-exam-cca-f-topic-1-question-4-discussion/",
    "topic": "Topic 1",
    "question_text": "You’ve configured the system so that all four subagents have access to the complete set of 18 tools. During testing, agents frequently call tools outside their specialization – the synthesis agent attempts web searches, and the report generator tries to analyze documents. What is the primary cause of this poor tool selection behavior?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Choosing from 18 tools instead of 4-5 relevant ones increases decision complexity beyond reliable selection thresholds.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "The tool definitions consume too much context window space, leaving insufficient room for task content.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "The agents’ role descriptions in their system prompts conflict with having access to tools outside that role.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "The coordinator cannot track which capabilities each subagent has, leading to misrouted tasks.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 5,
    "question_id": 1007733,
    "discussion_id": "419256",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419256-exam-cca-f-topic-1-question-5-discussion/",
    "topic": "Topic 1",
    "question_text": "The coordinator provides detailed step-by-step instructions to the web search subagent, specifying exact search queries, source priorities, and date filters. Production monitoring reveals three issues: (1) the subagent reports “insufficient results” rather than trying alternative approaches when pre-specified searches fail, (2) research quality drops for emerging topics that don’t match expected patterns, and (3) the subagent rarely surfaces valuable tangential sources. What’s the most effective way to improve subagent adaptability?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Implement a topic classification step where the coordinator categorizes requests as “well-defined” or “exploratory” and uses different instruction styles for each category.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Add explicit fallback directives to the detailed instructions: “If specified searches yield fewer than N results, attempt alternative query formulations before reporting failure.”",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Remove procedural details entirely, delegating with simple goals like “research X thoroughly” and relying on the subagent’s general capabilities.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Specify research goals and quality criteria (coverage breadth, source diversity, recency) rather than procedural steps, letting the subagent determine its search strategy.",
        "is_correct": true
      }
    ],
    "correct_answer": "D",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "D",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 6,
    "question_id": 1007734,
    "discussion_id": "419252",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419252-exam-cca-f-topic-1-question-6-discussion/",
    "topic": "Topic 1",
    "question_text": "The synthesis agent completes its initial pass but flags that three key research questions remain unanswered because the web search and document analysis agents didn’t find relevant information on those specific subtopics. The coordinator currently proceeds directly to report generation, producing reports with incomplete coverage. What change would most effectively improve research completeness?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Have the report generation agent note which research questions couldn’t be answered, so users understand the limitations of the final output.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Increase the initial breadth of queries sent to web search and document analysis to reduce the probability of missing relevant information.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Have the coordinator evaluate synthesis output for gaps, then re-delegate to web search and document analysis with targeted queries before invoking synthesis again.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Give the synthesis agent direct access to web search tools so it can autonomously fill knowledge gaps without returning control to the coordinator.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 7,
    "question_id": 1007735,
    "discussion_id": "419243",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419243-exam-cca-f-topic-1-question-7-discussion/",
    "topic": "Topic 1",
    "question_text": "The web search agent has gathered several relevant sources for a research topic. The document analysis agent now needs to examine these sources. How does information typically flow between these two specialized subagents?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "The agents communicate through an event-driven message queue, with the document analysis agent subscribing to web search completion events.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "The web search agent directly invokes the document analysis agent, passing the discovered sources as parameters.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "The coordinator agent receives the web search agent’s output and includes relevant findings in the prompt when invoking the document analysis agent.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Both agents access a shared memory store where the web search agent writes findings and the document analysis agent reads them.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 8,
    "question_id": 1007736,
    "discussion_id": "419225",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419225-exam-cca-f-topic-1-question-8-discussion/",
    "topic": "Topic 1",
    "question_text": "Production reviews reveal inconsistent handling of uncertainty in final reports. Sometimes conflicting subagent findings are synthesized into a single confident statement (losing nuance), while other times reports over-hedge with excessive qualifications (becoming unhelpful). When the web search agent returns “industry analysts estimate $50B market size (methodology varies)” and the document analysis agent returns “peer-reviewed study estimates $35B (±$7B, 95% CI),” the coordinator either picks one arbitrarily or produces vague statements like “the market may be $35B-$50B depending on factors.” What systematic approach best addresses this?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Configure subagents to only report findings meeting a high-confidence threshold, filtering uncertain information before it reaches the coordinator.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Add a verification subagent that cross-references findings across sources, only passing claims to synthesis that are corroborated by at least two independent sources.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Instruct the synthesis agent to structure reports with explicit sections distinguishing well-established findings from contested ones, preserving original source characterizations and methodological context.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Implement a confidence calibration layer that normalizes subagent uncertainty expressions to standardized probability scores (0.0-1.0), then weight-average findings by their calibrated confidence.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [
      {
        "voted_answers": "B",
        "vote_count": 1,
        "is_most_voted": false
      },
      {
        "voted_answers": "D",
        "vote_count": 1,
        "is_most_voted": true
      },
      {
        "voted_answers": "C",
        "vote_count": 1,
        "is_most_voted": false
      }
    ],
    "most_voted_answer": "D",
    "total_community_votes": 3,
    "community_consensus": "D",
    "is_controversial": true,
    "comments_count": 3,
    "discussions": [
      {
        "user": "aakash_0086",
        "date": "1 day, 18 hours ago",
        "vote": "",
        "upvotes": 1,
        "content": "C is correct , adding confidence calibration layer is unnecessary overhead."
      },
      {
        "user": "aakash_0086",
        "date": "1 day, 18 hours ago",
        "vote": "",
        "upvotes": 1,
        "content": "C is correct , adding confidence calibration layer is unnecessary overhead."
      },
      {
        "user": "ramsankar_gayu",
        "date": "1 week, 4 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "Address the root cause and eliminates arbitrary choices and preserves information"
      }
    ],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 9,
    "question_id": 1007737,
    "discussion_id": "419231",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419231-exam-cca-f-topic-1-question-9-discussion/",
    "topic": "Topic 1",
    "question_text": "In production, final reports frequently contain claims without proper source attribution. Investigation shows that while the web search and document analysis agents correctly attach citations to their outputs, the synthesis agent loses track of which sources support which conclusions when combining findings. What’s the most effective architectural change?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Require all subagents to output structured claim-source mappings that the synthesis agent must preserve and merge when combining findings from multiple sources.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Maintain complete transcripts of all subagent interactions and add a citation-resolution agent to analyze logs and determine attributions before report generation.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Add a verification step where the report generator uses semantic similarity matching against original sources to reconstruct which claims came from which documents.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Have the coordinator inject source identifier prefixes into text before each handoff, then parse these prefixes at report generation to reconstruct citations.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [
      {
        "voted_answers": "D",
        "vote_count": 1,
        "is_most_voted": false
      }
    ],
    "most_voted_answer": "D",
    "total_community_votes": 1,
    "community_consensus": "D",
    "is_controversial": true,
    "comments_count": 1,
    "discussions": [
      {
        "user": "AITeam",
        "date": "4 days, 18 hours ago",
        "vote": "",
        "upvotes": 1,
        "content": "A is incorrect, the question explicitly mentions \"the subagents correctly attach citations to their outputs\"\n\nD is correct as its clear the coordinator handled the context management poorly."
      }
    ],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 10,
    "question_id": 1007738,
    "discussion_id": "419236",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419236-exam-cca-f-topic-1-question-10-discussion/",
    "topic": "Topic 1",
    "question_text": "After the web search agent and document analysis agent complete their tasks, the coordinator invokes the synthesis agent. However, the synthesis agent responds that it cannot complete the task because no research findings were provided. What is the most likely cause of this issue?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "The subagents need to share a single API connection to enable automatic context sharing between invocations.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "The synthesis agent needs tools that can fetch results directly from the other agents’ conversation histories.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "The coordinator did not include the outputs from the previous agents in the synthesis agent’s prompt.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "The synthesis agent’s context window is not large enough to hold the combined outputs from both previous agents.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 11,
    "question_id": 1007739,
    "discussion_id": "419244",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419244-exam-cca-f-topic-1-question-11-discussion/",
    "topic": "Topic 1",
    "question_text": "Users report that final reports sometimes lack depth on specific subtopics. Investigation shows that the document analysis agent frequently identifies gaps – for instance, noting “the retrieved sources discuss API authentication but lack details on token refresh patterns” – but under the current strict pipeline, this insight isn’t actionable since search has already completed. What’s the most effective architectural change?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Add a research planning agent before the search phase that decomposes topics into specific sub-questions.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Have the analysis agent report specific gaps to the coordinator, which triggers targeted searches and re-invokes analysis until sufficient.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Have the coordinator review analysis output for gap indicators and re-invoke search with gap-informed queries when gaps are detected.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Have the synthesis agent attach confidence scores to each section and flag areas with insufficient coverage for manual review.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [
      {
        "voted_answers": "B",
        "vote_count": 5,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "B",
    "total_community_votes": 5,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 3,
    "discussions": [
      {
        "user": "ramsankar_gayu",
        "date": "1 week, 4 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "C places the burden incorrectly. Coordinator could not do that"
      },
      {
        "user": "rovir",
        "date": "2 weeks ago",
        "vote": "",
        "upvotes": 2,
        "content": "The analysis agent already knows exactly what's missing, but that information is discarded because of the linear pipeline."
      },
      {
        "user": "subbupro",
        "date": "2 weeks ago",
        "vote": "",
        "upvotes": 2,
        "content": "untill sufficinet is the key, once identify the gap have to finish, again re-invoke is must"
      }
    ],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 12,
    "question_id": 1007740,
    "discussion_id": "419238",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419238-exam-cca-f-topic-1-question-12-discussion/",
    "topic": "Topic 1",
    "question_text": "After the web search and document analysis subagents complete their tasks, the coordinator needs to spawn the synthesis subagent to synthesize the findings. What is the correct approach for providing the synthesis subagent with the information it needs?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Spawn the subagent with only a brief task description, relying on automatic context inheritance from the coordinator",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Provide the subagent with tool definitions that allow it to request outputs from other subagents via callbacks",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Pass reference identifiers and configure the subagent with read access to a shared memory store where other subagents deposited their results",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Include the complete findings from both subagents directly in the synthesis subagent’s prompt",
        "is_correct": true
      }
    ],
    "correct_answer": "D",
    "voted_stats": [
      {
        "voted_answers": "D",
        "vote_count": 1,
        "is_most_voted": false
      }
    ],
    "most_voted_answer": "D",
    "total_community_votes": 1,
    "community_consensus": "D",
    "is_controversial": false,
    "comments_count": 2,
    "discussions": [
      {
        "user": "Baddie",
        "date": "3 weeks, 6 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "Subagents generally do not automatically inherit the coordinator’s context or see other subagents’ outputs. The coordinator should explicitly provide the synthesis agent with all information needed to complete its task."
      },
      {
        "user": "lucas_0102",
        "date": "1 month, 1 week ago",
        "vote": "",
        "upvotes": 1,
        "content": "I'm having trouble seeing why this works—can someone help?"
      }
    ],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 13,
    "question_id": 1007741,
    "discussion_id": "419248",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419248-exam-cca-f-topic-1-question-13-discussion/",
    "topic": "Topic 1",
    "question_text": "When the agent calls lookup_order and receives order details showing the item was purchased 45 days ago, how does the agentic loop determine whether to call process_refund or escalate_to_human next?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "The orchestration layer automatically routes to the next tool based on the order’s status field.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "The order details are added to the conversation and the model reasons about which action to take.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "The agent executes the remaining steps in a tool sequence planned at the start of the request.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "The agent follows a pre-configured decision tree mapping order attributes to specific tool calls.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 14,
    "question_id": 1007742,
    "discussion_id": "419260",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419260-exam-cca-f-topic-1-question-14-discussion/",
    "topic": "Topic 1",
    "question_text": "After investigating a billing dispute over 25+ turns, you’ve identified that duplicate charges occurred due to a payment gateway timeout triggering retry logic. The required refund ($847) exceeds your $500 authorization limit You need to call escalate_to_human, and the human agent won’t have access to your conversation transcript. What context should you pass to enable effective resolution?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "A structured summary: customer ID, root cause, refund amount, and recommended action.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Your diagnosis and the refund amount only.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "The customer’s original complaint verbatim plus the tool result excerpts showing duplicate transactions.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "The complete conversation transcript with all tool results.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 15,
    "question_id": 1007743,
    "discussion_id": "419242",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419242-exam-cca-f-topic-1-question-15-discussion/",
    "topic": "Topic 1",
    "question_text": "Your agent is handling a billing dispute. After calling get_customer and lookup_order, it identifies that the dispute involves a promotional pricing error requiring manager approval – beyond the agent’s authorization level. How should the workflow handle this mid-process escalation?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Compile a structured handoff with customer details, order info, and the identified issue before calling escalate_to_human.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Persist the complete conversation and tool response history to a database, then call escalate_to_human with a reference ID.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Call escalate_to_human passing only the customer’s original message.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Attempt the refund with process_refund anyway, escalating only if the system rejects the transaction.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 16,
    "question_id": 1007744,
    "discussion_id": "419224",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419224-exam-cca-f-topic-1-question-16-discussion/",
    "topic": "Topic 1",
    "question_text": "You’re implementing the escalation logic for when the agent should call escalate_to_human. Your team proposes four different approaches for triggering escalation. Which approach will most reliably identify cases that genuinely require human intervention?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Implement sentiment analysis that monitors for frustration indicators (negative language, repeated questions, exclamation marks) and trigger escalation when the frustration score exceeds a configured threshold.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Configure the agent to escalate after three consecutive tool calls that fail to resolve the customer’s stated issue, ensuring a reasonable attempt before involving a human.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Instruct the agent to escalate when the customer requests a human, when the issue requires policy exceptions, or when the agent cannot make meaningful progress.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Build a rules engine that maps specific issue types, customer segments, and product categories to escalation decisions, removing the need for model judgment calls.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 17,
    "question_id": 1007745,
    "discussion_id": "419251",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419251-exam-cca-f-topic-1-question-17-discussion/",
    "topic": "Topic 1",
    "question_text": "Your order management system requires tools for three distinct operations: issuing refunds (requires amount and reason), canceling orders (requires reason), and requesting reshipments (requires shipping address). Each operation shares an order_id parameter but has different additional requirements. You notice during testing that with your current unified tool design, the agent frequently omits required parameters or includes irrelevant ones. What design change will most effectively improve parameter accuracy?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Keep one unified tool with a nested operation_details object parameter whose internal structure varies by operation type, documented in the tool description.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Keep one unified tool but add JSON Schema if-then-else conditionals to enforce that parameters like amount are required only when the operation type is “refund”.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Split into three separate tools (issue_refund, cancel_order, request_reshipment), each defining only the parameters required for that specific operation.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Keep one unified tool with all parameters marked optional, but add detailed few-shot examples in the system prompt showing correct parameter combinations for each operation type.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 18,
    "question_id": 1007746,
    "discussion_id": "419240",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419240-exam-cca-f-topic-1-question-18-discussion/",
    "topic": "Topic 1",
    "question_text": "Your post_content tool requires user confirmation before publishing. The current workflow displays “Ready to post to social media. Confirm?” and analytics show users approve 98% of requests within 2 seconds. Post-mortems reveal incidents where posts went to wrong accounts, were scheduled for wrong times, or contained errors – all confirmed by users without catching the mistakes. How should you redesign the confirmation workflow?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Auto-approve routine posts and only require explicit confirmation for unusual patterns like posting to new accounts or large audiences",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Require users to type a confirmation phrase instead of clicking a button",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Add a mandatory waiting period before the confirm option becomes available",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Include the complete post text, target account, scheduled time, and platform in the confirmation request",
        "is_correct": true
      }
    ],
    "correct_answer": "D",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "D",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 19,
    "question_id": 1007747,
    "discussion_id": "419261",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419261-exam-cca-f-topic-1-question-19-discussion/",
    "topic": "Topic 1",
    "question_text": "Your agent uses three tools: get_property_details(property_id) returns data including street address, get_price_history(property_id) returns historical pricing, and get_neighborhood_info(address) returns area statistics. You observe that get_neighborhood_info always requires get_property_details first just to extract the address, even when users specify the property by ID. This creates unnecessary latency and failure coupling – if the first call fails, the neighborhood request also fails. What tool design change best addresses this?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Create a lookup_address(property_id) helper tool for retrieving addresses.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Add retry logic and timeout handling to get_property_details.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Change get_neighborhood_info to accept property_id, resolving the address internally.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Consolidate into a single get_property_with_neighborhood(property_id) tool returning both datasets.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 20,
    "question_id": 1007748,
    "discussion_id": "419241",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419241-exam-cca-f-topic-1-question-20-discussion/",
    "topic": "Topic 1",
    "question_text": "Your update_user_profile tool accepts a user_id (required) and an optional fields_to_update object. In testing, Claude frequently omits user_id or passes incorrectly structured data. What is most critical for helping Claude understand what parameter values to provide?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Strict JSON Schema type constraints marking user_id as required and defining fields_to_update as an object type",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Verbose parameter names encoding format hints, such as user_id_string_uuid_format",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Detailed error responses explaining why invalid parameter values were rejected",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Clear parameter descriptions explaining expected format, such as “user_id: UUID of the user to update (required)”",
        "is_correct": true
      }
    ],
    "correct_answer": "D",
    "voted_stats": [
      {
        "voted_answers": "D",
        "vote_count": 6,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "D",
    "total_community_votes": 6,
    "community_consensus": "D",
    "is_controversial": false,
    "comments_count": 4,
    "discussions": [
      {
        "user": "Tarak9",
        "date": "1 month ago",
        "vote": "",
        "upvotes": 5,
        "content": "Answer: D. Clear parameter descriptions explaining expected format, such as “user_id: UUID of the user to update (required)”\nWhy D is most important\nLarge language models primarily rely on the semantic descriptions of tool parameters to determine what values to provide. Clear, explicit descriptions tell the model:\n\nWhat the parameter represents\nWhether it is required\nWhat format is expected\nHow it should be used"
      },
      {
        "user": "rovir",
        "date": "2 weeks ago",
        "vote": "",
        "upvotes": 1,
        "content": "It doesn't address issue with fields_to_update that has an object type with complex structure"
      },
      {
        "user": "subbupro",
        "date": "2 weeks ago",
        "vote": "",
        "upvotes": 1,
        "content": "schema can restrict what data type, but the value might be some restriction even string we can give integer, but it should be like an 6 digit end with X letter -> Then we have to tell it in the description , not on JSON schema"
      },
      {
        "user": "rovir",
        "date": "1 week, 6 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "In addition to regular data types, it also supports description and format (Regex, UUID, IPv4, etc)."
      }
    ],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 21,
    "question_id": 1007749,
    "discussion_id": "419237",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419237-exam-cca-f-topic-1-question-21-discussion/",
    "topic": "Topic 1",
    "question_text": "Your document extraction tool uses ML models to extract invoice fields (vendor, amount, date). The models return confidence scores (0.0-1.0) for each extracted field. In production, you observe: (1) the agent proceeds with low-confidence extractions that are incorrect 23% of the time, and (2) the agent requests unnecessary human review for 31% of extractions that were actually correct. How should you restructure the tool’s output?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Return fields with their raw confidence scores and add detailed few-shot examples to your system prompt demonstrating how to interpret different confidence ranges and when to request human review.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Return fields with confidence scores, plus a request_review boolean computed using your tested confidence thresholds, along with a review_reasons array explaining which fields triggered review.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Compute an aggregate extraction_quality score across all fields and return it alongside the extracted values. Include a text summary describing the overall extraction reliability.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Return fields organized into verified and needs_verification objects based on confidence thresholds.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 22,
    "question_id": 1007750,
    "discussion_id": "419255",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419255-exam-cca-f-topic-1-question-22-discussion/",
    "topic": "Topic 1",
    "question_text": "Your product search tool queries an external catalog API and returns matching items. In production, you observe the agent frequently retries searches immediately after receiving zero results, treating “no matches found” as a failure requiring retry. The external API returns HTTP 200 with an empty results array – a valid response. How should you restructure the tool’s result to help the agent correctly interpret empty result sets?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Add a suggestions field containing alternative search strategies when results are empty, helping guide the agent toward more productive follow-up queries.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Return a natural language string describing the outcome, allowing the agent to interpret the result contextually based on the message content.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Return a result object with isError: true and a message explaining no products matched.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Return a structured result with a success boolean and results array, reserving isError: true for actual execution failures only.",
        "is_correct": true
      }
    ],
    "correct_answer": "D",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "D",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 23,
    "question_id": 1007751,
    "discussion_id": "419257",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419257-exam-cca-f-topic-1-question-23-discussion/",
    "topic": "Topic 1",
    "question_text": "Your MCP server includes archive_file(file_id) and delete_file(file_id) tools. Production logs show the agent calls delete_file when users ask to “remove old backups,” but company policy requires archiving backup files. Both tools currently have minimal descriptions: “Archives a file” and “Deletes a file.” Which change most directly improves tool selection for this scenario?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Expand tool descriptions to clarify use cases, adding guidance like “Do not use for backup files” to delete_file.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Add a confirmation step that requires users to type “CONFIRM DELETE” before delete_file executes.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Implement server-side validation that rejects delete_file calls for files tagged as backups, returning an error message suggesting archive_file.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Add few-shot examples to the system prompt demonstrating that requests involving “backup” or “old” should use archive_file.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [
      {
        "voted_answers": "A",
        "vote_count": 2,
        "is_most_voted": false
      },
      {
        "voted_answers": "C",
        "vote_count": 2,
        "is_most_voted": false
      }
    ],
    "most_voted_answer": "A",
    "total_community_votes": 4,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 2,
    "discussions": [
      {
        "user": "DenKG",
        "date": "5 days, 8 hours ago",
        "vote": "",
        "upvotes": 2,
        "content": "A: The model focuses primarily on the description. If the description is poor, no other action will resolve the root cause of the problem."
      },
      {
        "user": "f2deaea",
        "date": "2 weeks ago",
        "vote": "",
        "upvotes": 2,
        "content": "C addresses the problem at the source of truth and prevents policy violations even when:\n\nTool descriptions are ambiguous.\nThe model misinterprets the user's request.\nPrompts change over time.\nDifferent agents or clients use the MCP server."
      }
    ],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 24,
    "question_id": 1007752,
    "discussion_id": "419263",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419263-exam-cca-f-topic-1-question-24-discussion/",
    "topic": "Topic 1",
    "question_text": "Your track_shipment(tracking_id) tool queries an external logistics API that sometimes fails – the API may be temporarily unavailable, the tracking ID may be malformed, or the shipment may not exist. Currently, your tool raises a Python exception when errors occur. Users report the agent gives unhelpful responses like “I’m having trouble with that request” instead of suggesting alternatives such as verifying the tracking number format or checking by order number. How should you handle errors in tool results?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Return a generic error response (e.g., {\"success\": false, \"error\": \"lookup_failed\"}) for all failure cases to maintain a consistent schema and avoid exposing internal error details.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Return structured error information as normal tool output including error type, recoverability status, and actionable context for the user.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Create dedicated error-recovery tools (retry_tracking_lookup, search_by_order_number) that the model can invoke after the primary tracking tool returns a failure indicator.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Implement retry logic with exponential backoff inside the tool implementation so transient errors are automatically handled and only return a result after all retry attempts are exhausted.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 25,
    "question_id": 1007753,
    "discussion_id": "419267",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419267-exam-cca-f-topic-1-question-25-discussion/",
    "topic": "Topic 1",
    "question_text": "Your MCP server implements a check_availability tool that queries an external calendar API. During testing, you encounter three error conditions: (1) the tool is called with a malformed request missing the required user_email parameter, (2) the calendar API returns a 404 because the specified user doesn’t exist in the calendar system, and (3) the calendar API returns a 503 because the service is temporarily unavailable. How should each error be reported according to MCP’s error handling design?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Report all three as tool results with isError: true.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Report errors 1 and 2 as JSON-RPC protocol errors; report error 3 as a tool result with isError: true.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Report error 1 as a JSON-RPC protocol error; report errors 2 and 3 as tool results with isError: true.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Report all three as JSON-RPC protocol errors.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 26,
    "question_id": 1007754,
    "discussion_id": "419222",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419222-exam-cca-f-topic-1-question-26-discussion/",
    "topic": "Topic 1",
    "question_text": "Your send_notification tool calls third-party messaging APIs. When these services time out during delivery, you cannot determine whether the message was actually sent. Currently, the tool returns is_error: true with a generic “Notification failed” message for all timeouts. Production monitoring reveals agents automatically retry these failures, frequently causing users to receive duplicate notifications. How should you modify the error response?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Return is_error: true with a structured field retry_safe: true for timeouts, distinguishing them from permanent failures that should not be retried.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Return is_error: true with a message communicating uncertainty: “Timeout – status unknown. Message may have been sent. Avoid retry.”",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Return is_error: true with a message encouraging retry: “Delivery service temporarily unavailable. Please retry the notification.”",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Return is_error: true with the original message content echoed back.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [
      {
        "voted_answers": "B",
        "vote_count": 3,
        "is_most_voted": false
      }
    ],
    "most_voted_answer": "B",
    "total_community_votes": 3,
    "community_consensus": "B",
    "is_controversial": true,
    "comments_count": 1,
    "discussions": [
      {
        "user": "DenKG",
        "date": "5 days, 8 hours ago",
        "vote": "",
        "upvotes": 3,
        "content": "B: Only this approach eliminates the described problem of sending a duplicate notification that may have already been sent."
      }
    ],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 27,
    "question_id": 1007755,
    "discussion_id": "419228",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419228-exam-cca-f-topic-1-question-27-discussion/",
    "topic": "Topic 1",
    "question_text": "Your control_device tool manages smart home devices through external APIs. When a device doesn’t respond within the timeout period, the tool returns an error. Production logs show that the agent simply tells users “the device is not responding” without offering helpful next steps. Which error response structure would best enable the agent to provide useful follow-up?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Set is_error: true with a structured technical error containing the device ID, timeout duration, and raw API response code for debugging purposes.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Set is_error: true with a brief “Device offline” message and provide a separate tool the agent can call to retrieve context-specific troubleshooting suggestions.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Set is_error: false with an optimistic message indicating the command was dispatched successfully but device acknowledgment is still pending.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Set is_error: true with a message explaining the likely cause and suggesting troubleshooting steps the agent can offer the user.",
        "is_correct": true
      }
    ],
    "correct_answer": "D",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "D",
    "is_controversial": false,
    "comments_count": 3,
    "discussions": [
      {
        "user": "lucas_0102",
        "date": "1 month, 1 week ago",
        "vote": "",
        "upvotes": 1,
        "content": "Can anyone shed light on why this is the correct choice?"
      },
      {
        "user": "DenKG",
        "date": "5 days, 8 hours ago",
        "vote": "",
        "upvotes": 1,
        "content": "D transmits the relevant domain context to the agent the moment a failure occurs. Upon receiving a message such as \"Error: Device failed to respond in time. Possible causes: power loss, weak Wi-Fi signal, or sleep mode. Suggest that the user check the power indicator or reboot the router,\" the agent can turn this information into a helpful dialogue. It will demonstrate empathy and provide specific, human-friendly instructions, significantly enhancing the user experience (UX)."
      },
      {
        "user": "DenKG",
        "date": "5 days, 8 hours ago",
        "vote": "",
        "upvotes": 2,
        "content": "The agent must provide the user with information about the problem and tell them something like, \"The device is currently unavailable; please try again later.\""
      }
    ],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 28,
    "question_id": 1007756,
    "discussion_id": "419239",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419239-exam-cca-f-topic-1-question-28-discussion/",
    "topic": "Topic 1",
    "question_text": "Your expense reimbursement agent processes employee requests using a process_reimbursement tool. Company policy requires that reimbursements above $500 must be approved by a manager before funds are disbursed. The agent handles hundreds of requests daily, and you need the threshold enforcement to be tamper-proof regardless of how the agent is prompted. Which design ensures the $500 approval threshold cannot be bypassed?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "The process_reimbursement tool accepts amount and details, and internally enforces the threshold: amounts <$500 are auto-disbursed and the tool returns a success confirmation; amounts >$500 cause the tool to create a pending approval request and return a status indicating manager review is pending.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "The process_reimbursement tool accepts an approved_by_manager: boolean parameter. The system prompt instructs the agent to only set this to true after confirming that a manager has approved the request. A nightly audit script reviews all reimbursements where approved_by_manager was set to true.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Provide two tools: auto_reimburse (hard-coded limit of $500) and request_manager_approval. Include detailed system prompt instructions telling the agent to check the amount and call the appropriate tool. Add a PostToolUse hook that logs which tool was called for auditing.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Implement the threshold check in a PreToolUse hook that inspects the amount parameter before process_reimbursement executes. If the amount exceeds $500, the hook modifies the tool call to add a requires_approval: true flag, which the tool checks before disbursing.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 29,
    "question_id": 1007757,
    "discussion_id": "419234",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419234-exam-cca-f-topic-1-question-29-discussion/",
    "topic": "Topic 1",
    "question_text": "Your content curation agent discovers articles, analyzes each for relevance, then adds selected articles to themed collections. With separate discover_articles(topic), analyze_article(id), and add_to_collection(article_id, collection_id) tools, you observe 18+ sequential tool calls per request, causing latency issues. The agent must make editorial judgments about which articles fit a collection’s theme – this requires seeing all candidates with their analysis scores simultaneously to select a cohesive set. What tool composition best addresses efficiency while preserving editorial judgment?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Keep all tools separate but implement response caching for analyze_article calls.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Create a curate_collection(topic, collection_id) tool that handles discovery, analysis, and selection internally using configurable quality thresholds.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Create a discover_and_analyze(topic) composite tool that returns all candidates with their analysis scores, keeping add_to_collection separate for selective calls.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Add a preview_curation(topic, collection_id) tool that shows what would be added based on predefined rules, with an approve_curation() tool to confirm.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 30,
    "question_id": 1007758,
    "discussion_id": "419245",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419245-exam-cca-f-topic-1-question-30-discussion/",
    "topic": "Topic 1",
    "question_text": "The document analysis agent has a single analyze_documnet tool that takes a document and a free-text instruction parameter. During evaluation, requests like “extract the key financial metrics” often return narrative summaries, while “summarize the methodology” sometimes returns raw data tables. The synthesis agent reports that 35% of analysis results require re-requests with clarified instructions. What’s the most effective way to improve reliability?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Have the coordinator pre-classify each analysis request before passing instructions to the document analysis agent",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Keep the single tool but add an analyze_type enum parameter requiring explicit selection between extraction, summarization, and verification modes",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Enhance the tool description with detailed examples showing how different instruction phrasings should map to different output formats",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Split the generic tool into purpose-specific tools – extract_data_points, summarize_content, verify_claim_against_source – each with defined input/output contracts",
        "is_correct": true
      }
    ],
    "correct_answer": "D",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "D",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 31,
    "question_id": 1007759,
    "discussion_id": "419266",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419266-exam-cca-f-topic-1-question-31-discussion/",
    "topic": "Topic 1",
    "question_text": "Compliance requires that refunds exceeding $500 must automatically escalate to a human agent – this rule cannot be left to model discretion. Despite clear system prompt instructions, production logs show the agent occasionally processes high-value refunds directly (3% failure rate). How should you achieve guaranteed compliance?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Modify the refund tool to return an error with message “Amount exceeds policy limit – please escalate” when threshold is exceeded.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Add few-shot examples to the prompt showing correct escalation behavior at various refund amounts ($400, $500, $600).",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Implement a hook to intercept tool calls; when the refund process amount exceeds $500, block it and invoke human escalation.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Strengthen the system prompt with emphatic language: “CRITICAL POLICY: Refunds over $500 MUST trigger human escalation. NEVER process these directly.”",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 32,
    "question_id": 1007760,
    "discussion_id": "419249",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419249-exam-cca-f-topic-1-question-32-discussion/",
    "topic": "Topic 1",
    "question_text": "Production logs reveal inconsistent error handling: when lookup_order fails, the agent sometimes retries 5+ times (wasteful when the order ID doesn’t exist), sometimes escalates immediately (premature for temporary network issues), and sometimes asks users for clarification (inappropriate when the issue is a backend permission error). Investigation shows your MCP tool returns uniform error responses: {\"isError\": true, \"content\": [{\"type\": \"text\", \"text\": \"Operation failed\"}]}. The agent cannot distinguish between error types. What’s the most effective improvement?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Create an analyze_error MCP tool the agent calls after any failure to determine the error category and recommended action.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Add few-shot examples to the system prompt demonstrating how to interpret error message patterns and select appropriate responses for each.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Enhance error responses with structured metadata: include errorCategory (transient/validation/permission), isRetryable boolean, and a description of what caused the failure.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Implement retry logic with exponential backoff in your MCP server for all errors, returning to the agent only after retries are exhausted.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 33,
    "question_id": 1007761,
    "discussion_id": "419265",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419265-exam-cca-f-topic-1-question-33-discussion/",
    "topic": "Topic 1",
    "question_text": "When implementing your lookup_order MCP tool, the backend sometimes returns errors (e.g., “Order not found” or temporary database failures). What is the correct pattern for communicating these errors back to the agent?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Throw an exception from the tool handler so the agent framework can catch and log it",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Return the error message in the tool result content with the isError flag set to true",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Log the error server-side and return an empty result to avoid confusing the model",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Return a success response with a “status” field indicating the error type",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 34,
    "question_id": 1007762,
    "discussion_id": "419262",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419262-exam-cca-f-topic-1-question-34-discussion/",
    "topic": "Topic 1",
    "question_text": "Your process_refund tool returns two types of errors: technical errors (“503 Service Unavailable”, “Connection timeout”) that are transient (5% of calls), and business errors (“Order exceeds 30 day return window”, “Item already refunded”) that are permanent (12% of calls). Monitoring shows the agent wastes 3-4 turns retrying business errors that can never succeed. Currently, both error types return only a plain text message to Claude.\nWhat’s the most effective way to reduce wasted retries while improving customer-facing response quality?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Implement automatic retry logic at the tool level for technical errors only, passing business errors to Claude without retries.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Add few-shot examples showing how to distinguish retriable from non-retriable errors by parsing error message text.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Return structured error responses with retriable: false for business errors and a customer-friendly explanation for Claude to use.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Add a check_refund_eligibility tool that must be called before process_refund to prevent business rule violations.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 35,
    "question_id": 1007763,
    "discussion_id": "419253",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419253-exam-cca-f-topic-1-question-35-discussion/",
    "topic": "Topic 1",
    "question_text": "Your get_portfolio_value tool returns the total value of a user’s investment portfolio. You’re deciding between returning a structured JSON object with explicit fields versus returning the information as a formatted text string. What is the primary advantage of using structured output with defined fields?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "JSON schemas automatically validate that the underlying API returned correct data before the agent processes it.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Structured JSON consumes significantly fewer tokens than natural language, substantially reducing API costs.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Structured JSON is processed deterministically by the model, significantly improving accuracy when extracting values.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "The agent can reliably extract specific values without parsing free-form text, reducing errors in subsequent operations.",
        "is_correct": true
      }
    ],
    "correct_answer": "D",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "D",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 36,
    "question_id": 1007764,
    "discussion_id": "419264",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419264-exam-cca-f-topic-1-question-36-discussion/",
    "topic": "Topic 1",
    "question_text": "The coordinator agent has AgentDefinitions configured for all four specialized subagents, each with appropriate descriptions, prompts, and tool restrictions. During testing, you notice the coordinator correctly reasons about when to delegate – it generates messages like “I’ll ask the web search agent to find sources on this topic” – but no subagent execution ever occurs. The coordinator then proceeds as if the delegation happened and continues with incomplete information. Logs show no errors. What is the most likely cause?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "The coordinator’s max_tokens setting is too low, causing the Task tool invocation to be truncated before the subagent type parameter can be specified.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "The coordinator’s allowedTools configuration doesn’t include “Task”, so while it can reason about delegation, it cannot invoke the tool required to spawn subagents.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "The AgentDefinitions are configured correctly, but the coordinator’s system prompt doesn’t explicitly list the available subagent types, preventing the model from knowing they can be invoked.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Subagent context isolation means task descriptions from the coordinator don’t automatically reach subagents; you need to configure explicit context forwarding in ClaudeAgentOptions.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 37,
    "question_id": 1007765,
    "discussion_id": "419247",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419247-exam-cca-f-topic-1-question-37-discussion/",
    "topic": "Topic 1",
    "question_text": "Your conversational assistant frequently generates multiple clarifying questions when users make ambiguous requests. When a user asks “Can you help me with the report?”, the assistant responds: “I’d be happy to help! Could you tell me: 1) Which report? 2) What kind of help – drafting, reviewing, or formatting? 3) What’s your deadline?”\nUser analytics show a 40% conversation abandonment rate after these multi-question responses. What’s the most effective way to reduce friction while appropriately handling ambiguity?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Limit the assistant to one clarifying question per turn, using conversation history to accumulate answers over multiple exchanges rather than requesting everything upfront.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Add a preprocessing step using a smaller model to classify request ambiguity on a 1-5 scale, routing high-ambiguity requests to a clarification dialog and low-ambiguity requests directly to the assistant.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Modify the system prompt to instruct the assistant to make reasonable assumptions from available context, state those assumptions explicitly, and offer to adjust if the interpretation is wrong.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Create a lookup table of common request patterns with predefined default interpretations, having the assistant respond with those defaults without stating the assumptions made.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 38,
    "question_id": 1007766,
    "discussion_id": "419250",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419250-exam-cca-f-topic-1-question-38-discussion/",
    "topic": "Topic 1",
    "question_text": "After 30+ turns, your conversational assistant shows noticeably slower responses and occasionally produces less coherent outputs. Investigation reveals: (1) average conversations reach 50,000 tokens by turn 35, (2) production logs show 94% of user messages only reference the previous 3-5 exchanges, (3) the 6% of queries referencing earlier context typically ask about information the user could easily re-state. Your goal is to improve response speed and quality while maintaining good user experience. What’s the most effective approach?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Enable prompt caching and continue sending the complete conversation history, using cached prefixes to reduce per-request costs while preserving all context.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Build a retrieval system that stores all conversation turns and uses semantic search to pull in relevant historical context only when the current query appears to reference past information.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Implement a summarization layer that progressively compresses older conversation turns into a running summary while keeping the most recent 5-6 turns verbatim, maintaining full historical context in condensed form.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Implement a sliding window keeping only the system prompt and last 8-10 turns. When users reference earlier context, acknowledge the limitation and ask them to re-state the relevant information.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [
      {
        "voted_answers": "C",
        "vote_count": 2,
        "is_most_voted": false
      },
      {
        "voted_answers": "D",
        "vote_count": 2,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "D",
    "total_community_votes": 4,
    "community_consensus": "D",
    "is_controversial": true,
    "comments_count": 4,
    "discussions": [
      {
        "user": "DenKG",
        "date": "3 days, 17 hours ago",
        "vote": "",
        "upvotes": 2,
        "content": "From the user's perspective C looks better"
      },
      {
        "user": "anttan",
        "date": "3 weeks, 4 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "The correct answer is D, because the evidence strongly indicates that most conversations do not require long-term context:\n94% of user messages reference only the previous 3–5 exchanges.\nThe 6% that reference older context involve information the user can easily restate.\nThe primary goals are to improve response speed and quality, both of which benefit from reducing the context window.\nA sliding window containing the system prompt and the most recent 8–10 turns is the simplest and most effective solution. It significantly reduces the prompt size, improving latency and reducing context dilution, while gracefully handling the rare cases where older context is needed by asking the user to restate it."
      },
      {
        "user": "Tarak9",
        "date": "1 month ago",
        "vote": "",
        "upvotes": 1,
        "content": "In practice: implement a sliding window of ~8-10 turns plus the system prompt. When a user references something outside that window (the rare 6% case), the assistant can respond naturally — e.g., \"Could you remind me of the details on that? I want to make sure I get it right\" — which is a minor, low-cost interaction given how infrequently it occurs, in exchange for consistently faster and more coherent responses across the vast majority of turns."
      },
      {
        "user": "rovir",
        "date": "1 week, 4 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "Sounds terrible from the user's perspective, forcing them to repeat themselves. I would never use this system after even a single such response. End-user experience should always have the highest priority."
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 39,
    "question_id": 1007767,
    "discussion_id": "419235",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419235-exam-cca-f-topic-1-question-39-discussion/",
    "topic": "Topic 1",
    "question_text": "Production monitoring shows that follow-up queries like “summarize what we learned about market trends” consistently take 40+ seconds. Investigation reveals the coordinator spawns the synthesis subagent for each summarization request, passing 80K+ tokens of accumulated findings. The coordinator already has these findings in its context from orchestrating the research. What’s the most effective way to improve response time for these follow-up summaries?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Enable prompt caching on the synthesis subagent to reduce the overhead of repeatedly transferring the same research findings.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Have the coordinator handle straightforward summarization requests directly using its existing context, reserving subagent spawning for complex analysis.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Pre-generate and cache summaries at multiple granularities whenever new findings accumulate.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Spawn the synthesis subagent with reduced context and have it request specific findings from the coordinator on-demand.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 40,
    "question_id": 1007768,
    "discussion_id": "419246",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419246-exam-cca-f-topic-1-question-40-discussion/",
    "topic": "Topic 1",
    "question_text": "A customer raises three separate issues during one session: a refund inquiry (turns 1-15), a subscription question (turns 16-30), and a payment method update (turns 31-45). At turn 48, the customer asks “What happened with my refund?” The conversation is approaching context limits. What strategy best maintains the agent’s ability to address all issues throughout the session?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Extract and persist structured issue data (order IDs, amounts, statuses) into a separate context layer.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Summarize earlier turns into a narrative description, preserving full message history only for the active issue.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Rely on MCP tools to re-fetch relevant information on demand when the customer references earlier issues.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Implement sliding window context that retains the most recent 30 turns.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 41,
    "question_id": 1007769,
    "discussion_id": "419233",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419233-exam-cca-f-topic-1-question-41-discussion/",
    "topic": "Topic 1",
    "question_text": "During a billing dispute resolution, your agent successfully retrieves customer info via get_customer and order details via lookup_order, but when attempting to call process_refund, the tool returns a timeout error. The agent has enough information to explain the charges and verify refund eligibility, but cannot actually process the refund due to the backend failure. What approach best balances first-contact resolution with appropriate error handling?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Explain the billing confirm refund eligibility, acknowledge the system issue preventing immediate processing, and offer escalation or retry later",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Confirm the refund will be processed and close the conversation, since the system has all necessary information to complete it automatically",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Implement automatic retries with exponential backoff for process_refund, keeping the conversation open until the refund is successfully processed",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Escalate immediately to a human agent since the refund action cannot be completed",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 42,
    "question_id": 1007770,
    "discussion_id": "419259",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419259-exam-cca-f-topic-1-question-42-discussion/",
    "topic": "Topic 1",
    "question_text": "Your agent has called lookup_order multiple times while investigating a customer’s return requests. Each response includes 40+ fields (items, shipping details, payment info, status history). Tool outputs now represent the majority of the conversation’s context. The customer mentions two more orders they want to discuss. What’s the most effective approach before making additional lookups?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Move all tool responses to a vector database with semantic indexing, retrieving relevant portions as the conversation continues",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Proceed with additional lookups without modifying the existing tool output context",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Have the model generate a natural language summary of each order’s key details, replacing structured responses with prose descriptions",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Extract only the return-relevant fields (items, purchase date, return window, status) from each existing order response, removing verbose details",
        "is_correct": true
      }
    ],
    "correct_answer": "D",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "D",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 43,
    "question_id": 1007771,
    "discussion_id": "419254",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419254-exam-cca-f-topic-1-question-43-discussion/",
    "topic": "Topic 1",
    "question_text": "A customer writes: “I’ve been going back and forth on this return for days. I just want to speak to someone who can actually help me.” The agent has confirmed via lookup_order that the return is straightforward – within policy and eligible for immediate processing. What should the agent do?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Process the refund via process_refund to resolve the underlying issue, then inform them it’s complete",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Acknowledge frustration, inform them this is resolvable now, and offer to complete it or escalate",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Call escalate_to_human immediately to honor the customer’s request",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Ask what specifically hasn’t worked in previous attempts before deciding whether to escalate or resolve automatically",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 44,
    "question_id": 1007772,
    "discussion_id": "419258",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419258-exam-cca-f-topic-1-question-44-discussion/",
    "topic": "Topic 1",
    "question_text": "A customer sends: “This is frustrating. I’ve explained my issue twice and nothing is being resolved. I want to talk to a real person NOW.” The agent has not yet called any tools to investigate their account. What should the agent do?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Immediately call escalate_to_human with the conversation history.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Briefly explain what the agent can help with and offer to resolve the issue quickly, escalating only if the customer repeats their request.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "First call get_customer and lookup_order to gather account context, then escalate to a human agent.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Acknowledge the frustration and ask one targeted question to understand the specific issue before escalating.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [
      {
        "voted_answers": "C",
        "vote_count": 2,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "C",
    "total_community_votes": 2,
    "community_consensus": "C",
    "is_controversial": true,
    "comments_count": 1,
    "discussions": [
      {
        "user": "InvalidNickname",
        "date": "1 week ago",
        "vote": "",
        "upvotes": 2,
        "content": "By proactively calling tools (get_customer, lookup_order) to gather the necessary context before escalating, the agent ensures the human representative receives a \"warm\" handoff with all the relevant data pre-loaded."
      }
    ],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 45,
    "question_id": 1007773,
    "discussion_id": "419232",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419232-exam-cca-f-topic-1-question-45-discussion/",
    "topic": "Topic 1",
    "question_text": "A customer returns 4 hours after the initial session about the same billing dispute. The previous 32-turn session contains lookup_order results showing “Status: PENDING, Expected resolution: 24-48 hours.” In testing, you observe that when resuming sessions with stale tool results, the agent often references the outdated data in responses (e.g., “I see your refund is still being processed”) even after subsequent fresh tool calls return different information. What approach most reliably handles returning customers?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Start a new session, inject a structured summary of the previous interaction (issue type, actions taken, resolution status), then make fresh tool calls before engaging.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Resume with full history but filter out previous tool_result messages before resuming, keeping only the human/assistant turns so the agent must re-fetch needed data.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Resume with full history and configure the agent to automatically re-call all previously-used tools at session start to ensure data freshness.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Resume with full history and add a system prompt instruction telling the agent to always prefer the most recent tool results when multiple calls to the same tool exist in context.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 46,
    "question_id": 1007774,
    "discussion_id": "419230",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419230-exam-cca-f-topic-1-question-46-discussion/",
    "topic": "Topic 1",
    "question_text": "The agent verifies customer identity through a multi-step process before resetting passwords. During testing, you notice that after the customer answers the third verification question, the agent asks them to provide their name again, as if the earlier exchange never happened. What’s the most likely cause of this behavior?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "The verification tool is clearing the agent’s internal state after each successful validation step.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Claude’s memory retention is limited to two conversational turns by default, requiring explicit configuration to extend it.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "The conversation history isn’t being passed in subsequent API requests.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "The prompt lacks instructions telling Claude to remember information across multiple exchanges.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 47,
    "question_id": 1007775,
    "discussion_id": "419311",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419311-exam-cca-f-topic-1-question-47-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nCase Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nBlue Yonder Airlines is a global carrier headquartered in Los Angeles, California, operating domestic and international flights. The company serves millions of passengers annually through its website, mobile app, and call centers. To improve customer service efficiency and reduce call center volume, Blue Yonder is deploying an AI agent in Microsoft Copilot Studio.\nThe agent will handle customer inquiries across multiple channels – web chat, mobile app, and Microsoft Teams (for internal support staff). It will answer questions, retrieve data from enterprise systems, and escalate to human agents when needed.\nThe project is led by a cross-function team:\nProduct manager: Defines requirements and success metrics.\nLead agent author: Designs topics, intents, and generative behavior.\nFlow designers: Build agent flows and integrations.\nIT/security and compliance: Oversees identity, data protection, and Responsible AI (RAI) compliance.\nCurrent environment -\nChannels -\nPublic website: Embedded web chat\nMobile app: In-app chatbot -\nMicrosoft Teams: Internal support agent access\nIdentity and access -\nCustomers: Anonymous access for general inquiries (e.g., flight status, baggage policy).\nAuthentication is required for personal data access (e.g., bookings, loyalty points).\nInternal staff: Authenticate via Microsoft Entra ID.\nData sources -\nReservation and Ticketing System (internal): REST API, no prebuilt connector with custom enterprise database.\nFlight Status and Weather APIs (external): REST APIs with API keys.\nCustomer Support Knowledge Base: SharePoint library with PDFs and policy documents.\nLoyalty Program Data: Stored in Dynamics 365 and Dataverse.\nTravel Advisory Content: Uses REST API with partner services.\nIntegration mechanisms -\nCustom connectors must be used for internal APIs that lack prebuilt connectors.\nHTTP request nodes may be used for lightweight external APIs.\nKnowledge sources must be used for unstructured content.\nAgent flows must be used to encapsulate reusable logic (e.g., rebooking).\nBusiness requirements -\nOmnichannel support -\nDeploy the agent across web, mobile, and Teams with a consistent user experience. The Teams deployment must also support internal staff.\nSelf-service capabilities -\nThe agent must handle common inquiries such as:\nFlight status -\nBooking and rebooking -\nLoyalty program questions -\nTravel policies and baggage rules\nHuman escalation -\nIf the agent cannot resolve an issue or the user requests help, it must:\nEscalate to a human agent.\nTransfer the conversation transcript and relevant context.\nRedact any sensitive personal data before escalation.\nKnowledge integration -\nThe agent must use scalable methods for knowledge integration and must not rely on manually authored Q&A topics for each document.\nPerformance metrics -\nFirst-contact resolution: +25%\nTier-1 call deflection: ≥20%\nResponse time: 90% of queries answered within 30 seconds\nAccuracy: ≥95% for known FAQs -\nCSAT: ≥85% for AI-handled interactions\nTechnical requirements -\nPlatform constraints -\nNo custom code is permitted; only Copilot Studio's built-in tools may be used.\nAll backend logic must be implemented using agent flows.\nMarkdown must be used for formatting (e.g., bold, bullet points); HTML is not supported.\nAuthentication -\nSign-in is required for personal data access.\nAnonymous access is allowed for general inquiries.\nUser identity must be used for data access; shared or builder credentials must not be used.\nCompliance and security -\nPower Platform DLP policies must be enforced to block unauthorized data flows.\nResponsible AI content moderation filters must be enabled.\nPrompt modifications must be added to enforce tone, disclaimers, and refusal behavior.\nDisclaimers must be applied consistently across all generative responses. Manual edits to individual topics must be avoided.\nMonitoring and maintenance -\nAll conversations and actions must be logged for auditing.\nWeekly reviews of transcripts and metrics must be conducted.\nIssues and constraints -\nAPI rate limits: External APIs (e.g., flight status) have usage limits. Agent flows must handle retries and caching to avoid exceeding quotas.\nKnowledge base limits: Copilot Studio has limits on the number and size of indexed documents. Large files must be split or summarized.\nGenerative answer risks: Generative responses must be constrained to avoid policy violations. Prompt modifications and filters must be used to enforce tone, safety, and compliance.\nUser input variability: Users phrase questions in diverse ways. Topics must include varied trigger phrases and fallback handling.\nAuthentication UX: The agent must clearly explain when sign-in is required and handle transitions smoothly across channels.\nProblem statement -\nBlue Yonder Airlines must deploy a secure, scalable, and policy-compliant AI agent using Microsoft Copilot Studio. The agent must deliver accurate, helpful, and safe responses across multiple channels, integrate with enterprise systems, and support both anonymous and authenticated users. It must adhere to strict data protection and Responsible AI standards while improving customer service efficiency and satisfaction.\nYou need to configure the agent in Copilot Studio to meet Blue Vender's Responsible AI and data protection requirements.\nWhich three actions should you perform in sequence? To answer, move the appropriate actions from the list of actions to the answer area and arrange them in the correct order.",
    "images": [
      "https://img.examtopics.com/ab-620/image1.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 2,
    "discussions": [
      {
        "user": "Hatsapatsa",
        "date": "1 month, 1 week ago",
        "vote": "",
        "upvotes": 6,
        "content": "I think 3 should be Configure content moderation filters as stated in the case study."
      },
      {
        "user": "60ed5c2",
        "date": "1 month, 1 week ago",
        "vote": "",
        "upvotes": 1,
        "content": "I agree the question specifically talks to configuration, testing would come later."
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 48,
    "question_id": 1007776,
    "discussion_id": "419312",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419312-exam-cca-f-topic-1-question-48-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nCase Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nBlue Yonder Airlines is a global carrier headquartered in Los Angeles, California, operating domestic and international flights. The company serves millions of passengers annually through its website, mobile app, and call centers. To improve customer service efficiency and reduce call center volume, Blue Yonder is deploying an AI agent in Microsoft Copilot Studio.\nThe agent will handle customer inquiries across multiple channels – web chat, mobile app, and Microsoft Teams (for internal support staff). It will answer questions, retrieve data from enterprise systems, and escalate to human agents when needed.\nThe project is led by a cross-function team:\nProduct manager: Defines requirements and success metrics.\nLead agent author: Designs topics, intents, and generative behavior.\nFlow designers: Build agent flows and integrations.\nIT/security and compliance: Oversees identity, data protection, and Responsible AI (RAI) compliance.\nCurrent environment -\nChannels -\nPublic website: Embedded web chat\nMobile app: In-app chatbot -\nMicrosoft Teams: Internal support agent access\nIdentity and access -\nCustomers: Anonymous access for general inquiries (e.g., flight status, baggage policy).\nAuthentication is required for personal data access (e.g., bookings, loyalty points).\nInternal staff: Authenticate via Microsoft Entra ID.\nData sources -\nReservation and Ticketing System (internal): REST API, no prebuilt connector with custom enterprise database.\nFlight Status and Weather APIs (external): REST APIs with API keys.\nCustomer Support Knowledge Base: SharePoint library with PDFs and policy documents.\nLoyalty Program Data: Stored in Dynamics 365 and Dataverse.\nTravel Advisory Content: Uses REST API with partner services.\nIntegration mechanisms -\nCustom connectors must be used for internal APIs that lack prebuilt connectors.\nHTTP request nodes may be used for lightweight external APIs.\nKnowledge sources must be used for unstructured content.\nAgent flows must be used to encapsulate reusable logic (e.g., rebooking).\nBusiness requirements -\nOmnichannel support -\nDeploy the agent across web, mobile, and Teams with a consistent user experience. The Teams deployment must also support internal staff.\nSelf-service capabilities -\nThe agent must handle common inquiries such as:\nFlight status -\nBooking and rebooking -\nLoyalty program questions -\nTravel policies and baggage rules\nHuman escalation -\nIf the agent cannot resolve an issue or the user requests help, it must:\nEscalate to a human agent.\nTransfer the conversation transcript and relevant context.\nRedact any sensitive personal data before escalation.\nKnowledge integration -\nThe agent must use scalable methods for knowledge integration and must not rely on manually authored Q&A topics for each document.\nPerformance metrics -\nFirst-contact resolution: +25%\nTier-1 call deflection: ≥20%\nResponse time: 90% of queries answered within 30 seconds\nAccuracy: ≥95% for known FAQs -\nCSAT: ≥85% for AI-handled interactions\nTechnical requirements -\nPlatform constraints -\nNo custom code is permitted; only Copilot Studio's built-in tools may be used.\nAll backend logic must be implemented using agent flows.\nMarkdown must be used for formatting (e.g., bold, bullet points); HTML is not supported.\nAuthentication -\nSign-in is required for personal data access.\nAnonymous access is allowed for general inquiries.\nUser identity must be used for data access; shared or builder credentials must not be used.\nCompliance and security -\nPower Platform DLP policies must be enforced to block unauthorized data flows.\nResponsible AI content moderation filters must be enabled.\nPrompt modifications must be added to enforce tone, disclaimers, and refusal behavior.\nDisclaimers must be applied consistently across all generative responses. Manual edits to individual topics must be avoided.\nMonitoring and maintenance -\nAll conversations and actions must be logged for auditing.\nWeekly reviews of transcripts and metrics must be conducted.\nIssues and constraints -\nAPI rate limits: External APIs (e.g., flight status) have usage limits. Agent flows must handle retries and caching to avoid exceeding quotas.\nKnowledge base limits: Copilot Studio has limits on the number and size of indexed documents. Large files must be split or summarized.\nGenerative answer risks: Generative responses must be constrained to avoid policy violations. Prompt modifications and filters must be used to enforce tone, safety, and compliance.\nUser input variability: Users phrase questions in diverse ways. Topics must include varied trigger phrases and fallback handling.\nAuthentication UX: The agent must clearly explain when sign-in is required and handle transitions smoothly across channels.\nProblem statement -\nBlue Yonder Airlines must deploy a secure, scalable, and policy-compliant AI agent using Microsoft Copilot Studio. The agent must deliver accurate, helpful, and safe responses across multiple channels, integrate with enterprise systems, and support both anonymous and authenticated users. It must adhere to strict data protection and Responsible AI standards while improving customer service efficiency and satisfaction.\nYou need to evaluate whether the current configuration decisions for the Blue Yonder Copilot agent comply with the company's security and governance policies.\nWhich compliance status should you assign to each configuration decision? To answer, move the appropriate compliance statuses to the correct configuration decisions. You may use each compliance status once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image3.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "lucas_0102",
        "date": "1 month, 1 week ago",
        "vote": "",
        "upvotes": 1,
        "content": "I'm struggling with this—why is this the correct answer?"
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 49,
    "question_id": 1007777,
    "discussion_id": "419277",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419277-exam-cca-f-topic-1-question-49-discussion/",
    "topic": "Topic 1",
    "question_text": "Case Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nBlue Yonder Airlines is a global carrier headquartered in Los Angeles, California, operating domestic and international flights. The company serves millions of passengers annually through its website, mobile app, and call centers. To improve customer service efficiency and reduce call center volume, Blue Yonder is deploying an AI agent in Microsoft Copilot Studio.\nThe agent will handle customer inquiries across multiple channels – web chat, mobile app, and Microsoft Teams (for internal support staff). It will answer questions, retrieve data from enterprise systems, and escalate to human agents when needed.\nThe project is led by a cross-function team:\nProduct manager: Defines requirements and success metrics.\nLead agent author: Designs topics, intents, and generative behavior.\nFlow designers: Build agent flows and integrations.\nIT/security and compliance: Oversees identity, data protection, and Responsible AI (RAI) compliance.\nCurrent environment -\nChannels -\nPublic website: Embedded web chat\nMobile app: In-app chatbot -\nMicrosoft Teams: Internal support agent access\nIdentity and access -\nCustomers: Anonymous access for general inquiries (e.g., flight status, baggage policy).\nAuthentication is required for personal data access (e.g., bookings, loyalty points).\nInternal staff: Authenticate via Microsoft Entra ID.\nData sources -\nReservation and Ticketing System (internal): REST API, no prebuilt connector with custom enterprise database.\nFlight Status and Weather APIs (external): REST APIs with API keys.\nCustomer Support Knowledge Base: SharePoint library with PDFs and policy documents.\nLoyalty Program Data: Stored in Dynamics 365 and Dataverse.\nTravel Advisory Content: Uses REST API with partner services.\nIntegration mechanisms -\nCustom connectors must be used for internal APIs that lack prebuilt connectors.\nHTTP request nodes may be used for lightweight external APIs.\nKnowledge sources must be used for unstructured content.\nAgent flows must be used to encapsulate reusable logic (e.g., rebooking).\nBusiness requirements -\nOmnichannel support -\nDeploy the agent across web, mobile, and Teams with a consistent user experience. The Teams deployment must also support internal staff.\nSelf-service capabilities -\nThe agent must handle common inquiries such as:\nFlight status -\nBooking and rebooking -\nLoyalty program questions -\nTravel policies and baggage rules\nHuman escalation -\nIf the agent cannot resolve an issue or the user requests help, it must:\nEscalate to a human agent.\nTransfer the conversation transcript and relevant context.\nRedact any sensitive personal data before escalation.\nKnowledge integration -\nThe agent must use scalable methods for knowledge integration and must not rely on manually authored Q&A topics for each document.\nPerformance metrics -\nFirst-contact resolution: +25%\nTier-1 call deflection: ≥20%\nResponse time: 90% of queries answered within 30 seconds\nAccuracy: ≥95% for known FAQs -\nCSAT: ≥85% for AI-handled interactions\nTechnical requirements -\nPlatform constraints -\nNo custom code is permitted; only Copilot Studio's built-in tools may be used.\nAll backend logic must be implemented using agent flows.\nMarkdown must be used for formatting (e.g., bold, bullet points); HTML is not supported.\nAuthentication -\nSign-in is required for personal data access.\nAnonymous access is allowed for general inquiries.\nUser identity must be used for data access; shared or builder credentials must not be used.\nCompliance and security -\nPower Platform DLP policies must be enforced to block unauthorized data flows.\nResponsible AI content moderation filters must be enabled.\nPrompt modifications must be added to enforce tone, disclaimers, and refusal behavior.\nDisclaimers must be applied consistently across all generative responses. Manual edits to individual topics must be avoided.\nMonitoring and maintenance -\nAll conversations and actions must be logged for auditing.\nWeekly reviews of transcripts and metrics must be conducted.\nIssues and constraints -\nAPI rate limits: External APIs (e.g., flight status) have usage limits. Agent flows must handle retries and caching to avoid exceeding quotas.\nKnowledge base limits: Copilot Studio has limits on the number and size of indexed documents. Large files must be split or summarized.\nGenerative answer risks: Generative responses must be constrained to avoid policy violations. Prompt modifications and filters must be used to enforce tone, safety, and compliance.\nUser input variability: Users phrase questions in diverse ways. Topics must include varied trigger phrases and fallback handling.\nAuthentication UX: The agent must clearly explain when sign-in is required and handle transitions smoothly across channels.\nProblem statement -\nBlue Yonder Airlines must deploy a secure, scalable, and policy-compliant AI agent using Microsoft Copilot Studio. The agent must deliver accurate, helpful, and safe responses across multiple channels, integrate with enterprise systems, and support both anonymous and authenticated users. It must adhere to strict data protection and Responsible AI standards while improving customer service efficiency and satisfaction.\nYou need to deploy the Blue Yonder Copilot agent to the public website and Microsoft Teams while ensuring compliance with the company's security and Responsible AI requirements.\nWhich two actions should you perform before making the agent available on both channels? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Configure prompt modifications to enforce tone, disclaimers, and refusal behavior at the system level.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Manually add disclaimers to each topic before publishing.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Embed the web channel and then rely on channel-level settings to enforce content moderation.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Configure Power Platform DLP policies to restrict unauthorized data connectors.",
        "is_correct": true
      },
      {
        "letter": "E",
        "text": "Publish the agent and then enable Responsible AI filters individually for each channel.",
        "is_correct": false
      }
    ],
    "correct_answer": "A, D",
    "voted_stats": [
      {
        "voted_answers": "AD",
        "vote_count": 3,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "AD",
    "total_community_votes": 3,
    "community_consensus": "AD",
    "is_controversial": true,
    "comments_count": 2,
    "discussions": [
      {
        "user": "moodin",
        "date": "3 weeks, 2 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "Brief states \"Power Platform DLP policies must be enforced to block unauthorized data flows.\" Additionally, E is configuring per-channel rather than system level, bad practice."
      },
      {
        "user": "690471c",
        "date": "1 month, 1 week ago",
        "vote": "",
        "upvotes": 2,
        "content": "las políticas DLP de Power Platform permiten bloquear conectores, canales o fuentes de datos no autorizados. Es una medida esencial antes de publicar un agente conectado a sistemas empresariales."
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 50,
    "question_id": 1007778,
    "discussion_id": "419306",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419306-exam-cca-f-topic-1-question-50-discussion/",
    "topic": "Topic 1",
    "question_text": "Case Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nBlue Yonder Airlines is a global carrier headquartered in Los Angeles, California, operating domestic and international flights. The company serves millions of passengers annually through its website, mobile app, and call centers. To improve customer service efficiency and reduce call center volume, Blue Yonder is deploying an AI agent in Microsoft Copilot Studio.\nThe agent will handle customer inquiries across multiple channels – web chat, mobile app, and Microsoft Teams (for internal support staff). It will answer questions, retrieve data from enterprise systems, and escalate to human agents when needed.\nThe project is led by a cross-function team:\nProduct manager: Defines requirements and success metrics.\nLead agent author: Designs topics, intents, and generative behavior.\nFlow designers: Build agent flows and integrations.\nIT/security and compliance: Oversees identity, data protection, and Responsible AI (RAI) compliance.\nCurrent environment -\nChannels -\nPublic website: Embedded web chat\nMobile app: In-app chatbot -\nMicrosoft Teams: Internal support agent access\nIdentity and access -\nCustomers: Anonymous access for general inquiries (e.g., flight status, baggage policy).\nAuthentication is required for personal data access (e.g., bookings, loyalty points).\nInternal staff: Authenticate via Microsoft Entra ID.\nData sources -\nReservation and Ticketing System (internal): REST API, no prebuilt connector with custom enterprise database.\nFlight Status and Weather APIs (external): REST APIs with API keys.\nCustomer Support Knowledge Base: SharePoint library with PDFs and policy documents.\nLoyalty Program Data: Stored in Dynamics 365 and Dataverse.\nTravel Advisory Content: Uses REST API with partner services.\nIntegration mechanisms -\nCustom connectors must be used for internal APIs that lack prebuilt connectors.\nHTTP request nodes may be used for lightweight external APIs.\nKnowledge sources must be used for unstructured content.\nAgent flows must be used to encapsulate reusable logic (e.g., rebooking).\nBusiness requirements -\nOmnichannel support -\nDeploy the agent across web, mobile, and Teams with a consistent user experience. The Teams deployment must also support internal staff.\nSelf-service capabilities -\nThe agent must handle common inquiries such as:\nFlight status -\nBooking and rebooking -\nLoyalty program questions -\nTravel policies and baggage rules\nHuman escalation -\nIf the agent cannot resolve an issue or the user requests help, it must:\nEscalate to a human agent.\nTransfer the conversation transcript and relevant context.\nRedact any sensitive personal data before escalation.\nKnowledge integration -\nThe agent must use scalable methods for knowledge integration and must not rely on manually authored Q&A topics for each document.\nPerformance metrics -\nFirst-contact resolution: +25%\nTier-1 call deflection: ≥20%\nResponse time: 90% of queries answered within 30 seconds\nAccuracy: ≥95% for known FAQs -\nCSAT: ≥85% for AI-handled interactions\nTechnical requirements -\nPlatform constraints -\nNo custom code is permitted; only Copilot Studio's built-in tools may be used.\nAll backend logic must be implemented using agent flows.\nMarkdown must be used for formatting (e.g., bold, bullet points); HTML is not supported.\nAuthentication -\nSign-in is required for personal data access.\nAnonymous access is allowed for general inquiries.\nUser identity must be used for data access; shared or builder credentials must not be used.\nCompliance and security -\nPower Platform DLP policies must be enforced to block unauthorized data flows.\nResponsible AI content moderation filters must be enabled.\nPrompt modifications must be added to enforce tone, disclaimers, and refusal behavior.\nDisclaimers must be applied consistently across all generative responses. Manual edits to individual topics must be avoided.\nMonitoring and maintenance -\nAll conversations and actions must be logged for auditing.\nWeekly reviews of transcripts and metrics must be conducted.\nIssues and constraints -\nAPI rate limits: External APIs (e.g., flight status) have usage limits. Agent flows must handle retries and caching to avoid exceeding quotas.\nKnowledge base limits: Copilot Studio has limits on the number and size of indexed documents. Large files must be split or summarized.\nGenerative answer risks: Generative responses must be constrained to avoid policy violations. Prompt modifications and filters must be used to enforce tone, safety, and compliance.\nUser input variability: Users phrase questions in diverse ways. Topics must include varied trigger phrases and fallback handling.\nAuthentication UX: The agent must clearly explain when sign-in is required and handle transitions smoothly across channels.\nProblem statement -\nBlue Yonder Airlines must deploy a secure, scalable, and policy-compliant AI agent using Microsoft Copilot Studio. The agent must deliver accurate, helpful, and safe responses across multiple channels, integrate with enterprise systems, and support both anonymous and authenticated users. It must adhere to strict data protection and Responsible AI standards while improving customer service efficiency and satisfaction.\nYou need to configure the Blue Yonder Copilot agent's responses in accordance with the company's content control and platform requirements.\nWhich two actions should you perform? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Add required disclaimer text inside each individual topic.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Configure prompt instructions that include disclaimer text.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Use Markdown syntax within response content.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Insert HTML formatting directly into topic responses.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Duplicate disclaimer text across reusable topics.",
        "is_correct": false
      }
    ],
    "correct_answer": "B, C",
    "voted_stats": [
      {
        "voted_answers": "BC",
        "vote_count": 2,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "BC",
    "total_community_votes": 2,
    "community_consensus": "BC",
    "is_controversial": true,
    "comments_count": 1,
    "discussions": [
      {
        "user": "moodin",
        "date": "3 weeks, 2 days ago",
        "vote": "",
        "upvotes": 2,
        "content": "\"Disclaimers must be applied consistently across all generative responses\" for B, and \"Markdown must be used for formatting (e.g., bold, bullet points); HTML is not supported\" for C"
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 51,
    "question_id": 1007779,
    "discussion_id": "419274",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419274-exam-cca-f-topic-1-question-51-discussion/",
    "topic": "Topic 1",
    "question_text": "Case Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nBlue Yonder Airlines is a global carrier headquartered in Los Angeles, California, operating domestic and international flights. The company serves millions of passengers annually through its website, mobile app, and call centers. To improve customer service efficiency and reduce call center volume, Blue Yonder is deploying an AI agent in Microsoft Copilot Studio.\nThe agent will handle customer inquiries across multiple channels – web chat, mobile app, and Microsoft Teams (for internal support staff). It will answer questions, retrieve data from enterprise systems, and escalate to human agents when needed.\nThe project is led by a cross-function team:\nProduct manager: Defines requirements and success metrics.\nLead agent author: Designs topics, intents, and generative behavior.\nFlow designers: Build agent flows and integrations.\nIT/security and compliance: Oversees identity, data protection, and Responsible AI (RAI) compliance.\nCurrent environment -\nChannels -\nPublic website: Embedded web chat\nMobile app: In-app chatbot -\nMicrosoft Teams: Internal support agent access\nIdentity and access -\nCustomers: Anonymous access for general inquiries (e.g., flight status, baggage policy).\nAuthentication is required for personal data access (e.g., bookings, loyalty points).\nInternal staff: Authenticate via Microsoft Entra ID.\nData sources -\nReservation and Ticketing System (internal): REST API, no prebuilt connector with custom enterprise database.\nFlight Status and Weather APIs (external): REST APIs with API keys.\nCustomer Support Knowledge Base: SharePoint library with PDFs and policy documents.\nLoyalty Program Data: Stored in Dynamics 365 and Dataverse.\nTravel Advisory Content: Uses REST API with partner services.\nIntegration mechanisms -\nCustom connectors must be used for internal APIs that lack prebuilt connectors.\nHTTP request nodes may be used for lightweight external APIs.\nKnowledge sources must be used for unstructured content.\nAgent flows must be used to encapsulate reusable logic (e.g., rebooking).\nBusiness requirements -\nOmnichannel support -\nDeploy the agent across web, mobile, and Teams with a consistent user experience. The Teams deployment must also support internal staff.\nSelf-service capabilities -\nThe agent must handle common inquiries such as:\nFlight status -\nBooking and rebooking -\nLoyalty program questions -\nTravel policies and baggage rules\nHuman escalation -\nIf the agent cannot resolve an issue or the user requests help, it must:\nEscalate to a human agent.\nTransfer the conversation transcript and relevant context.\nRedact any sensitive personal data before escalation.\nKnowledge integration -\nThe agent must use scalable methods for knowledge integration and must not rely on manually authored Q&A topics for each document.\nPerformance metrics -\nFirst-contact resolution: +25%\nTier-1 call deflection: ≥20%\nResponse time: 90% of queries answered within 30 seconds\nAccuracy: ≥95% for known FAQs -\nCSAT: ≥85% for AI-handled interactions\nTechnical requirements -\nPlatform constraints -\nNo custom code is permitted; only Copilot Studio's built-in tools may be used.\nAll backend logic must be implemented using agent flows.\nMarkdown must be used for formatting (e.g., bold, bullet points); HTML is not supported.\nAuthentication -\nSign-in is required for personal data access.\nAnonymous access is allowed for general inquiries.\nUser identity must be used for data access; shared or builder credentials must not be used.\nCompliance and security -\nPower Platform DLP policies must be enforced to block unauthorized data flows.\nResponsible AI content moderation filters must be enabled.\nPrompt modifications must be added to enforce tone, disclaimers, and refusal behavior.\nDisclaimers must be applied consistently across all generative responses. Manual edits to individual topics must be avoided.\nMonitoring and maintenance -\nAll conversations and actions must be logged for auditing.\nWeekly reviews of transcripts and metrics must be conducted.\nIssues and constraints -\nAPI rate limits: External APIs (e.g., flight status) have usage limits. Agent flows must handle retries and caching to avoid exceeding quotas.\nKnowledge base limits: Copilot Studio has limits on the number and size of indexed documents. Large files must be split or summarized.\nGenerative answer risks: Generative responses must be constrained to avoid policy violations. Prompt modifications and filters must be used to enforce tone, safety, and compliance.\nUser input variability: Users phrase questions in diverse ways. Topics must include varied trigger phrases and fallback handling.\nAuthentication UX: The agent must clearly explain when sign-in is required and handle transitions smoothly across channels.\nProblem statement -\nBlue Yonder Airlines must deploy a secure, scalable, and policy-compliant AI agent using Microsoft Copilot Studio. The agent must deliver accurate, helpful, and safe responses across multiple channels, integrate with enterprise systems, and support both anonymous and authenticated users. It must adhere to strict data protection and Responsible AI standards while improving customer service efficiency and satisfaction.\nYou need to configure the agent in Copilot Studio to use internal and external partner knowledge sources to answer user questions about the airline services.\nWhich two actions should you perform? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Use a Microsoft Graph connector to index the partner's travel advisory content.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Write individual Q&A pairs for each document as separate topics.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Enable unrestricted web search for the agent.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Add the internal policy documents as a knowledge source.",
        "is_correct": true
      }
    ],
    "correct_answer": "A, D",
    "voted_stats": [
      {
        "voted_answers": "AD",
        "vote_count": 1,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "AD",
    "total_community_votes": 1,
    "community_consensus": "AD",
    "is_controversial": true,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "3 weeks, 2 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "Travel Advisory Content: Uses REST API with partner services.> if this is true then A cannot be the option"
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 52,
    "question_id": 1007780,
    "discussion_id": "419280",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419280-exam-cca-f-topic-1-question-52-discussion/",
    "topic": "Topic 1",
    "question_text": "Case Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nBlue Yonder Airlines is a global carrier headquartered in Los Angeles, California, operating domestic and international flights. The company serves millions of passengers annually through its website, mobile app, and call centers. To improve customer service efficiency and reduce call center volume, Blue Yonder is deploying an AI agent in Microsoft Copilot Studio.\nThe agent will handle customer inquiries across multiple channels – web chat, mobile app, and Microsoft Teams (for internal support staff). It will answer questions, retrieve data from enterprise systems, and escalate to human agents when needed.\nThe project is led by a cross-function team:\nProduct manager: Defines requirements and success metrics.\nLead agent author: Designs topics, intents, and generative behavior.\nFlow designers: Build agent flows and integrations.\nIT/security and compliance: Oversees identity, data protection, and Responsible AI (RAI) compliance.\nCurrent environment -\nChannels -\nPublic website: Embedded web chat\nMobile app: In-app chatbot -\nMicrosoft Teams: Internal support agent access\nIdentity and access -\nCustomers: Anonymous access for general inquiries (e.g., flight status, baggage policy).\nAuthentication is required for personal data access (e.g., bookings, loyalty points).\nInternal staff: Authenticate via Microsoft Entra ID.\nData sources -\nReservation and Ticketing System (internal): REST API, no prebuilt connector with custom enterprise database.\nFlight Status and Weather APIs (external): REST APIs with API keys.\nCustomer Support Knowledge Base: SharePoint library with PDFs and policy documents.\nLoyalty Program Data: Stored in Dynamics 365 and Dataverse.\nTravel Advisory Content: Uses REST API with partner services.\nIntegration mechanisms -\nCustom connectors must be used for internal APIs that lack prebuilt connectors.\nHTTP request nodes may be used for lightweight external APIs.\nKnowledge sources must be used for unstructured content.\nAgent flows must be used to encapsulate reusable logic (e.g., rebooking).\nBusiness requirements -\nOmnichannel support -\nDeploy the agent across web, mobile, and Teams with a consistent user experience. The Teams deployment must also support internal staff.\nSelf-service capabilities -\nThe agent must handle common inquiries such as:\nFlight status -\nBooking and rebooking -\nLoyalty program questions -\nTravel policies and baggage rules\nHuman escalation -\nIf the agent cannot resolve an issue or the user requests help, it must:\nEscalate to a human agent.\nTransfer the conversation transcript and relevant context.\nRedact any sensitive personal data before escalation.\nKnowledge integration -\nThe agent must use scalable methods for knowledge integration and must not rely on manually authored Q&A topics for each document.\nPerformance metrics -\nFirst-contact resolution: +25%\nTier-1 call deflection: ≥20%\nResponse time: 90% of queries answered within 30 seconds\nAccuracy: ≥95% for known FAQs -\nCSAT: ≥85% for AI-handled interactions\nTechnical requirements -\nPlatform constraints -\nNo custom code is permitted; only Copilot Studio's built-in tools may be used.\nAll backend logic must be implemented using agent flows.\nMarkdown must be used for formatting (e.g., bold, bullet points); HTML is not supported.\nAuthentication -\nSign-in is required for personal data access.\nAnonymous access is allowed for general inquiries.\nUser identity must be used for data access; shared or builder credentials must not be used.\nCompliance and security -\nPower Platform DLP policies must be enforced to block unauthorized data flows.\nResponsible AI content moderation filters must be enabled.\nPrompt modifications must be added to enforce tone, disclaimers, and refusal behavior.\nDisclaimers must be applied consistently across all generative responses. Manual edits to individual topics must be avoided.\nMonitoring and maintenance -\nAll conversations and actions must be logged for auditing.\nWeekly reviews of transcripts and metrics must be conducted.\nIssues and constraints -\nAPI rate limits: External APIs (e.g., flight status) have usage limits. Agent flows must handle retries and caching to avoid exceeding quotas.\nKnowledge base limits: Copilot Studio has limits on the number and size of indexed documents. Large files must be split or summarized.\nGenerative answer risks: Generative responses must be constrained to avoid policy violations. Prompt modifications and filters must be used to enforce tone, safety, and compliance.\nUser input variability: Users phrase questions in diverse ways. Topics must include varied trigger phrases and fallback handling.\nAuthentication UX: The agent must clearly explain when sign-in is required and handle transitions smoothly across channels.\nProblem statement -\nBlue Yonder Airlines must deploy a secure, scalable, and policy-compliant AI agent using Microsoft Copilot Studio. The agent must deliver accurate, helpful, and safe responses across multiple channels, integrate with enterprise systems, and support both anonymous and authenticated users. It must adhere to strict data protection and Responsible AI standards while improving customer service efficiency and satisfaction.\nYou need to ensure that every AI-generated response from the agent in Copilot Studio includes a disclaimer that complies with the company's security and governance policies.\nWhich two actions should you perform? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Add a greeting message that includes the disclaimer.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Add a prompt modification in the generative answers node settings.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Create a disclaimer topic that always runs first.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Disable generative answers and use only pre-authored responses.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Edit every topic's first message to include the disclaimer.",
        "is_correct": false
      }
    ],
    "correct_answer": "A, B",
    "voted_stats": [
      {
        "voted_answers": "BC",
        "vote_count": 4,
        "is_most_voted": false
      }
    ],
    "most_voted_answer": "BC",
    "total_community_votes": 4,
    "community_consensus": "BC",
    "is_controversial": true,
    "comments_count": 1,
    "discussions": [
      {
        "user": "Hatsapatsa",
        "date": "1 month, 1 week ago",
        "vote": "",
        "upvotes": 4,
        "content": "I would say 'B and C' because A only runs once, case study requires it to be added to each generative response and therefore a reusable separate topic would be the better option."
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 53,
    "question_id": 1007781,
    "discussion_id": "419276",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419276-exam-cca-f-topic-1-question-53-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nCase Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nBlue Yonder Airlines is a global carrier headquartered in Los Angeles, California, operating domestic and international flights. The company serves millions of passengers annually through its website, mobile app, and call centers. To improve customer service efficiency and reduce call center volume, Blue Yonder is deploying an AI agent in Microsoft Copilot Studio.\nThe agent will handle customer inquiries across multiple channels – web chat, mobile app, and Microsoft Teams (for internal support staff). It will answer questions, retrieve data from enterprise systems, and escalate to human agents when needed.\nThe project is led by a cross-function team:\nProduct manager: Defines requirements and success metrics.\nLead agent author: Designs topics, intents, and generative behavior.\nFlow designers: Build agent flows and integrations.\nIT/security and compliance: Oversees identity, data protection, and Responsible AI (RAI) compliance.\nCurrent environment -\nChannels -\nPublic website: Embedded web chat\nMobile app: In-app chatbot -\nMicrosoft Teams: Internal support agent access\nIdentity and access -\nCustomers: Anonymous access for general inquiries (e.g., flight status, baggage policy).\nAuthentication is required for personal data access (e.g., bookings, loyalty points).\nInternal staff: Authenticate via Microsoft Entra ID.\nData sources -\nReservation and Ticketing System (internal): REST API, no prebuilt connector with custom enterprise database.\nFlight Status and Weather APIs (external): REST APIs with API keys.\nCustomer Support Knowledge Base: SharePoint library with PDFs and policy documents.\nLoyalty Program Data: Stored in Dynamics 365 and Dataverse.\nTravel Advisory Content: Uses REST API with partner services.\nIntegration mechanisms -\nCustom connectors must be used for internal APIs that lack prebuilt connectors.\nHTTP request nodes may be used for lightweight external APIs.\nKnowledge sources must be used for unstructured content.\nAgent flows must be used to encapsulate reusable logic (e.g., rebooking).\nBusiness requirements -\nOmnichannel support -\nDeploy the agent across web, mobile, and Teams with a consistent user experience. The Teams deployment must also support internal staff.\nSelf-service capabilities -\nThe agent must handle common inquiries such as:\nFlight status -\nBooking and rebooking -\nLoyalty program questions -\nTravel policies and baggage rules\nHuman escalation -\nIf the agent cannot resolve an issue or the user requests help, it must:\nEscalate to a human agent.\nTransfer the conversation transcript and relevant context.\nRedact any sensitive personal data before escalation.\nKnowledge integration -\nThe agent must use scalable methods for knowledge integration and must not rely on manually authored Q&A topics for each document.\nPerformance metrics -\nFirst-contact resolution: +25%\nTier-1 call deflection: ≥20%\nResponse time: 90% of queries answered within 30 seconds\nAccuracy: ≥95% for known FAQs -\nCSAT: ≥85% for AI-handled interactions\nTechnical requirements -\nPlatform constraints -\nNo custom code is permitted; only Copilot Studio's built-in tools may be used.\nAll backend logic must be implemented using agent flows.\nMarkdown must be used for formatting (e.g., bold, bullet points); HTML is not supported.\nAuthentication -\nSign-in is required for personal data access.\nAnonymous access is allowed for general inquiries.\nUser identity must be used for data access; shared or builder credentials must not be used.\nCompliance and security -\nPower Platform DLP policies must be enforced to block unauthorized data flows.\nResponsible AI content moderation filters must be enabled.\nPrompt modifications must be added to enforce tone, disclaimers, and refusal behavior.\nDisclaimers must be applied consistently across all generative responses. Manual edits to individual topics must be avoided.\nMonitoring and maintenance -\nAll conversations and actions must be logged for auditing.\nWeekly reviews of transcripts and metrics must be conducted.\nIssues and constraints -\nAPI rate limits: External APIs (e.g., flight status) have usage limits. Agent flows must handle retries and caching to avoid exceeding quotas.\nKnowledge base limits: Copilot Studio has limits on the number and size of indexed documents. Large files must be split or summarized.\nGenerative answer risks: Generative responses must be constrained to avoid policy violations. Prompt modifications and filters must be used to enforce tone, safety, and compliance.\nUser input variability: Users phrase questions in diverse ways. Topics must include varied trigger phrases and fallback handling.\nAuthentication UX: The agent must clearly explain when sign-in is required and handle transitions smoothly across channels.\nProblem statement -\nBlue Yonder Airlines must deploy a secure, scalable, and policy-compliant AI agent using Microsoft Copilot Studio. The agent must deliver accurate, helpful, and safe responses across multiple channels, integrate with enterprise systems, and support both anonymous and authenticated users. It must adhere to strict data protection and Responsible AI standards while improving customer service efficiency and satisfaction.\nYou need to determine which authentication model should be applied to each Blue Yonder Copilot interaction scenario to comply with the company's security and governance requirements.\nWhich authentication requirement should you apply to each scenario? To answer, move the appropriate authentication requirements to the correct user scenarios. You may use each authentication requirement once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image5.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 54,
    "question_id": 1007782,
    "discussion_id": "419317",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419317-exam-cca-f-topic-1-question-54-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company has an existing custom connector that is approved and available in the environment. A builder wants an agent in Copilot Studio to call the connector during a conversation to retrieve information from an internal system.\nTo meet the business needs, the solution must meet the following requirements:\nThe agent must make the connector available for topic steps.\nThe agent must run the connector call with a valid connection.\nThe connector call must receive the required input values at runtime.\nYou need to configure the agent so the custom connector can be used as a tool.\nWhat should you configure for each requirement? To answer, move the appropriate configurations to the correct requirements. You may use each configuration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image7.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 55,
    "question_id": 1007783,
    "discussion_id": "419310",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419310-exam-cca-f-topic-1-question-55-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company needs to ground an agent in Copilot Studio answers using live enterprise data from a supported system via a Microsoft Power Platform connector.\nTo meet the business needs, the builder must meet the following requirements:\nAuthenticate using a valid connection.\nAdd the connector as a real-time knowledge source.\nSelect the tables for knowledge grounding.\nYou need to add a Power Platform connector as a real-time knowledge source for the agent.\nIn which order should you perform the actions? To answer, move all actions from the list of actions to the answer area and arrange them in the correct order.",
    "images": [
      "https://img.examtopics.com/ab-620/image9.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 56,
    "question_id": 1007784,
    "discussion_id": "419268",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419268-exam-cca-f-topic-1-question-56-discussion/",
    "topic": "Topic 1",
    "question_text": "HOTSPOT -\nYou deploy an agent in Microsoft Copilot Studio that triggers a cloud flow to update customer records in Microsoft Dataverse.\nYou observe the following after deploying the agent:\nSeveral runs fail due to a temporary authentication issue.\nThe flow continues to trigger and generate additional failed runs.\nYou must:\nStop additional failed executions while troubleshooting.\nProcess a failed execution after resolving the authentication issue.\nValidate if the most recent executions succeeded immediately after resolution.\nYou need to use the appropriate monitoring and management actions to restore normal flow operation and validate successful execution.\nWhich action should you perform for each requirement? To answer, select the appropriate options in the answer area.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image11.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "lucas_0102",
        "date": "1 month, 1 week ago",
        "vote": "",
        "upvotes": 1,
        "content": "Could someone help me understand the logic behind this answer?"
      }
    ],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 57,
    "question_id": 1007785,
    "discussion_id": "419304",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419304-exam-cca-f-topic-1-question-57-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company is preparing an agent flow so that it can be invoked by an agent during conversations.\nThe agent flow must meet the following requirements:\nThe agent must be able to trigger the flow.\nThe agent flow must be verified.\nYou need to prepare an agent flow so that it can be used by the agent.\nIn which order should you perform the actions to prepare the agent flow? To answer, move all actions from the list of actions to the answer area and arrange them in the correct order.",
    "images": [
      "https://img.examtopics.com/ab-620/image13.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 58,
    "question_id": 1007786,
    "discussion_id": "419307",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419307-exam-cca-f-topic-1-question-58-discussion/",
    "topic": "Topic 1",
    "question_text": "HOTSPOT -\nA company uses an agent flow that occasionally requires human input before continuing execution.\nSome automated actions must pause until a human provides a decision or additional information. The flow must be configured to:\nCapture a human response for use in later steps.\nContinue processing within the same flow run after the response is submitted.\nWait for a manual decision before proceeding.\nYou need to configure a human-in-the-loop agent flow.\nWhich setting should you configure for each requirement? To answer, select the appropriate options in the answer area.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image15.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 59,
    "question_id": 1007787,
    "discussion_id": "419345",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419345-exam-cca-f-topic-1-question-59-discussion/",
    "topic": "Topic 1",
    "question_text": "HOTSPOT -\nA company uses an agent that invokes an agent flow to exchange information during a conversation.\nThe company requires that the agent send data into the flow and receive structured results back from the same flow run. To support this business need, the flow must be configured to do the following:\nCapture the data provided by the agent.\nReturn data results to the agent.\nYou need to configure the flow so that it can exchange data with the agent.\nWhat should you configure for each requirement? To answer, select the appropriate options in the answer area.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image17.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 60,
    "question_id": 1007788,
    "discussion_id": "419323",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419323-exam-cca-f-topic-1-question-60-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nYou are configuring an agent in Copilot Studio for an organization. The organization uses Microsoft Dataverse, Dynamics 365, and SharePoint Online.\nThe agent must retrieve information from enterprise systems and internal documents. The agent must meet the following requirements:\nMust retrieve the current balance of a customer account stored in Dataverse.\nMust retrieve the real-time shipping status of an order that updates throughout the day in Dynamics 365.\nMust answer questions based on the content of a static PDF policy document.\nMust provide a welcome message that does NOT depend on enterprise data.\nYou need to configure the agent to meet the requirements.\nHow should the agent retrieve the data? To answer, move the appropriate solutions to the correct requirements. You may use each solution once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image19.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 61,
    "question_id": 1007789,
    "discussion_id": "419326",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419326-exam-cca-f-topic-1-question-61-discussion/",
    "topic": "Topic 1",
    "question_text": "An agent calls a flow. The agent requires structured output values to be returned.\nThe agent receives unexpected or empty values.\nYou need to configure the agent so that data is exchanged correctly between the agent and the flow.\nWhat should you do?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Validate parameter definitions.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Change the trigger schema.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Review the flow run history.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Add a Parse JSON inside the flow.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Republish the agent.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 2,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "3 weeks, 2 days ago",
        "vote": "",
        "upvotes": 2,
        "content": "A. Validate parameter definitions ✅\n\nThe problem is about data being exchanged between the agent and the flow. If the agent receives empty or unexpected values, the first thing to check is that:\n\nAgent inputs match flow inputs\nFlow outputs are properly defined\nParameter names and data types match\nReturned values are mapped correctly"
      },
      {
        "user": "lucas_0102",
        "date": "1 month, 1 week ago",
        "vote": "",
        "upvotes": 1,
        "content": "Why is this answer justified? Can someone elaborate?"
      }
    ],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 62,
    "question_id": 1007790,
    "discussion_id": "419279",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419279-exam-cca-f-topic-1-question-62-discussion/",
    "topic": "Topic 1",
    "question_text": "A company is building an agent in Copilot Studio.\nThe agent must meet the following requirements:\nResponses must be grounded in approved internal content.\nThe agent must be able to retrieve information from configured data sources in a topic.\nYou need to configure the agent so that topic responses are grounded from custom data sources.\nWhat should you configure?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Enable analytics to review which topics users trigger most often.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Add a custom prompt that tells the agent to answer only from company data.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Configure knowledge sources in a generative answers node.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Add SharePoint as a knowledge source only at the agent level.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Increase the response length limit to improve answer completeness.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 63,
    "question_id": 1007791,
    "discussion_id": "419313",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419313-exam-cca-f-topic-1-question-63-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company is building an agent in Copilot Studio topic that must retrieve real-time status information from an external REST API using a Send HTTP request node.\nTo meet the business needs, the topic must meet the following requirements:\nThe request must include the required authentication header.\nThe request must call the endpoint using the correct HTTP method.\nThe response must be configured with an appropriate response data type based on a schema and saved so the topic can reuse the returned values.\nYou need to configure the Send HTTP request node.\nWhich configuration should you use for each requirement? To answer, move the appropriate configurations to the correct requirements. You may use each configuration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image21.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 64,
    "question_id": 1007792,
    "discussion_id": "419325",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419325-exam-cca-f-topic-1-question-64-discussion/",
    "topic": "Topic 1",
    "question_text": "A company is deploying an agent for employees.\nThe company has the following requirements:\nAccess must be restricted to the internal employees only.\nEnd-user authentication must be enforced.\nYou need to configure the agent based on the company requirements.\nWhat should you do?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Select Authenticate with Microsoft Entra ID for the agent.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Enable Require Secure Access in the Web channel security.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Publish the agent as a public website experience.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Select Authenticate with personal account for the agent.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "lucas_0102",
        "date": "1 month, 1 week ago",
        "vote": "",
        "upvotes": 1,
        "content": "Can someone explain why this answer is correct?"
      }
    ],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 65,
    "question_id": 1007793,
    "discussion_id": "419308",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419308-exam-cca-f-topic-1-question-65-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company is integrating an agent in Copilot Studio into a custom application by using the Microsoft 365 Agents SDK.\nThe company has the following requirements for the application:\nThe deployment workflow must follow a dependency driven sequence.\nThe agent must be published before configuration values are retrieved.\nEnd-to-end validation must occur before production deployment.\nYou need to plan the deployment workflow to integrate the agent.\nIn which order should you perform the actions? To answer, move all actions from the list of actions to the answer area and arrange them in the correct order.",
    "images": [
      "https://img.examtopics.com/ab-620/image23.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 2,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "4 weeks ago",
        "vote": "",
        "upvotes": 4,
        "content": "Order\tAction\n1\tPublish the agent.\n2\tConfigure and enable the agent's target integration channel.\n3\tRetrieve current agent configuration values.\n4\tImplement the Microsoft 365 Agents SDK in the app using the agent configuration.\n5\tValidate the end-to-end conversation workflow in a test environment.\n6\tDeploy the web app to production."
      },
      {
        "user": "lucas_0102",
        "date": "1 month, 1 week ago",
        "vote": "",
        "upvotes": 1,
        "content": "I'm not following the reasoning—can someone explain?"
      }
    ],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 66,
    "question_id": 1007794,
    "discussion_id": "419333",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419333-exam-cca-f-topic-1-question-66-discussion/",
    "topic": "Topic 1",
    "question_text": "An agent in Copilot Studio already exists in a development environment.\nYou need to prepare the agent so it can be moved to a production environment using the supported solution-based approach.\nYou need to create an exportable package that contains the existing agent.\nWhich two actions should you perform? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Remove agent topics directly from the solution to prevent export errors.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Convert the solution to a managed solution so it can be exported.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Export the unmanaged solution that contains the agent.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Publish the agent to a channel and export the channel configuration.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Create a custom solution and add the existing agent to the solution.",
        "is_correct": true
      }
    ],
    "correct_answer": "B, E",
    "voted_stats": [
      {
        "voted_answers": "CE",
        "vote_count": 2,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "CE",
    "total_community_votes": 2,
    "community_consensus": "CE",
    "is_controversial": true,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "1 month ago",
        "vote": "",
        "upvotes": 2,
        "content": "The supported ALM process is:\n\nCreate/Open an unmanaged solution.\nAdd Existing → Copilot Agent to the solution.\nInclude dependencies (flows, connectors, environment variables, etc.).\nExport the unmanaged solution (or later export as managed for production deployment depending on the scenario)."
      }
    ],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 67,
    "question_id": 1007795,
    "discussion_id": "419330",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419330-exam-cca-f-topic-1-question-67-discussion/",
    "topic": "Topic 1",
    "question_text": "HOTSPOT -\nA company wants to use content from a non-Microsoft enterprise knowledge base to ground agent responses.\nTo meet the business needs, the knowledge source must meet the following requirements:\nSupport grounding from indexed data.\nUse existing access controls from the source system.\nSupport read-only operations.\nYou need to determine the correct behavior to meet the requirements.\nWhich behavior meets each requirement? To answer, select the appropriate options in the answer area.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image25.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 68,
    "question_id": 1007796,
    "discussion_id": "419283",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419283-exam-cca-f-topic-1-question-68-discussion/",
    "topic": "Topic 1",
    "question_text": "Note: This question is part of a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Some question sets might have more than one correct solution, while others might not have a correct solution.\nAfter you answer a question in this section, you will NOT be able to return to it. As a result, these questions will not appear on the review screen.\nAn agent uses a flow that calls an external service which can occasionally fail or time out.\nWhen a failure occurs, the agent must meet the following requirements:\nMust not terminate silently.\nMust send a notification containing the error details.\nYou need to configure the agent flow so that failures are handled in a controlled and predictable way.\nSolution: Retry the failing action without handling failure.\nDoes the solution meet the goal?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Yes",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "No",
        "is_correct": true
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 69,
    "question_id": 1007797,
    "discussion_id": "419269",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419269-exam-cca-f-topic-1-question-69-discussion/",
    "topic": "Topic 1",
    "question_text": "Note: This question is part of a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Some question sets might have more than one correct solution, while others might not have a correct solution.\nAfter you answer a question in this section, you will NOT be able to return to it. As a result, these questions will not appear on the review screen.\nAn agent uses a flow that calls an external service which can occasionally fail or time out.\nWhen a failure occurs, the agent must meet the following requirements:\nMust not terminate silently.\nMust send a notification containing the error details.\nYou need to configure the agent flow so that failures are handled in a controlled and predictable way.\nSolution: Configure run after conditions for failure paths.\nDoes the solution meet the goal?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Yes",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "No",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 70,
    "question_id": 1007798,
    "discussion_id": "419271",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419271-exam-cca-f-topic-1-question-70-discussion/",
    "topic": "Topic 1",
    "question_text": "Note: This question is part of a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Some question sets might have more than one correct solution, while others might not have a correct solution.\nAfter you answer a question in this section, you will NOT be able to return to it. As a result, these questions will not appear on the review screen.\nAn agent uses a flow that calls an external service which can occasionally fail or time out.\nWhen a failure occurs, the agent must meet the following requirements:\nMust not terminate silently.\nMust send a notification containing the error details.\nYou need to configure the agent flow so that failures are handled in a controlled and predictable way.\nSolution: Send a notification with relevant error details.\nDoes the solution meet the goal?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Yes",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "No",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [
      {
        "voted_answers": "A",
        "vote_count": 3,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "A",
    "total_community_votes": 3,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "4 weeks ago",
        "vote": "",
        "upvotes": 3,
        "content": "Sending a notification with the error details explicitly alerts someone that the failure occurred, so the failure is not silent, and it also satisfies the requirement to send a notification containing the error details."
      }
    ],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 71,
    "question_id": 1007799,
    "discussion_id": "419319",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419319-exam-cca-f-topic-1-question-71-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nCase Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nBlue Yonder Airlines is a global carrier headquartered in Los Angeles, California, operating domestic and international flights. The company serves millions of passengers annually through its website, mobile app, and call centers. To improve customer service efficiency and reduce call center volume, Blue Yonder is deploying an AI agent in Microsoft Copilot Studio.\nThe agent will handle customer inquiries across multiple channels – web chat, mobile app, and Microsoft Teams (for internal support staff). It will answer questions, retrieve data from enterprise systems, and escalate to human agents when needed.\nThe project is led by a cross-function team:\nProduct manager: Defines requirements and success metrics.\nLead agent author: Designs topics, intents, and generative behavior.\nFlow designers: Build agent flows and integrations.\nIT/security and compliance: Oversees identity, data protection, and Responsible AI (RAI) compliance.\nCurrent environment -\nChannels -\nPublic website: Embedded web chat\nMobile app: In-app chatbot -\nMicrosoft Teams: Internal support agent access\nIdentity and access -\nCustomers: Anonymous access for general inquiries (e.g., flight status, baggage policy).\nAuthentication is required for personal data access (e.g., bookings, loyalty points).\nInternal staff: Authenticate via Microsoft Entra ID.\nData sources -\nReservation and Ticketing System (internal): REST API, no prebuilt connector with custom enterprise database.\nFlight Status and Weather APIs (external): REST APIs with API keys.\nCustomer Support Knowledge Base: SharePoint library with PDFs and policy documents.\nLoyalty Program Data: Stored in Dynamics 365 and Dataverse.\nTravel Advisory Content: Uses REST API with partner services.\nIntegration mechanisms -\nCustom connectors must be used for internal APIs that lack prebuilt connectors.\nHTTP request nodes may be used for lightweight external APIs.\nKnowledge sources must be used for unstructured content.\nAgent flows must be used to encapsulate reusable logic (e.g., rebooking).\nBusiness requirements -\nOmnichannel support -\nDeploy the agent across web, mobile, and Teams with a consistent user experience. The Teams deployment must also support internal staff.\nSelf-service capabilities -\nThe agent must handle common inquiries such as:\nFlight status -\nBooking and rebooking -\nLoyalty program questions -\nTravel policies and baggage rules\nHuman escalation -\nIf the agent cannot resolve an issue or the user requests help, it must:\nEscalate to a human agent.\nTransfer the conversation transcript and relevant context.\nRedact any sensitive personal data before escalation.\nKnowledge integration -\nThe agent must use scalable methods for knowledge integration and must not rely on manually authored Q&A topics for each document.\nPerformance metrics -\nFirst-contact resolution: +25%\nTier-1 call deflection: ≥20%\nResponse time: 90% of queries answered within 30 seconds\nAccuracy: ≥95% for known FAQs -\nCSAT: ≥85% for AI-handled interactions\nTechnical requirements -\nPlatform constraints -\nNo custom code is permitted; only Copilot Studio's built-in tools may be used.\nAll backend logic must be implemented using agent flows.\nMarkdown must be used for formatting (e.g., bold, bullet points); HTML is not supported.\nAuthentication -\nSign-in is required for personal data access.\nAnonymous access is allowed for general inquiries.\nUser identity must be used for data access; shared or builder credentials must not be used.\nCompliance and security -\nPower Platform DLP policies must be enforced to block unauthorized data flows.\nResponsible AI content moderation filters must be enabled.\nPrompt modifications must be added to enforce tone, disclaimers, and refusal behavior.\nDisclaimers must be applied consistently across all generative responses. Manual edits to individual topics must be avoided.\nMonitoring and maintenance -\nAll conversations and actions must be logged for auditing.\nWeekly reviews of transcripts and metrics must be conducted.\nIssues and constraints -\nAPI rate limits: External APIs (e.g., flight status) have usage limits. Agent flows must handle retries and caching to avoid exceeding quotas.\nKnowledge base limits: Copilot Studio has limits on the number and size of indexed documents. Large files must be split or summarized.\nGenerative answer risks: Generative responses must be constrained to avoid policy violations. Prompt modifications and filters must be used to enforce tone, safety, and compliance.\nUser input variability: Users phrase questions in diverse ways. Topics must include varied trigger phrases and fallback handling.\nAuthentication UX: The agent must clearly explain when sign-in is required and handle transitions smoothly across channels.\nProblem statement -\nBlue Yonder Airlines must deploy a secure, scalable, and policy-compliant AI agent using Microsoft Copilot Studio. The agent must deliver accurate, helpful, and safe responses across multiple channels, integrate with enterprise systems, and support both anonymous and authenticated users. It must adhere to strict data protection and Responsible AI standards while improving customer service efficiency and satisfaction.\nYou need to implement tool usage in topics that meet the Blue Yonder design and governance requirements.\nWhich implementation method should you use for each requirement? To answer, move the appropriate implementation methods to the correct requirements. You may use each implementation method once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image27.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "4 weeks, 1 day ago",
        "vote": "",
        "upvotes": 7,
        "content": "Let the agent decide when to run a tool based on user input. → Enable generative orchestration\nRun a specific agent flow at a defined step in a topic. → Add a tool node\nUse a connector action to retrieve data during a conversation. → Add a tool node"
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 72,
    "question_id": 1007800,
    "discussion_id": "419299",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419299-exam-cca-f-topic-1-question-72-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nCase Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nBlue Yonder Airlines is a global carrier headquartered in Los Angeles, California, operating domestic and international flights. The company serves millions of passengers annually through its website, mobile app, and call centers. To improve customer service efficiency and reduce call center volume, Blue Yonder is deploying an AI agent in Microsoft Copilot Studio.\nThe agent will handle customer inquiries across multiple channels – web chat, mobile app, and Microsoft Teams (for internal support staff). It will answer questions, retrieve data from enterprise systems, and escalate to human agents when needed.\nThe project is led by a cross-function team:\nProduct manager: Defines requirements and success metrics.\nLead agent author: Designs topics, intents, and generative behavior.\nFlow designers: Build agent flows and integrations.\nIT/security and compliance: Oversees identity, data protection, and Responsible AI (RAI) compliance.\nCurrent environment -\nChannels -\nPublic website: Embedded web chat\nMobile app: In-app chatbot -\nMicrosoft Teams: Internal support agent access\nIdentity and access -\nCustomers: Anonymous access for general inquiries (e.g., flight status, baggage policy).\nAuthentication is required for personal data access (e.g., bookings, loyalty points).\nInternal staff: Authenticate via Microsoft Entra ID.\nData sources -\nReservation and Ticketing System (internal): REST API, no prebuilt connector with custom enterprise database.\nFlight Status and Weather APIs (external): REST APIs with API keys.\nCustomer Support Knowledge Base: SharePoint library with PDFs and policy documents.\nLoyalty Program Data: Stored in Dynamics 365 and Dataverse.\nTravel Advisory Content: Uses REST API with partner services.\nIntegration mechanisms -\nCustom connectors must be used for internal APIs that lack prebuilt connectors.\nHTTP request nodes may be used for lightweight external APIs.\nKnowledge sources must be used for unstructured content.\nAgent flows must be used to encapsulate reusable logic (e.g., rebooking).\nBusiness requirements -\nOmnichannel support -\nDeploy the agent across web, mobile, and Teams with a consistent user experience. The Teams deployment must also support internal staff.\nSelf-service capabilities -\nThe agent must handle common inquiries such as:\nFlight status -\nBooking and rebooking -\nLoyalty program questions -\nTravel policies and baggage rules\nHuman escalation -\nIf the agent cannot resolve an issue or the user requests help, it must:\nEscalate to a human agent.\nTransfer the conversation transcript and relevant context.\nRedact any sensitive personal data before escalation.\nKnowledge integration -\nThe agent must use scalable methods for knowledge integration and must not rely on manually authored Q&A topics for each document.\nPerformance metrics -\nFirst-contact resolution: +25%\nTier-1 call deflection: ≥20%\nResponse time: 90% of queries answered within 30 seconds\nAccuracy: ≥95% for known FAQs -\nCSAT: ≥85% for AI-handled interactions\nTechnical requirements -\nPlatform constraints -\nNo custom code is permitted; only Copilot Studio's built-in tools may be used.\nAll backend logic must be implemented using agent flows.\nMarkdown must be used for formatting (e.g., bold, bullet points); HTML is not supported.\nAuthentication -\nSign-in is required for personal data access.\nAnonymous access is allowed for general inquiries.\nUser identity must be used for data access; shared or builder credentials must not be used.\nCompliance and security -\nPower Platform DLP policies must be enforced to block unauthorized data flows.\nResponsible AI content moderation filters must be enabled.\nPrompt modifications must be added to enforce tone, disclaimers, and refusal behavior.\nDisclaimers must be applied consistently across all generative responses. Manual edits to individual topics must be avoided.\nMonitoring and maintenance -\nAll conversations and actions must be logged for auditing.\nWeekly reviews of transcripts and metrics must be conducted.\nIssues and constraints -\nAPI rate limits: External APIs (e.g., flight status) have usage limits. Agent flows must handle retries and caching to avoid exceeding quotas.\nKnowledge base limits: Copilot Studio has limits on the number and size of indexed documents. Large files must be split or summarized.\nGenerative answer risks: Generative responses must be constrained to avoid policy violations. Prompt modifications and filters must be used to enforce tone, safety, and compliance.\nUser input variability: Users phrase questions in diverse ways. Topics must include varied trigger phrases and fallback handling.\nAuthentication UX: The agent must clearly explain when sign-in is required and handle transitions smoothly across channels.\nProblem statement -\nBlue Yonder Airlines must deploy a secure, scalable, and policy-compliant AI agent using Microsoft Copilot Studio. The agent must deliver accurate, helpful, and safe responses across multiple channels, integrate with enterprise systems, and support both anonymous and authenticated users. It must adhere to strict data protection and Responsible AI standards while improving customer service efficiency and satisfaction.\nYou need to determine how the agent in Copilot Studio should integrate with two different systems in the Blue Yonder environment, based on their characteristics and the tools available.\nWhich integration mechanism should you use for each system? To answer, move the appropriate integrations to the correct system or data sources. You may use each integration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image29.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 73,
    "question_id": 1007801,
    "discussion_id": "419342",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419342-exam-cca-f-topic-1-question-73-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nCase Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nBlue Yonder Airlines is a global carrier headquartered in Los Angeles, California, operating domestic and international flights. The company serves millions of passengers annually through its website, mobile app, and call centers. To improve customer service efficiency and reduce call center volume, Blue Yonder is deploying an AI agent in Microsoft Copilot Studio.\nThe agent will handle customer inquiries across multiple channels – web chat, mobile app, and Microsoft Teams (for internal support staff). It will answer questions, retrieve data from enterprise systems, and escalate to human agents when needed.\nThe project is led by a cross-function team:\nProduct manager: Defines requirements and success metrics.\nLead agent author: Designs topics, intents, and generative behavior.\nFlow designers: Build agent flows and integrations.\nIT/security and compliance: Oversees identity, data protection, and Responsible AI (RAI) compliance.\nCurrent environment -\nChannels -\nPublic website: Embedded web chat\nMobile app: In-app chatbot -\nMicrosoft Teams: Internal support agent access\nIdentity and access -\nCustomers: Anonymous access for general inquiries (e.g., flight status, baggage policy).\nAuthentication is required for personal data access (e.g., bookings, loyalty points).\nInternal staff: Authenticate via Microsoft Entra ID.\nData sources -\nReservation and Ticketing System (internal): REST API, no prebuilt connector with custom enterprise database.\nFlight Status and Weather APIs (external): REST APIs with API keys.\nCustomer Support Knowledge Base: SharePoint library with PDFs and policy documents.\nLoyalty Program Data: Stored in Dynamics 365 and Dataverse.\nTravel Advisory Content: Uses REST API with partner services.\nIntegration mechanisms -\nCustom connectors must be used for internal APIs that lack prebuilt connectors.\nHTTP request nodes may be used for lightweight external APIs.\nKnowledge sources must be used for unstructured content.\nAgent flows must be used to encapsulate reusable logic (e.g., rebooking).\nBusiness requirements -\nOmnichannel support -\nDeploy the agent across web, mobile, and Teams with a consistent user experience. The Teams deployment must also support internal staff.\nSelf-service capabilities -\nThe agent must handle common inquiries such as:\nFlight status -\nBooking and rebooking -\nLoyalty program questions -\nTravel policies and baggage rules\nHuman escalation -\nIf the agent cannot resolve an issue or the user requests help, it must:\nEscalate to a human agent.\nTransfer the conversation transcript and relevant context.\nRedact any sensitive personal data before escalation.\nKnowledge integration -\nThe agent must use scalable methods for knowledge integration and must not rely on manually authored Q&A topics for each document.\nPerformance metrics -\nFirst-contact resolution: +25%\nTier-1 call deflection: ≥20%\nResponse time: 90% of queries answered within 30 seconds\nAccuracy: ≥95% for known FAQs -\nCSAT: ≥85% for AI-handled interactions\nTechnical requirements -\nPlatform constraints -\nNo custom code is permitted; only Copilot Studio's built-in tools may be used.\nAll backend logic must be implemented using agent flows.\nMarkdown must be used for formatting (e.g., bold, bullet points); HTML is not supported.\nAuthentication -\nSign-in is required for personal data access.\nAnonymous access is allowed for general inquiries.\nUser identity must be used for data access; shared or builder credentials must not be used.\nCompliance and security -\nPower Platform DLP policies must be enforced to block unauthorized data flows.\nResponsible AI content moderation filters must be enabled.\nPrompt modifications must be added to enforce tone, disclaimers, and refusal behavior.\nDisclaimers must be applied consistently across all generative responses. Manual edits to individual topics must be avoided.\nMonitoring and maintenance -\nAll conversations and actions must be logged for auditing.\nWeekly reviews of transcripts and metrics must be conducted.\nIssues and constraints -\nAPI rate limits: External APIs (e.g., flight status) have usage limits. Agent flows must handle retries and caching to avoid exceeding quotas.\nKnowledge base limits: Copilot Studio has limits on the number and size of indexed documents. Large files must be split or summarized.\nGenerative answer risks: Generative responses must be constrained to avoid policy violations. Prompt modifications and filters must be used to enforce tone, safety, and compliance.\nUser input variability: Users phrase questions in diverse ways. Topics must include varied trigger phrases and fallback handling.\nAuthentication UX: The agent must clearly explain when sign-in is required and handle transitions smoothly across channels.\nProblem statement -\nBlue Yonder Airlines must deploy a secure, scalable, and policy-compliant AI agent using Microsoft Copilot Studio. The agent must deliver accurate, helpful, and safe responses across multiple channels, integrate with enterprise systems, and support both anonymous and authenticated users. It must adhere to strict data protection and Responsible AI standards while improving customer service efficiency and satisfaction.\nYou need to determine an appropriate implementation related to the use of agent flows that is based on Blue Vender's design and compliance standards.\nWhich implementation method should you use for each scenario? To answer, move the appropriate implementation methods to the correct scenarios. You may use each implementation method once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image31.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "2 weeks, 2 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "Scenario\tImplementation method\nA topic includes a series of steps that replicate logic already defined in another flow.\tUse a tool node.\nA topic provides a natural language explanation of a process but does not execute it.\tUse a generative answers node.\nA topic includes a step that triggers a reusable process to update booking details.\tUse a tool node."
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 74,
    "question_id": 1007802,
    "discussion_id": "419275",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419275-exam-cca-f-topic-1-question-74-discussion/",
    "topic": "Topic 1",
    "question_text": "Case Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nFabrikam Inc. is a Canada-based manufacturer with a growing service organization that supports field technicians and internal operations teams. Fabrikam Inc. plans to launch a new internal agent solution named Operations Concierge to reduce time spent searching policy content, retrieving operational metrics, and executing routine transactions.\nThe agent will be used by three groups:\nService coordinators who triage incoming service requests\nField technicians who need guided procedures and parts availability\nOperations managers who monitor KPIs and exceptions\nThe agent solution must work in real-world operational conditions. Users often ask questions mid-call with a customer or while coordinating parts shipments. The agents require quick, reliable outcomes. As a result, Fabrikam Inc. requires the solution to:\nProvide grounded answers with traceability when it provides guidance.\nRetrieve real-time metrics when users ask for operational status.\nExecute authenticated updates when users initiate a flow (such as creating a parts request).\nFabrikam Inc. also expects the solution to be maintained by multiple makers and developers across the year. The company has experienced duplicated logic and inconsistent behavior across different agents. This project emphasizes reuse, governance, and maintainability across teams.\nCurrent environment -\nFabrikam Inc. runs three Microsoft Power Platform environments for agent development and release: Dev, Test, and Prod.\nThe team plans to build the agent and validate it in Dev and Test, then promote to Prod by using a controlled release process that supports repeatable deployments.\nFabrikam Inc. already has two assets the team wants to reuse:\nA partially completed Copilot Studio agent named Service Desk Agent, used by IT to create internal tickets and route requests\nA Microsoft Foundry agent created by a central AI team that performs specialized summarization and classification for long-form text (for example, summarizing call transcripts into an incident narrative)\nFabrikam Inc. also has operational and knowledge data sources:\nA curated policy library (internal SOPs, service warranty rules, escalation criteria, and standard operating procedures)\nA set of indexed documents and procedures in an Azure AI Search service that supports vector search for the policy library\nA Microsoft Fabric workspace that includes a semantic model used by operations leadership for reporting\nBusiness requirements -\nFabrikam Inc. requires Operations Concierge to meet the following business requirements:\nTraceability requirement: When the agent provides policy guidance or procedural recommendations, users must be able to see where the answer came from.\nMetrics requirement: When users ask about service performance (backlog, SLA risk, parts shortages, dispatch delays), the solution must return up-to-date metrics in a structured format that operations managers can use in weekly reviews.\nTransaction requirement: The solution must support authenticated updates initiated during conversations, including creating a parts request and updating a service case status.\nIn addition, Fabrikam Inc. wants to avoid duplicating common assets across agents:\nThe team must reuse the same set of escalation topics, MCP tool definitions, and a standard safety disclaimer across three different agents.\nOnly the platform engineering group as allowed to edit shared assets. However, all agent authors must be able to use them.\nTechnical requirements -\nThe Fabrikam Inc. solution architecture uses a multi-agent approach so that specialist responsibilities are isolated and can evolve independently.\nThe Operations Concierge (primary agent) must coordinate the following specialist capabilities:\nPolicy and procedure Q&A: Use an enterprise knowledge source that supports indexed retrieval across the curated policy library and service procedures.\nOperational metrics: Delegate metric queries to a Fabric Data Agent that reads governed business data through the Fabric semantic model.\nAuthenticated updates: Use tools exposed by an existing internal Model Context Protocol (MCP) server that provides transactional operations for the service organization.\nSpecialized processing: Delegate summarization and classification requests to an existing Microsoft Foundry agent.\nFabrikam Inc. will onboard two MCP servers as tools:\nPartsOps MCP server: exposes tools for parts availability checks and parts request creation. The server requires per-user authentication because actions must be traceable to the requesting user.\nWarrantyRules MCP server: exposes a read-only tool for validating warranty coverage. The server uses an API key shared by the agent team.\nFabrikam Inc. has also defined a collaboration requirement with the existing Service Desk Agent:\nThe primary agent must delegate IT-specific requests to the existing Service Desk Agent rather than reimplement ticket creation logic.\nFinally, Fabrikarn Inc. plans to support a partner integration:\nFor shipment tracking inquiries, Fabrikam Inc. will delegate to a partner-provided agent that is only available through a standardized agent-to-agent endpoint.\nIssues and constraints -\nDuring early testing, Fabrikam Inc. found three recurring problems:\nMakers are copying and modifying the same components across agents, resulting in inconsistent disclaimers and duplicated tools.\nUsers can obtain a correct answer, but the response is not consistently traceable to a source when the agent uses knowledge.\nThe primary agent can route some requests, but specialist capabilities are not consistently delegated (for example, some metric questions are answered generatively instead of being routed to the Fabric Data Agent).\nYou are part of the engineering team responsible for correcting the design and configuration to meet the preceding requirements and constraints.\nYou need to enable Operations Concierge to delegate shipment tracking inquiries according to Fabrikam Inc.'s defined architecture and technical requirements.\nWhich integration approach should you use?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Configure the partner capability as an enterprise knowledge source with indexed retrieval enabled.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Configure the partner capability as an MCP tool and invoke it as a transactional operation.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Configure the partner capability as an A2A integration and supply its endpoint information.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Configure the primary agent to handle shipment tracking through generative responses after publishing.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 75,
    "question_id": 1007803,
    "discussion_id": "419346",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419346-exam-cca-f-topic-1-question-75-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nCase Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nFabrikam Inc. is a Canada-based manufacturer with a growing service organization that supports field technicians and internal operations teams. Fabrikam Inc. plans to launch a new internal agent solution named Operations Concierge to reduce time spent searching policy content, retrieving operational metrics, and executing routine transactions.\nThe agent will be used by three groups:\nService coordinators who triage incoming service requests\nField technicians who need guided procedures and parts availability\nOperations managers who monitor KPIs and exceptions\nThe agent solution must work in real-world operational conditions. Users often ask questions mid-call with a customer or while coordinating parts shipments. The agents require quick, reliable outcomes. As a result, Fabrikam Inc. requires the solution to:\nProvide grounded answers with traceability when it provides guidance.\nRetrieve real-time metrics when users ask for operational status.\nExecute authenticated updates when users initiate a flow (such as creating a parts request).\nFabrikam Inc. also expects the solution to be maintained by multiple makers and developers across the year. The company has experienced duplicated logic and inconsistent behavior across different agents. This project emphasizes reuse, governance, and maintainability across teams.\nCurrent environment -\nFabrikam Inc. runs three Microsoft Power Platform environments for agent development and release: Dev, Test, and Prod.\nThe team plans to build the agent and validate it in Dev and Test, then promote to Prod by using a controlled release process that supports repeatable deployments.\nFabrikam Inc. already has two assets the team wants to reuse:\nA partially completed Copilot Studio agent named Service Desk Agent, used by IT to create internal tickets and route requests\nA Microsoft Foundry agent created by a central AI team that performs specialized summarization and classification for long-form text (for example, summarizing call transcripts into an incident narrative)\nFabrikam Inc. also has operational and knowledge data sources:\nA curated policy library (internal SOPs, service warranty rules, escalation criteria, and standard operating procedures)\nA set of indexed documents and procedures in an Azure AI Search service that supports vector search for the policy library\nA Microsoft Fabric workspace that includes a semantic model used by operations leadership for reporting\nBusiness requirements -\nFabrikam Inc. requires Operations Concierge to meet the following business requirements:\nTraceability requirement: When the agent provides policy guidance or procedural recommendations, users must be able to see where the answer came from.\nMetrics requirement: When users ask about service performance (backlog, SLA risk, parts shortages, dispatch delays), the solution must return up-to-date metrics in a structured format that operations managers can use in weekly reviews.\nTransaction requirement: The solution must support authenticated updates initiated during conversations, including creating a parts request and updating a service case status.\nIn addition, Fabrikam Inc. wants to avoid duplicating common assets across agents:\nThe team must reuse the same set of escalation topics, MCP tool definitions, and a standard safety disclaimer across three different agents.\nOnly the platform engineering group as allowed to edit shared assets. However, all agent authors must be able to use them.\nTechnical requirements -\nThe Fabrikam Inc. solution architecture uses a multi-agent approach so that specialist responsibilities are isolated and can evolve independently.\nThe Operations Concierge (primary agent) must coordinate the following specialist capabilities:\nPolicy and procedure Q&A: Use an enterprise knowledge source that supports indexed retrieval across the curated policy library and service procedures.\nOperational metrics: Delegate metric queries to a Fabric Data Agent that reads governed business data through the Fabric semantic model.\nAuthenticated updates: Use tools exposed by an existing internal Model Context Protocol (MCP) server that provides transactional operations for the service organization.\nSpecialized processing: Delegate summarization and classification requests to an existing Microsoft Foundry agent.\nFabrikam Inc. will onboard two MCP servers as tools:\nPartsOps MCP server: exposes tools for parts availability checks and parts request creation. The server requires per-user authentication because actions must be traceable to the requesting user.\nWarrantyRules MCP server: exposes a read-only tool for validating warranty coverage. The server uses an API key shared by the agent team.\nFabrikam Inc. has also defined a collaboration requirement with the existing Service Desk Agent:\nThe primary agent must delegate IT-specific requests to the existing Service Desk Agent rather than reimplement ticket creation logic.\nFinally, Fabrikarn Inc. plans to support a partner integration:\nFor shipment tracking inquiries, Fabrikam Inc. will delegate to a partner-provided agent that is only available through a standardized agent-to-agent endpoint.\nIssues and constraints -\nDuring early testing, Fabrikam Inc. found three recurring problems:\nMakers are copying and modifying the same components across agents, resulting in inconsistent disclaimers and duplicated tools.\nUsers can obtain a correct answer, but the response is not consistently traceable to a source when the agent uses knowledge.\nThe primary agent can route some requests, but specialist capabilities are not consistently delegated (for example, some metric questions are answered generatively instead of being routed to the Fabric Data Agent).\nYou are part of the engineering team responsible for correcting the design and configuration to meet the preceding requirements and constraints.\nYou need to integrate Fabrikam Inc.'s existing Foundry agent so Operations Concierge can delegate summarization requests.\nWhich action should you perform for each requirement? To answer, move the appropriate actions to the correct requirements. You may use each action once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image33.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 76,
    "question_id": 1007804,
    "discussion_id": "419314",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419314-exam-cca-f-topic-1-question-76-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nCase Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nFabrikam Inc. is a Canada-based manufacturer with a growing service organization that supports field technicians and internal operations teams. Fabrikam Inc. plans to launch a new internal agent solution named Operations Concierge to reduce time spent searching policy content, retrieving operational metrics, and executing routine transactions.\nThe agent will be used by three groups:\nService coordinators who triage incoming service requests\nField technicians who need guided procedures and parts availability\nOperations managers who monitor KPIs and exceptions\nThe agent solution must work in real-world operational conditions. Users often ask questions mid-call with a customer or while coordinating parts shipments. The agents require quick, reliable outcomes. As a result, Fabrikam Inc. requires the solution to:\nProvide grounded answers with traceability when it provides guidance.\nRetrieve real-time metrics when users ask for operational status.\nExecute authenticated updates when users initiate a flow (such as creating a parts request).\nFabrikam Inc. also expects the solution to be maintained by multiple makers and developers across the year. The company has experienced duplicated logic and inconsistent behavior across different agents. This project emphasizes reuse, governance, and maintainability across teams.\nCurrent environment -\nFabrikam Inc. runs three Microsoft Power Platform environments for agent development and release: Dev, Test, and Prod.\nThe team plans to build the agent and validate it in Dev and Test, then promote to Prod by using a controlled release process that supports repeatable deployments.\nFabrikam Inc. already has two assets the team wants to reuse:\nA partially completed Copilot Studio agent named Service Desk Agent, used by IT to create internal tickets and route requests\nA Microsoft Foundry agent created by a central AI team that performs specialized summarization and classification for long-form text (for example, summarizing call transcripts into an incident narrative)\nFabrikam Inc. also has operational and knowledge data sources:\nA curated policy library (internal SOPs, service warranty rules, escalation criteria, and standard operating procedures)\nA set of indexed documents and procedures in an Azure AI Search service that supports vector search for the policy library\nA Microsoft Fabric workspace that includes a semantic model used by operations leadership for reporting\nBusiness requirements -\nFabrikam Inc. requires Operations Concierge to meet the following business requirements:\nTraceability requirement: When the agent provides policy guidance or procedural recommendations, users must be able to see where the answer came from.\nMetrics requirement: When users ask about service performance (backlog, SLA risk, parts shortages, dispatch delays), the solution must return up-to-date metrics in a structured format that operations managers can use in weekly reviews.\nTransaction requirement: The solution must support authenticated updates initiated during conversations, including creating a parts request and updating a service case status.\nIn addition, Fabrikam Inc. wants to avoid duplicating common assets across agents:\nThe team must reuse the same set of escalation topics, MCP tool definitions, and a standard safety disclaimer across three different agents.\nOnly the platform engineering group as allowed to edit shared assets. However, all agent authors must be able to use them.\nTechnical requirements -\nThe Fabrikam Inc. solution architecture uses a multi-agent approach so that specialist responsibilities are isolated and can evolve independently.\nThe Operations Concierge (primary agent) must coordinate the following specialist capabilities:\nPolicy and procedure Q&A: Use an enterprise knowledge source that supports indexed retrieval across the curated policy library and service procedures.\nOperational metrics: Delegate metric queries to a Fabric Data Agent that reads governed business data through the Fabric semantic model.\nAuthenticated updates: Use tools exposed by an existing internal Model Context Protocol (MCP) server that provides transactional operations for the service organization.\nSpecialized processing: Delegate summarization and classification requests to an existing Microsoft Foundry agent.\nFabrikam Inc. will onboard two MCP servers as tools:\nPartsOps MCP server: exposes tools for parts availability checks and parts request creation. The server requires per-user authentication because actions must be traceable to the requesting user.\nWarrantyRules MCP server: exposes a read-only tool for validating warranty coverage. The server uses an API key shared by the agent team.\nFabrikam Inc. has also defined a collaboration requirement with the existing Service Desk Agent:\nThe primary agent must delegate IT-specific requests to the existing Service Desk Agent rather than reimplement ticket creation logic.\nFinally, Fabrikarn Inc. plans to support a partner integration:\nFor shipment tracking inquiries, Fabrikam Inc. will delegate to a partner-provided agent that is only available through a standardized agent-to-agent endpoint.\nIssues and constraints -\nDuring early testing, Fabrikam Inc. found three recurring problems:\nMakers are copying and modifying the same components across agents, resulting in inconsistent disclaimers and duplicated tools.\nUsers can obtain a correct answer, but the response is not consistently traceable to a source when the agent uses knowledge.\nThe primary agent can route some requests, but specialist capabilities are not consistently delegated (for example, some metric questions are answered generatively instead of being routed to the Fabric Data Agent).\nYou are part of the engineering team responsible for correcting the design and configuration to meet the preceding requirements and constraints.\nYou need to plan how Fabrikam Inc. will reuse shared components across multiple agents while limiting who can change the shared components.\nWhich approach should you use for each requirement? To answer, move the appropriate components to the correct requirements. You may use each component once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image35.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 77,
    "question_id": 1007805,
    "discussion_id": "419278",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419278-exam-cca-f-topic-1-question-77-discussion/",
    "topic": "Topic 1",
    "question_text": "Case Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nFabrikam Inc. is a Canada-based manufacturer with a growing service organization that supports field technicians and internal operations teams. Fabrikam Inc. plans to launch a new internal agent solution named Operations Concierge to reduce time spent searching policy content, retrieving operational metrics, and executing routine transactions.\nThe agent will be used by three groups:\nService coordinators who triage incoming service requests\nField technicians who need guided procedures and parts availability\nOperations managers who monitor KPIs and exceptions\nThe agent solution must work in real-world operational conditions. Users often ask questions mid-call with a customer or while coordinating parts shipments. The agents require quick, reliable outcomes. As a result, Fabrikam Inc. requires the solution to:\nProvide grounded answers with traceability when it provides guidance.\nRetrieve real-time metrics when users ask for operational status.\nExecute authenticated updates when users initiate a flow (such as creating a parts request).\nFabrikam Inc. also expects the solution to be maintained by multiple makers and developers across the year. The company has experienced duplicated logic and inconsistent behavior across different agents. This project emphasizes reuse, governance, and maintainability across teams.\nCurrent environment -\nFabrikam Inc. runs three Microsoft Power Platform environments for agent development and release: Dev, Test, and Prod.\nThe team plans to build the agent and validate it in Dev and Test, then promote to Prod by using a controlled release process that supports repeatable deployments.\nFabrikam Inc. already has two assets the team wants to reuse:\nA partially completed Copilot Studio agent named Service Desk Agent, used by IT to create internal tickets and route requests\nA Microsoft Foundry agent created by a central AI team that performs specialized summarization and classification for long-form text (for example, summarizing call transcripts into an incident narrative)\nFabrikam Inc. also has operational and knowledge data sources:\nA curated policy library (internal SOPs, service warranty rules, escalation criteria, and standard operating procedures)\nA set of indexed documents and procedures in an Azure AI Search service that supports vector search for the policy library\nA Microsoft Fabric workspace that includes a semantic model used by operations leadership for reporting\nBusiness requirements -\nFabrikam Inc. requires Operations Concierge to meet the following business requirements:\nTraceability requirement: When the agent provides policy guidance or procedural recommendations, users must be able to see where the answer came from.\nMetrics requirement: When users ask about service performance (backlog, SLA risk, parts shortages, dispatch delays), the solution must return up-to-date metrics in a structured format that operations managers can use in weekly reviews.\nTransaction requirement: The solution must support authenticated updates initiated during conversations, including creating a parts request and updating a service case status.\nIn addition, Fabrikam Inc. wants to avoid duplicating common assets across agents:\nThe team must reuse the same set of escalation topics, MCP tool definitions, and a standard safety disclaimer across three different agents.\nOnly the platform engineering group as allowed to edit shared assets. However, all agent authors must be able to use them.\nTechnical requirements -\nThe Fabrikam Inc. solution architecture uses a multi-agent approach so that specialist responsibilities are isolated and can evolve independently.\nThe Operations Concierge (primary agent) must coordinate the following specialist capabilities:\nPolicy and procedure Q&A: Use an enterprise knowledge source that supports indexed retrieval across the curated policy library and service procedures.\nOperational metrics: Delegate metric queries to a Fabric Data Agent that reads governed business data through the Fabric semantic model.\nAuthenticated updates: Use tools exposed by an existing internal Model Context Protocol (MCP) server that provides transactional operations for the service organization.\nSpecialized processing: Delegate summarization and classification requests to an existing Microsoft Foundry agent.\nFabrikam Inc. will onboard two MCP servers as tools:\nPartsOps MCP server: exposes tools for parts availability checks and parts request creation. The server requires per-user authentication because actions must be traceable to the requesting user.\nWarrantyRules MCP server: exposes a read-only tool for validating warranty coverage. The server uses an API key shared by the agent team.\nFabrikam Inc. has also defined a collaboration requirement with the existing Service Desk Agent:\nThe primary agent must delegate IT-specific requests to the existing Service Desk Agent rather than reimplement ticket creation logic.\nFinally, Fabrikarn Inc. plans to support a partner integration:\nFor shipment tracking inquiries, Fabrikam Inc. will delegate to a partner-provided agent that is only available through a standardized agent-to-agent endpoint.\nIssues and constraints -\nDuring early testing, Fabrikam Inc. found three recurring problems:\nMakers are copying and modifying the same components across agents, resulting in inconsistent disclaimers and duplicated tools.\nUsers can obtain a correct answer, but the response is not consistently traceable to a source when the agent uses knowledge.\nThe primary agent can route some requests, but specialist capabilities are not consistently delegated (for example, some metric questions are answered generatively instead of being routed to the Fabric Data Agent).\nYou are part of the engineering team responsible for correcting the design and configuration to meet the preceding requirements and constraints.\nYou need to configure Operations Concierge so that prompt-driven summarization behavior aligns with Fabrikam Inc.'s architectural requirements.\nWhich two actions should you perform? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Configure Azure AI Search as the grounding source for summarization prompts.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Publish the agent to ensure the selected model is enforced for summarization.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Select a model from the Foundry model catalog in the custom prompt configuration.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Enable citations to control how summarization output is generated.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Create a reusable custom prompt template and apply it where summarization responses are generated.",
        "is_correct": true
      }
    ],
    "correct_answer": "C, E",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C, E",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 78,
    "question_id": 1007806,
    "discussion_id": "419285",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419285-exam-cca-f-topic-1-question-78-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nCase Study -\nThis is a case study. Case studies are not timed separately from other exam sections. You can use as much exam time as you would like to complete each case study. However, there might be additional case studies or other exam sections. Manage your time to ensure that you can complete all the exam sections in the time provided. Pay attention to the Exam Progress at the top of the screen so you have sufficient time to complete any exam sections that follow this case study.\nTo answer the case study questions, you will need to reference information that is provided in the case. Case studies and associated questions might contain exhibits or other resources that provide more information about the scenario described in the case. Information provided in an individual question does not apply to the other questions in the case study.\nA Review Screen will appear at the end of this case study. From the Review Screen, you can review and change your answers before you move to the next exam section. After you leave this case study, you will NOT be able to return to it.\nTo start the case study -\nTo display the first question in this case study, select the \"Next\" button. To the left of the question, a menu provides links to information such as business requirements, the existing environment, and problem statements. Please read through all this information before answering any questions. When you are ready to answer a question, select the \"Question\" button to return to the question.\nBackground -\nFabrikam Inc. is a Canada-based manufacturer with a growing service organization that supports field technicians and internal operations teams. Fabrikam Inc. plans to launch a new internal agent solution named Operations Concierge to reduce time spent searching policy content, retrieving operational metrics, and executing routine transactions.\nThe agent will be used by three groups:\nService coordinators who triage incoming service requests\nField technicians who need guided procedures and parts availability\nOperations managers who monitor KPIs and exceptions\nThe agent solution must work in real-world operational conditions. Users often ask questions mid-call with a customer or while coordinating parts shipments. The agents require quick, reliable outcomes. As a result, Fabrikam Inc. requires the solution to:\nProvide grounded answers with traceability when it provides guidance.\nRetrieve real-time metrics when users ask for operational status.\nExecute authenticated updates when users initiate a flow (such as creating a parts request).\nFabrikam Inc. also expects the solution to be maintained by multiple makers and developers across the year. The company has experienced duplicated logic and inconsistent behavior across different agents. This project emphasizes reuse, governance, and maintainability across teams.\nCurrent environment -\nFabrikam Inc. runs three Microsoft Power Platform environments for agent development and release: Dev, Test, and Prod.\nThe team plans to build the agent and validate it in Dev and Test, then promote to Prod by using a controlled release process that supports repeatable deployments.\nFabrikam Inc. already has two assets the team wants to reuse:\nA partially completed Copilot Studio agent named Service Desk Agent, used by IT to create internal tickets and route requests\nA Microsoft Foundry agent created by a central AI team that performs specialized summarization and classification for long-form text (for example, summarizing call transcripts into an incident narrative)\nFabrikam Inc. also has operational and knowledge data sources:\nA curated policy library (internal SOPs, service warranty rules, escalation criteria, and standard operating procedures)\nA set of indexed documents and procedures in an Azure AI Search service that supports vector search for the policy library\nA Microsoft Fabric workspace that includes a semantic model used by operations leadership for reporting\nBusiness requirements -\nFabrikam Inc. requires Operations Concierge to meet the following business requirements:\nTraceability requirement: When the agent provides policy guidance or procedural recommendations, users must be able to see where the answer came from.\nMetrics requirement: When users ask about service performance (backlog, SLA risk, parts shortages, dispatch delays), the solution must return up-to-date metrics in a structured format that operations managers can use in weekly reviews.\nTransaction requirement: The solution must support authenticated updates initiated during conversations, including creating a parts request and updating a service case status.\nIn addition, Fabrikam Inc. wants to avoid duplicating common assets across agents:\nThe team must reuse the same set of escalation topics, MCP tool definitions, and a standard safety disclaimer across three different agents.\nOnly the platform engineering group as allowed to edit shared assets. However, all agent authors must be able to use them.\nTechnical requirements -\nThe Fabrikam Inc. solution architecture uses a multi-agent approach so that specialist responsibilities are isolated and can evolve independently.\nThe Operations Concierge (primary agent) must coordinate the following specialist capabilities:\nPolicy and procedure Q&A: Use an enterprise knowledge source that supports indexed retrieval across the curated policy library and service procedures.\nOperational metrics: Delegate metric queries to a Fabric Data Agent that reads governed business data through the Fabric semantic model.\nAuthenticated updates: Use tools exposed by an existing internal Model Context Protocol (MCP) server that provides transactional operations for the service organization.\nSpecialized processing: Delegate summarization and classification requests to an existing Microsoft Foundry agent.\nFabrikam Inc. will onboard two MCP servers as tools:\nPartsOps MCP server: exposes tools for parts availability checks and parts request creation. The server requires per-user authentication because actions must be traceable to the requesting user.\nWarrantyRules MCP server: exposes a read-only tool for validating warranty coverage. The server uses an API key shared by the agent team.\nFabrikam Inc. has also defined a collaboration requirement with the existing Service Desk Agent:\nThe primary agent must delegate IT-specific requests to the existing Service Desk Agent rather than reimplement ticket creation logic.\nFinally, Fabrikarn Inc. plans to support a partner integration:\nFor shipment tracking inquiries, Fabrikam Inc. will delegate to a partner-provided agent that is only available through a standardized agent-to-agent endpoint.\nIssues and constraints -\nDuring early testing, Fabrikam Inc. found three recurring problems:\nMakers are copying and modifying the same components across agents, resulting in inconsistent disclaimers and duplicated tools.\nUsers can obtain a correct answer, but the response is not consistently traceable to a source when the agent uses knowledge.\nThe primary agent can route some requests, but specialist capabilities are not consistently delegated (for example, some metric questions are answered generatively instead of being routed to the Fabric Data Agent).\nYou are part of the engineering team responsible for correcting the design and configuration to meet the preceding requirements and constraints.\nYou need to connect Operations Concierge to Fabrikam Inc.'s Azure AI Search knowledge index while complying with security requirements.\nWhich configuration should you use for each requirement? To answer, move the appropriate configurations to the correct requirements. You may use each configuration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image37.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "3 weeks, 3 days ago",
        "vote": "",
        "upvotes": 2,
        "content": "RequirementConfigurationEnsure the Azure AI Search connection complies with the governance requirement for authenticated access.Select the service principal as the authentication type.Ensure policy and procedure Q&A uses the required curated, indexed enterprise knowledge source.Enter the name of the Azure AI Search index.Ensure the connection targets the Azure AI Search service instance that stores the indexed policy documents.Provide the Azure AI Search Endpoint URL in the connection details."
      }
    ],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 79,
    "question_id": 1007807,
    "discussion_id": "419292",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419292-exam-cca-f-topic-1-question-79-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company is building a Copilot Studio solution that must answer policy questions, retrieve operational metrics from structured data, and execute authenticated updates in backend systems. The company decides to use multiple specialized agents rather than a single monolithic agent. Custom agents for each action already exist.\nTo meet the business needs, the solution must meet the following requirements:\nThe solution must retrieve up to date metrics from structured data.\nThe solution must answer policy questions using curated knowledge.\nThe solution must execute authenticated updates during conversations.\nYou need to select the appropriate agent design for each requirement.\nWhich approach should you use for each requirement? To answer, move the appropriate configurations to the correct requirements. You may use each configuration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image39.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "1 month ago",
        "vote": "",
        "upvotes": 3,
        "content": "should it not be:\nRetrieve up-to-date metrics → Delegate to a data-access agent\nAnswer policy questions → Delegate to a knowledge-focused agent\nExecute authenticated updates → Delegate to a tools-first agent"
      }
    ],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 80,
    "question_id": 1007808,
    "discussion_id": "419322",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419322-exam-cca-f-topic-1-question-80-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company has an approved custom connector that uses a REST API for an internal system.\nAn agent in Copilot Studio must call this connector during conversations to retrieve or update data.\nTo meet the business needs, the solution must meet the following requirements:\nMake the connector actions available for the agent to invoke.\nEnsure authentication is handled at the service level, not per user.\nPass conversation context into the connector when it is called.\nSurface the returned data of the connector to the user in the conversation.\nYou need to configure the agent and the connector action to meet the requirements.\nWhat should you configure for each requirement? To answer, move the appropriate configurations to the correct requirements. You may use each configuration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image41.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 81,
    "question_id": 1007809,
    "discussion_id": "419291",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419291-exam-cca-f-topic-1-question-81-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company has an Azure AI Search vector index that contains enterprise content and wants to use it as a knowledge source for an agent in Copilot Studio.\nTo meet business needs, the knowledge source must meet the following requirements:\nThe agent must connect to the Azure AI Search service.\nThe agent must use a supported authentication method for the connection.\nThe agent must ensure answers are grounded using the specified Azure AI Search index.\nYou need to connect to Azure AI Search as a knowledge source for the agent.\nIn which order should you perform the actions? To answer, move all actions from the list of actions to the answer area and arrange them in the correct order.",
    "images": [
      "https://img.examtopics.com/ab-620/image43.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 82,
    "question_id": 1007810,
    "discussion_id": "419294",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419294-exam-cca-f-topic-1-question-82-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company uses a primary agent in Copilot Studio to handle user intake.\nFor some requests, the company wants the primary agent to delegate work to another Copilot Studio agent that already exists.\nTo meet the business needs, the solution must allow agents to perform the following on the connected agent:\nMust allow calls from other agents.\nMust allow agents to use the connected agent for collaboration.\nMust allow agents to invoke the connected agent in conversations.\nYou need to integrate the existing Copilot Studio agent with the connected agent.\nWhich setting should you configure for each requirement? To answer, move the appropriate configurations to the correct requirements. You may use each configuration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image45.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "3 weeks, 3 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "RequirementConfigurationMust allow calls from other agentsPublish the connected agentMust allow agents to use the connected agent for collaborationConfigure connections to the connected agentMust allow agents to invoke the connected agent in conversationsAdd the connected agent"
      }
    ],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 83,
    "question_id": 1007811,
    "discussion_id": "419309",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419309-exam-cca-f-topic-1-question-83-discussion/",
    "topic": "Topic 1",
    "question_text": "A company uses multiple Copilot Studio agents that perform specialized tasks.\nThe company needs to enable one agent to directly delegate and invoke another agent within Copilot Studio by using a standard Copilot Studio interface.\nYou need to configure collaboration among agents by using Copilot Studio.\nWhat should you do?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Add the target agent as a Microsoft Fabric Data Agent.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Provide A2A endpoint information for the target agent.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Upload documentation about the target agent for referencing.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Add the target agent as an indexed knowledge source.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 84,
    "question_id": 1007812,
    "discussion_id": "419328",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419328-exam-cca-f-topic-1-question-84-discussion/",
    "topic": "Topic 1",
    "question_text": "A company uses an agent in Copilot Studio that produces structured responses using a reusable instruction template. The responses follow the required tone and format. During a compliance review, the team discovers that the responses were generated using a model that is not on the approved list.\nThe company requires that the reusable instruction template continues to be used and the model used for prompt-driven responses meets governance requirements.\nThe solution must ensure that prompt-driven responses are generated using an approved model.\nYou need to configure the solution that meets the requirements.\nWhich two actions should you perform? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Publish the agent so that the model used by prompt-driven responses is updated automatically.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Enable citations so generated responses can be traced and comply with governance requirements.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Add a line to the instruction template that requires the agent to use only approved models when generating responses.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Configure Azure AI Search as the grounding source so the approved model requirement is enforced during response generation.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Ensure the reusable instruction template is the one applied to the agent that generates the structured response.",
        "is_correct": true
      }
    ],
    "correct_answer": "A, E",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A, E",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 85,
    "question_id": 1007813,
    "discussion_id": "419339",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419339-exam-cca-f-topic-1-question-85-discussion/",
    "topic": "Topic 1",
    "question_text": "A team has an agent in Copilot Studio that handles user intake. For some requests, the team wants the agent to delegate work to a Microsoft Foundry agent that performs specialized processing. The Foundry agent already exists.\nTo meet the business needs, the solution must meet the following requirements:\nThe primary agent must be able to call the Foundry agent.\nThe external agent connection must reference the correct Foundry project and agent.\nYou need to integrate the primary agent with the Foundry agent.\nWhich two actions should you take? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Add an external agent.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Configure the Copilot Studio endpoint URL.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Configure the project endpoint URL.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Add an indexed knowledge source.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Publish the Copilot Studio agent.",
        "is_correct": false
      }
    ],
    "correct_answer": "A, C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A, C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 86,
    "question_id": 1007814,
    "discussion_id": "419344",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419344-exam-cca-f-topic-1-question-86-discussion/",
    "topic": "Topic 1",
    "question_text": "A company must enable an agent in Copilot Studio to execute operations exposed by an external MCP server.\nThe MCP server publishes callable tools and requires authentication.\nThe agent must be able to invoke MCP tools during conversations.\nYou need to configure MCP tools so the agent can execute MCP tool calls.\nWhat should you do?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Upload documentation about the MCP server so the agent can answer questions about it.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Enable generative answers so the model can automatically invoke MCP tools.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Publish the agent and rely on default settings for tool availability.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Add the MCP server to the agent's tool configuration.",
        "is_correct": true
      }
    ],
    "correct_answer": "D",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "D",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 87,
    "question_id": 1007815,
    "discussion_id": "419351",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419351-exam-cca-f-topic-1-question-87-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company needs an agent to answer questions using live enterprise records and to execute a limited set of operations in the same system.\nTo meet the business needs, the agent must meet the following requirements:\nThe agent must update a record using authenticated access.\nThe agent must answer questions using live data at runtime.\nThe agent must avoid indexing enterprise data into a search index.\nYou need to select the correct Power Platform connector approach for each requirement.\nWhich option should you use for each requirement? To answer, move the appropriate solutions to the correct requirements. You may use each solution once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image47.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "4 weeks, 1 day ago",
        "vote": "",
        "upvotes": 4,
        "content": "RequirementCorrect solutionThe agent must update a record using authenticated access.Power Platform connector toolThe agent must answer questions using live data at runtime.Power Platform connector as real-time knowledgeThe agent must avoid indexing enterprise data into a search index.Power Platform connector as real-time knowledge"
      }
    ],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 88,
    "question_id": 1007816,
    "discussion_id": "419302",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419302-exam-cca-f-topic-1-question-88-discussion/",
    "topic": "Topic 1",
    "question_text": "A company uses an agent in Copilot Studio to coordinate user interactions.\nThe company wants the agent to delegate requests to a Microsoft Fabric Data Agent that accesses governed business data.\nThe agent must retrieve structured analytical data while enforcing data security and scope controls.\nYou need to select the integration approach that meets the requirements.\nWhat should you use?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "A Microsoft Fabric Data Agent and bind it to the model.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "A REST API action that queries Fabric tables directly.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "A Power Automate flow and call it from a topic.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "A Copilot connector knowledge source that indexes Fabric data.",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_1_agentic_architecture"
  },
  {
    "question_number": 89,
    "question_id": 1007817,
    "discussion_id": "419335",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419335-exam-cca-f-topic-1-question-89-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company is building an agent in Copilot Studio that must answer questions using enterprise systems and must also perform authenticated operations.\nTo meet the business needs, the agent must meet the following requirements.\nThe agent must provide searchable answers from indexed enterprise content.\nThe agent must retrieve up-to-date facts at runtime without indexing data.\nThe agent must perform an authenticated update operation during the conversation.\nYou need to select the correct integration approach for each requirement.\nWhich option should you use for each requirement? To answer, move the appropriate solutions to the correct requirements. You may use each solution once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image49.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 90,
    "question_id": 1007818,
    "discussion_id": "419332",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419332-exam-cca-f-topic-1-question-90-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company is extending agents in Copilot Studio with both external capabilities and enterprise content access. Some user requests require grounded answers, while other requests require executing actions.\nTo meet the business needs, the agent must meet the following requirements:\nGround answers using results from enterprise data.\nInvoke callable functions exposed through a standardized tool interface.\nWrite an update to a system by using an authenticated action during the conversation.\nYou need to integrate the correct approach to meet the requirements.\nWhat should you integrate for each requirement? To answer, move the appropriate integrations to the correct requirements. You may use each integration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image51.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "kevinirl",
        "date": "2 weeks, 4 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "Ground answers using results from enterprise data → Add Dataverse tables as a structured data knowledge source."
      }
    ],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 91,
    "question_id": 1007819,
    "discussion_id": "419318",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419318-exam-cca-f-topic-1-question-91-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company plans to use Copilot connectors to ground answers from a third-party system for an agent in Copilot Studio.\nTo meet the business needs, responsibilities for configuring and using Copilot connectors must be separated, based on the following requirements:\nFor tenant administration, the connector must be available at the tenant level.\nFor agent runtime behavior, answers must be grounded from authorized sources.\nFor builder configuration, you must add the connector to the agent.\nYou need to determine how Copilot connector set-up responsibilities are handled across tenant, runtime, and builder stages.\nWhat should you configure for each requirement? To answer, move the appropriate configuration to the correct requirements. You may use each configuration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image53.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "4 weeks, 1 day ago",
        "vote": "",
        "upvotes": 4,
        "content": "Tenant administrationConfigure the Copilot connector in Microsoft 365 Admin CenterAgent runtime behaviorCall the connector knowledge sourceBuilder configurationAdd the Copilot connector as a knowledge source"
      }
    ],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 92,
    "question_id": 1007820,
    "discussion_id": "419343",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419343-exam-cca-f-topic-1-question-92-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company uses an agent in Copilot Studio to answer questions based on enterprise content.\nThe content is indexed in Azure AI Search. Responses must be generated by a Microsoft Foundry model.\nTo meet the business needs, the solution must meet the following requirements:\nUsers are able to trace each answer back to its source.\nThe agent retrieves information from a centralized data index.\nResponses are generated by an enterprise-approved foundation model.\nYou need to configure generative answers for the agent.\nWhat should you configure for each requirement? To answer, move the appropriate configurations to the correct requirements. You may use each configuration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image55.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 93,
    "question_id": 1007821,
    "discussion_id": "419320",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419320-exam-cca-f-topic-1-question-93-discussion/",
    "topic": "Topic 1",
    "question_text": "A company uses an agent in Copilot Studio to generate structured responses for internal users.\nThe agent must meet the following requirements:\nConsistently follow a reusable instruction template for response tone and structure.\nUse an enterprise-approved foundation model for responses generated through the template.\nYou need to configure custom prompts so the agent uses the Microsoft Foundry model catalog.\nWhich two actions should you perform? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Publish the agent to apply the Foundry model selection automatically.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Configure Azure AI Search as the grounding source, so the model choice is enforced.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Allow topic authors to define tone and structure directly in topic steps.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Select a model from the Foundry model catalog for the custom prompt configuration.",
        "is_correct": true
      },
      {
        "letter": "E",
        "text": "Create a custom prompt template and apply it where the agent generates the structured response.",
        "is_correct": true
      },
      {
        "letter": "F",
        "text": "Enable citations, so the model is restricted to approved outputs.",
        "is_correct": false
      }
    ],
    "correct_answer": "D, E",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "D, E",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 94,
    "question_id": 1007822,
    "discussion_id": "419329",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419329-exam-cca-f-topic-1-question-94-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company integrates an MCP service that exposes ticket-management operations.\nThe MCP service requires authenticated requests and exposes multiple callable operations that must be selectively governed for agent use.\nTo meet the business needs, the MCP configuration must meet the following requirements:\nOnly the allowed capabilities must be callable during conversations.\nRequests must succeed without embedding credentials in topic steps.\nThe agent must be configured to send requests to the correct backend.\nYou need to configure MCP tools for the agent.\nWhich setting should you configure for each requirement? To answer, move the appropriate settings to the correct requirements. You may use each setting once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image57.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 95,
    "question_id": 1007823,
    "discussion_id": "419295",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419295-exam-cca-f-topic-1-question-95-discussion/",
    "topic": "Topic 1",
    "question_text": "An agent in Copilot Studio must complete tasks by automating interactions with a legacy desktop application that does not use APIs.\nDuring testing, the builder must confirm that the automation runs in a supported execution context and can inspect how each automation step executes during conversations.\nTo meet the business needs, the solution must:\nExecute UI automation in a supported, platform-managed environment.\nProvide visibility into how automation steps run during agent conversations.\nYou need to configure the agent based on the requirements.\nWhich two actions should you perform? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Publish the agent so automation settings are applied at runtime.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Inspect automation execution details by using the agent runtime view.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Enable computer use for the agent so UI automation runs in the supported execution environment.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Add the desktop application as a knowledge source so the agent can reference its UI structure.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Configure a custom connector to simulate UI interactions through REST calls.",
        "is_correct": false
      }
    ],
    "correct_answer": "B, C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B, C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 96,
    "question_id": 1007824,
    "discussion_id": "419327",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419327-exam-cca-f-topic-1-question-96-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company configures an agent flow that interacts with multiple systems to complete user requests.\nThe company must integrate external services, retrieve data, and notify users as part of the same automated flow run. To support this scenario, the agent flow must be able to do the following:\nCall an external API.\nRetrieve stored data from a supported internal data source.\nSend a Teams message.\nYou need to select a connector or action type for each requirement.\nWhat should you use? To answer, move the appropriate connectors or actions to the correct requirements. You may use each connector or action once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image59.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 97,
    "question_id": 1007825,
    "discussion_id": "419305",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419305-exam-cca-f-topic-1-question-97-discussion/",
    "topic": "Topic 1",
    "question_text": "An agent in Copilot Studio must retrieve real-time data from an external system that exposes a REST API.\nThe API returns structured JSON data and requires authentication.\nThe agent must call the API during conversations to fulfill user requests.\nThe agent must retrieve real-time data from the external system by calling an authenticated REST API during a conversation.\nThe solution must use a supported mechanism that executes the REST API call and the call must be explicitly configured to run at runtime.\nYou need to determine which approaches add the REST API to the agent.\nWhich two solutions meet the goal? Each correct answer is a complete solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Configure an HTTP action and invoke it from a topic during the conversation.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Create a topic variable and use a Formula to parse the API endpoint string.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Add the REST API as a tool and call it either by using a topic or agent instruction.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Add the REST API as a knowledge source so the agent can query it during conversations.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Enable generative answers and rely on the model to fetch the REST API data automatically.",
        "is_correct": false
      },
      {
        "letter": "F",
        "text": "Create a global variable to store the API URL and call it using a Redirect node.",
        "is_correct": false
      }
    ],
    "correct_answer": "A, C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A, C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 98,
    "question_id": 1007826,
    "discussion_id": "419290",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419290-exam-cca-f-topic-1-question-98-discussion/",
    "topic": "Topic 1",
    "question_text": "A company must enable an agent in Copilot Studio to execute operations exposed by an external MCP server.\nThe MCP server publishes callable tools and requires authentication.\nThe agent must be able to invoke MCP tools during conversations.\nYou need to configure MCP tools so the agent can execute MCP tool calls.\nWhat should you do?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Enable generative answers so the model can automatically invoke MCP tools.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Add a Power Platform connector as real-time knowledge to replace MCP tools.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Add the MCP server output as an indexed knowledge source.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Configure authentication for the MCP server connection used by the agent.",
        "is_correct": true
      }
    ],
    "correct_answer": "D",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "D",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_2_tool_design_mcp"
  },
  {
    "question_number": 99,
    "question_id": 1007827,
    "discussion_id": "419288",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419288-exam-cca-f-topic-1-question-99-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nAn agent in Copilot Studio must retrieve real-time data from an external system that exposes a REST API. The API returns structured JSON responses and requires authentication.\nTo meet the business needs, the solution must meet the following requirements:\nThe agent calls a REST API during a conversation.\nThe REST API call runs with proper authentication.\nThe REST API response is available to the topic at runtime.\nYou need to configure the REST API to meet the requirements.\nWhat should you configure for each requirement? To answer, move the appropriate configurations to the correct requirements. You may use each configuration once, more than once, or not at au. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image61.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 100,
    "question_id": 1007828,
    "discussion_id": "419324",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419324-exam-cca-f-topic-1-question-100-discussion/",
    "topic": "Topic 1",
    "question_text": "A company is configuring generative answers for an agent in Copilot Studio agent.\nThe agent must use Azure AI Search to retrieve enterprise content, and all responses must be generated by a Microsoft Foundry model.\nThe agent sometimes generates answers that are not grounded in Azure AI Search content. The company requires that the agent only generate responses when relevant indexed content is retrieved.\nYou need to configure the agent so that its generative answer behavior meets the organization's requirements.\nWhat should you do?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Use Azure AI Search as a tailback source and enable answer expansion.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Upload documents into the agent and disable fallback responses.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Require grounding for generative answers and use Azure AI Search as the retrieval source.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Enable citations and configure a public model endpoint.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Enable conversational boosting and select a Foundry-approved model.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [
      {
        "voted_answers": "C",
        "vote_count": 2,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "C",
    "total_community_votes": 2,
    "community_consensus": "C",
    "is_controversial": true,
    "comments_count": 2,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "3 weeks, 1 day ago",
        "vote": "",
        "upvotes": 1,
        "content": "Require grounding for generative answers and use Azure AI Search as the retrieval source."
      },
      {
        "user": "BolDeFruits",
        "date": "3 weeks, 1 day ago",
        "vote": "",
        "upvotes": 1,
        "content": "Proper answer is C\nSource: https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/retrieval-augmented-generation"
      }
    ],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 101,
    "question_id": 1007829,
    "discussion_id": "419289",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419289-exam-cca-f-topic-1-question-101-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company wants to extend an agent in Copilot Studio by calling an external REST API to retrieve and update data.\nTo meet the business needs, the REST API must be added following a correct dependency order.\nYou need to add a REST API to the agent so it can be invoked during conversations.\nIn which order should you perform the actions? To answer, move all actions from the list of actions to the answer area and arrange them in the correct order.",
    "images": [
      "https://img.examtopics.com/ab-620/image63.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "3 weeks, 2 days ago",
        "vote": "",
        "upvotes": 6,
        "content": "Add the REST API tool\nConfigure the API endpoint details\nConfigure authentication for the API\nTest the API configuration"
      }
    ],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 102,
    "question_id": 1007830,
    "discussion_id": "419348",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419348-exam-cca-f-topic-1-question-102-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company needs an agent in Copilot Studio to complete tasks by interacting with a legacy desktop application that does NOT have APIs.\nTo meet the business needs, the solution must meet the following requirements:\nThe agent must interact with the application's UI.\nThe execution must run on supported infrastructure.\nThe builder must be able to observe how the tool runs during execution.\nYou need to configure the agent based on the requirements.\nWhich setting should you configure for each requirement? To answer, move the appropriate settings to the correct requirements. You may use each setting once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image65.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 103,
    "question_id": 1007831,
    "discussion_id": "419321",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419321-exam-cca-f-topic-1-question-103-discussion/",
    "topic": "Topic 1",
    "question_text": "Note: This question is part of a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Some question sets might have more than one correct solution, while others might not have a correct solution.\nAfter you answer a question in this section, you will NOT be able to return to it. As a result, these questions will not appear on the review screen.\nA company is configuring an agent in Copilot Studio that uses a generative answers node inside multiple topics.\nThe company requires responses to meet the following requirements:\nMust use an executive summary format.\nMust apply only within a specific topic.\nMust continue using configured knowledge sources.\nMust comply with connector security controls.\nYou need to configure a custom prompt to meet the formatting requirements.\nSolution: Add instructions in the custom prompt tool to restrict connector access during runtime.\nDoes the solution meet the goal?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Yes",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "No",
        "is_correct": true
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 104,
    "question_id": 1007832,
    "discussion_id": "419287",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419287-exam-cca-f-topic-1-question-104-discussion/",
    "topic": "Topic 1",
    "question_text": "Note: This question is part of a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Some question sets might have more than one correct solution, while others might not have a correct solution.\nAfter you answer a question in this section, you will NOT be able to return to it. As a result, these questions will not appear on the review screen.\nA company is configuring an agent in Copilot Studio that uses a generative answers node inside multiple topics.\nThe company requires responses to meet the following requirements:\nMust use an executive summary format.\nMust apply only within a specific topic.\nMust continue using configured knowledge sources.\nMust comply with connector security controls.\nYou need to configure a custom prompt to meet the formatting requirements.\nSolution: Create a custom prompt tool in the specific topic that instructs the model to respond using an executive-summary structure.\nDoes the solution meet the goal?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Yes",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "No",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 105,
    "question_id": 1007833,
    "discussion_id": "419298",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419298-exam-cca-f-topic-1-question-105-discussion/",
    "topic": "Topic 1",
    "question_text": "Note: This question is part of a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Some question sets might have more than one correct solution, while others might not have a correct solution.\nAfter you answer a question in this section, you will NOT be able to return to it. As a result, these questions will not appear on the review screen.\nA company is configuring an agent in Copilot Studio that uses a generative answers node inside multiple topics.\nThe company requires responses to meet the following requirements:\nMust use an executive summary format.\nMust apply only within a specific topic.\nMust continue using configured knowledge sources.\nMust comply with connector security controls.\nYou need to configure a custom prompt to meet the formatting requirements.\nSolution: Remove the generative answers node and rely only on the custom prompt to produce formatted responses.\nDoes the solution meet the goal?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Yes",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "No",
        "is_correct": true
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 106,
    "question_id": 1007834,
    "discussion_id": "419273",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419273-exam-cca-f-topic-1-question-106-discussion/",
    "topic": "Topic 1",
    "question_text": "Note: This question is part of a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Some question sets might have more than one correct solution, while others might not have a correct solution.\nAfter you answer a question in this section, you will NOT be able to return to it. As a result, these questions will not appear on the review screen.\nA company is configuring an agent in Copilot Studio that uses a generative answers node inside multiple topics.\nThe company requires responses to meet the following requirements:\nMust use an executive summary format.\nMust apply only within a specific topic.\nMust continue using configured knowledge sources.\nMust comply with connector security controls.\nYou need to configure a custom prompt to meet the formatting requirements.\nSolution: Configure the custom prompt tool at the topic level so that other topics are not affected.\nDoes the solution meet the goal?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Yes",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "No",
        "is_correct": true
      }
    ],
    "correct_answer": "B",
    "voted_stats": [
      {
        "voted_answers": "A",
        "vote_count": 2,
        "is_most_voted": true
      },
      {
        "voted_answers": "B",
        "vote_count": 1,
        "is_most_voted": false
      }
    ],
    "most_voted_answer": "A",
    "total_community_votes": 3,
    "community_consensus": "A",
    "is_controversial": true,
    "comments_count": 2,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "6 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "Separate custom prompt tool\n\nIs topic-specific\nCan format output\nBut does not inherently guarantee that the answer is still being generated by the existing Generative Answers node and its configured knowledge sources\nIntroduces a separate prompt execution path"
      },
      {
        "user": "BolDeFruits",
        "date": "3 weeks, 1 day ago",
        "vote": "",
        "upvotes": 2,
        "content": "Because the custom prompt is configured at the topic level, it provides the required executive-summary formatting for that topic only, while continuing to use the existing knowledge sources and preserving security controls.\nSource:\nhttps://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node"
      }
    ],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 107,
    "question_id": 1007835,
    "discussion_id": "419296",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419296-exam-cca-f-topic-1-question-107-discussion/",
    "topic": "Topic 1",
    "question_text": "A team is developing an agent in Copilot Studio and wants to evaluate its behavior before expanding access.\nThe team needs a repeatable, consistent method to test the agent using predefined interactions.\nYou need to ensure that agent responses can be evaluated consistently across multiple test runs.\nWhat should you do?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Review evaluation scores from previous production sessions.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Enable telemetry and analytics to monitor intent matches, fallback usage, and response frequency.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Define test sets of prompts and expectations.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Change the evaluation method to a qualitative approach.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Publish the agent to additional channels for broader usage.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 108,
    "question_id": 1007836,
    "discussion_id": "419347",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419347-exam-cca-f-topic-1-question-108-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company builds agents in Copilot Studio in a development environment.\nThe agents are packaged inside a solution and deployed by using Power Platform Pipelines to test and production environments.\nThe company has the following requirements that must be met:\nProduction deployments are limited to a defined set of users who are responsible for that stage.\nThe same solution is reused across all environments without editing its components.\nThe production environment always receives a locked-down version of the solution.\nYou need to configure the pipeline and solution behavior to meet the requirements.\nWhat should you configure? To answer, move the appropriate configurations to the correct requirements. You may use each configuration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image67.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "4 weeks, 1 day ago",
        "vote": "",
        "upvotes": 1,
        "content": "Use environment variablesChange environment-specific values without changing solution componentsDeploy as unmanagedAllow solution components to be edited in the target environmentDeploy as managedPrevent solution components from being edited in the target environment"
      }
    ],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 109,
    "question_id": 1007837,
    "discussion_id": "419270",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419270-exam-cca-f-topic-1-question-109-discussion/",
    "topic": "Topic 1",
    "question_text": "HOTSPOT -\nYou run multiple evaluation tests for an agent in Copilot Studio before expanding user access.\nThe tests provide the following results:\nEach evaluation case is reported as meeting or missing the expected response.\nSome evaluation cases fail repeatedly across several runs.\nEach run displays the expected response and the response generated by the agent.\nYou need to provide a conclusion based on the evaluation results.\nWhich conclusions should you make? To answer, select the appropriate options in the answer area.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image69.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 110,
    "question_id": 1007838,
    "discussion_id": "419301",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419301-exam-cca-f-topic-1-question-110-discussion/",
    "topic": "Topic 1",
    "question_text": "An agent in Copilot Studio is evaluated using a fixed test set and an automated evaluation method.\nAfter running the evaluation, the team observes that the same three interactions fail in every run, while all other interactions pass consistently.\nYou need to use the evaluation results to determine an accurate conclusion.\nWhat should you conclude from the evaluation results?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "The agent's overall design is flawed and requires a full redesign.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "The failing interactions are caused by an issue in the underlying language model.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "The outcomes isolate which portions of the agent's functional scope require remediation.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "The agent should not be deployed.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 111,
    "question_id": 1007839,
    "discussion_id": "419303",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419303-exam-cca-f-topic-1-question-111-discussion/",
    "topic": "Topic 1",
    "question_text": "A team has an existing agent in Copilot Studio and must move it to a different target location without rebuilding the agent. Some builders use Copilot Studio in the web app, while others use Copilot Studio in Microsoft Teams.\nYou need a supported approach to move the existing agent to the target location using ALM practices. The solution must avoid rebuilding the agent.\nYou need to move the existing agent to the target location using a supported method.\nWhat should you do?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Remove agent components directly from the solution so that export and import will succeed.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Duplicate the agent in the source and manually recreate the changes in the target to avoid solution dependencies.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Create a custom solution, add the existing agent to the solution, export the solution with the agent, and import the solution into the target environment.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Publish the agent to a channel and use the channel configuration as the transport mechanism to the target environment.",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 112,
    "question_id": 1007840,
    "discussion_id": "419350",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419350-exam-cca-f-topic-1-question-112-discussion/",
    "topic": "Topic 1",
    "question_text": "HOTSPOT -\nYou are setting up an evaluation for an agent in Copilot Studio before expanding access to more users.\nYou must configure the evaluation so that the agent is tested by using prepared interactions rather than impromptu conversations.\nThe evaluation should provide the following functionality for users:\nAn administrator updates a sensitive configuration value. The administrator requires the change to take effect at runtime without republishing the agent.\nA builder needs to confirm a configuration value but must not be able to modify it from Copilot Studio.\nAn administrator updates a non-secret configuration value and requires the updated value to be used by the published agent at runtime.\nYou need to create a test set-based evaluation that supports consistent test runs for each scenario.\nWhat should you configure for each scenario? To answer, select the appropriate options in the answer area.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image71.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 113,
    "question_id": 1007841,
    "discussion_id": "419340",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419340-exam-cca-f-topic-1-question-113-discussion/",
    "topic": "Topic 1",
    "question_text": "HOTSPOT -\nA team is preparing to evaluate an agent in Copilot Studio before expanding access to additional users.\nThe team must select an evaluation method that meets the following requirements:\nUse a fixed set of prepared interactions.\nDetermine responses against a predefined baseline.\nSupport consistent comparison across repeated test runs.\nYou need to determine the evaluation method that satisfies the evaluation requirements.\nWhich evaluation method should you select for each requirement? To answer, select the appropriate option in the answer area.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image73.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 114,
    "question_id": 1007842,
    "discussion_id": "419300",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419300-exam-cca-f-topic-1-question-114-discussion/",
    "topic": "Topic 1",
    "question_text": "A solution containing an agent in Copilot Studio is moved across environments. The agent relies on configuration values that are different between environments and are managed as environment variables.\nYou must ensure the following:\nConfiguration values are managed through environment variables that supports ALM.\nRuntime behavior reflects updates to environment variable values.\nYou need to implement environment-variable usage that supports ALM and ensures correct runtime behavior.\nWhich three actions should you perform? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Replace environment variables with hard-coded values inside the agent so that runtime behavior is always consistent across environments.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Allow builders to change environment variable values directly in Copilot Studio during topic authoring to speed deployment.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Use environment variables as read-only in Copilot Studio and change their values in the appropriate administrative authoring experience.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Store external reference values as environment variables so the agent solution can move between environments while keeping the agent definition the same.",
        "is_correct": true
      },
      {
        "letter": "E",
        "text": "Assume that all environment variable updates take effect immediately at runtime for all variable types without republishing.",
        "is_correct": false
      },
      {
        "letter": "F",
        "text": "After an administrator updates a non-secret environment variable, republish any agents that use the variable so the change is effective at runtime.",
        "is_correct": true
      }
    ],
    "correct_answer": "C, D, F",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C, D, F",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 115,
    "question_id": 1007843,
    "discussion_id": "419272",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419272-exam-cca-f-topic-1-question-115-discussion/",
    "topic": "Topic 1",
    "question_text": "HOTSPOT -\nAn organization uses separate development and production environments for agents in Copilot Studio.\nYou create an agent in the development environment.\nThe agent must be deployed to production by using an ALM process.\nYou must configure the solution strategy to meet the following requirements:\nDevelopers continue modifying the agent in development.\nThe production deployment prevents direct modification.\nThe agent is exported from development and imported into production in a deployment-ready state.\nYou need to configure solutions to support deployment and lifecycle management of the agents.\nWhich solution type should you use for each requirement? To answer, select the appropriate options in the answer area.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image75.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_4_prompt_engineering"
  },
  {
    "question_number": 116,
    "question_id": 1007844,
    "discussion_id": "419282",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419282-exam-cca-f-topic-1-question-116-discussion/",
    "topic": "Topic 1",
    "question_text": "A team is standardizing ALM for agents in Copilot Studio.\nThe team requires a custom solution that includes agents. The solution must support ALM scenarios, such as managing and transporting agent assets across environments and pipeline deployments.\nYou need to create an ALM-ready custom solution in Copilot Studio.\nWhat should you do?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Publish the agent to a channel and use that channel configuration as the ALM container.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Create a new custom solution from the Solutions area.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Export the custom solution as a managed solution and import it into production.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Export the agent directly and then import it into another environment.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 117,
    "question_id": 1007845,
    "discussion_id": "419297",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419297-exam-cca-f-topic-1-question-117-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nYou run the same fixed test set three times in Copilot Studio.\nDuring evaluation, you observe the following:\nThe same interaction fails in all three runs.\nScore values range from 0.58 to 0.61.\nThe reasoning states that the response partially matches the expected answer.\nThe knowledge source that is used is internal documentation.\nNo tools are invoked.\nYou need to determine which conclusions are supported based on the evaluation results.\nWhich conclusions should you make? To answer, move the appropriate conclusions to the correct evaluation results. You may use each conclusion once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image77.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 118,
    "question_id": 1007846,
    "discussion_id": "419284",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419284-exam-cca-f-topic-1-question-118-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA team wants to automate solution deployment between environments. Deployments must follow a controlled, repeatable process.\nThe team needs to implement a pipeline-based deployment process that enforces the correct dependency order.\nYou need to implement a deployment pipeline and determine the correct sequence of actions.\nIn which order should you perform the actions? To answer, move all actions from the list of actions to the answer area and arrange them in the correct order.",
    "images": [
      "https://img.examtopics.com/ab-620/image79.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 119,
    "question_id": 1007847,
    "discussion_id": "419341",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419341-exam-cca-f-topic-1-question-119-discussion/",
    "topic": "Topic 1",
    "question_text": "A company needs an agent in Copilot Studio to complete tasks by interacting with a legacy desktop application that does not use APIs. The builder needs to validate that UI automation can run in the supported execution context and needs a way to inspect how the automation behaves during testing conversations.\nTo meet the business needs, the solution must meet the following requirements:\nEnable the agent to perform UI automation against the legacy application.\nInspect execution details for the automation during conversations.\nYou need to configure the agent based on the requirements.\nWhich two actions should you perform? Each correct answer presents part of the solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Configure a custom connector for the desktop app so the agent can automate the UI through authenticated calls.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Add a Power Platform Desktop flow to control the desktop app.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Access the remote session within the testing pane to monitor the real-time execution of the agent's desktop interactions.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Publish the agent so the automation runs in the supported environment automatically.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Enable the Computer use capability.",
        "is_correct": true
      }
    ],
    "correct_answer": "B, E",
    "voted_stats": [
      {
        "voted_answers": "CE",
        "vote_count": 2,
        "is_most_voted": false
      }
    ],
    "most_voted_answer": "CE",
    "total_community_votes": 2,
    "community_consensus": "CE",
    "is_controversial": true,
    "comments_count": 1,
    "discussions": [
      {
        "user": "kevinirl",
        "date": "2 weeks, 5 days ago",
        "vote": "",
        "upvotes": 2,
        "content": "E. Enable the Computer use capability — This is the feature that lets a Copilot Studio agent perform UI automation against applications that have no API. Computer use drives the interface directly (clicking, typing, reading the screen) the way a person would, which is exactly what a legacy desktop app without APIs requires. This satisfies the first requirement.\n\nC. Access the remote session within the testing pane — Computer use runs in a remote/cloud session, and the testing pane lets you watch that session live so you can inspect how the automation behaves during test conversations. This satisfies the second requirement (inspect execution details during conversations)."
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 120,
    "question_id": 1007848,
    "discussion_id": "419338",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419338-exam-cca-f-topic-1-question-120-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA development team is reusing agents in Copilot Studio across development, test, and production environments.\nYou need to ensure the agents meet the following requirements:\nReusable components must support governed promotion across environments.\nEnvironment-specific configuration must not be hard-coded.\nDeployments must support automated, multi-stage approvals.\nYou need to configure the agents based on the business requirements.\nWhich configurations should you use for each requirement? To answer, move the appropriate configurations to the correct requirements. You may use each configuration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image81.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 121,
    "question_id": 1007849,
    "discussion_id": "419281",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419281-exam-cca-f-topic-1-question-121-discussion/",
    "topic": "Topic 1",
    "question_text": "An agent calls a flow that intermittently produces unexpected results during execution.\nThe agent behaves inconsistently.\nYou need to investigate agent flow executions to diagnose the issue.\nWhich two actions should you use? Each correct answer presents a complete solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Inspect failed run details.",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "Update the flow trigger definition.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Check the Error column in the Activity tab.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Review flow analytics summary.",
        "is_correct": false
      },
      {
        "letter": "E",
        "text": "Review flow run history.",
        "is_correct": true
      },
      {
        "letter": "F",
        "text": "Increase the connector timeout.",
        "is_correct": false
      }
    ],
    "correct_answer": "A, E",
    "voted_stats": [
      {
        "voted_answers": "AE",
        "vote_count": 5,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "AE",
    "total_community_votes": 5,
    "community_consensus": "AE",
    "is_controversial": true,
    "comments_count": 2,
    "discussions": [
      {
        "user": "ziggy1117",
        "date": "1 week, 3 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "You open and see that there is a failed run.\nYou then review the flow run history (E)\nThen you check the flow and inspect the failed run details inside (A)"
      },
      {
        "user": "kevinirl",
        "date": "2 weeks, 5 days ago",
        "vote": "",
        "upvotes": 4,
        "content": "There is no error column in Activity tab from where the agent flow errors  can be diagnosed"
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 122,
    "question_id": 1007850,
    "discussion_id": "419315",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419315-exam-cca-f-topic-1-question-122-discussion/",
    "topic": "Topic 1",
    "question_text": "You create a test set in Copilot Studio to evaluate an agent that answers policy questions and retrieves data from connected knowledge sources.\nYou run the evaluation and review the following result for one test case:\nExpected response: Digital products are non-refundable after download.\nActual response: Digital products cannot be refunded once downloaded.\nResult: Pass -\nScore: 0.92 -\nReasoning: The actual response semantically matches the expected response.\nKnowledge sources used: RefundPolicy_KB\nTools invoked: None -\nYou need to determine whether additional corrective action is required based on the evaluation results.\nWhich two actions should you perform? Each correct answer presents a complete solution.\nNOTE: Each correct selection is worth one point.",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Investigate external tool configuration for this test case.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Rerun the evaluation because the score is below 1.00.",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "Accept the result because semantic matching is sufficient for a passing evaluation.",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "Confirm that the connected knowledge source is functioning as expected.",
        "is_correct": true
      },
      {
        "letter": "E",
        "text": "Modify the test case because the response is not an exact match.",
        "is_correct": false
      }
    ],
    "correct_answer": "C, D",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C, D",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 123,
    "question_id": 1007851,
    "discussion_id": "419286",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419286-exam-cca-f-topic-1-question-123-discussion/",
    "topic": "Topic 1",
    "question_text": "HOTSPOT -\nA team deploys Copilot Studio solutions by using Power Platform Pipelines.\nYou must configure a deployment strategy that meets the following requirements:\nEnsure that the solutions deploy in dev, test, and production environments in order.\nIdentify missing connection references or environment variables before the deployment process begins.\nManage all pipeline stages and security from a single, unified location for all linked environments.\nYou need to configure the pipeline to meet the requirements.\nWhat should you configure for each requirement? To answer, select the appropriate options in the answer area.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image83.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 1,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "2 weeks, 2 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "•\tSolutions deploy in dev, test and production environments in order → Sequential stage progression\n•\tIdentify missing connection references or environment variables before deployment → Deployment input validation\n•\tManage pipeline stages and security from a single, unified location for linked environments → Centralized pipeline configuration."
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 124,
    "question_id": 1007852,
    "discussion_id": "419293",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419293-exam-cca-f-topic-1-question-124-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA team is preparing a test set to evaluate an agent in Copilot Studio before expanding access to additional users.\nThe test set must support consistent evaluation across repeated runs and focus on the agent's most important behaviors.\nYou need to create a test set that enables repeatable and meaningful evaluation.\nIn which order should you perform the actions? To answer, move all actions from the list of actions to the answer area and arrange them in the correct order.",
    "images": [
      "https://img.examtopics.com/ab-620/image85.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 125,
    "question_id": 1007853,
    "discussion_id": "419336",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419336-exam-cca-f-topic-1-question-125-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA team is preparing to assess an agent in Copilot Studio before expanding access to additional users.\nThe team requires an evaluation that provides controlled, repeatable, and consistently measured test runs.\nThe evaluation must:\nBe triggered directly by the team to control when testing occurs.\nDetermine success based on clearly established acceptance criteria.\nRely on a predefined source that ensures consistency across repeated runs.\nYou need to configure the evaluation to meet the requirements.\nWhat should you configure? To answer, move the appropriate configurations to the correct evaluation requirements. You may use each configuration once, more than once, or not at all. You may need to move the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image87.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 126,
    "question_id": 1007854,
    "discussion_id": "419349",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419349-exam-cca-f-topic-1-question-126-discussion/",
    "topic": "Topic 1",
    "question_text": "HOTSPOT -\nYou run multiple evaluation tests for an agent in Copilot Studio before expanding user access.\nYou observe the following about the evaluation results:\nEach evaluation case is reported as meeting or missing the expected response.\nSome evaluation cases fail repeatedly across several runs.\nEach run displays the expected response and the response generated by the agent.\nYou need to interpret what the evaluation results reveal.\nWhat should you conclude based on each interpretation? To answer, select the appropriate options in the answer area.\nNOTE: Each correct selection is worth one point.",
    "images": [
      "https://img.examtopics.com/ab-620/image89.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 127,
    "question_id": 1007855,
    "discussion_id": "419337",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419337-exam-cca-f-topic-1-question-127-discussion/",
    "topic": "Topic 1",
    "question_text": "DRAG DROP -\nA company uses an agent in Copilot Studio in production and requires centralized monitoring for operational visibility and troubleshooting.\nThe team decides to use Application Insights as the monitoring solution.\nAn agent activity is not included in the monitoring data.\nYou need to enable monitoring the agent by using Application Insights.\nWhich four actions should you perform in sequence? To answer, move the appropriate actions from the list of actions to the answer area and arrange them in the correct order.",
    "images": [
      "https://img.examtopics.com/ab-620/image91.png"
    ],
    "choices": [],
    "correct_answer": "",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 128,
    "question_id": 1007856,
    "discussion_id": "419331",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419331-exam-cca-f-topic-1-question-128-discussion/",
    "topic": "Topic 1",
    "question_text": "Note: This question is part of a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Some question sets might have more than one correct solution, while others might not have a correct solution.\nAfter you answer a question in this section, you will NOT be able to return to it. As a result, these questions will not appear on the review screen.\nA team is implementing ALM for agents in Copilot Studio across multiple environments.\nThe team requires a consistent way to manage and transport agent assets.\nYou need to recommend a solution that supports creation and use of ALM scenarios for agents in Copilot Studio.\nSolution: To export, import, and manage agents between environments, you need to create and use a custom solution.\nDoes the solution meet the goal?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Yes",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "No",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [
      {
        "voted_answers": "A",
        "vote_count": 4,
        "is_most_voted": true
      }
    ],
    "most_voted_answer": "A",
    "total_community_votes": 4,
    "community_consensus": "A",
    "is_controversial": false,
    "comments_count": 2,
    "discussions": [
      {
        "user": "faisalronnie",
        "date": "2 weeks, 2 days ago",
        "vote": "",
        "upvotes": 1,
        "content": "\"To export, import, and manage agents between environments, you need to create and use a custom solution.\""
      },
      {
        "user": "BolDeFruits",
        "date": "3 weeks, 1 day ago",
        "vote": "",
        "upvotes": 3,
        "content": "The statement in the solution:\n\n\"To export, import, and manage agents between environments, you need to create and use a custom solution.\"\n\nmatches the documented ALM process for Copilot Studio agents\nSource:\nhttps://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-import-export"
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 129,
    "question_id": 1007857,
    "discussion_id": "419334",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419334-exam-cca-f-topic-1-question-129-discussion/",
    "topic": "Topic 1",
    "question_text": "Note: This question is part of a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Some question sets might have more than one correct solution, while others might not have a correct solution.\nAfter you answer a question in this section, you will NOT be able to return to it. As a result, these questions will not appear on the review screen.\nA team is implementing ALM for agents in Copilot Studio across multiple environments.\nThe team requires a consistent way to manage and transport agent assets.\nYou need to recommend a solution that supports creation and use of ALM scenarios for agents in Copilot Studio.\nSolution: Publishing an agent to a channel is the required ALM container for transporting agents between environments.\nDoes the solution meet the goal?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Yes",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "No",
        "is_correct": true
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 130,
    "question_id": 1007858,
    "discussion_id": "419316",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/419316-exam-cca-f-topic-1-question-130-discussion/",
    "topic": "Topic 1",
    "question_text": "Note: This question is part of a series of questions that present the same scenario. Each question in the series contains a unique solution that might meet the stated goals. Some question sets might have more than one correct solution, while others might not have a correct solution.\nAfter you answer a question in this section, you will NOT be able to return to it. As a result, these questions will not appear on the review screen.\nA team is implementing ALM for agents in Copilot Studio across multiple environments.\nThe team requires a consistent way to manage and transport agent assets.\nYou need to recommend a solution that supports creation and use of ALM scenarios for agents in Copilot Studio.\nSolution: Builders can change environment variable values directly in Copilot Studio to complete ALM configuration without administrative tools.\nDoes the solution meet the goal?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Yes",
        "is_correct": true
      },
      {
        "letter": "B",
        "text": "No",
        "is_correct": false
      }
    ],
    "correct_answer": "A",
    "voted_stats": [
      {
        "voted_answers": "B",
        "vote_count": 4,
        "is_most_voted": false
      }
    ],
    "most_voted_answer": "B",
    "total_community_votes": 4,
    "community_consensus": "B",
    "is_controversial": true,
    "comments_count": 1,
    "discussions": [
      {
        "user": "BolDeFruits",
        "date": "3 weeks, 1 day ago",
        "vote": "",
        "upvotes": 4,
        "content": "Answer should be B (No)\nIn Copilot Studio, environment variables are read-only for builders. Their values are managed through the appropriate Power Platform administrative experience (such as solution management and environment configuration), not directly during Copilot Studio authoring. Environment variables are specifically designed to support ALM by separating configuration from the agent definition."
      }
    ],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 131,
    "question_id": 1007859,
    "discussion_id": "421164",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/421164-exam-cca-f-topic-1-question-131-discussion/",
    "topic": "Topic 1",
    "question_text": "Which data retention periods are the standard in the cloud for Web Intelligence Reporting?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "1 year for allowed traffic and 1 year for blocked traffic",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "45 days for allowed traffic and 1 year for blocked traffic",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "1 year for allowed traffic and 45 days for blocked traffic",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "45 days for allowed traffic and 45 days for blocked traffic",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  },
  {
    "question_number": 132,
    "question_id": 1007860,
    "discussion_id": "421165",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/421165-exam-cca-f-topic-1-question-132-discussion/",
    "topic": "Topic 1",
    "question_text": "An engineer must configure Cisco Secure Web Appliance, configure Explicit Forwarding for the P1 Ethernet port, and monitor Layer 4 traffic. These configurations were already performed:\n•\tSelect Use M1 port for management only.\n•\tUse a duplex cable to connect P1 to the internal network and the internet.\n•\tConfigure DNS and time synchronization.\n•\tConnect the M1 management interface.\n•\tConnect T1 to network TAP to receive outbound client traffic.\n•\tConnect T2 to network TAP to receive inbound internet traffic.\nWhich action must be taken next to accomplish the task?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Connect P1 and M1 to the same network",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Connect P1 and M1 to different subnets.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Connect T2 to the management network.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Connect T1 to the management network.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 133,
    "question_id": 1007861,
    "discussion_id": "421166",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/421166-exam-cca-f-topic-1-question-133-discussion/",
    "topic": "Topic 1",
    "question_text": "A company recently deployed Cisco Secure Web Appliance in transparent mode in a highly secure environment. Clients that use Mozilla Firefox and Google Chrome can access web sites without any additional step; however, clients that use Internet Explorer are prompted to enter a username and password to connect. What additional configuration step must be taken in the security settings of Internet Explorer to prevent the authentication prompt?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "Set the location of the PAC file in the Use automatic configuration script field.",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "Add the appliance redirect hostname to the list of trusted sites in the Local Intranet zone.",
        "is_correct": true
      },
      {
        "letter": "C",
        "text": "Navigate to the IE Enhanced Security Configuration and turn it off for Users.",
        "is_correct": false
      },
      {
        "letter": "D",
        "text": "Select the Bypass proxy server for local intranet addresses check box in the LAN settings.",
        "is_correct": false
      }
    ],
    "correct_answer": "B",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "B",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_3_claude_code_config"
  },
  {
    "question_number": 134,
    "question_id": 1007862,
    "discussion_id": "421167",
    "discussion_url": "https://www.examtopics.com/discussions/anthropic/view/421167-exam-cca-f-topic-1-question-134-discussion/",
    "topic": "Topic 1",
    "question_text": "What is the default TCP port used by Cisco Secure Endpoint for File reputation scanning?",
    "images": [],
    "choices": [
      {
        "letter": "A",
        "text": "443",
        "is_correct": false
      },
      {
        "letter": "B",
        "text": "8080",
        "is_correct": false
      },
      {
        "letter": "C",
        "text": "32137",
        "is_correct": true
      },
      {
        "letter": "D",
        "text": "53421",
        "is_correct": false
      }
    ],
    "correct_answer": "C",
    "voted_stats": [],
    "most_voted_answer": null,
    "total_community_votes": 0,
    "community_consensus": "C",
    "is_controversial": false,
    "comments_count": 0,
    "discussions": [],
    "domain": "domain_5_context_management"
  }
];
