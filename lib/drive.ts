
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

export const uploadImage = async (fileBuffer: Buffer, mimeType: string) => {
  const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: SCOPES,
  });

  const drive = google.drive({ version: 'v3', auth: jwt });

  // Create file metadata
  const fileMetadata = {
    name: `avatar-${Date.now()}`,
    parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : undefined,
  };

  const media = {
    mimeType: mimeType,
    body: Readable.from(fileBuffer),
  };

  const res = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });

  const fileId = res.data.id;

  if (!fileId) throw new Error('Failed to upload file');

  // Make public
  await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // Direct link for image
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};
