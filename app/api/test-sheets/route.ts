
import { NextResponse } from 'next/server';
import { getDoc } from '@/lib/sheets';

export async function GET() {
  try {
    const doc = await getDoc();
    return NextResponse.json({
      message: 'Connection successful!',
      title: doc.title,
      sheetCount: doc.sheetCount
    });
  } catch (error: any) {
    console.error('Spreadsheet Error:', error);
    return NextResponse.json({
      error: 'Failed to connect to Google Sheets',
      details: error.message
    }, { status: 500 });
  }
}
