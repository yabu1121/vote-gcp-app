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

// New type for the output of getQuestionnaires, including derived stats
export type QuestionnaireWithStats = {
  id: string;
  title: string;
  choices: string[]; // Parsed choices
  created_at: string;
  totalResponses: number;
  stats: Record<string, number>; // Percentages
  counts: Record<string, number>; // Raw vote counts
};

export const addQuestionnaire = async (data: QuestionnaireRow) => {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[SHEET_QUESTIONNAIRES];
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_QUESTIONNAIRES}" not found. Please create it manually.`);
  }
  await sheet.addRow(data);
};

export const getQuestionnaires = async (): Promise<QuestionnaireWithStats[]> => {
  const doc = await getDoc();
  await doc.loadInfo(); // Ensure all sheets are loaded

  const qSheet = doc.sheetsByTitle[SHEET_QUESTIONNAIRES];
  const rSheet = doc.sheetsByTitle[SHEET_RESPONSES];

  if (!qSheet) return [];

  const qRows = await qSheet.getRows();
  let rRows: any[] = [];

  // If responses sheet exists, fetch all responses
  if (rSheet) {
    rRows = await rSheet.getRows();
  }

  return qRows.map((row) => {
    const data = row.toObject() as QuestionnaireRow;

    // Parse choices
    const choices: string[] = (() => {
      try {
        return JSON.parse(data.choices);
      } catch {
        return [];
      }
    })();

    // Filter responses for this questionnaire
    const relevantResponses = rRows.filter(r => r.get('questionnaire_id') === data.id);
    const total = relevantResponses.length;

    // Calculate counts per choice
    const counts: Record<string, number> = {};
    choices.forEach(c => { counts[c] = 0; });

    relevantResponses.forEach(r => {
      const ans = r.get('answer');
      if (counts[ans] !== undefined) {
        counts[ans]++;
      }
    });

    // Calculate percentages
    const stats: Record<string, number> = {};
    choices.forEach(c => {
      stats[c] = total > 0 ? Math.round((counts[c] / total) * 100) : 0;
    });

    return {
      ...data,
      choices,
      totalResponses: total,
      stats,
      counts, // Add raw vote counts
    };
  });
};

export const SHEET_RESPONSES = 'Responses';

export type ResponseRow = {
  id: string;
  questionnaire_id: string;
  answer: string;
  submitted_at: string;
};

export const addResponse = async (data: ResponseRow) => {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[SHEET_RESPONSES];
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_RESPONSES}" not found. Please create it manually.`);
  }
  await sheet.addRow(data);
};