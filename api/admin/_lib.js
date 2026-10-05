import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Configuration loaded from secure environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'hake-acc';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Watereyericks';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

// Critical credentials loaded strictly from secure environment variables.
// NO FALLBACKS: If unset, server fails closed and rejects authentication.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

const SESSION_SECRET =
  process.env.SESSION_SECRET || 'watereye-secure-session-secret-key-32chars';
const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

const COOKIE_NAME = 'we_admin_session';

// =========================================================
// RATE LIMITING & BRUTE-FORCE PROTECTION
// =========================================================
const loginAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15-minute IP lockout

/**
 * Extracts the real client IP address from request headers.
 */
export function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (forwarded && typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown-ip';
}

/**
 * Checks if the client IP is currently rate-limited or locked out.
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };

  // Check if IP is in active lockout
  if (record.lockUntil && now < record.lockUntil) {
    const remainingMins = Math.ceil((record.lockUntil - now) / 60000);
    return {
      allowed: false,
      lockout: true,
      remainingMins,
      message: `Too many failed login attempts. IP locked for ${remainingMins} minute(s).`,
    };
  }

  // Auto-reset if the last attempt was before the lockout window
  if (record.lastAttempt && now - record.lastAttempt > LOCKOUT_DURATION_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };
  }

  return {
    allowed: true,
    remaining: Math.max(0, MAX_FAILED_ATTEMPTS - record.attempts),
  };
}

/**
 * Records a failed login attempt for the client IP.
 */
export function recordFailedLogin(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0, lastAttempt: now };
  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_DURATION_MS;
  }
  loginAttempts.set(ip, record);
}

/**
 * Resets failed login attempts for an authenticated client IP.
 */
export function resetLoginAttempts(ip) {
  loginAttempts.delete(ip);
}

/**
 * Parses HTTP cookies from request headers.
 */
export function parseCookies(req) {
  const list = {};
  const header = req.headers?.cookie;
  if (!header) return list;
  header.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts[0]?.trim();
    if (!name) return;
    list[name] = decodeURIComponent(parts.slice(1).join('=').trim());
  });
  return list;
}

/**
 * Creates an HMAC-SHA256 signed session token.
 */
export function signSession(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('base64url');
  return `${data}.${sig}`;
}

/**
 * Verifies an HMAC-SHA256 session token.
 */
export function verifySession(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('base64url');

  try {
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Middleware helper to authenticate an incoming admin request.
 */
export function authenticateAdmin(req, res) {
  // Always set security and noindex headers
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  const session = verifySession(token);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
    return null;
  }
  return session;
}

/**
 * Constant-time comparison for login credentials.
 * Enforces strict length requirements:
 * - Username / Owner ID: exactly 128 characters
 * - Password: exactly 209 characters
 * - Server configuration must be present; otherwise fails closed immediately.
 */
export function verifyCredentials(username, password) {
  // FAIL-CLOSED: Ensure server secrets are configured
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
    console.error('CRITICAL: Server authentication secrets are unconfigured. Rejecting login.');
    return false;
  }

  // Strict length validation
  if (typeof username !== 'string' || username.length !== 128) {
    return false;
  }
  if (typeof password !== 'string' || password.length !== 209) {
    return false;
  }

  try {
    // Constant-time username comparison
    const userBuf = Buffer.from(username, 'utf8');
    const expUserBuf = Buffer.from(ADMIN_USERNAME, 'utf8');
    if (userBuf.length !== expUserBuf.length || !crypto.timingSafeEqual(userBuf, expUserBuf)) {
      return false;
    }

    // Constant-time password hash comparison
    const passHash = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
    const hashBuf = Buffer.from(passHash, 'utf8');
    const expHashBuf = Buffer.from(ADMIN_PASSWORD_HASH, 'utf8');
    if (hashBuf.length !== expHashBuf.length || !crypto.timingSafeEqual(hashBuf, expHashBuf)) {
      return false;
    }

    return true;
  } catch (err) {
    console.error('Credential verification error:', err);
    return false;
  }
}

