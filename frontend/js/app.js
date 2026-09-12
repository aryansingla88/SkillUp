// SkillUp — bootstrap, app shell (sidebar/topbar), auth guards, login page.
// Page modules register their routes by importing from './pages/index.js'.
import { api } from './api.js';
import { getToken, setToken, setUser, getUser, clearSession } from './state.js';
import { registerRoute, navigate, start } from './router.js';
import { el, btn, formField, toast, loadingState } from './components/ui.js';
import './pages/index.js';

const ROLE_HOME = {
  STATE_ADMIN: '/state/dashboard',
  DISTRICT_ADMIN: '/district/dashboard',
  TRAINING_CENTRE: '/centre/dashboard',
  CANDIDATE: '/candidate/dashboard',
};

const ROLE_TAGLINE = {
  STATE_ADMIN: 'System recommends · Human decides',
  DISTRICT_ADMIN: 'Skill gaps to action plans, end to end',
  TRAINING_CENTRE: 'Deliver training, report progress',
  CANDIDATE: 'Your skills, your next career move',
};

const NAV = {
  STATE_ADMIN: [
    ['Dashboard', '⌂', '/state/dashboard'],
    ['Labour Market', '▤', '/state/labour-market'],
    ['Skill Trends', '↗', '/state/trends'],
    ['District Priorities', '◎', '/state/priorities'],
    ['Forecast', '◔', '/state/forecast'],
    ['Recommendations', '✦', '/state/recommendations'],
    ['Coordination', '⇄', '/state/coordination'],
  ],
  DISTRICT_ADMIN: [
    ['Dashboard', '⌂', '/district/dashboard'],
    ['Labour Market', '▤', '/district/labour-market'],
    ['Skill Gaps', '⌕', '/district/skill-gaps'],
    ['Curriculum', '▣', '/district/curriculum'],
    ['Training Capacity', '◫', '/district/capacity'],
    ['Recommendations', '✦', '/district/recommendations'],
    ['Action Plans', '▤', '/district/action-plans'],
    ['Requests', '⇄', '/district/requests'],
    ['Implementation', '◔', '/district/implementation'],
  ],
  TRAINING_CENTRE: [
    ['Dashboard', '⌂', '/centre/dashboard'],
    ['Capacity', '◫', '/centre/capacity'],
    ['Assigned Actions', '▣', '/centre/actions'],
    ['Requests', '⇄', '/centre/requests'],
  ],
  CANDIDATE: [
    ['Dashboard', '⌂', '/candidate/dashboard'],
    ['My Skills', '⌕', '/candidate/skills'],
    ['Career Goal', '◎', '/candidate/goal'],
    ['Career Matches', '▤', '/candidate/matches'],
    ['Skill Gaps', '◔', '/candidate/gaps'],
    ['Learning', '▣', '/candidate/learning'],
    ['Learning Guidance', '✦', '/candidate/guidance'],
  ],
};

const root = document.getElementById('app');
let shell = null;
let navButtons = [];
let pageEl = null;

function initial(name) {
  return (name || 'S').trim().charAt(0).toUpperCase() || 'S';
}

function buildShell() {
  const user = getUser() || {};
  const role = user.role || '';
  navButtons = [];
  const nav = el('nav', { class: 'nav' },
    (NAV[role] || []).map(([label, ico, path]) => {
      const b = el('button', { class: 'navbtn', onclick: () => navigate(path) },
        el('span', { class: 'ico' }, ico),
        el('span', { class: 'txt' }, label));
      b.dataset.path = path;
      navButtons.push(b);
      return b;
    }));
  pageEl = el('div', { id: 'page' });
  shell = el('div', { class: 'app' },
    el('aside', { class: 'side' },
      el('div', { class: 'brand' },
        el('div', { class: 'logo' }, 'S'),
        el('div', { class: 'bname' }, 'SkillUp')),
      el('div', { class: 'role' }, `${role ? role.replace(/_/g, ' ') : ''} PORTAL`),
      nav,
      el('div', { class: 'sidefoot' }, 'Labour Market Intelligence', el('br'), 'Maharashtra')),
    el('main', {},
      el('div', { class: 'top' },
        el('div', {},
          el('div', { class: 'label', id: 'tb-label' }, ''),
          el('h1', { id: 'tb-h1' }, ''),
          el('div', { class: 'sub', id: 'tb-sub' }, '')),
        el('div', { class: 'tright' },
          btn('Logout', { class: 'ghost small', onClick: logout }),
          el('div', { class: 'user', id: 'tb-user' }, initial(user.firstName || user.name)))),
      pageEl));
  root.replaceChildren(shell);
  syncNav();
}

