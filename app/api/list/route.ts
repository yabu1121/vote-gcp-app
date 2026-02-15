
import { NextResponse } from 'next/server';
import { getQuestionnaires } from '@/lib/sheets';

export const dynamic = 'force-dynamic'; // キャッシュを無効化して常に最新データを取得

export async function GET() {
  try {
    const questionnaires = await getQuestionnaires();
    return NextResponse.json(questionnaires);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