/**
 * Builds the Set-Cookie string for a logged-in admin.
 */
export function buildAuthCookie(username, isProd = true) {
  const token = signSession({
    user: username,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${
    isProd ? '; Secure' : ''
  }`;
}

/**
 * Builds the Set-Cookie string to clear the session cookie.
 */
export function buildClearCookie(isProd = true) {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${
    isProd ? '; Secure' : ''
  }`;
}

/**
 * Safely parses JSON request body for Vercel functions.
 */
export async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(new Error('Invalid JSON payload: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Validates an image buffer and determines its format, dimensions, and 16:9 aspect ratio.
 */
export function validateImage(buffer, label = 'Image') {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error(`${label}: Upload data is missing or invalid.`);
  }

  const maxBytes = 15 * 1024 * 1024; // 15MB limit
  if (buffer.length > maxBytes) {
    throw new Error(`${label}: File size exceeds 15MB limit.`);
  }

  if (buffer.length < 30) {
    throw new Error(`${label}: File is too small or corrupted.`);
  }

  let type = null;
  let width = 0;
  let height = 0;

  // 1. PNG check: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    type = 'png';
    width = buffer.readUInt32BE(16);
    height = buffer.readUInt32BE(20);
  }
  // 2. JPEG check: FF D8
  else if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    type = 'jpeg';
    let offset = 2;
    while (offset < buffer.length - 8) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        height = buffer.readUInt16BE(offset + 5);
        width = buffer.readUInt16BE(offset + 7);
        break;
      }
      const len = buffer.readUInt16BE(offset + 2);
      offset += 2 + len;
    }
  }
  // 3. WebP check: RIFF ... WEBP
  else if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    type = 'webp';
    const chunk = buffer.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') {
      width = buffer.readUInt16LE(26) & 0x3fff;
      height = buffer.readUInt16LE(28) & 0x3fff;
    } else if (chunk === 'VP8L') {
      const b0 = buffer[21],
        b1 = buffer[22],
        b2 = buffer[23],
        b3 = buffer[24];
      width = 1 + (((b1 & 0x3f) << 8) | b0);
      height = 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
    } else if (chunk === 'VP8X') {
      width = 1 + buffer.readUIntLE(24, 3);
      height = 1 + buffer.readUIntLE(27, 3);
    }
  }

  if (!type || width === 0 || height === 0) {
    throw new Error(
      `${label}: Unsupported or unrecognized image format. Only WebP, JPG/JPEG, and PNG are allowed.`
    );
  }

  if (width < 320 || height < 180) {
    throw new Error(
      `${label}: Image resolution is too small (${width}x${height}). Recommended: 1280x720 or 1920x1080.`
    );
  }

  // Aspect ratio check for YouTube 16:9 thumbnail format (~1.777)
  const ratio = width / height;
  // Allow flexible ratio between 1.40 and 2.10 to accommodate diverse banner and game formats
  if (ratio < 1.40 || ratio > 2.10) {
    throw new Error(
      `${label}: Aspect ratio (${ratio.toFixed(2)}:1) is outside recommended range (16:9 ~ 1.78:1). Recommended: 1280x720 or 1920x1080.`
    );
  }

  const ext = type === 'jpeg' ? 'jpg' : type;
  return { type, ext, width, height, ratio };
}

/**
 * Generates a clean, URL-safe and collision-resistant filename.
 */
export function generateSafeFilename(name, prefix, ext) {
  const safeSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 45);

  const randId =
    Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  return `${prefix}-${safeSlug || 'thumb'}-${randId}.${ext}`;
}

/**
 * Makes an authenticated request to the GitHub REST API.
 */
async function githubRequest(endpoint, { method = 'GET', body = null } = {}) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is not configured.');
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    'User-Agent': 'WaterEye-CMS/1.0',
    Accept: 'application/vnd.github.v3+json',
  };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const resp = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const text = await resp.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!resp.ok) {
    const errorMsg = json?.message || text || `GitHub API error (${resp.status})`;
    const err = new Error(errorMsg);
    err.status = resp.status;
    err.details = json;
    throw err;
  }

  return json;
}

