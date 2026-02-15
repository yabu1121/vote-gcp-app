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

// Sheet Names
export const SHEET_QUESTIONNAIRES = 'Questionnaires';
export const SHEET_RESPONSES = 'Responses';
export const SHEET_USERS = 'Users';

// Types
export type QuestionnaireRow = {
  id: string;
  title: string;
  choices: string; // JSON string
  created_at: string;
  owner_email?: string;
  owner_name?: string;
  owner_image?: string;
  likes?: number;
};

export type QuestionnaireWithStats = {
  id: string;
  title: string;
  choices: string[]; // Parsed choices
  created_at: string;
  owner_email?: string;
  owner_name?: string;
  owner_image?: string;
  likes?: number;
  totalResponses: number;
  stats: Record<string, number>; // Percentages
  counts: Record<string, number>; // Raw vote counts
};

export type ResponseRow = {
  id: string;
  questionnaire_id: string;
  answer: string;
  submitted_at: string;
};

export type UserRow = {
  email: string;
  name: string;
  image: string;
};

// Helper to ensure sheet exists
const ensureSheet = async (doc: GoogleSpreadsheet, title: string, headers: string[]) => {
  let sheet = doc.sheetsByTitle[title];
  if (!sheet) {
    sheet = await doc.addSheet({ title, headerValues: headers });
  }
  return sheet;
};

// Questionnaires
export const addQuestionnaire = async (data: QuestionnaireRow) => {
  const doc = await getDoc();
  // Ensure 'likes' is in headers
  const sheet = await ensureSheet(doc, SHEET_QUESTIONNAIRES, ['id', 'title', 'choices', 'created_at', 'owner_email', 'owner_name', 'owner_image', 'likes']);
  await sheet.addRow({
    ...data,
    likes: 0
  });
};

export const updateLike = async (id: string, increment: boolean) => {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[SHEET_QUESTIONNAIRES];
  if (!sheet) return null;

  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('id') === id);

  if (row) {
    let currentLikes = parseInt(row.get('likes') || '0', 10);
    if (isNaN(currentLikes)) currentLikes = 0;

    // Increment or decrement
    const newLikes = increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);

    row.assign({ likes: newLikes });
    await row.save();
    return newLikes;
  }
  return null;
};

export const getQuestionnaires = async (): Promise<QuestionnaireWithStats[]> => {
  const doc = await getDoc();

  // Load headers for all sheets we might need (just in case)
  await doc.loadInfo();

  const qSheet = doc.sheetsByTitle[SHEET_QUESTIONNAIRES];
  const rSheet = doc.sheetsByTitle[SHEET_RESPONSES];
  const uSheet = doc.sheetsByTitle[SHEET_USERS];

  if (!qSheet) return [];

  const qRows = await qSheet.getRows();
  let rRows: any[] = [];
  let uRows: any[] = [];

  if (rSheet) {
    rRows = await rSheet.getRows();
  }

  if (uSheet) {
    uRows = await uSheet.getRows();
  }

  // Create user map for fast lookup
  const userMap: Record<string, { name: string, image: string }> = {};
  uRows.forEach(row => {
    const email = row.get('email');
    if (email) {
      userMap[email] = {
        name: row.get('name'),
        image: row.get('image'),
      };
    }
  });

  return qRows.map((row) => {
    const rawData = row.toObject();

    // Handle likes parsing safely
    let likes = 0;
    try {
      likes = parseInt(rawData.likes || '0', 10);
      if (isNaN(likes)) likes = 0;
    } catch {
      likes = 0;
    }

    const data = {
      ...rawData,
      choices: rawData.choices,
      owner_email: rawData.owner_email,
      owner_name: rawData.owner_name,
      owner_image: rawData.owner_image,
      created_at: rawData.created_at,
      id: rawData.id,
      title: rawData.title,
      likes: likes
    } as unknown as QuestionnaireRow;

    // Join with User data
    if (data.owner_email && userMap[data.owner_email]) {
      data.owner_name = userMap[data.owner_email].name;
      data.owner_image = userMap[data.owner_email].image;
    }

    // Parse choices
    let choices: string[] = [];
    try {
      choices = JSON.parse(data.choices);
    } catch {
      choices = [];
    }

    // Calculate stats
    const relevantResponses = rRows.filter(r => r.get('questionnaire_id') === data.id);
    const total = relevantResponses.length;

    const counts: Record<string, number> = {};
    choices.forEach(c => { counts[c] = 0; });

    relevantResponses.forEach(r => {
      const ans = r.get('answer');
      if (counts[ans] !== undefined) {
        counts[ans]++;
      }
    });

    const stats: Record<string, number> = {};
    choices.forEach(c => {
      stats[c] = total > 0 ? Math.round((counts[c] / total) * 100) : 0;
    });

    return {
      ...data,
      choices,
      totalResponses: total,
      stats,
      counts,
    };
  });
};

// Responses
export const addResponse = async (data: ResponseRow) => {
  const doc = await getDoc();
  const sheet = await ensureSheet(doc, SHEET_RESPONSES, ['id', 'questionnaire_id', 'answer', 'submitted_at']);
  await sheet.addRow(data);
};

// Users
export const updateUser = async (data: UserRow) => {
  const doc = await getDoc();
  const sheet = await ensureSheet(doc, SHEET_USERS, ['email', 'name', 'image']);

  // Check if user exists
  const rows = await sheet.getRows();
  const existingRow = rows.find(row => row.get('email') === data.email);

  if (existingRow) {
    existingRow.assign({
      name: data.name,
      image: data.image
    });
    await existingRow.save();
  } else {
    await sheet.addRow(data);
  }
};

export const getUser = async (email: string): Promise<UserRow | null> => {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[SHEET_USERS];
  if (!sheet) return null;

  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('email') === email);

  if (!row) return null;

  return {
    email: row.get('email'),
    name: row.get('name'),
    image: row.get('image'),
  };
};