// api/votes/[id].js
import { getFeatures } from '../lib/googleSheets.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  const {
    query: { id },
  } = req;

  try {
    const features = await getFeatures();
    const feature = features.find(item => item.id === id);
    if (!feature) {
      return res.status(404).send('Feature not found');
    }
    res.status(200).json(feature);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
