import crypto from 'crypto';

let isClaimedInMemory = false;

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // Check if claimed in memory during current container lifetime
  if (isClaimedInMemory) {
    return res.status(410).send(renderExpiredPage('Credentials already claimed and permanently purged from server memory.'));
  }

  const encryptedDataRaw = process.env.PROVISION_ENCRYPTED_DATA;
  const expectedKeyHash = process.env.PROVISION_KEY_HASH;

  if (!encryptedDataRaw || !expectedKeyHash) {
    return res.status(410).send(renderExpiredPage('No active provisioning payload found. Credentials have already been claimed or were never provisioned.'));
  }

  // Parse key from query params or URL
  const url = new URL(req.url, 'http://localhost');
  const claimKey = url.searchParams.get('key') || req.query?.key;

  if (!claimKey || typeof claimKey !== 'string') {
    return res.status(403).send(renderErrorPage('Access Denied', 'A valid claim authorization key must be supplied in the URL query parameters.'));
  }

  // Constant-time comparison of the SHA-256 hash of the claim key
  const keyHash = crypto.createHash('sha256').update(claimKey).digest('hex');
  const keyHashBuf = Buffer.from(keyHash);
  const expHashBuf = Buffer.from(expectedKeyHash);

  if (keyHashBuf.length !== expHashBuf.length || !crypto.timingSafeEqual(keyHashBuf, expHashBuf)) {
    return res.status(403).send(renderErrorPage('Invalid Key', 'The provided claim key is invalid. Verification failed.'));
  }

  // Decrypt the credentials payload using AES-256-GCM
  let decryptedCreds;
  try {
    const encryptedPayload = JSON.parse(encryptedDataRaw);
    const { iv, authTag, ciphertext } = encryptedPayload;

    const aesKey = crypto.createHash('sha256').update(claimKey).digest(); // 32-byte key
    const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    decryptedCreds = JSON.parse(decrypted);
  } catch (err) {
    console.error('Decryption error:', err);
    return res.status(500).send(renderErrorPage('Decryption Failure', 'Could not decrypt credentials payload.'));
  }

  // IMMEDIATELY BURN / DESTROY credentials
  isClaimedInMemory = true;
  process.env.PROVISION_ENCRYPTED_DATA = '';

  // Asynchronously purge the env vars from Vercel so they can never be accessed again
  const vercelToken = process.env.VERCEL_TOKEN;
  const vercelProjectId = process.env.VERCEL_PROJECT_ID;
  const provisionEnvId = process.env.PROVISION_ENV_ID;

  if (vercelToken && vercelProjectId && provisionEnvId) {
    try {
      await fetch(`https://api.vercel.com/v9/projects/${vercelProjectId}/env/${provisionEnvId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${vercelToken}` },
      });
      console.log('Successfully burned PROVISION_ENCRYPTED_DATA from Vercel project.');
    } catch (burnErr) {
      console.error('Warning: Failed to burn Vercel env var:', burnErr);
    }
  }

  const { ownerId, password } = decryptedCreds;
  const adminRoute = process.env.ADMIN_ROUTE || '/owner-we-8f2c7a1e5d9b4c3f';

  return res.status(200).send(renderSuccessPage({ ownerId, password, adminRoute }));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderSuccessPage({ ownerId, password, adminRoute }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
  <title>Water Eye CMS — One-Time Owner Provisioning</title>
  <style>
    :root {
      --bg: #09090b;
      --card-bg: #141418;
      --border: #27272a;
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
      --accent: #8b5cf6;
      --accent-hover: #7c3aed;
      --success: #10b981;
      --danger: #ef4444;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      width: 100%;
      max-width: 680px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 36px 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
    .badge {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 9999px;
      background: rgba(139, 92, 246, 0.15);
      color: #c4b5fd;
      border: 1px solid rgba(139, 92, 246, 0.3);
      margin-bottom: 12px;
    }
    h1 {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #fff;
    }
    p.sub {
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .warning-banner {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
      padding: 16px;
      border-radius: 10px;
      font-size: 13.5px;
      line-height: 1.5;
      margin-bottom: 28px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .field-group {
      margin-bottom: 24px;
    }
    .field-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .field-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }
    .field-badge {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--success);
      background: rgba(16, 185, 129, 0.12);
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid rgba(16, 185, 129, 0.25);
    }
    .input-container {
      position: relative;
      display: flex;
      gap: 8px;
    }
    textarea, input[type="text"], input[type="password"] {
      width: 100%;
      background: #09090b;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 14px;
      font-family: var(--font-mono);
      font-size: 13px;
      color: #38bdf8;
      word-break: break-all;
      resize: none;
      outline: none;
    }
    textarea:focus, input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
    }
    .copy-btn {
      flex-shrink: 0;
      background: #27272a;
      border: 1px solid #3f3f46;
      color: #fff;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 500;
      padding: 0 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .copy-btn:hover {
      background: #3f3f46;
    }
    .copy-btn.copied {
      background: rgba(16, 185, 129, 0.2);
      border-color: var(--success);
      color: var(--success);
    }
    .action-panel {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .primary-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      background: var(--accent);
      color: #fff;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 14px;
      border-radius: 8px;
      transition: background 0.15s ease;
    }
    .primary-btn:hover {
      background: var(--accent-hover);
    }
    .toggle-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 12px;
      padding: 4px 6px;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">CONFIDENTIAL • SECURE PROVISIONING</span>
    <h1>Water Eye Owner Credentials</h1>
    <p class="sub">Generated with hardware-backed cryptographically secure pseudo-random number generator (CSPRNG).</p>

    <div class="warning-banner">
      <div>⚠️</div>
      <div>
        <strong>ONE-TIME ACCESS ONLY:</strong> This provisioning payload has been <strong>permanently destroyed from the server</strong> upon rendering this page.
        Copy both credentials now and save them in a secure password manager (e.g., 1Password, Bitwarden, or Apple Keychain).
        You will NOT be able to reload or re-open this page.
      </div>
    </div>

    <!-- OWNER ID (128 CHARS) -->
    <div class="field-group">
      <div class="field-header">
        <label class="field-label" for="ownerId">Owner ID / Username</label>
        <span class="field-badge">128 / 128 characters</span>
      </div>
      <div class="input-container">
        <input id="ownerId" type="text" readonly value="${escapeHtml(ownerId)}" />
        <button class="copy-btn" onclick="copyField('ownerId', this)">
          <span>Copy</span>
        </button>
      </div>
    </div>

    <!-- PASSWORD (209 CHARS) -->
    <div class="field-group">
      <div class="field-header">
        <label class="field-label" for="password">Password</label>
        <div>
          <button class="toggle-btn" type="button" onclick="togglePasswordVisibility()">Show/Hide</button>
          <span class="field-badge">209 / 209 characters</span>
        </div>
      </div>
      <div class="input-container">
        <textarea id="password" rows="3" readonly>${escapeHtml(password)}</textarea>
        <button class="copy-btn" onclick="copyField('password', this)">
          <span>Copy</span>
        </button>
      </div>
    </div>

    <!-- ACTION PANEL -->
    <div class="action-panel">
      <a class="primary-btn" href="${escapeHtml(adminRoute)}">
        <span>Proceed to Owner Panel (${escapeHtml(adminRoute)})</span>
        <span>&rarr;</span>
      </a>
    </div>
  </div>

  <script>
    function copyField(elementId, btn) {
      const el = document.getElementById(elementId);
      const text = el.value || el.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const origText = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '<span>Copied! ✓</span>';
        setTimeout(() => {
          btn.innerHTML = origText;
          btn.classList.remove('copied');
        }, 2200);
      });
    }

    let isHidden = false;
    function togglePasswordVisibility() {
      const el = document.getElementById('password');
      if (isHidden) {
        el.style.webkitTextSecurity = 'none';
        isHidden = false;
      } else {
        el.style.webkitTextSecurity = 'disc';
        isHidden = true;
      }
    }
  </script>
