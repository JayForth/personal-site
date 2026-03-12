import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// ── Parse markdown files from posts/ directory ──
function parsePosts() {
  const postsDir = path.resolve('posts');
  if (!fs.existsSync(postsDir)) return [];

  return fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8').replace(/\r\n/g, '\n');
      const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!match) return null;

      const frontmatter = {};
      match[1].split('\n').forEach(line => {
        const idx = line.indexOf(':');
        if (idx > -1) {
          frontmatter[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
        }
      });

      const slug = file.replace(/^\d{4}-\d{2}-\d{2}_/, '').replace(/\.md$/, '');
      return {
        slug,
        filename: `posts/${file}`,
        title: frontmatter.title || slug,
        date: frontmatter.date || '2026-01-01',
        type: frontmatter.type || 'post',
        body: match[2].trim()
      };
    })
    .filter(Boolean);
}

// ── Virtual module: import { posts } from 'virtual:posts' ──
function postsPlugin() {
  const virtualId = 'virtual:posts';
  const resolvedId = '\0' + virtualId;

  return {
    name: 'posts-plugin',
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId) {
        return `export const posts = ${JSON.stringify(parsePosts())};`;
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.md') && file.includes('posts')) {
        const mod = server.moduleGraph.getModuleById(resolvedId);
        if (mod) return [mod];
      }
    }
  };
}

// ── Generate Atom feed at build time ──
function feedPlugin() {
  return {
    name: 'generate-atom-feed',
    writeBundle() {
      const posts = parsePosts();
      const siteUrl = 'https://helloiamjacob.com';
      const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
      const updated = sorted[0]?.date || new Date().toISOString().slice(0, 10);

      const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

      const entries = sorted.map(p => `  <entry>
    <title>${esc(p.title)}</title>
    <link href="${siteUrl}/post/${p.slug}" rel="alternate"/>
    <id>${siteUrl}/post/${p.slug}</id>
    <updated>${p.date}T00:00:00Z</updated>
    <content type="text">${esc(p.body)}</content>
  </entry>`).join('\n');

      const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Jacob Forth</title>
  <subtitle>Personal blog of Jacob Forth</subtitle>
  <link href="${siteUrl}/feed.xml" rel="self"/>
  <link href="${siteUrl}" rel="alternate"/>
  <id>${siteUrl}/</id>
  <updated>${updated}T00:00:00Z</updated>
  <author><name>Jacob Forth</name></author>
${entries}
</feed>
`;
      fs.mkdirSync('dist', { recursive: true });
      fs.writeFileSync('dist/feed.xml', xml, 'utf-8');
      console.log('  ✓ Generated feed.xml');
    }
  };
}

export default defineConfig({
  plugins: [postsPlugin(), feedPlugin()]
});
