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
  return window.location.pathname;
}

function navigate(path) {
  history.pushState(null, '', path);
  render();
}

// ── Helpers ──
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function renderHeader(activePage) {
  return `
    <header class="site-header">
      <h1><a href="/" data-link>Jacob Forth</a></h1>
      <nav class="site-nav">
        <a href="/" data-link class="${activePage === 'home' ? 'active' : ''}">Blog</a>
        <a href="/about" data-link class="${activePage === 'about' ? 'active' : ''}">About</a>
        <a href="/now" data-link class="${activePage === 'now' ? 'active' : ''}">Now</a>
        <a href="/connect" data-link class="${activePage === 'connect' ? 'active' : ''}">Connect</a>
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
              <span class="post-title"><a href="/post/${p.slug}" data-link>${p.title}</a></span>
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

function isAuthed() {
  return !!sessionStorage.getItem('write-pass');
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
      <div class="post-actions">
        <a href="/" data-link class="back-link">All posts</a>
        ${isAuthed() ? `
          <span class="post-admin">
            <a href="/edit/${post.slug}" data-link class="admin-link">Edit</a>
            <a href="#" class="admin-link admin-link-delete" data-slug="${post.slug}" data-filename="${post.filename}" data-title="${post.title}">Delete</a>
          </span>
        ` : ''}
      </div>
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
          <a href="/connect" data-link>every platform</a> where people actually hang out. The POSSE approach —
          Publish on your Own Site, Syndicate Elsewhere.</p>
          <p>No analytics. No tracking. No algorithmic feed. Just ideas, written down.</p>
          <hr>
          <p>If something here is useful to you, that's the best outcome I could ask for. If you want to get in touch, pick whichever platform you prefer from the <a href="/connect" data-link>connect page</a>.</p>
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
function renderWrite(editSlug) {
  const authed = sessionStorage.getItem('write-pass');
  const editPost = editSlug ? posts.find(p => p.slug === editSlug) : null;

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

  const isThought = editPost?.type === 'thought';
  const postType = isThought ? 'thought' : 'post';

  return `
    <main class="write-page">
      <div class="write-toggle">
        <button class="write-type-btn ${postType === 'post' ? 'active' : ''}" data-type="post">Post</button>
        <button class="write-type-btn ${postType === 'thought' ? 'active' : ''}" data-type="thought">Thought</button>
      </div>

      <div id="write-title-wrap" class="write-title-wrap" ${isThought ? 'style="display:none"' : ''}>
        <input type="text" id="write-title" class="write-title" placeholder="Title" value="${editPost && !isThought ? editPost.title.replace(/"/g, '&quot;') : ''}">
      </div>

      <textarea id="write-body" class="write-body" placeholder="Write something..." autofocus>${editPost ? editPost.body : ''}</textarea>

      ${editPost ? `<input type="hidden" id="write-edit-filename" value="${editPost.filename}">` : ''}

      <div class="write-footer">
        <div class="write-footer-left">
          <label class="write-upload-label" title="Add image">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <input type="file" id="write-image" accept="image/*" hidden>
          </label>
          <span id="write-status" class="write-status"></span>
        </div>
        <button id="write-publish" class="write-btn write-publish-btn">${editPost ? 'Save' : 'Publish'}</button>
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

  let currentType = document.querySelector('.write-type-btn.active')?.dataset.type || 'post';

  // Auto-grow textarea
  if (body) {
    body.addEventListener('input', () => {
      body.style.height = 'auto';
      body.style.height = body.scrollHeight + 'px';
    });
    // Trigger auto-grow on load if editing
    body.dispatchEvent(new Event('input'));
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

  // Image upload
  const imageInput = document.getElementById('write-image');
  if (imageInput) {
    imageInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        status.textContent = 'Image too large (max 5MB).';
        return;
      }

      status.textContent = 'Uploading image...';

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result.split(',')[1];
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              password: sessionStorage.getItem('write-pass'),
              filename: file.name,
              data: base64,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            status.textContent = data.error || 'Upload failed.';
            return;
          }

          // Insert markdown image at cursor
          const pos = body.selectionStart;
          const before = body.value.slice(0, pos);
          const after = body.value.slice(pos);
          body.value = `${before}![](${data.url})${after}`;
          body.selectionStart = body.selectionEnd = pos + `![](${data.url})`.length;
          body.focus();
          body.dispatchEvent(new Event('input'));
          status.textContent = 'Image added.';
        } catch (err) {
          status.textContent = 'Upload failed. Try again.';
        }
      };
      reader.readAsDataURL(file);
      imageInput.value = '';
    });
  }

  // Publish / Save
  const editFilename = document.getElementById('write-edit-filename')?.value;
  const isEditing = !!editFilename;

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
      status.textContent = isEditing ? 'Saving...' : 'Publishing...';

      try {
        const endpoint = isEditing ? '/api/edit' : '/api/publish';
        const payload = {
          password: sessionStorage.getItem('write-pass'),
          title: currentType === 'thought' ? '' : titleVal,
          body: bodyVal,
          type: currentType,
        };
        if (isEditing) payload.filename = editFilename;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
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

        if (isEditing) {
          status.textContent = 'Saved! Site rebuilding...';
          setTimeout(() => navigate('/'), 2000);
        } else {
          status.textContent = 'Published! Site rebuilding...';
          body.value = '';
          if (title) title.value = '';
          setTimeout(() => {
            status.textContent = 'Published! Write another?';
            publishBtn.disabled = false;
          }, 3000);
        }
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
      <a href="/" data-link class="back-link">Home</a>
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
  else if (route.startsWith('/edit/')) html = renderWrite(route.replace('/edit/', ''));
  else if (route.startsWith('/post/')) html = renderPost(route.replace('/post/', ''));
  else html = render404();

  app.innerHTML = `<div class="site">${html}</div>`;
  window.scrollTo(0, 0);

  // Wire up write page after render
  if (route === '/write' || route.startsWith('/edit/')) initWrite();

  // Wire up delete buttons
  document.querySelectorAll('.admin-link-delete').forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const { slug, filename, title } = link.dataset;
      if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

      link.textContent = 'Deleting...';

      try {
        const res = await fetch('/api/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: sessionStorage.getItem('write-pass'),
            filename,
            title,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || 'Delete failed.');
          link.textContent = 'Delete';
          return;
        }

        link.textContent = 'Deleted!';
        setTimeout(() => navigate('/'), 1000);
      } catch (err) {
        alert('Network error.');
        link.textContent = 'Delete';
      }
    });
  });
}

// Intercept internal link clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-link]');
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute('href'));
  }
});

// Handle browser back/forward
window.addEventListener('popstate', render);

render();
