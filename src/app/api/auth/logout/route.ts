import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookieName } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(getAuthCookieName());
  return res;
}
