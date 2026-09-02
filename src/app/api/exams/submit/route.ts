import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { saveExamAttempt } from '@/lib/db';
import { QUESTIONS_DATA, DOMAINS } from '@/lib/questions-data';
import { DomainKey, ExamAttempt } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      examType = 'quick',
      domainKey,
      questionNumbers = [],
      answers = {},
      flagged = {},
      timeSpentSeconds = 0,
    } = body;

    if (!questionNumbers || questionNumbers.length === 0) {
      return NextResponse.json({ error: 'Question numbers required' }, { status: 400 });
    }

    let correctCount = 0;
    const domainScores: Record<DomainKey, { correct: number; total: number; pct: number }> = {
      domain_1_agentic_architecture: { correct: 0, total: 0, pct: 0 },
      domain_2_tool_design_mcp: { correct: 0, total: 0, pct: 0 },
      domain_3_claude_code_config: { correct: 0, total: 0, pct: 0 },
      domain_4_prompt_engineering: { correct: 0, total: 0, pct: 0 },
      domain_5_context_management: { correct: 0, total: 0, pct: 0 },
    };

    questionNumbers.forEach((qnum: number) => {
      const q = QUESTIONS_DATA.find(item => item.question_number === qnum);
      if (!q) return;

      const userAns = (answers[qnum] || '').toUpperCase().replace(/[^A-Z]/g, '');
      const official = (q.correct_answer || '').toUpperCase().replace(/[^A-Z]/g, '');
      const isCorrect = userAns.length > 0 && (official.includes(userAns) || userAns === official);

      if (isCorrect) correctCount++;

      if (q.domain && domainScores[q.domain]) {
        domainScores[q.domain].total++;
        if (isCorrect) domainScores[q.domain].correct++;
      }
    });

    // Compute domain percentages
    (Object.keys(domainScores) as DomainKey[]).forEach(dKey => {
      const d = domainScores[dKey];
      d.pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
    });

    const totalQuestions = questionNumbers.length;
    const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePct >= 70; // 70% threshold

    const attempt: ExamAttempt = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      examType,
      domainKey,
      questionNumbers,
      answers,
      flagged,
      startedAt: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      timeSpentSeconds,
      totalQuestions,
      score: correctCount,
      scorePct,
      passed,
      domainScores,
    };

    await saveExamAttempt(attempt);

    return NextResponse.json({ success: true, attempt });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 });
  }
}
