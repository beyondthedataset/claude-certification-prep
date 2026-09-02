import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import {
  getUserProgress,
  recordUserAnswer,
  toggleUserStar,
  resetUserProgress,
} from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const progress = await getUserProgress(user.id);
  return NextResponse.json({ progress });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { action, questionNumber, selectedAnswer } = body;

  if (action === 'answer' && questionNumber && selectedAnswer) {
    const progress = await recordUserAnswer(user.id, questionNumber, selectedAnswer);
    return NextResponse.json({ success: true, progress });
  }

  if (action === 'star' && questionNumber) {
    const result = await toggleUserStar(user.id, questionNumber);
    return NextResponse.json({ success: true, ...result });
  }

  if (action === 'reset') {
    const progress = await resetUserProgress(user.id);
    return NextResponse.json({ success: true, progress });
  }

  return NextResponse.json({ error: 'Invalid action or parameters' }, { status: 400 });
}
