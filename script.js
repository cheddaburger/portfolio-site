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
    'nav.sidequests':   'side quests',
    'nav.skills':       'skills',
    'nav.experience':   'experience',
    'nav.education':    'education',
    'nav.contact':      'contact',
    'section.about':    'about',
    'section.featured':    'featured analytics products',
    'section.sidequests':  '🧙 side quests',
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
    'nav.sidequests':   'misiones secundarias',
    'nav.skills':       'habilidades',
    'nav.experience':   'experiencia',
    'nav.education':    'educación',
    'nav.contact':      'contacto',
    'section.about':    'sobre mí',
    'section.featured':   'productos analíticos destacados',
    'section.sidequests': '🧙 misiones secundarias',
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
