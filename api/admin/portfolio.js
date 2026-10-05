import { authenticateAdmin } from './_lib.js';
import fs from 'fs';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'hake-acc';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Watereyericks';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const session = authenticateAdmin(req, res);
  if (!session) return;

  // 1. Fetch authoritative live data directly from GitHub repository main branch
  if (GITHUB_TOKEN) {
    try {
      const ghResp = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/src/data/portfolio.json?ref=${GITHUB_BRANCH}&_t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            'User-Agent': 'WaterEye-CMS/1.0',
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      if (ghResp.ok) {
        const ghData = await ghResp.json();
        if (ghData.content) {
          const raw = Buffer.from(ghData.content, 'base64').toString('utf8');
          const parsed = JSON.parse(raw);
          return res.status(200).json({
            ...parsed,
            source: 'github-live',
            fetchedAt: new Date().toISOString(),
          });
        }
      }
    } catch (ghErr) {
      console.warn('GitHub direct fetch failed, falling back to local file:', ghErr.message);
    }
  }

  // 2. Fallback to local container file if GitHub is unavailable
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'portfolio.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return res.status(200).json({
        ...data,
        source: 'local-fallback',
        fetchedAt: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      thumbnails: [],
      comparisons: [],
      version: '1.0.0',
      source: 'empty-fallback',
    });
  } catch (err) {
    console.error('Portfolio fetch error:', err);
    return res.status(500).json({ error: 'Failed to read portfolio data.' });
  }
}