</body>
</html>`;
}

function renderExpiredPage(message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
  <title>Credentials Expired — Water Eye CMS</title>
  <style>
    body {
      background: #09090b;
      color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      margin: 0;
    }
    .card {
      max-width: 520px;
      background: #141418;
      border: 1px solid #27272a;
      border-radius: 14px;
      padding: 32px;
      text-align: center;
    }
    .icon { font-size: 40px; margin-bottom: 16px; }
    h1 { font-size: 22px; margin-bottom: 12px; }
    p { font-size: 14px; color: #a1a1aa; line-height: 1.5; margin-bottom: 24px; }
    a {
      display: inline-block;
      background: #27272a;
      color: #fff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔒</div>
    <h1>Provisioning Link Expired</h1>
    <p>${escapeHtml(message)}</p>
    <a href="/">Return to Website</a>
  </div>
</body>
</html>`;
}

function renderErrorPage(title, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
  <title>${escapeHtml(title)} — Water Eye CMS</title>
  <style>
    body {
      background: #09090b;
      color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      margin: 0;
    }
    .card {
      max-width: 520px;
      background: #141418;
      border: 1px solid #ef4444;
      border-radius: 14px;
      padding: 32px;
      text-align: center;
    }
    .icon { font-size: 40px; margin-bottom: 16px; }
    h1 { font-size: 22px; color: #ef4444; margin-bottom: 12px; }
    p { font-size: 14px; color: #a1a1aa; line-height: 1.5; margin-bottom: 24px; }
    a {
      display: inline-block;
      background: #27272a;
      color: #fff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">⛔</div>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
    <a href="/">Return to Website</a>
  </div>
</body>
</html>`;
}
