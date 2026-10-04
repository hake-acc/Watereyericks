import { authenticateAdmin } from './_lib.js';

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const session = authenticateAdmin(req, res);
  if (!session) return; // Response handled by middleware

  return res.status(200).json({
    authenticated: true,
    user: session.user,
    expiresAt: session.exp,
  });
}
