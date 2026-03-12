export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, filename, title, body, type } = req.body;

  if (!password || password !== process.env.PUBLISH_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  if (!filename || !body?.trim()) {
    return res.status(400).json({ error: 'Missing filename or body' });
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

  // Get current file SHA (required to update)
  const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, { headers });
  if (!getRes.ok) {
    return res.status(404).json({ error: 'Post file not found on GitHub' });
  }
  const { sha } = await getRes.json();

  // Parse the date from the existing filename
  const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})_/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10);

  const content = `---\ntitle: ${title}\ndate: ${date}\ntype: ${type || 'post'}\n---\n\n${body.trim()}\n`;

  const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `Edit: ${title}`,
      content: Buffer.from(content).toString('base64'),
      sha,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    return res.status(500).json({ error: err.message || 'GitHub API error' });
  }

  return res.status(200).json({ ok: true });
}
