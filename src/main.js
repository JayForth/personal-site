import { marked } from 'marked';
import './style.css';

// ── Blog posts (add new posts here) ──
const posts = [
  {
    slug: 'publish-on-your-site-syndicate-elsewhere',
    title: 'Publish on your site, syndicate elsewhere',
    date: '2026-03-12',
    body: `
Your website is your home base. Everything starts here.

Then you push it out to every platform where people hang out — X, YouTube, Bluesky, Substack, Instagram, all of them.

This is the POSSE approach: **Publish on your Own Site, Syndicate Elsewhere.**

Why? Because people consume content differently. Some only watch video. Some only read newsletters. Some live on Twitter. If you only post in one place, you're invisible to everyone else.

But your site is the master copy. The canonical source. The thing you own and control. Platforms come and go, but your domain is forever.

> "Instead of making everyone come to my little town, I go to their city."
> — Derek Sivers

So the workflow is simple:

1. Write it here
2. Push it everywhere
3. All roads lead back home
    `
  },
  {
    slug: 'hello-world',
    title: 'Hello world',
    date: '2026-03-12',
    body: `
This site is live.

It's intentionally minimal. No analytics. No cookies. No pop-ups asking you to subscribe. Just words on a page.

I'll write here about what I'm thinking, building, and learning. If something resonates, great. If not, that's fine too.

The best personal sites are the ones that actually get updated. So that's the only goal — keep writing, keep shipping.
    `
  }
];

// ── Social links ──
const socials = [
  { platform: 'X', handle: '@jacobforth', url: 'https://x.com/jacobforth' },
  { platform: 'YouTube', handle: '@jacobforth', url: 'https://youtube.com/@jacobforth' },
  { platform: 'Bluesky', handle: '@jacobforth', url: 'https://bsky.app/profile/jacobforth' },
  { platform: 'Substack', handle: 'jacobforth', url: 'https://jacobforth.substack.com' },
  { platform: 'Instagram', handle: '@jacobforth', url: 'https://instagram.com/jacobforth' },
  { platform: 'TikTok', handle: '@jacobforth', url: 'https://tiktok.com/@jacobforth' },
  { platform: 'LinkedIn', handle: 'jacobforth', url: 'https://linkedin.com/in/jacobforth' },
  { platform: 'GitHub', handle: 'JayForth', url: 'https://github.com/JayForth' },
];

