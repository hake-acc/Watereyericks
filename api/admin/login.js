import {
  parseJsonBody,
  verifyCredentials,
  buildAuthCookie,
  getClientIp,
  checkRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
} from './_lib.js';

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: rateLimit.message || 'Too many failed login attempts. Access temporarily locked.',
    });
  }

  try {
    const body = await parseJsonBody(req);
    const { username, password } = body || {};

    // Validate presence
    if (!username || !password) {
      recordFailedLogin(clientIp);
      return res.status(400).json({ error: 'Owner ID and Password are required.' });
    }

    // Strict length validation before hashing or timing
    // Owner ID: exactly 128 characters
    // Password: exactly 209 characters
    if (
      typeof username !== 'string' ||
      username.length !== 128 ||
      typeof password !== 'string' ||
      password.length !== 209
    ) {
      recordFailedLogin(clientIp);
      // Artificial delay to prevent timing and rapid brute-force attacks
      await new Promise((r) => setTimeout(r, 650));
      return res.status(401).json({
        error: 'Authentication failed. Invalid credentials.',
      });
    }

    const isValid = verifyCredentials(username, password);
    if (!isValid) {
      recordFailedLogin(clientIp);
      // Artificial delay to prevent timing attacks
      await new Promise((r) => setTimeout(r, 650));
      return res.status(401).json({
        error: 'Authentication failed. Invalid credentials.',
      });
    }

    // Authentication successful: clear failed attempt counter for client IP
    resetLoginAttempts(clientIp);

    const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
    // Issue authenticated session cookie
    const cookie = buildAuthCookie('owner', isProd);

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({
      success: true,
      user: 'Owner',
      message: 'Authentication successful.',
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}

