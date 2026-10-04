import {
  parseJsonBody,
  verifyCredentials,
  buildAuthCookie,
} from './_lib.js';

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await parseJsonBody(req);
    const { username, password } = body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const isValid = verifyCredentials(username.trim(), password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
    const cookie = buildAuthCookie(username.trim(), isProd);

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({
      success: true,
      user: username.trim(),
      message: 'Authentication successful.',
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}
