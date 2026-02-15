import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

export const getDoc = async () => {
  const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, jwt);

  await doc.loadInfo();
  return doc;
};

export const getRows = async (sheetTitle: string) => {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[sheetTitle];
  if (!sheet) return [];

  const rows = await sheet.getRows();
  return rows.map((row) => row.toObject());
};

export const addRow = async (sheetTitle: string, data: Record<string, string>) => {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[sheetTitle];
  if (!sheet) throw new Error(`Sheet ${sheetTitle} not found`);

  await sheet.addRow(data);
};

export const SHEET_QUESTIONNAIRES = 'Questionnaires';

export type QuestionnaireRow = {
  id: string;
  title: string;
  choices: string; // JSON string
  created_at: string;
};

export const addQuestionnaire = async (data: QuestionnaireRow) => {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[SHEET_QUESTIONNAIRES];
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_QUESTIONNAIRES}" not found. Please create it manually.`);
  }
  await sheet.addRow(data);
};