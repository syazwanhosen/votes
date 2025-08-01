// api/vote.js
import { updateVote } from '../lib/googleSheets.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { id, type } = req.body;

  if (!id || !['upvote', 'downvote'].includes(type)) {
    return res.status(400).send('Invalid request');
  }

  try {
    const result = await updateVote(id, type);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
