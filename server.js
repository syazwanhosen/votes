// server.js
import express from 'express';
import serverless from 'serverless-http'; // Wrap express app

import votesHandler from './api/votes.js';
import voteHandler from './api/vote.js';
import checkFile from './api/debug/check-file.js';

const app = express();
app.use(express.json());

app.get('/api/votes', votesHandler);
app.post('/api/vote', voteHandler);

app.get('/api/debug/check-file', checkFile);

// ❌ Do not use app.listen()
// ✅ Instead, export the handler
export const handler = serverless(app);
