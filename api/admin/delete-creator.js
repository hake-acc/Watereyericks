import {
  authenticateAdmin,
  parseJsonBody,
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
    const { id } = body || {};

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Creator ID is required.' });
    }

    let deletedName = id;

    // Atomic commit to GitHub
    const commitResult = await atomicGitHubCreatorsCommit({
      commitMessage: `chore(creators): remove creator "${id}"`,
      updateCreators: (data) => {
        const list = Array.isArray(data.creators) ? data.creators : [];
        const target = list.find((c) => c.id === id);
        if (target) deletedName = target.name || id;

        const filtered = list.filter((c) => c.id !== id);
        return {
          ...data,
          creators: filtered,
        };
      },
    });

    // Automatically trigger Vercel deployment
    const deployResult = await triggerVercelDeploy();

    return res.status(200).json({
      success: true,
      commitSha: commitResult.commitSha,
      deployTriggered: deployResult.triggered,
      message: `Creator "${deletedName}" removed from portfolio.`,
    });
  } catch (err) {
    console.error('Delete creator error:', err);
    return res.status(400).json({
      error: err.message || 'Failed to delete creator.',
    });
  }
}
