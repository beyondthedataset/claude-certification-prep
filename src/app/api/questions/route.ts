import { NextRequest, NextResponse } from 'next/server';
import { QUESTIONS_DATA, DOMAINS } from '@/lib/questions-data';
import { DomainKey } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain') as DomainKey | null;
  const bank = searchParams.get('bank');
  const subdomain = searchParams.get('subdomain');
  const qnum = searchParams.get('qnum');
  const search = searchParams.get('search')?.toLowerCase();
  const filter = searchParams.get('filter'); // 'discussions' | 'disputed' | 'exhibits'

  let list = [...QUESTIONS_DATA];

  if (qnum) {
    const question = list.find(q => q.question_number === parseInt(qnum));
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json({ question });
  }

  if (bank && bank !== 'all') {
    list = list.filter(q => q.source === bank);
  }

  if (domain) {
    list = list.filter(q => q.domain === domain);
  }

  if (subdomain) {
    list = list.filter(q => q.subdomain && q.subdomain.includes(subdomain));
  }

  if (filter === 'discussions') {
    list = list.filter(q => (q.comments_count || 0) > 0);
  } else if (filter === 'disputed') {
    list = list.filter(q => q.is_controversial);
  } else if (filter === 'exhibits') {
    list = list.filter(q => (q.images || []).length > 0);
  }

  if (search) {
    list = list.filter(q => {
      const qnumMatch = q.question_number.toString() === search || `q${q.question_number}` === search;
      const textMatch = q.question_text.toLowerCase().includes(search);
      const choiceMatch = q.choices.some(c => c.text.toLowerCase().includes(search));
      const discMatch = (q.discussions || []).some(d => d.content.toLowerCase().includes(search));
      const subMatch = q.subdomain?.toLowerCase().includes(search);
      return qnumMatch || textMatch || choiceMatch || discMatch || subMatch;
    });
  }

  return NextResponse.json({
    total: QUESTIONS_DATA.length,
    filteredCount: list.length,
    domains: DOMAINS,
    questions: list,
  });
}