/**
 * Performs an atomic multi-file Git commit on the main branch via the GitHub Git Data API.
 * Handles concurrency conflicts with automatic re-fetches and retries.
 *
 * @param {Object} options
 * @param {string} options.commitMessage
 * @param {Array<{ path: string, base64Content: string }>} [options.filesToAdd]
 * @param {Array<string>} [options.pathsToDelete]
 * @param {Function} options.updatePortfolio - Callback receiving current portfolio object and returning updated portfolio object.
 */
export async function atomicGitHubCommit({
  commitMessage,
  filesToAdd = [],
  pathsToDelete = [],
  updatePortfolio,
}) {
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 1. Get the latest commit SHA of the branch
      const refData = await githubRequest(`/git/ref/heads/${GITHUB_BRANCH}`);
      const latestCommitSha = refData.object.sha;

      // 2. Fetch the commit object to retrieve the base tree SHA
      const commitData = await githubRequest(`/git/commits/${latestCommitSha}`);
      const baseTreeSha = commitData.tree.sha;

      // 3. Fetch the current portfolio.json from GitHub at this exact commit
      let currentPortfolio = { version: '1.0.0', thumbnails: [], comparisons: [] };
      try {
        const fileData = await githubRequest(
          `/contents/src/data/portfolio.json?ref=${latestCommitSha}`
        );
        if (fileData.content) {
          const raw = Buffer.from(fileData.content, 'base64').toString('utf8');
          currentPortfolio = JSON.parse(raw);
        }
      } catch (err) {
        console.warn('Warning: Could not fetch portfolio.json from GitHub, using local fallback:', err.message);
        try {
          const localPath = path.join(process.cwd(), 'src', 'data', 'portfolio.json');
          if (fs.existsSync(localPath)) {
            currentPortfolio = JSON.parse(fs.readFileSync(localPath, 'utf8'));
          }
        } catch {
          // ignore
        }
      }

      // 4. Update the portfolio in memory using the caller's callback
      const updatedPortfolio = await updatePortfolio(currentPortfolio);

      // Check if any actual modifications occurred
      const noFileChanges = filesToAdd.length === 0 && pathsToDelete.length === 0;
      const jsonUnchanged =
        JSON.stringify(updatedPortfolio.thumbnails) === JSON.stringify(currentPortfolio.thumbnails) &&
        JSON.stringify(updatedPortfolio.comparisons) === JSON.stringify(currentPortfolio.comparisons);

      if (noFileChanges && jsonUnchanged) {
        return {
          success: true,
          noChanges: true,
          commitSha: latestCommitSha,
          portfolio: currentPortfolio,
        };
      }

      updatedPortfolio.updatedAt = new Date().toISOString();

      // 5. Upload blobs for all added files
      const treeEntries = [];

      for (const file of filesToAdd) {
        const blobResp = await githubRequest('/git/blobs', {
          method: 'POST',
          body: {
            content: file.base64Content,
            encoding: 'base64',
          },
        });
        treeEntries.push({
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: blobResp.sha,
        });
      }

      // 6. Create blob for updated src/data/portfolio.json
      const portfolioJsonBuffer = Buffer.from(
        JSON.stringify(updatedPortfolio, null, 2),
        'utf8'
      );
      const portfolioBlob = await githubRequest('/git/blobs', {
        method: 'POST',
        body: {
          content: portfolioJsonBuffer.toString('base64'),
          encoding: 'base64',
        },
      });
      treeEntries.push({
        path: 'src/data/portfolio.json',
        mode: '100644',
        type: 'blob',
        sha: portfolioBlob.sha,
      });

      // 7. Mark any deleted paths in the tree entries with sha: null
      for (const delPath of pathsToDelete) {
        // Strip leading slash if present
        const cleanPath = delPath.replace(/^\//, '');
        treeEntries.push({
          path: cleanPath,
          mode: '100644',
          type: 'blob',
          sha: null,
        });
      }

      // 8. Create a new Git tree on top of the base tree
      const newTree = await githubRequest('/git/trees', {
        method: 'POST',
        body: {
          base_tree: baseTreeSha,
          tree: treeEntries,
        },
      });

      // 9. Create the commit
      const newCommit = await githubRequest('/git/commits', {
        method: 'POST',
        body: {
          message: commitMessage,
          tree: newTree.sha,
          parents: [latestCommitSha],
        },
      });

      // 10. Update the branch ref to point to the new commit
      await githubRequest(`/git/refs/heads/${GITHUB_BRANCH}`, {
        method: 'PATCH',
        body: {
          sha: newCommit.sha,
          force: false,
        },
      });

      // Success!
      return {
        success: true,
        commitSha: newCommit.sha,
        portfolio: updatedPortfolio,
      };
    } catch (err) {
      lastError = err;
      if (err.status === 422 || err.message?.includes('fast forward')) {
        // Concurrency conflict: retry after short delay
        console.warn(`Concurrency conflict on attempt ${attempt}. Retrying...`);
        await new Promise((r) => setTimeout(r, 600 * attempt));
        continue;
      }
      throw err;
    }
  }

  throw new Error(`Failed to commit to GitHub after ${maxRetries} attempts: ${lastError?.message}`);
}

