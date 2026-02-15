
import { NextResponse } from 'next/server';
import { addResponse } from '@/lib/sheets';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questionnaire_id, answer } = body;

    if (!questionnaire_id || !answer) {
      return NextResponse.json(
        { error: 'Questionnaire ID and answer are required' },
        { status: 400 }
      );
    }

    const newResponse = {
      id: uuidv4(),
      questionnaire_id,
      answer,
      submitted_at: new Date().toISOString(),
    };

    await addResponse(newResponse);

    return NextResponse.json({
      message: 'Response submitted!',
      data: newResponse
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
