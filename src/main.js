import { marked } from 'marked';
import './style.css';

let posts = [];

async function fetchPosts() {
  const res = await fetch('/api/posts');
  if (res.ok) posts = await res.json();
}

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
      <h1><a href="/" data-link>Jacob Welby</a></h1>
      <nav class="site-nav">
        <a href="/" data-link class="${activePage === 'home' ? 'active' : ''}">Blog</a>
        <a href="/about" data-link class="${activePage === 'about' ? 'active' : ''}">About</a>
        <a href="/now" data-link class="${activePage === 'now' ? 'active' : ''}">Now</a>
      </nav>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
    </footer>
  `;
}

// ── Pages ──
function renderHome() {
  const sorted = [...posts].filter(p => !p.draft).sort((a, b) => new Date(b.date) - new Date(a.date));

  return `
    ${renderHeader('home')}
    <main>
      <div class="intro h-card">
        <p>Hello I am <span class="name-hover" id="name-hover"><span class="p-name">Jacob</span><img src="/jacob.jpg" class="name-hover-img" alt="Jacob"><span class="name-hover-msg">great job!</span></span>. <span class="p-note">I build things on the internet and write about what I learn along the way. I currently co-run <a href="https://pipdecks.com" target="_blank" rel="noopener">Pip Decks</a> with my best friend.</span></p>
      </div>
      <section class="section h-feed">
        <h2>Writing</h2>
        <ul class="post-list">
          ${sorted.map(p => `
            <li class="h-entry">
              <time class="post-date dt-published" datetime="${p.date}">${formatDate(p.date)}</time>
              <span class="post-title"><a class="p-name u-url" href="/post/${p.slug}" data-link>${p.title}</a></span>
            </li>
          `).join('')}
        </ul>
      </section>
    </main>
    ${renderFooter()}
  `;
}

function isAuthed() {
  return !!localStorage.getItem('write-pass');
}

function renderPost(slug) {
  const post = posts.find(p => p.slug === slug);
  if (!post || (post.draft && !isAuthed())) return render404();
  return `
    ${renderHeader('blog')}
    <main>
      <article class="h-entry">
        <div class="post-header">
          <h1 class="p-name">${post.title}</h1>
          <time class="post-meta dt-published" datetime="${post.date}">${formatDate(post.date)}</time>
          ${post.draft ? '<span class="draft-badge">Draft</span>' : ''}
        </div>
        <div class="post-body e-content">
          ${marked.parse(post.body.trim())}
        </div>
        <a class="u-url" href="/post/${post.slug}" style="display:none">permalink</a>
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
          <p>I'm Jacob Welby.</p>
          <p>I build things on the internet. I write about what I'm learning, thinking, and making.</p>
          <p>This site is the home base. Everything I publish starts here.</p>
          <p>No analytics. No tracking. No algorithmic feed. Just ideas, written down.</p>
          <hr>
          <p>If something here is useful to you, that's the best outcome I could ask for.</p>
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

function renderAllPosts() {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const authed = isAuthed();
  const params = new URLSearchParams(window.location.search);
  const page = Math.max(1, parseInt(params.get('page')) || 1);
  const perPage = 30;
  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  return `
    ${renderHeader('')}
    <main>
      <section class="section">
        <h2>All Posts (${sorted.length})</h2>
        <ul class="post-list">
          ${paginated.map(p => `
            <li>
              <time class="post-date" datetime="${p.date}">${formatDate(p.date)}</time>
              <span class="post-title">
                <a href="/post/${p.slug}" data-link>${p.title}</a>
              </span>
              ${authed ? `<a href="/edit/${p.slug}" data-link class="admin-link post-list-edit">Edit</a>` : ''}
            </li>
          `).join('')}
        </ul>
        ${totalPages > 1 ? `
        <div class="pagination">
          ${page > 1 ? `<a href="/all-posts?page=${page - 1}" data-link class="pagination-link">&larr; Newer</a>` : '<span></span>'}
          <span class="pagination-info">Page ${page} of ${totalPages}</span>
          ${page < totalPages ? `<a href="/all-posts?page=${page + 1}" data-link class="pagination-link">Older &rarr;</a>` : '<span></span>'}
        </div>
        ` : ''}
      </section>
    </main>
    ${renderFooter()}
  `;
}

