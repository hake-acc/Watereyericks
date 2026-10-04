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
    const { name, subtitle, category, subcat, tools, imageBase64 } = body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Thumbnail name/title is required.' });
    }

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Thumbnail image data is required.' });
    }

    // Strip data URL scheme if present (e.g. data:image/png;base64,...)
    const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
    const imageBuffer = Buffer.from(cleanBase64, 'base64');

    // Server-side validation: format, dimensions, 16:9 ratio
    const imgInfo = validateImage(imageBuffer, 'Thumbnail image');

    // Generate safe filename and path
    const filename = generateSafeFilename(name.trim(), 'thumb', imgInfo.ext);
    const relativeAssetPath = `public/thumbnails/normal/${filename}`;
    const webAssetUrl = `/thumbnails/normal/${filename}`;

    const newThumbnail = {
      id: `we-${Date.now().toString(36)}`,
      type: 'thumbnail',
      name: name.trim(),
      title: name.trim(),
      subtitle: subtitle?.trim() || '',
      category: category?.trim() || 'Minecraft',
      subcat: subcat?.trim() || 'Boss Battles',
      tools: Array.isArray(tools) && tools.length > 0 ? tools : ['Photoshop', 'Cinema 4D'],
      image: webAssetUrl,
      img: webAssetUrl,
      width: imgInfo.width,
      height: imgInfo.height,
      createdAt: new Date().toISOString(),
    };

    // Perform atomic commit to GitHub
    const commitResult = await atomicGitHubCommit({
      commitMessage: `feat(portfolio): add thumbnail "${name.trim()}"`,
      filesToAdd: [
        {
          path: relativeAssetPath,
          base64Content: cleanBase64,
        },
      ],
      updatePortfolio: (portfolio) => {
        const thumbs = portfolio.thumbnails || [];
        return {
          ...portfolio,
          thumbnails: [newThumbnail, ...thumbs],
        };
      },
    });

    // Automatically trigger Vercel deployment
    const deployResult = await triggerVercelDeploy();

    return res.status(200).json({
      success: true,
      item: newThumbnail,
      commitSha: commitResult.commitSha,
      deployTriggered: deployResult.triggered,
      message: 'Published successfully. Deployment triggered.',
    });
  } catch (err) {
    console.error('Thumbnail upload error:', err);
    return res.status(400).json({
      error: err.message || 'Failed to upload thumbnail.',
    });
  }
}
