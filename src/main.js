import { marked } from 'marked';
import { posts } from 'virtual:posts';
import './style.css';

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
  return window.location.hash.slice(1) || '/';
}

// ── Helpers ──
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function renderHeader(activePage) {
  return `
    <header class="site-header">
      <h1><a href="#/">Jacob Forth</a></h1>
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
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const writing = sorted.filter(p => p.type !== 'thought');
  const thoughts = sorted.filter(p => p.type === 'thought').slice(0, 6);

  return `
    ${renderHeader('home')}
    <main>
      <div class="intro">
        <p>I'm Jacob — I build things on the internet and write about what I learn along the way.</p>
      </div>
      <section class="section">
        <h2>Writing</h2>
        <ul class="post-list">
          ${writing.map(p => `
            <li>
              <span class="post-date">${formatDate(p.date)}</span>
              <span class="post-title"><a href="#/post/${p.slug}">${p.title}</a></span>
            </li>
          `).join('')}
        </ul>
      </section>
      ${thoughts.length ? `
      <section class="section">
        <h2>Thoughts</h2>
        <div class="thoughts-list">
          ${thoughts.map(t => `
            <div class="thought">
              <div class="thought-body">${marked.parse(t.body.trim())}</div>
              <span class="thought-date">${formatDate(t.date)}</span>
            </div>
          `).join('')}
        </div>
      </section>
      ` : ''}
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

// ── Write page ──
function renderWrite() {
  const authed = sessionStorage.getItem('write-pass');

  if (!authed) {
    return `
      <main class="write-page">
        <div class="write-gate">
          <input type="password" id="write-password" class="write-password-input" placeholder="Password" autofocus>
          <button id="write-login" class="write-btn">Go</button>
        </div>
      </main>
    `;
  }

  return `
    <main class="write-page">
      <div class="write-toggle">
        <button class="write-type-btn active" data-type="post">Post</button>
        <button class="write-type-btn" data-type="thought">Thought</button>
      </div>

      <div id="write-title-wrap" class="write-title-wrap">
        <input type="text" id="write-title" class="write-title" placeholder="Title">
      </div>

      <textarea id="write-body" class="write-body" placeholder="Write something..." autofocus></textarea>

      <div class="write-footer">
        <span id="write-status" class="write-status"></span>
        <button id="write-publish" class="write-btn write-publish-btn">Publish</button>
      </div>
    </main>
  `;
}

// ── Wire up write page interactions ──
function initWrite() {
  const authed = sessionStorage.getItem('write-pass');

  if (!authed) {
    const input = document.getElementById('write-password');
    const btn = document.getElementById('write-login');
    if (!input || !btn) return;

    const login = () => {
      if (input.value.trim()) {
        sessionStorage.setItem('write-pass', input.value.trim());
        render();
      }
    };

    btn.addEventListener('click', login);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
    return;
  }

  // Editor interactions
  const body = document.getElementById('write-body');
  const title = document.getElementById('write-title');
  const titleWrap = document.getElementById('write-title-wrap');
  const publishBtn = document.getElementById('write-publish');
  const status = document.getElementById('write-status');
  const typeBtns = document.querySelectorAll('.write-type-btn');

  let currentType = 'post';

  // Auto-grow textarea
  if (body) {
    body.addEventListener('input', () => {
      body.style.height = 'auto';
      body.style.height = body.scrollHeight + 'px';
    });
  }

  // Type toggle
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentType = btn.dataset.type;
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      titleWrap.style.display = currentType === 'thought' ? 'none' : '';
      if (currentType === 'thought') body.focus();
    });
  });

  // Publish
  if (publishBtn) {
    publishBtn.addEventListener('click', async () => {
      const bodyVal = body.value.trim();
      const titleVal = title?.value.trim() || '';

      if (!bodyVal) {
        status.textContent = 'Write something first.';
        return;
      }
      if (currentType === 'post' && !titleVal) {
        status.textContent = 'Add a title.';
        return;
      }

      publishBtn.disabled = true;
      status.textContent = 'Publishing...';

      try {
        const res = await fetch('/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: sessionStorage.getItem('write-pass'),
            title: titleVal,
            body: bodyVal,
            type: currentType,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            sessionStorage.removeItem('write-pass');
            status.textContent = 'Wrong password.';
            setTimeout(() => render(), 1500);
            return;
          }
          status.textContent = data.error || 'Something went wrong.';
          publishBtn.disabled = false;
          return;
        }

        status.textContent = 'Published! Site rebuilding...';
        body.value = '';
        if (title) title.value = '';

        setTimeout(() => {
          status.textContent = 'Published! Write another?';
          publishBtn.disabled = false;
        }, 3000);
      } catch (err) {
        status.textContent = 'Network error. Try again.';
        publishBtn.disabled = false;
      }
    });
  }
}

function render404() {
  return `
    ${renderHeader('')}
    <main>
      <div class="intro"><p>Page not found.</p></div>
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

  if (route === '/') html = renderHome();
  else if (route === '/about') html = renderAbout();
  else if (route === '/now') html = renderNow();
  else if (route === '/connect') html = renderConnect();
  else if (route === '/write') html = renderWrite();
  else if (route.startsWith('/post/')) html = renderPost(route.replace('/post/', ''));
  else html = render404();

  app.innerHTML = `<div class="site">${html}</div>`;
  window.scrollTo(0, 0);

  // Wire up write page after render
  if (route === '/write') initWrite();
}

window.addEventListener('hashchange', render);
render();