function destroyShell() {
  shell = null;
  navButtons = [];
  pageEl = null;
}

function syncNav() {
  const path = (location.hash || '#/').slice(1) || '/';
  navButtons.forEach((b) => b.classList.toggle('active', b.dataset.path === path));
}

function setTopbar(def) {
  const user = getUser() || {};
  document.getElementById('tb-label').textContent = def.title || '';
  document.getElementById('tb-h1').textContent =
    `Namaste, ${user.firstName || user.name || 'User'}`;
  document.getElementById('tb-sub').textContent = ROLE_TAGLINE[user.role] || '';
  document.getElementById('tb-user').textContent = initial(user.firstName || user.name);
}

function logout() {
  clearSession();
  destroyShell();
  navigate('/login');
}

function renderLogin(container) {
  const email = el('input', { class: 'inp', type: 'email', placeholder: 'Email address', autocomplete: 'username' });
  const pass = el('input', { class: 'inp', type: 'password', placeholder: 'Password', autocomplete: 'current-password' });
  const submit = btn('Sign in', { class: 'dark' ,type: 'submit'});
  const form = el('form', {},
    formField('Email', email),
    formField('Password', pass),
    submit);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    submit.disabled = true;
    submit.textContent = 'Signing in…';
    try {
      const data = await api.login(email.value.trim(), pass.value);
      const user = data.user || data;
      const token = data.token || data.accessToken;
      setToken(token);
      setUser(user);
      toast(`Welcome, ${user.firstName || user.name || 'user'}`);
      navigate(ROLE_HOME[user.role] || '/login');
    } catch (err) {
      toast(err.message || 'Login failed', 'err');
      submit.disabled = false;
      submit.textContent = 'Sign in';
    }
  });
  container.replaceChildren(el('div', { class: 'loginwrap' },
    el('div', { class: 'logincard' },
      el('div', { class: 'lbrand' },
        el('div', { class: 'logo' }, 'S'),
        el('h1', {}, 'SkillUp')),
      el('div', { class: 'lsub' }, 'Labour Market Intelligence — Maharashtra · SIH 2026'),
      form,
      el('div', { class: 'lrole' }, 'System recommends · Human decides'),
      el('button', {
        class: 'btn link small',
        type: 'button',
        onclick: () => navigate('/register'),
      }, 'New candidate? Create an account'),
      el('div', { class: 'muted', style: { fontSize: '9px', marginTop: '8px', lineHeight: '1.5' } },
        'Government (state/district) and training centre sign-ins are issued by the administration.'))));
}

registerRoute('/login', {
  title: 'Sign in',
  roles: null,
  render(container) {
    const home = getUser() && ROLE_HOME[getUser().role];
    if (getToken() && getUser() && home) { navigate(home); return; }
    if (getToken() && getUser() && !home) clearSession(); // unusable role — force clean re-login
    renderLogin(container);
  },
});

function handleRoute(def, params) {
  const path = (location.hash || '#/').slice(1) || '/';
  const token = getToken();
  const user = getUser();

  if (!token && path !== '/login' && path !== '/register') { navigate('/login'); return; }
  if (token && user && (path === '/login' || path === '/register')) { navigate(ROLE_HOME[user.role] || '/login'); return; }

  if (path === '/login' || path === '/register') {
    if (!shell) {
      root.replaceChildren(el('div', { class: 'app' }, el('main', { style: { marginLeft: '0', padding: '0' } }, pageEl = el('div', { id: 'page' }))));
    }
    def.render(pageEl, params);
    return;
  }

  if (!user) {
    // token exists but user not hydrated yet — wait for boot's api.me()
    pageEl = pageEl || el('div', { id: 'page' });
    pageEl.replaceChildren(loadingState('Restoring your session…'));
    if (!shell) buildShell();
    return;
  }

  if (!shell) buildShell();
  syncNav();

  if (!def) { navigate(ROLE_HOME[user.role] || '/login'); return; }
  if (def.roles && !def.roles.includes(user.role)) { navigate(ROLE_HOME[user.role] || '/login'); return; }

  setTopbar(def);
  def.render(pageEl, params);
}

async function boot() {
  const token = getToken();

  if (token && !getUser()) {
    clearSession();
  }

  start(handleRoute);
}

boot();

