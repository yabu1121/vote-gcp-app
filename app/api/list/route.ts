
import { NextResponse } from 'next/server';
import { getQuestionnaires } from '@/lib/sheets';

export const dynamic = 'force-dynamic'; // キャッシュを無効化して常に最新データを取得

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query params
    const pageParam = searchParams.get('page');
    // If page is not provided, we pass undefined to getQuestionnaires (returns ALL)
    // This maintains compatibility with search/page.tsx
    const page = pageParam ? parseInt(pageParam) : undefined;

    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : undefined;

    const sortParam = searchParams.get('sort');
    const sort = sortParam === 'popular' ? 'popular' : 'latest';

    const questionnaires = await getQuestionnaires({ page, limit, sort });
    return NextResponse.json(questionnaires);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
