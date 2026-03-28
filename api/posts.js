export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!repo || !token) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'personal-site-publisher',
  };

  // Get list of files in posts/
  const listRes = await fetch(`https://api.github.com/repos/${repo}/contents/posts`, { headers });
  if (!listRes.ok) {
    return res.status(500).json({ error: 'Failed to list posts' });
  }

  const files = (await listRes.json()).filter(f => f.name.endsWith('.md'));

  // Fetch all file contents in parallel via raw URLs
  const posts = await Promise.all(files.map(async (f) => {
    const raw = await fetch(f.download_url).then(r => r.text());

    const match = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return null;

    const frontmatter = {};
    match[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx > -1) {
        frontmatter[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      }
    });

    const slug = f.name.replace(/^\d{4}-\d{2}-\d{2}_/, '').replace(/\.md$/, '');
    return {
      slug,
      filename: `posts/${f.name}`,
      title: frontmatter.title || slug,
      date: frontmatter.date || '2026-01-01',
      type: frontmatter.type || 'post',
      draft: frontmatter.draft === 'true',
      body: match[2].trim()
    };
  }));

  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=300');
  return res.status(200).json(posts.filter(Boolean));
}
