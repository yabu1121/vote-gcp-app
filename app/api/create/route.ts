
import { NextResponse } from 'next/server';
import { addQuestionnaire } from '@/lib/sheets';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, choices } = body;

    if (!title || !Array.isArray(choices)) {
      return NextResponse.json({ error: 'Title and choices are required' }, { status: 400 });
    }

    const newQuestionnaire = {
      id: uuidv4(),
      title,
      choices: JSON.stringify(choices), // Convert array to string for storage
      created_at: new Date().toISOString(),
    };

    await addQuestionnaire(newQuestionnaire);

    return NextResponse.json({
      message: 'Questionnaire created!',
      data: newQuestionnaire
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