/**
 * Triggers the Vercel deployment hook if configured.
 */
export async function triggerVercelDeploy() {
  if (!VERCEL_DEPLOY_HOOK) {
    return { triggered: false, reason: 'VERCEL_DEPLOY_HOOK not configured' };
  }
  try {
    const resp = await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' });
    const data = await resp.json().catch(() => ({}));
    return { triggered: resp.ok, status: resp.status, data };
  } catch (err) {
    return { triggered: false, error: err.message };
  }
}

/**
 * Checks the latest deployment state on Vercel via Vercel API.
 */
export async function checkVercelDeployment() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return { status: 'UNKNOWN', reason: 'Vercel API credentials not set' };
  }
  try {
    const url = `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=1`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });
    if (!resp.ok) return { status: 'UNKNOWN', code: resp.status };
    const data = await resp.json();
    const latest = data.deployments?.[0];
    if (!latest) return { status: 'NO_DEPLOYMENTS' };
    return {
      status: latest.readyState || latest.state || 'UNKNOWN',
      id: latest.uid || latest.id,
      url: latest.url,
      createdAt: latest.createdAt,
    };
  } catch (err) {
    return { status: 'ERROR', error: err.message };
  }
}

/**
 * Parses numeric subscriber count from formatted text like "6.89M", "524K subscribers", etc.
 */
