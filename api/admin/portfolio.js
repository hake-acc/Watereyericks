import { authenticateAdmin } from './_lib.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const session = authenticateAdmin(req, res);
  if (!session) return;

  try {
    // Read local portfolio.json (packaged in deployment)
    const filePath = path.join(process.cwd(), 'src', 'data', 'portfolio.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return res.status(200).json(data);
    }

    return res.status(200).json({
      thumbnails: [],
      comparisons: [],
      version: '1.0.0',
    });
  } catch (err) {
    console.error('Portfolio fetch error:', err);
    return res.status(500).json({ error: 'Failed to read portfolio data.' });
  }
}
