/* ============================================================
   UTILITIES
   ============================================================ */

const sleep = ms => new Promise(r => setTimeout(r, ms));
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   TERMINAL TYPEWRITER
   ============================================================ */

const PROMPT_HTML =
  `<span class="t-user">stephen</span>` +
  `<span class="t-host">@portfolio:~$</span> `;

const COMMANDS = [
  {
    cmd: 'whoami',
    output: '> Analytics Engineer · 10+ years @ T-Mobile · Detroit, MI',
  },
  {
    cmd: "cat stack.json | jq '.core'",
    output: '> ["SQL", "Snowflake", "Python", "pandas", "Power BI"]',
  },
  {
    cmd: './run_portfolio.sh --scroll',
    output: '> Loading projects...',
  },
];

function makePromptLine() {
  const line = document.createElement('span');
  line.className = 't-line';
  line.innerHTML = PROMPT_HTML;
  return line;
}

async function typeText(el, text) {
  for (const ch of text) {
    el.insertAdjacentText('beforeend', ch);
    await sleep(46 + Math.random() * 26);
  }
}

async function runTerminal() {
  const root = document.getElementById('terminal-output');
  if (!root) return;

  if (prefersReducedMotion()) {
    COMMANDS.forEach(({ cmd, output }) => {
      const p = makePromptLine();
      const c = document.createElement('span');
      c.className = 't-cmd';
      c.textContent = cmd;
      p.appendChild(c);
      root.appendChild(p);
      const o = document.createElement('span');
      o.className = 't-line t-out';
      o.textContent = output;
      root.appendChild(o);
      root.appendChild(Object.assign(document.createElement('span'), { className: 't-spacer' }));
    });
    const fp = makePromptLine();
    fp.insertAdjacentHTML('beforeend', '<span class="cursor"></span>');
    root.appendChild(fp);
    return;
  }

  await sleep(500);

  for (let i = 0; i < COMMANDS.length; i++) {
    const { cmd, output } = COMMANDS[i];

    const pLine = makePromptLine();
    root.appendChild(pLine);

    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    pLine.appendChild(cursor);

    await sleep(350);
    const cmdSpan = document.createElement('span');
    cmdSpan.className = 't-cmd';
    pLine.insertBefore(cmdSpan, cursor);
    await typeText(cmdSpan, cmd);

    await sleep(200);
    cursor.remove();

    const outLine = document.createElement('span');
    outLine.className = 't-line t-out';
    outLine.textContent = output;
    root.appendChild(outLine);

    root.appendChild(Object.assign(document.createElement('span'), { className: 't-spacer' }));
    await sleep(i < COMMANDS.length - 1 ? 750 : 300);
  }

  const finalP = makePromptLine();
  finalP.insertAdjacentHTML('beforeend', '<span class="cursor"></span>');
  root.appendChild(finalP);
}

/* ============================================================
   GITHUB REPOS
   ============================================================ */

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', SCSS: '#c6538c',
  'Jupyter Notebook': '#DA5B0B', Shell: '#89e051', Bash: '#89e051',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600',
  Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516', PHP: '#4F5D95',
  Swift: '#FA7343', Kotlin: '#A97BFF', Scala: '#c22d40', R: '#198CE7',
  Dockerfile: '#384d54', Vue: '#41b883', Svelte: '#ff3e00',
};

// Repos featured individually above — exclude from the "all repos" grid
const FEATURED_REPOS = new Set(['power_cabinet_tool', 'data-integrity-triage', 'address-matching-ml']);