export function parseSubscriberCount(str) {
  if (!str) return 0;
  const match = String(str).match(/([0-9]+(?:\.[0-9]+)?)\s*([KMBkmb])?/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = (match[2] || '').toUpperCase();
  if (unit === 'B') return Math.round(num * 1000000000);
  if (unit === 'M') return Math.round(num * 1000000);
  if (unit === 'K') return Math.round(num * 1000);
  return Math.round(num);
}

/**
 * Formats a numeric subscriber count into concise string (e.g. 6890000 -> "6.89M").
 */
export function formatSubscriberCount(countOrStr) {
  const num = typeof countOrStr === 'number' ? countOrStr : parseSubscriberCount(countOrStr);
  if (num >= 1000000000) {
    const v = num / 1000000000;
    return `${v % 1 === 0 ? v : v.toFixed(2).replace(/\.?0+$/, '')}B`;
  }
  if (num >= 1000000) {
    const v = num / 1000000;
    return `${v % 1 === 0 ? v : v.toFixed(2).replace(/\.?0+$/, '')}M`;
  }
  if (num >= 1000) {
    const v = num / 1000;
    return `${v % 1 === 0 ? v : v.toFixed(1).replace(/\.?0+$/, '')}K`;
  }
  return String(num);
}

/**
 * Automatically scrapes YouTube channel name, handle, avatar URL, and subscriber count from a link or handle.
 */
export async function scrapeYouTubeChannel(rawInput) {
  let targetUrl = rawInput.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `https://www.youtube.com/${targetUrl.startsWith('@') ? '' : '@'}${targetUrl}`;
  }

  async function fetchUrl(url, redirectCount = 0) {
    if (redirectCount > 5) throw new Error('Too many redirects while resolving YouTube URL');
    const resp = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
      redirect: 'manual',
    });

    if (resp.status >= 300 && resp.status < 400 && resp.headers.get('location')) {
      const next = new URL(resp.headers.get('location'), url).href;
      return fetchUrl(next, redirectCount + 1);
    }

    const html = await resp.text();
    return { html, finalUrl: url };
  }

  const { html, finalUrl } = await fetchUrl(targetUrl);

  let ytData = null;
  const match =
    html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/s) ||
    html.match(/ytInitialData\s*=\s*({.+?});/s);
  if (match) {
    try {
      ytData = JSON.parse(match[1]);
    } catch {}
  }

  const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)">/);
  const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)">/);
  const ogUrlMatch = html.match(/<meta property="og:url" content="([^"]+)">/);
  const linkCanonical = html.match(/<link rel="canonical" href="([^"]+)">/);
  const metaDesc = html.match(/<meta property="og:description" content="([^"]+)">/);

  let name = ogTitleMatch ? ogTitleMatch[1] : null;
  let avatarUrl = ogImageMatch ? ogImageMatch[1] : null;
  let canonicalUrl = ogUrlMatch ? ogUrlMatch[1] : linkCanonical ? linkCanonical[1] : finalUrl;
  let subText = null;

  if (ytData) {
    // 1. pageHeaderRenderer (modern YouTube format)
    const p = ytData.header?.pageHeaderRenderer;
    if (p) {
      name = name || p.pageTitle;
      const thumbs =
        p.content?.pageHeaderViewModel?.image?.decoratedAvatarViewModel?.avatar?.avatarViewModel
          ?.image?.sources;
      if (thumbs && thumbs.length) {
        avatarUrl = thumbs[thumbs.length - 1].url;
      }
      const metadataRows =
        p.content?.pageHeaderViewModel?.metadata?.contentMetadataViewModel?.metadataRows;
      if (metadataRows) {
        for (const row of metadataRows) {
          for (const part of row.metadataParts || []) {
            const text = part.text?.content || '';
            if (/subscribers?/i.test(text)) subText = text;
          }
        }
      }
    }

    // 2. c4TabbedHeaderRenderer (classic format)
    const c = ytData.header?.c4TabbedHeaderRenderer;
    if (c) {
      name = name || c.title;
      const thumbs = c.avatar?.thumbnails;
      if (thumbs && thumbs.length) avatarUrl = thumbs[thumbs.length - 1].url;
      if (c.subscriberCountText?.simpleText) subText = c.subscriberCountText.simpleText;
    }

    // 3. Fallback regex on JSON string
    if (!subText) {
      const str = JSON.stringify(ytData);
      const s1 = str.match(/"subscriberCountText":\{"simpleText":"([^"]+)"\}/);
      const s2 = str.match(/"content":"([0-9\.]+[KMBkmb]?\s+subscribers?)"/);
      if (s1) subText = s1[1];
      else if (s2) subText = s2[1];
    }
  }

  if (!subText && metaDesc) {
    const m = metaDesc[1].match(/([0-9\.]+[KMBkmb]?)\s+subscribers?/i);
    if (m) subText = m[0];
  }

  // Derive clean handle
  let handle = '';
  const handleMatch =
    canonicalUrl.match(/(@[a-zA-Z0-9_\-\.]+)/) || targetUrl.match(/(@[a-zA-Z0-9_\-\.]+)/);
  if (handleMatch) {
    handle = handleMatch[1];
  } else if (name) {
    handle = '@' + name.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
  }

  const subCount = parseSubscriberCount(subText);
  const formattedSub = formatSubscriberCount(subCount);

  // Upgrade avatar quality to s240
  if (avatarUrl && avatarUrl.includes('=s')) {
    avatarUrl = avatarUrl.replace(/=s\d+-[^"]+/, '=s240-c-k-c0x00ffffff-no-rj');
  }

  // Fetch avatar image buffer as base64 for preview
  let avatarBase64 = null;
  if (avatarUrl) {
    try {
      const imgResp = await fetch(avatarUrl);
      if (imgResp.ok) {
        const arrayBuf = await imgResp.arrayBuffer();
        const buf = Buffer.from(arrayBuf);
        const mime = imgResp.headers.get('content-type') || 'image/jpeg';
        avatarBase64 = `data:${mime};base64,${buf.toString('base64')}`;
      }
    } catch (imgErr) {
      console.warn('Could not fetch avatar image buffer:', imgErr.message);
    }
  }

  return {
    name: name ? name.replace(/ - YouTube$/, '').trim() : 'Unknown Channel',
    handle,
    youtubeUrl: canonicalUrl,
    avatarUrl,
    avatarBase64,
    subscribers: formattedSub,
    subscribersCount: subCount,
  };
}

/**
 * Performs an atomic multi-file Git commit on src/data/creators.json.
 */
export async function atomicGitHubCreatorsCommit({
  commitMessage,
  filesToAdd = [],
  pathsToDelete = [],
  updateCreators,
}) {
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const refData = await githubRequest(`/git/ref/heads/${GITHUB_BRANCH}`);
      const latestCommitSha = refData.object.sha;

      const commitData = await githubRequest(`/git/commits/${latestCommitSha}`);
      const baseTreeSha = commitData.tree.sha;

      let currentData = { version: '1.0.0', creators: [] };
      try {
        const fileData = await githubRequest(
          `/contents/src/data/creators.json?ref=${latestCommitSha}`
        );
        if (fileData.content) {
          const raw = Buffer.from(fileData.content, 'base64').toString('utf8');
          currentData = JSON.parse(raw);
        }
      } catch (err) {
        console.warn('Could not fetch creators.json from GitHub, using default base.', err.message);
      }

      const updatedData = await updateCreators(currentData);
      updatedData.updatedAt = new Date().toISOString();

      const treeEntries = [];

      for (const file of filesToAdd) {
        const blobResp = await githubRequest('/git/blobs', {
          method: 'POST',
          body: {
            content: file.base64Content,
            encoding: 'base64',
          },
        });
        treeEntries.push({
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: blobResp.sha,
        });
      }

      const jsonBuf = Buffer.from(JSON.stringify(updatedData, null, 2), 'utf8');
      const jsonBlob = await githubRequest('/git/blobs', {
        method: 'POST',
        body: {
          content: jsonBuf.toString('base64'),
          encoding: 'base64',
        },
      });
      treeEntries.push({
        path: 'src/data/creators.json',
        mode: '100644',
        type: 'blob',
        sha: jsonBlob.sha,
      });

      for (const delPath of pathsToDelete) {
        const cleanPath = delPath.replace(/^\//, '');
        treeEntries.push({
          path: cleanPath,
          mode: '100644',
          type: 'blob',
          sha: null,
        });
      }

      const newTree = await githubRequest('/git/trees', {
        method: 'POST',
        body: {
          base_tree: baseTreeSha,
          tree: treeEntries,
        },
      });

      const newCommit = await githubRequest('/git/commits', {
        method: 'POST',
        body: {
          message: commitMessage,
          tree: newTree.sha,
          parents: [latestCommitSha],
        },
      });

      await githubRequest(`/git/refs/heads/${GITHUB_BRANCH}`, {
        method: 'PATCH',
        body: {
          sha: newCommit.sha,
          force: false,
        },
      });

      return {
        success: true,
        commitSha: newCommit.sha,
        creators: updatedData,
      };
    } catch (err) {
      lastError = err;
      if (err.status === 422 || err.message?.includes('fast forward')) {
        await new Promise((r) => setTimeout(r, 600 * attempt));
        continue;
      }
      throw err;
    }
  }

  throw new Error(`Failed to commit creators to GitHub after ${maxRetries} attempts: ${lastError?.message}`);
}
