import { NextRequest, NextResponse } from 'next/server';
import { getTeamLeaderboard, getRecentExamCompletions, getCohortSummary } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const [leaderboard, recentCompletions, cohortSummary] = await Promise.all([
      getTeamLeaderboard(),
      getRecentExamCompletions(5),
      getCohortSummary(),
    ]);

    return NextResponse.json({
      leaderboard,
      recentCompletions,
      cohortSummary,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch team data' }, { status: 500 });
  }
}

