import fs from 'fs';
import path from 'path';
import {
  authenticateAdmin,
  parseJsonBody,
  scrapeYouTubeChannel,
  parseSubscriberCount,
  formatSubscriberCount,
  atomicGitHubCreatorsCommit,
  triggerVercelDeploy,
} from './_lib.js';

function getFallbackCreators() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'creators.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error('Failed to read creators.json fallback:', err);
  }
  return { creators: [], updatedAt: new Date().toISOString() };
}

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const session = authenticateAdmin(req, res);
  if (!session) return;

  const urlObj = new URL(req.url, 'http://localhost');
  const actionQuery = urlObj.searchParams.get('action');

  // 1. GET: Return list of creators sorted by subscriber count descending
  if (req.method === 'GET') {
    try {
      const data = getFallbackCreators();
      const creators = Array.isArray(data.creators) ? [...data.creators] : [];
      creators.sort((a, b) => (b.subscribersCount || 0) - (a.subscribersCount || 0));
      return res.status(200).json({
        success: true,
        creators,
        count: creators.length,
        updatedAt: data.updatedAt,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve creators list.' });
    }
  }

  // 2. DELETE: Remove creator
  if (req.method === 'DELETE' || actionQuery === 'delete') {
    try {
      const body = await parseJsonBody(req);
      const id = body?.id || urlObj.searchParams.get('id');
      if (!id) return res.status(400).json({ error: 'Creator ID is required.' });

      let deletedName = id;
      const commitResult = await atomicGitHubCreatorsCommit({
        commitMessage: `chore(creators): remove creator "${id}"`,
        updateCreators: (data) => {
          const list = Array.isArray(data.creators) ? data.creators : [];
          const target = list.find((c) => c.id === id);
          if (target) deletedName = target.name || id;
          return {
            ...data,
            creators: list.filter((c) => c.id !== id),
          };
        },
      });

      const deployResult = await triggerVercelDeploy();
      return res.status(200).json({
        success: true,
        commitSha: commitResult.commitSha,
        deployTriggered: deployResult.triggered,
        message: `Creator "${deletedName}" removed from portfolio.`,
      });
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Failed to delete creator.' });
    }
  }

  // 3. POST: Either "fetch" or "add" or "delete"
  if (req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const action = body?.action || actionQuery;

      // ACTION A: AUTO-FETCH YOUTUBE DATA
      if (action === 'fetch') {
        const { url } = body || {};
        if (!url || !url.trim()) {
          return res.status(400).json({ error: 'YouTube channel URL or handle is required.' });
        }
        const creatorData = await scrapeYouTubeChannel(url.trim());
        return res.status(200).json({
          success: true,
          creator: creatorData,
        });
      }

      // ACTION B: DELETE VIA POST
      if (action === 'delete') {
        const id = body?.id;
        if (!id) return res.status(400).json({ error: 'Creator ID is required.' });
        let deletedName = id;
        const commitResult = await atomicGitHubCreatorsCommit({
          commitMessage: `chore(creators): remove creator "${id}"`,
          updateCreators: (data) => {
            const list = Array.isArray(data.creators) ? data.creators : [];
            const target = list.find((c) => c.id === id);
            if (target) deletedName = target.name || id;
            return {
              ...data,
              creators: list.filter((c) => c.id !== id),
            };
          },
        });
        const deployResult = await triggerVercelDeploy();
        return res.status(200).json({
          success: true,
          commitSha: commitResult.commitSha,
          deployTriggered: deployResult.triggered,
          message: `Creator "${deletedName}" removed from portfolio.`,
        });
      }

      // ACTION C: ADD / UPDATE CREATOR
      const { name, handle, youtubeUrl, subscribers, subscribersCount, avatarBase64, avatarUrl } = body || {};
      if (!name || !name.trim()) return res.status(400).json({ error: 'Creator channel name is required.' });
      if (!youtubeUrl || !youtubeUrl.trim()) return res.status(400).json({ error: 'YouTube channel URL is required.' });

      const cleanName = name.trim();
      const cleanHandle = (handle || '').trim() || ('@' + cleanName.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase());
      const cleanUrl = youtubeUrl.trim();

      const numericSubs = typeof subscribersCount === 'number' && !isNaN(subscribersCount)
        ? subscribersCount
        : parseSubscriberCount(subscribers);

      const formattedSubs = subscribers && subscribers.trim()
        ? subscribers.trim()
        : formatSubscriberCount(numericSubs);

      const slug = cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 40) || 'creator';

      let relativeAvatarPath = `public/creators/${slug}.webp`;
      let webAvatarUrl = `/creators/${slug}.webp`;
      let processedBase64 = null;

      if (avatarBase64 && typeof avatarBase64 === 'string') {
        try {
          const sharpModule = await import('sharp');
          const sharp = sharpModule.default || sharpModule;
          const rawBase64 = avatarBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
          const imageBuffer = Buffer.from(rawBase64, 'base64');
          const optBuffer = await sharp(imageBuffer)
            .resize(148, 148, { fit: 'cover', kernel: 'lanczos3' })
            .webp({ quality: 84, effort: 4 })
            .toBuffer();
          processedBase64 = optBuffer.toString('base64');
        } catch (sharpErr) {
          processedBase64 = avatarBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
        }
      } else if (avatarUrl && typeof avatarUrl === 'string') {
        try {
          const resp = await fetch(avatarUrl);
          if (resp.ok) {
            const arrayBuf = await resp.arrayBuffer();
            const buf = Buffer.from(arrayBuf);
            const sharpModule = await import('sharp');
            const sharp = sharpModule.default || sharpModule;
            const optBuffer = await sharp(buf)
              .resize(148, 148, { fit: 'cover', kernel: 'lanczos3' })
              .webp({ quality: 84, effort: 4 })
              .toBuffer();
            processedBase64 = optBuffer.toString('base64');
          }
        } catch (dlErr) {
          console.warn('Avatar download error:', dlErr.message);
        }
      }

      const newCreator = {
        id: slug,
        name: cleanName,
        subscribers: formattedSubs,
        youtubeUrl: cleanUrl,
        handle: cleanHandle,
        avatar: webAvatarUrl,
        subscribersCount: numericSubs,
        updatedAt: new Date().toISOString(),
      };

      const filesToAdd = [];
      if (processedBase64) {
        filesToAdd.push({
          path: relativeAvatarPath,
          base64Content: processedBase64,
        });
      }

      const commitResult = await atomicGitHubCreatorsCommit({
        commitMessage: `feat(creators): add/update creator "${cleanName}" (${formattedSubs})`,
        filesToAdd,
        updateCreators: (data) => {
          let list = Array.isArray(data.creators) ? [...data.creators] : [];
          const existingIdx = list.findIndex(
            (c) =>
              c.id === newCreator.id ||
              c.youtubeUrl === newCreator.youtubeUrl ||
              (c.handle && c.handle.toLowerCase() === newCreator.handle.toLowerCase())
          );
          if (existingIdx >= 0) {
            list[existingIdx] = { ...list[existingIdx], ...newCreator };
          } else {
            list.push(newCreator);
          }
          // CRITICAL: Auto-arrange by subscriber count descending!
          list.sort((a, b) => (b.subscribersCount || 0) - (a.subscribersCount || 0));
          return {
            ...data,
            creators: list,
          };
        },
      });

      const deployResult = await triggerVercelDeploy();
      return res.status(200).json({
        success: true,
        creator: newCreator,
        commitSha: commitResult.commitSha,
        deployTriggered: deployResult.triggered,
        message: `Creator "${cleanName}" saved and auto-arranged by subscribers count!`,
      });
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Failed to save creator.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
