export type DomainKey = 
  | 'domain_1_agentic_architecture'
  | 'domain_2_tool_design_mcp'
  | 'domain_3_claude_code_config'
  | 'domain_4_prompt_engineering'
  | 'domain_5_context_management';

export type QuestionBank = 'all' | 'certsafari' | 'examtopics';

export interface DomainInfo {
  key: DomainKey;
  code: string;
  name: string;
  weightPct: number;
  description: string;
}

export interface SubdomainInfo {
  code: string;
  title: string;
  domainKey: DomainKey;
  domainCode: string;
  questionCount?: number;
}

export interface QuestionChoice {
  letter: string;
  text: string;
  is_correct: boolean;
  explanation?: string;
}

export interface VoteStat {
  voted_answers: string;
  vote_count: number;
  is_most_voted?: boolean;
}

export interface DiscussionComment {
  user: string;
  date: string;
  vote?: string;
  upvotes: number;
  content: string;
}

export interface Question {
  question_number: number;
  source: 'examtopics' | 'certsafari';
  domain: DomainKey;
  domain_code?: string;
  domain_name?: string;
  subdomain?: string;
  question_id?: number | string;
  discussion_id?: string;
  discussion_url?: string;
  topic?: string;
  question_text: string;
  images?: string[];
  choices: QuestionChoice[];
  correct_answer: string;
  overall_explanation?: string;
  voted_stats?: VoteStat[];
  most_voted_answer?: string | null;
  total_community_votes?: number;
  community_consensus?: string;
  is_controversial: boolean;
  comments_count: number;
  discussions?: DiscussionComment[];
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'member';
  createdAt: string;
}

export interface UserAnswerRecord {
  selectedAnswer: string;
  isCorrect: boolean;
  timestamp: string;
}

export interface UserProgress {
  userId: string;
  answers: Record<number, UserAnswerRecord>; // qnum -> record
  starred: Record<number, boolean>;
  notes: Record<number, string>;
  updatedAt: string;
}

export interface ExamQuestionState {
  questionNumber: number;
  selectedAnswer?: string;
  isFlagged?: boolean;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examType: 'full' | 'quick' | 'domain';
  bank?: QuestionBank;
  domainKey?: DomainKey;
  questionNumbers: number[];
  answers: Record<number, string>; // qnum -> answer
  flagged: Record<number, boolean>;
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds: number;
  totalQuestions: number;
  score: number;
  scorePct: number;
  passed: boolean;
  domainScores: Record<DomainKey, { correct: number; total: number; pct: number }>;
}

export interface TeamMemberStats {
  userId: string;
  username: string;
  fullName: string;
  questionsPracticed: number;
  accuracyPct: number;
  mocksTaken: number;
  bestMockScore: number;
  readinessPct: number;
  lastActive: string;
}