const GH_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`;

const STAR_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function buildRepoCard(repo) {
  const color = repo.language ? (LANG_COLORS[repo.language] || '#8b8b8b') : null;
  const langHTML  = color ? `<span class="meta-item"><span class="lang-dot" style="background:${color}"></span>${repo.language}</span>` : '';
  const starsHTML = repo.stargazers_count > 0 ? `<span class="meta-item">${STAR_SVG}${repo.stargazers_count}</span>` : '';
  const descHTML  = repo.description
    ? `<p class="repo-desc">${repo.description}</p>`
    : `<p class="repo-desc empty">No description.</p>`;

  return `
    <div class="glass-card repo-card fade-in">
      <div class="repo-name">
        ${repo.name}
        <a href="${repo.html_url}" class="repo-link-icon" target="_blank" rel="noopener noreferrer" title="View on GitHub">${GH_SVG}</a>
      </div>
      ${descHTML}
      <div class="repo-meta">
        ${langHTML}
        ${starsHTML}
        <span class="meta-item">Updated ${fmtDate(repo.updated_at)}</span>
      </div>
    </div>`;
}

function placeholderRepos() {
  // TODO: Stephen — GitHub API unavailable; fill in repos manually below
  return `
    <div class="glass-card repo-card fade-in">
      <div class="repo-name">your-repo <a href="https://github.com/cheddaburger" class="repo-link-icon" target="_blank" rel="noopener noreferrer">${GH_SVG}</a></div>
      <p class="repo-desc empty">// TODO: Stephen — GitHub API unreachable; add repos manually</p>
      <div class="repo-meta"><span class="meta-item">Updated —</span></div>
    </div>`;
}

async function loadRepos() {
  const grid = document.getElementById('repos-grid');
  if (!grid) return;

  try {
    const res = await fetch(
      'https://api.github.com/users/cheddaburger/repos?sort=updated&per_page=100',
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );
    if (!res.ok) throw new Error(`${res.status}`);

    const repos = await res.json();
    const filtered = repos.filter(r => !r.fork && !FEATURED_REPOS.has(r.name));
    if (!filtered.length) throw new Error('empty');

    grid.innerHTML = filtered.map(buildRepoCard).join('');
  } catch (err) {
    console.warn('[portfolio] Repos fetch failed:', err.message);
    grid.innerHTML = placeholderRepos();
  }

  observeFadeIns(grid.querySelectorAll('.fade-in'));
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */

function observeFadeIns(els) {
  if (prefersReducedMotion()) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ============================================================
   NAVIGATION
   ============================================================ */

function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));
}

/* ============================================================
   THEME TOGGLE
   ============================================================ */

function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ============================================================
   i18n EASTER EGG — type "es" / "en"
   ============================================================ */

const TRANSLATIONS = {
  en: {
    'nav.about':        'about',
    'nav.work':         'work',
    'nav.skills':       'skills',
    'nav.experience':   'experience',
    'nav.education':    'education',
    'nav.contact':      'contact',
    'section.about':    'about',
    'section.featured': 'featured analytics products',
    'section.skills':   'skills',
    'section.experience': 'experience',
    'section.education': 'education & learning',
    'section.contact':  'contact',
    'badge.internal':   'internal',
    'badge.public':     'public',
    'skills.col1':      'Analytics Engineering',
    'skills.col2':      'Data Platforms & SQL',
    'skills.col3':      'Python & Tooling',
    'label.exposure':   'exposure',
    'label.present':    'present',
    'contact.tagline':  "Let's build something worth measuring.",
  },
  es: {
    'nav.about':        'sobre mí',
    'nav.work':         'trabajo',
    'nav.skills':       'habilidades',
    'nav.experience':   'experiencia',
    'nav.education':    'educación',
    'nav.contact':      'contacto',
    'section.about':    'sobre mí',
    'section.featured': 'productos analíticos destacados',
    'section.skills':   'habilidades',
    'section.experience': 'experiencia',
    'section.education': 'educación y aprendizaje',
    'section.contact':  'contacto',
    'badge.internal':   'interno',
    'badge.public':     'público',
    'skills.col1':      'Ingeniería Analítica',
    'skills.col2':      'Plataformas de Datos y SQL',
    'skills.col3':      'Python y Herramientas',
    'label.exposure':   'exposición',
    'label.present':    'presente',
    'contact.tagline':  'Construyamos algo que valga la pena medir.',
  },
};

let currentLang    = 'en';
let toastSeen      = false;
let toastTimeout   = null;

function applyLang(lang) {
  const dict = TRANSLATIONS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.documentElement.lang = lang;
  currentLang = lang;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('visible');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3000);
}

function initI18n() {
  let buf = '';

  document.addEventListener('keydown', e => {
    // Ignore keypresses in form fields
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

    buf = (buf + e.key).slice(-2);

    if (buf === 'es' && currentLang !== 'es') {
      applyLang('es');
      if (!toastSeen) {
        showToast('🌐 Vista en español activada');
        toastSeen = true;
      } else {
        showToast('🌐 Vista en español');
      }
    } else if (buf === 'en' && currentLang !== 'en') {
      applyLang('en');
      showToast('🌐 Switched to English');
    }
  });
}

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTheme();
  runTerminal();
  observeFadeIns(document.querySelectorAll('.fade-in'));
  initI18n();
});
