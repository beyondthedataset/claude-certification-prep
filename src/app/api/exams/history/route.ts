import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserExamAttempts, getExamAttemptById } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const attemptId = searchParams.get('id');

    if (attemptId) {
      const attempt = await getExamAttemptById(attemptId);
      if (!attempt) {
        return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
      }
      return NextResponse.json({ attempt });
    }

    const attempts = await getUserExamAttempts(user.id);
    return NextResponse.json({ attempts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch history' }, { status: 500 });
  }
}
