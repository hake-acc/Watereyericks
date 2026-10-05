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
    let alreadyRemoved = false;

    const commitResult = await atomicGitHubCommit({
      commitMessage: `feat(portfolio): delete ${itemType} item "${id}"`,
      pathsToDelete,
      updatePortfolio: (portfolio) => {
        if (itemType === 'slider') {
          const comparisons = Array.isArray(portfolio.comparisons) ? portfolio.comparisons : [];
          const target = comparisons.find(
            (c) =>
              c.id === id ||
              (c.title && c.title.toLowerCase() === id.toLowerCase()) ||
              (c.name && c.name.toLowerCase() === id.toLowerCase())
          );

          if (!target) {
            alreadyRemoved = true;
            return portfolio; // Item already removed; don't error out
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
            comparisons: comparisons.filter((c) => c !== target && c.id !== target.id),
          };
        } else {
          const thumbnails = Array.isArray(portfolio.thumbnails) ? portfolio.thumbnails : [];
          const target = thumbnails.find(
            (t) =>
              t.id === id ||
              (t.title && t.title.toLowerCase() === id.toLowerCase()) ||
              (t.name && t.name.toLowerCase() === id.toLowerCase()) ||
              (t.image && t.image === id) ||
              (t.img && t.img === id)
          );

          if (!target) {
            alreadyRemoved = true;
            return portfolio; // Item already removed; don't error out
          }

          deletedTitle = target.title || target.name || id;

          const imgPath = target.image || target.img;
          if (imgPath && typeof imgPath === 'string') {
            const clean = imgPath.replace(/^\//, '');
            if (clean.startsWith('thumbnails/') || clean.startsWith('samples/')) {
              pathsToDelete.push(`public/${clean}`);
            }
          }

          const gridPath = target.gridImage;
          if (gridPath && typeof gridPath === 'string') {
            const clean = gridPath.replace(/^\//, '');
            if (clean.startsWith('thumbnails/') || clean.startsWith('samples/')) {
              pathsToDelete.push(`public/${clean}`);
            }
          }

          return {
            ...portfolio,
            thumbnails: thumbnails.filter((t) => t !== target && t.id !== target.id),
          };
        }
      },
    });

    // If item was already removed in GitHub, respond gracefully with the fresh portfolio
    if (alreadyRemoved) {
      return res.status(200).json({
        success: true,
        alreadyDeleted: true,
        deletedId: id,
        portfolio: commitResult.portfolio,
        message: `Item was already removed from the GitHub repository. Portfolio view has been synchronized.`,
      });
    }

    // Trigger Vercel deployment
    const deployResult = await triggerVercelDeploy();

    return res.status(200).json({
      success: true,
      alreadyDeleted: false,
      deletedId: id,
      deletedTitle,
      commitSha: commitResult.commitSha,
      deployTriggered: deployResult.triggered,
      portfolio: commitResult.portfolio,
      message: `Deleted "${deletedTitle}" successfully. Live deployment triggered.`,
    });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(400).json({
      error: err.message || 'Failed to delete portfolio item.',
    });
  }
}