// ── Router ──
function getRoute() {
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

function navigate(path) {
  window.location.hash = path;
}

// ── Render helpers ──
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function renderHeader(activePage) {
  return `
    <header class="site-header">
      <h1><a href="#/" onclick="return true">Jacob Forth</a></h1>
      <nav class="site-nav">
        <a href="#/" class="${activePage === 'home' ? 'active' : ''}">Blog</a>
        <a href="#/about" class="${activePage === 'about' ? 'active' : ''}">About</a>
        <a href="#/now" class="${activePage === 'now' ? 'active' : ''}">Now</a>
        <a href="#/connect" class="${activePage === 'connect' ? 'active' : ''}">Connect</a>
      </nav>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <p>This is my home on the internet. Published here first, syndicated everywhere.</p>
    </footer>
  `;
}

// ── Pages ──
function renderHome() {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return `
    ${renderHeader('home')}

    <main>
      <div class="intro">
        <p>I'm Jacob — I build things on the internet and write about what I learn along the way.</p>
      </div>

      <section class="section">
        <h2>Writing</h2>
        <ul class="post-list">
          ${sortedPosts.map(post => `
            <li>
              <span class="post-date">${formatDate(post.date)}</span>
              <span class="post-title"><a href="#/post/${post.slug}">${post.title}</a></span>
            </li>
          `).join('')}
        </ul>
      </section>

      <section class="section">
        <h2>Elsewhere</h2>
        <div class="social-grid">
          ${socials.map(s => `
            <a href="${s.url}" target="_blank" rel="noopener">
              <span class="platform">${s.platform}</span>
              <span class="handle">${s.handle}</span>
            </a>
          `).join('')}
        </div>
      </section>
    </main>

    ${renderFooter()}
  `;
}

function renderPost(slug) {
  const post = posts.find(p => p.slug === slug);
  if (!post) return render404();

  return `
    ${renderHeader('blog')}

    <main>
      <article>
        <div class="post-header">
          <h1>${post.title}</h1>
          <div class="post-meta">${formatDate(post.date)}</div>
        </div>
        <div class="post-body">
          ${marked.parse(post.body.trim())}
        </div>
      </article>
      <a href="#/" class="back-link">All posts</a>
    </main>

    ${renderFooter()}
  `;
}

function renderAbout() {
  return `
    ${renderHeader('about')}

    <main>
      <div class="section">
        <div class="post-body">
          <p>I'm Jacob Forth.</p>

          <p>I build things on the internet. I write about what I'm learning, thinking, and making.</p>

          <p>This site is the home base. Everything I publish starts here, then gets syndicated to
          <a href="#/connect">every platform</a> where people actually hang out. The POSSE approach —
          Publish on your Own Site, Syndicate Elsewhere.</p>

          <p>No analytics. No tracking. No algorithmic feed. Just ideas, written down.</p>

          <hr>

          <p>If something here is useful to you, that's the best outcome I could ask for. If you want to get in touch, pick whichever platform you prefer from the <a href="#/connect">connect page</a>.</p>
        </div>
      </div>
    </main>

    ${renderFooter()}
  `;
}

function renderNow() {
  return `
    ${renderHeader('now')}

    <main>
      <div class="section">
        <h2>What I'm doing now</h2>
        <div class="now-content">
          <p><em>Updated March 2026</em></p>

          <p>Building and shipping projects. Writing more, publishing frequently.</p>

          <p>Learning in public. Connecting ideas across different domains.</p>

          <p>Based in the UK.</p>

          <hr style="border:none; border-top: 1px solid var(--color-border); margin: 2rem 0;">

          <p style="font-size: 0.85rem; color: var(--color-text-muted);">
            This is a <a href="https://nownownow.com/about" target="_blank" rel="noopener">/now page</a>.
            If you have your own site, you should make one too.
          </p>
        </div>
      </div>
    </main>

    ${renderFooter()}
  `;
}

function renderConnect() {
  return `
    ${renderHeader('connect')}

    <main>
      <div class="section">
        <div class="intro">
          <p>People consume content differently. Some only watch video. Some only read newsletters. Some live on Twitter.</p>
          <p>So I publish here first, then syndicate everywhere. Find me wherever you already hang out:</p>
        </div>

        <div class="social-grid">
          ${socials.map(s => `
            <a href="${s.url}" target="_blank" rel="noopener">
              <span class="platform">${s.platform}</span>
              <span class="handle">${s.handle}</span>
            </a>
          `).join('')}
        </div>

        <div style="margin-top: 3rem;">
          <p style="color: var(--color-text-muted); font-size: 0.9rem;">
            Or email me at <a href="mailto:hello@jacobforth.com">hello@jacobforth.com</a>
          </p>
        </div>
      </div>
    </main>

    ${renderFooter()}
  `;
}

function render404() {
  return `
    ${renderHeader('')}
    <main>
      <div class="intro">
        <p>Page not found.</p>
      </div>
      <a href="#/" class="back-link">Home</a>
    </main>
    ${renderFooter()}
  `;
}

// ── App ──
function render() {
  const route = getRoute();
  const app = document.getElementById('app');

  let html;

  if (route === '/') {
    html = renderHome();
  } else if (route === '/about') {
    html = renderAbout();
  } else if (route === '/now') {
    html = renderNow();
  } else if (route === '/connect') {
    html = renderConnect();
  } else if (route.startsWith('/post/')) {
    const slug = route.replace('/post/', '');
    html = renderPost(slug);
  } else {
    html = render404();
  }

  app.innerHTML = `<div class="site">${html}</div>`;
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
