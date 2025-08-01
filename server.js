// server.js
import express from 'express';
import serverless from 'serverless-http'; // Wrap express app
import path from 'path';
import fs from 'fs';

import votesHandler from './api/votes.js';
import voteHandler from './api/vote.js';

const app = express();
app.use(express.json());

app.get('/api/votes', votesHandler);
app.post('/api/vote', voteHandler);

app.get('/debug/check-file', (req, res) => {
  const filePath = path.join(process.cwd(), 'service-account.json');
  const exists = fs.existsSync(filePath);
  res.status(200).json({ found: exists });
});

// ❌ Do not use app.listen()
// ✅ Instead, export the handler
export const handler = serverless(app);
