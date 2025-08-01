import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'service-account.json');
  const exists = fs.existsSync(filePath);
  res.status(200).json({ found: exists });
}