import dotenv from 'dotenv';
dotenv.config();

import { google } from 'googleapis';
import fs from 'fs';

console.log("Loaded SPREADSHEET_ID in googleSheets.js:", process.env.SPREADSHEET_ID);

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

if (!SPREADSHEET_ID) {
  throw new Error('SPREADSHEET_ID is not defined in the .env file');
}

// Load service account credentials
const credentials = JSON.parse(fs.readFileSync('service-account.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

/**
 * Get all features from the spreadsheet
 */
export async function getFeatures() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A2:E',
    });

    const rows = res.data.values || [];
    return rows.map(([id, title, upvotes, downvotes, totalVotes]) => ({
      id,
      title,
      upvotes: parseInt(upvotes || '0', 10),
      downvotes: parseInt(downvotes || '0', 10),
      totalVotes: parseInt(totalVotes || '0', 10),
    }));
  } catch (err) {
    console.error('Failed to fetch features:', err.message);
    throw err;
  }
}

/**
 * Update vote count (upvote or downvote) for a feature
 */
export async function updateVote(id, type) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A2:E',
    });

    const rows = res.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === id);

    if (rowIndex === -1) throw new Error('Feature not found in spreadsheet');

    let [ , , upvotes = '0', downvotes = '0', totalVotes = '0' ] = rows[rowIndex];

    upvotes = parseInt(upvotes, 10);
    downvotes = parseInt(downvotes, 10);
    totalVotes = parseInt(totalVotes, 10);

    if (type === 'upvote') {
      upvotes += 1;
      totalVotes += 1;
    } else if (type === 'downvote') {
      downvotes += 1;
      totalVotes = Math.max(totalVotes - 1, 0); // avoid negative
    } else {
      throw new Error('Invalid vote type');
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Sheet1!C${rowIndex + 2}:E${rowIndex + 2}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[upvotes.toString(), downvotes.toString(), totalVotes.toString()]],
      },
    });

    return { id, upvotes, downvotes, totalVotes };
  } catch (err) {
    console.error('Failed to update vote:', err.message);
    throw err;
  }
}

export { sheets }; // optional export if needed elsewhere
