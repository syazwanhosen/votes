// server.js
import express from 'express';

import votesHandler from './api/votes.js';
import voteHandler from './api/vote.js';

const app = express();
app.use(express.json());

app.get('/api/votes', (req, res) => votesHandler(req, res));
app.post('/api/vote', (req, res) => voteHandler(req, res));

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`✅ API is running at http://localhost:${PORT}`);
});
