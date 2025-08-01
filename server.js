// server.js
import express from 'express';
import serverless from 'serverless-http'; // Wrap express app

import votesHandler from './api/votes.js';
import voteHandler from './api/vote.js';

const app = express();
app.use(express.json());

app.get('/api/votes', votesHandler);
app.post('/api/vote', voteHandler);

// ❌ Do not use app.listen()
// ✅ Instead, export the handler
export const handler = serverless(app);
