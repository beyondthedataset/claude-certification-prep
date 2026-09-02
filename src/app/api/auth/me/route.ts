import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { findUserById, getUserProgress } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ user: null, progress: null });
    }

    const user = await findUserById(sessionUser.id);
    if (!user) {
      return NextResponse.json({ user: null, progress: null });
    }

    const progress = await getUserProgress(user.id);
    return NextResponse.json({ user, progress });
  } catch (error: any) {
    return NextResponse.json({ user: null, progress: null });
  }
}
