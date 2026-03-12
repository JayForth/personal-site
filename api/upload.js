export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, filename, data } = req.body;

  if (!password || password !== process.env.PUBLISH_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  if (!filename || !data) {
    return res.status(400).json({ error: 'Missing filename or data' });
  }

  // Sanitize filename and add timestamp to avoid collisions
  const ext = filename.split('.').pop().toLowerCase();
  const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  if (!allowed.includes(ext)) {
    return res.status(400).json({ error: `File type .${ext} not allowed` });
  }

  const safeName = `${Date.now()}-${filename.toLowerCase().replace(/[^a-z0-9._-]/g, '')}`;
  const filepath = `public/images/${safeName}`;

  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!repo || !token) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const ghResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filepath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'personal-site-publisher',
    },
    body: JSON.stringify({
      message: `Upload image: ${safeName}`,
      content: data, // already base64
    }),
  });

  if (!ghResponse.ok) {
    const err = await ghResponse.json();
    return res.status(500).json({ error: err.message || 'GitHub API error' });
  }

  return res.status(200).json({ ok: true, url: `/images/${safeName}` });
}
