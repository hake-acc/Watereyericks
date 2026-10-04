import {
  authenticateAdmin,
  parseJsonBody,
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
    const { id, type } = body || {};

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Item ID is required for deletion.' });
    }

    const itemType = type === 'slider' ? 'slider' : 'thumbnail';
    const pathsToDelete = [];
    let deletedTitle = '';

    const commitResult = await atomicGitHubCommit({
      commitMessage: `feat(portfolio): delete ${itemType} item "${id}"`,
      pathsToDelete,
      updatePortfolio: (portfolio) => {
        if (itemType === 'slider') {
          const comparisons = portfolio.comparisons || [];
          const target = comparisons.find((c) => c.id === id);
          if (!target) {
            throw new Error(`Comparison slider with ID "${id}" was not found.`);
          }
          deletedTitle = target.title || target.name || id;

          // Collect paths to delete safely
          const before = target.beforeImage || target.beforeImg;
          const after = target.afterImage || target.afterImg;

          [before, after].forEach((urlPath) => {
            if (urlPath && typeof urlPath === 'string') {
              const clean = urlPath.replace(/^\//, '');
              // Only delete if inside public/thumbnails or public/comparisons
              if (clean.startsWith('thumbnails/') || clean.startsWith('comparisons/')) {
                pathsToDelete.push(`public/${clean}`);
              }
            }
          });

          return {
            ...portfolio,
            comparisons: comparisons.filter((c) => c.id !== id),
          };
        } else {
          const thumbnails = portfolio.thumbnails || [];
          const target = thumbnails.find((t) => t.id === id);
          if (!target) {
            throw new Error(`Thumbnail with ID "${id}" was not found.`);
          }
          deletedTitle = target.title || target.name || id;

          const imgPath = target.image || target.img;
          if (imgPath && typeof imgPath === 'string') {
            const clean = imgPath.replace(/^\//, '');
            // Safe deletion path verification
            if (clean.startsWith('thumbnails/') || clean.startsWith('samples/')) {
              pathsToDelete.push(`public/${clean}`);
            }
          }

          return {
            ...portfolio,
            thumbnails: thumbnails.filter((t) => t.id !== id),
          };
        }
      },
    });

    // Trigger Vercel deployment
    const deployResult = await triggerVercelDeploy();

    return res.status(200).json({
      success: true,
      deletedId: id,
      deletedTitle,
      commitSha: commitResult.commitSha,
      deployTriggered: deployResult.triggered,
      message: `Deleted "${deletedTitle}" successfully. Deployment triggered.`,
    });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(400).json({
      error: err.message || 'Failed to delete portfolio item.',
    });
  }
}
