import { authenticateAdmin } from './_lib.js';
import creatorsFallback from '../../src/data/creators.json' assert { type: 'json' };

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const session = authenticateAdmin(req, res);
  if (!session) return;

  try {
    // Return creators list, ensuring sorted order by subscribersCount descending
    const creators = Array.isArray(creatorsFallback.creators) ? [...creatorsFallback.creators] : [];
    creators.sort((a, b) => (b.subscribersCount || 0) - (a.subscribersCount || 0));

    return res.status(200).json({
      success: true,
      creators,
      count: creators.length,
      updatedAt: creatorsFallback.updatedAt,
    });
  } catch (err) {
    console.error('Fetch creators list error:', err);
    return res.status(500).json({ error: 'Failed to retrieve creators list.' });
  }
}
