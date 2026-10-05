import {
  authenticateAdmin,
  parseJsonBody,
  parseSubscriberCount,
  formatSubscriberCount,
  atomicGitHubCreatorsCommit,
  triggerVercelDeploy,
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
    const { name, handle, youtubeUrl, subscribers, subscribersCount, avatarBase64, avatarUrl } = body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Creator channel name is required.' });
    }
    if (!youtubeUrl || typeof youtubeUrl !== 'string' || !youtubeUrl.trim()) {
      return res.status(400).json({ error: 'YouTube channel URL is required.' });
    }

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

    // Process Avatar (148x148 WebP for crisp 2x retina display)
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
        console.warn('Sharp optimization error:', sharpErr.message);
        // Fallback to raw base64 if sharp unavailable
        processedBase64 = avatarBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
      }
    } else if (avatarUrl && typeof avatarUrl === 'string') {
      // Download avatar from URL if base64 not provided directly
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

    // Atomic commit to GitHub and auto-arrange by subscribers count (descending)
    const commitResult = await atomicGitHubCreatorsCommit({
      commitMessage: `feat(creators): add/update creator "${cleanName}" (${formattedSubs})`,
      filesToAdd,
      updateCreators: (data) => {
        let list = Array.isArray(data.creators) ? [...data.creators] : [];

        // Check if creator already exists by id, url, or handle
        const existingIdx = list.findIndex(
          (c) =>
            c.id === newCreator.id ||
            c.youtubeUrl === newCreator.youtubeUrl ||
            (c.handle && c.handle.toLowerCase() === newCreator.handle.toLowerCase())
        );

        if (existingIdx >= 0) {
          list[existingIdx] = {
            ...list[existingIdx],
            ...newCreator,
          };
        } else {
          list.push(newCreator);
        }

        // CRITICAL: Auto-arrange creators by subscriber count (highest to lowest)
        list.sort((a, b) => (b.subscribersCount || 0) - (a.subscribersCount || 0));

        return {
          ...data,
          creators: list,
        };
      },
    });

    // Trigger Vercel automatic deployment
    const deployResult = await triggerVercelDeploy();

    return res.status(200).json({
      success: true,
      creator: newCreator,
      commitSha: commitResult.commitSha,
      deployTriggered: deployResult.triggered,
      message: `Creator "${cleanName}" saved and auto-arranged by subscribers count!`,
    });
  } catch (err) {
    console.error('Add creator error:', err);
    return res.status(400).json({
      error: err.message || 'Failed to save creator.',
    });
  }
}
