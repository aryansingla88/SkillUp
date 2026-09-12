// SkillUp — candidate self-registration. Government (state/district) and
// training centre accounts are issued by the administration, not self-served.
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import { el, btn, formField, toast, loadingState } from '../components/ui.js';
import { getToken, getUser, setToken, setUser } from '../state.js';

const ROLE_HOME = { CANDIDATE: '/candidate/dashboard' };

function renderRegister(container) {
  const home = getUser() && ROLE_HOME[getUser().role];
  if (getToken() && getUser() && home) { navigate(home); return; }

  const name = el('input', { class: 'inp', placeholder: 'Full name', autocomplete: 'name' });
  const email = el('input', { class: 'inp', type: 'email', placeholder: 'Email address', autocomplete: 'username' });
  const pass = el('input', { class: 'inp', type: 'password', placeholder: 'Password (min 6 characters)', autocomplete: 'new-password' });
  const pass2 = el('input', { class: 'inp', type: 'password', placeholder: 'Confirm password', autocomplete: 'new-password' });
  const district = el('select', { class: 'inp' }, el('option', { value: '' }, 'Loading districts…'));
  const education = el('input', { class: 'inp', placeholder: 'Education (optional, e.g. 12th pass, ITI, B.Tech)' });
  const submit = btn('Create candidate account', { class: 'dark' });

  api.districts()
    .then((data) => {
      const list = Array.isArray(data) ? data : (data?.districts ?? data?.content ?? []);
      district.replaceChildren(
        el('option', { value: '' }, 'Select your district'),
        list.map((d) => el('option', { value: d?.id ?? d?.name ?? '' }, d?.name || String(d))));
    })
    .catch(() => district.replaceChildren(el('option', { value: '' }, 'District list unavailable')));

  const form = el('form', {},
    formField('Full name', name),
    formField('Email', email),
    formField('Password', pass),
    formField('Confirm password', pass2),
    formField('District', district),
    formField('Education', education),
    submit);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    const fullName = name.value.trim();
    const mail = email.value.trim();
    if (!fullName) return toast('Please enter your name', 'err');
    if (!mail) return toast('Please enter your email', 'err');
    if (pass.value.length < 6) return toast('Password must be at least 6 characters', 'err');
    if (pass.value !== pass2.value) return toast('Passwords do not match', 'err');
    submit.disabled = true;
    submit.textContent = 'Creating account…';
    try {
      const body = { name: fullName, email: mail, password: pass.value, role: 'CANDIDATE' };
      if (district.value) body.districtId = district.value;
      if (education.value.trim()) body.education = education.value.trim();
      const data = await api.register(body);
      const user = data?.user || { id: data?.id, name: fullName, email: mail, role: 'CANDIDATE' };
      const token = data?.token || data?.accessToken;
      if (token) {
        setToken(token);
        setUser(user);
        toast(`Welcome, ${user.name || fullName}`);
        navigate(ROLE_HOME[user.role] || '/candidate/dashboard');
      } else {
        toast('Account created — please sign in');
        navigate('/login');
      }
    } catch (err) {
      toast(err?.message || 'Registration failed', 'err');
      submit.disabled = false;
      submit.textContent = 'Create candidate account';
    }
  });

  container.replaceChildren(el('div', { class: 'loginwrap' },
    el('div', { class: 'logincard' },
      el('div', { class: 'lbrand' },
        el('div', { class: 'logo' }, 'S'),
        el('h1', {}, 'SkillUp')),
      el('div', { class: 'lsub' }, 'Candidate registration — Maharashtra · SIH 2026'),
      form,
      el('div', { class: 'lrole' }, 'Government and training centre accounts are issued by the administration'),
      el('button', {
        class: 'btn link small',
        type: 'button',
        onclick: () => navigate('/login'),
      }, 'Already have an account? Sign in'))));
}

registerRoute('/register', {
  title: 'Register',
  roles: null,
  render(container) {
    container.replaceChildren(loadingState('Loading registration…'));
    renderRegister(container);
  },
});
