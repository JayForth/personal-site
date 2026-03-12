export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, filename, title } = req.body;

  if (!password || password !== process.env.PUBLISH_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  if (!filename) {
    return res.status(400).json({ error: 'Missing filename' });
  }

  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!repo || !token) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'personal-site-publisher',
  };

  // Get current file SHA (required to delete)
  const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, { headers });
  if (!getRes.ok) {
    return res.status(404).json({ error: 'Post file not found on GitHub' });
  }
  const { sha } = await getRes.json();

  const delRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({
      message: `Delete: ${title || filename}`,
      sha,
    }),
  });

  if (!delRes.ok) {
    const err = await delRes.json();
    return res.status(500).json({ error: err.message || 'GitHub API error' });
  }

  return res.status(200).json({ ok: true });
}
