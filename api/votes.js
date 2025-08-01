// api/votes.js
import { getFeatures } from '../lib/googleSheets.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }
  try {
    const features = await getFeatures();
    res.status(200).json(features);
  } catch (error) {
    res.status(500).send(error.message);
  }
}