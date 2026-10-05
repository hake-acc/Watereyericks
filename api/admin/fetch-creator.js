import {
  authenticateAdmin,
  parseJsonBody,
  scrapeYouTubeChannel,
} from './_lib.js';

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = authenticateAdmin(req, res);
  if (!session) return;

  try {
    const body = await parseJsonBody(req);
    const { url } = body || {};

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'YouTube channel URL or handle is required.' });
    }

    const creatorData = await scrapeYouTubeChannel(url.trim());

    return res.status(200).json({
      success: true,
      creator: creatorData,
    });
  } catch (err) {
    console.error('Fetch creator error:', err);
    return res.status(400).json({
      error: err.message || 'Failed to fetch YouTube creator details.',
    });
  }
}
