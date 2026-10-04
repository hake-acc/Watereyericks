import { authenticateAdmin, checkVercelDeployment } from './_lib.js';

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const session = authenticateAdmin(req, res);
  if (!session) return;

  try {
    const deployment = await checkVercelDeployment();
    return res.status(200).json(deployment);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to check deployment status.' });
  }
}