// ── Write page ──
function renderWrite(editSlug) {
  const authed = localStorage.getItem('write-pass');
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

  return `
    <main class="write-page">
      <div id="write-title-wrap" class="write-title-wrap">
        <input type="text" id="write-title" class="write-title" placeholder="Title" value="${editPost ? editPost.title.replace(/"/g, '&quot;') : ''}">
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
        <button id="write-draft" class="write-btn write-draft-btn">${editPost?.draft ? 'Save Draft' : 'Save Draft'}</button>
        <button id="write-publish" class="write-btn write-publish-btn">${editPost ? (editPost.draft ? 'Publish' : 'Save') : 'Publish'}</button>
      </div>

      ${!editPost ? `
      <div class="write-posts-list">
        <h2>Your Posts</h2>
        <ul class="post-list">
          ${[...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(p => `
            <li>
              <time class="post-date" datetime="${p.date}">${formatDate(p.date)}</time>
              <span class="post-title">
                <a href="/post/${p.slug}" data-link>${p.title}</a>
                ${p.draft ? '<span class="post-type-tag draft-tag">draft</span>' : ''}
              </span>
              <a href="/edit/${p.slug}" data-link class="admin-link post-list-edit">Edit</a>
            </li>
          `).join('')}
        </ul>
        ${posts.length > 5 ? '<a href="/all-posts" data-link class="view-all-link">All posts &rarr;</a>' : ''}
      </div>
      ` : ''}
    </main>
  `;
}

// ── Wire up write page interactions ──
function initWrite() {
  const authed = localStorage.getItem('write-pass');

  if (!authed) {
    const input = document.getElementById('write-password');
    const btn = document.getElementById('write-login');
    if (!input || !btn) return;

    const login = () => {
      if (input.value.trim()) {
        localStorage.setItem('write-pass', input.value.trim());
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
  // Auto-grow textarea (without scrolling viewport on mobile)
  if (body) {
    body.addEventListener('input', () => {
      const scrollY = window.scrollY;
      body.style.height = 'auto';
      body.style.height = body.scrollHeight + 'px';
      window.scrollTo(0, scrollY);
    });
    // Trigger auto-grow on load if editing
    const scrollY = window.scrollY;
    body.style.height = 'auto';
    body.style.height = body.scrollHeight + 'px';
    window.scrollTo(0, scrollY);
  }

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
              password: localStorage.getItem('write-pass'),
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

  // Publish / Save / Draft
  const editFilename = document.getElementById('write-edit-filename')?.value;
  const isEditing = !!editFilename;
  const draftBtn = document.getElementById('write-draft');

  async function submitPost(isDraft) {
    const bodyVal = body.value.trim();
    const titleVal = title?.value.trim() || '';

    if (!bodyVal) {
      status.textContent = 'Write something first.';
      return;
    }
    if (!titleVal && !isDraft) {
      status.textContent = 'Add a title.';
      return;
    }

    publishBtn.disabled = true;
    draftBtn.disabled = true;
    status.textContent = isDraft ? 'Saving draft...' : (isEditing ? 'Saving...' : 'Publishing...');

    try {
      const endpoint = isEditing ? '/api/edit' : '/api/publish';
      const payload = {
        password: localStorage.getItem('write-pass'),
        title: titleVal,
        body: bodyVal,
        type: 'post',
        draft: isDraft,
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
          localStorage.removeItem('write-pass');
          status.textContent = 'Wrong password.';
          setTimeout(() => render(), 1500);
          return;
        }
        status.textContent = data.error || 'Something went wrong.';
        publishBtn.disabled = false;
        draftBtn.disabled = false;
        return;
      }

      // Refetch posts so the new/edited post is immediately available
      await fetchPosts();

      if (isDraft) {
        const newSlug = data.slug || '';
        if (!isEditing) { body.value = ''; if (title) title.value = ''; }
        publishBtn.disabled = false;
        draftBtn.disabled = false;
        status.innerHTML = `Draft saved! <a href="/post/${newSlug}" data-link class="write-preview-link">Preview &rarr;</a>`;
      } else if (isEditing) {
        const editSlug = editFilename.replace(/^posts\/\d{4}-\d{2}-\d{2}_/, '').replace(/\.md$/, '');
        navigate(`/post/${editSlug}`);
      } else {
        const newSlug = data.slug;
        body.value = '';
        if (title) title.value = '';
        publishBtn.disabled = false;
        draftBtn.disabled = false;
        navigate(`/post/${newSlug}`);
      }
    } catch (err) {
      status.textContent = 'Network error. Try again.';
      publishBtn.disabled = false;
      draftBtn.disabled = false;
    }
  }

  if (publishBtn) publishBtn.addEventListener('click', () => submitPost(false));
  if (draftBtn) draftBtn.addEventListener('click', () => submitPost(true));
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
  else if (route === '/all-posts') html = renderAllPosts();
  else if (route === '/write') html = renderWrite();
  else if (route.startsWith('/edit/')) html = renderWrite(route.replace('/edit/', ''));
  else if (route.startsWith('/post/')) html = renderPost(route.replace('/post/', ''));
  else html = render404();

  app.innerHTML = `<div class="site">${html}</div>`;
  window.scrollTo(0, 0);

  // Wire up name hover click easter egg
  const nameHover = document.getElementById('name-hover');
  if (nameHover) {
    nameHover.addEventListener('click', () => {
      nameHover.classList.remove('clicked');
      void nameHover.offsetWidth;
      nameHover.classList.add('clicked');
      setTimeout(() => nameHover.classList.remove('clicked'), 1500);
    });
  }

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
            password: localStorage.getItem('write-pass'),
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
        await fetchPosts();
        navigate('/');
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

// Load posts then render
fetchPosts().then(render);
