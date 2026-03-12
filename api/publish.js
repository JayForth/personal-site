export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, title, body, type } = req.body;

  if (!password || password !== process.env.PUBLISH_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  if (!body || !body.trim()) {
    return res.status(400).json({ error: 'Post body is empty' });
  }

  const date = new Date().toISOString().slice(0, 10);

  // Generate slug
  const postTitle = type === 'thought'
    ? `Thought — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : (title || '').trim();

  if (type !== 'thought' && !postTitle) {
    return res.status(400).json({ error: 'Title is required for posts' });
  }

  const slug = type === 'thought'
    ? `thought-${Date.now()}`
    : postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const filename = `posts/${date}_${slug}.md`;

  // Build markdown file
  const content = `---\ntitle: ${postTitle}\ndate: ${date}\ntype: ${type}\n---\n\n${body.trim()}\n`;

  // Commit to GitHub
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!repo || !token) {
    return res.status(500).json({ error: 'Server not configured (missing GITHUB_REPO or GITHUB_TOKEN)' });
  }

  const ghResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'personal-site-publisher',
    },
    body: JSON.stringify({
      message: `New ${type}: ${postTitle}`,
      content: Buffer.from(content).toString('base64'),
    }),
  });

  if (!ghResponse.ok) {
    const err = await ghResponse.json();
    return res.status(500).json({ error: err.message || 'GitHub API error' });
  }

  return res.status(200).json({ ok: true, slug, filename });
}
