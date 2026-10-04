import { buildClearCookie } from './_lib.js';

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  res.setHeader('Set-Cookie', buildClearCookie(isProd));

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}
