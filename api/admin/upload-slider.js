import {
  authenticateAdmin,
  parseJsonBody,
  validateImage,
  generateSafeFilename,
  atomicGitHubCommit,
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
    const {
      name,
      subtitle,
      description,
      tools,
      beforeImageBase64,
      afterImageBase64,
      beforeLabel,
      afterLabel,
    } = body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Slider project name/title is required.' });
    }

    if (!beforeImageBase64 || typeof beforeImageBase64 !== 'string') {
      return res.status(400).json({ error: 'Before image is required for slider comparisons.' });
    }

    if (!afterImageBase64 || typeof afterImageBase64 !== 'string') {
      return res.status(400).json({ error: 'After image is required for slider comparisons.' });
    }

    // Strip data URL schemes
    const cleanBeforeBase64 = beforeImageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
    const cleanAfterBase64 = afterImageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');

    const beforeBuf = Buffer.from(cleanBeforeBase64, 'base64');
    const afterBuf = Buffer.from(cleanAfterBase64, 'base64');

    // Server-side validation of both images
    const beforeInfo = validateImage(beforeBuf, 'Before image');
    const afterInfo = validateImage(afterBuf, 'After image');

    // Generate safe filenames
    const beforeFilename = generateSafeFilename(name.trim(), 'before', beforeInfo.ext);
    const afterFilename = generateSafeFilename(name.trim(), 'after', afterInfo.ext);

    const beforeRelPath = `public/thumbnails/before/${beforeFilename}`;
    const afterRelPath = `public/thumbnails/after/${afterFilename}`;

    const beforeUrl = `/thumbnails/before/${beforeFilename}`;
    const afterUrl = `/thumbnails/after/${afterFilename}`;

    const newSlider = {
      id: `ba-${Date.now().toString(36)}`,
      type: 'slider',
      name: name.trim(),
      title: name.trim(),
      subtitle: subtitle?.trim() || 'Before & After Transformation',
      description:
        description?.trim() ||
        'Crafted dynamic visual depth, custom rim lighting, and high-impact compositing in Photoshop and 3D.',
      beforeImage: beforeUrl,
      beforeImg: beforeUrl,
      afterImage: afterUrl,
      afterImg: afterUrl,
      beforeLabel: beforeLabel?.trim() || 'BEFORE (Initial Concept)',
      afterLabel: afterLabel?.trim() || 'AFTER (Final Polish)',
      tools: Array.isArray(tools) && tools.length > 0 ? tools : ['Photoshop', 'Cinema 4D'],
      createdAt: new Date().toISOString(),
    };

    // Atomic commit to GitHub
    const commitResult = await atomicGitHubCommit({
      commitMessage: `feat(portfolio): add Before & After slider "${name.trim()}"`,
      filesToAdd: [
        {
          path: beforeRelPath,
          base64Content: cleanBeforeBase64,
        },
        {
          path: afterRelPath,
          base64Content: cleanAfterBase64,
        },
      ],
      updatePortfolio: (portfolio) => {
        const comparisons = portfolio.comparisons || [];
        return {
          ...portfolio,
          comparisons: [newSlider, ...comparisons],
        };
      },
    });

    // Automatically trigger Vercel deployment
    const deployResult = await triggerVercelDeploy();

    return res.status(200).json({
      success: true,
      item: newSlider,
      commitSha: commitResult.commitSha,
      deployTriggered: deployResult.triggered,
      message: 'Published slider successfully. Deployment triggered.',
    });
  } catch (err) {
    console.error('Slider upload error:', err);
    return res.status(400).json({
      error: err.message || 'Failed to upload comparison slider.',
    });
  }
}
