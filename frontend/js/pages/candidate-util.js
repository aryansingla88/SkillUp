// SkillUp — shared helpers for candidate pages (flat module, no routes).
import { api } from '../api.js';
import { el, btn, formField, modal, toast } from '../components/ui.js';

export const PROFICIENCIES = ['BASIC', 'INTERMEDIATE', 'ADVANCED'];
export const LEARNING_TYPES = ['COURSE', 'VIDEO', 'CERTIFICATION', 'OTHER'];
export const LEARNING_STATUSES = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED'];

// First non-null-ish value among keys.
export function pick(obj, keys, fallback = null) {
  if (!obj) return fallback;
  for (const k of keys) {
    if (obj[k] != null && obj[k] !== '') return obj[k];
  }
  return fallback;
}

// Human-readable name for a skill / role / resource-like object.
export function nameOf(x) {
  if (x == null) return '';
  if (typeof x === 'string') return x;
  return pick(x, ['name', 'title', 'label', 'skillName', 'roleName'], '');
}

export function idOf(x) {
  if (x == null) return null;
  if (typeof x === 'object') return pick(x, ['id', 'skillId', 'jobRoleId', 'learningResourceId'], null);
  return x;
}

export function levelSelect(value, levels = PROFICIENCIES) {
  return el('select', { class: 'inp', value: value || levels[0] },
    levels.map((p) => el('option', { value: p }, p.replace(/_/g, ' '))));
}

// Modal with a live search over api.skills(); calls onSelect(skill) on pick.
export function skillSearchModal(title, onSelect) {
  const input = el('input', { class: 'inp', placeholder: 'Type to search skills…' });
  const list = el('div', {});
  let skills = [];

  function draw(filter = '') {
    const q = filter.trim().toLowerCase();
    const hits = skills.filter((s) => nameOf(s).toLowerCase().includes(q));
    list.replaceChildren(hits.length
      ? hits.map((s) => el('div', { class: 'row', onclick: () => { m.close(); onSelect(s); } },
          el('div', {}, el('div', { class: 'name' }, nameOf(s))),
          el('div', {}), el('div', {})))
      : el('div', { class: 'empty' }, skills.length ? 'No skills match your search' : 'No skills available'));
  }

  input.addEventListener('input', () => draw(input.value));
  const m = modal({
    title,
    body: el('div', {}, formField('Search skill', input), list),
    actions: [{ label: 'Close', class: 'ghost' }],
  });

  list.replaceChildren(el('div', { class: 'loading' }, 'Loading skills…'));
  api.skills().then((data) => {
    skills = Array.isArray(data) ? data : (data?.skills ?? data?.content ?? []);
    draw();
  }).catch(() => list.replaceChildren(el('div', { class: 'errstate' }, el('p', {}, 'Could not load skills'))));
  input.focus();
}

// Standard mutation button runner: disables, awaits, toasts, re-renders.
export async function runMutation(button, fn, { success, refresh }) {
  if (button.disabled) return;
  button.disabled = true;
  try {
    await fn();
    if (success) toast(success);
    if (refresh) refresh();
  } catch (err) {
    toast(err?.message || 'Something went wrong', 'err');
    button.disabled = false;
  }
}

// --- Career "why it's worth pursuing" facts -----------------------------

function missingList(m) {
  const v = m?.missingSkills ?? m?.missing ?? m?.skillGaps ?? [];
  return Array.isArray(v) ? v : [];
}

// Highest-priority missing skill name, or first missing skill.
export function biggestGapOf(m) {
  const miss = missingList(m);
  if (!miss.length) return null;
  const hi = miss.find((s) => String(pick(s, ['priority', 'gapLevel', 'severity'], '')).toUpperCase() === 'HIGH');
  return nameOf(pick(hi ?? miss[0], ['skill'], hi ?? miss[0])) || null;
}

// e.g. "High", or "+42%" already-formatted growth strings.
export function demandOf(m) {
  const role = (m?.jobRole ?? m?.role ?? m?.career) || {};
  const v = pick(m, ['demand', 'demandLevel', 'marketDemand'], null) ?? pick(role, ['demand', 'demandLevel'], null);
  if (v == null) return null;
  return typeof v === 'number' ? String(v) : String(v);
}

export function growthOf(m) {
  const role = (m?.jobRole ?? m?.role ?? m?.career) || {};
  const v = pick(m, ['demandGrowth', 'growthPct', 'growth', 'growthPercent', 'demandGrowthPct'], null) ??
    pick(role, ['demandGrowth', 'growthPct', 'growth', 'growthPercent'], null);
  if (v == null || v === '') return null;
  const n = Number(v);
  if (Number.isNaN(n)) {
    const s = String(v);
    return /[%+\-]/.test(s) ? s : `+${s}%`;
  }
  return `${n > 0 ? '+' : ''}${n}%`;
}

// Render "Market demand / Demand growth / Your biggest gap" facts for a match.
// Returns null when the API provides no market data at all.
export function careerValueRow(m) {
  const demand = demandOf(m);
  const growth = growthOf(m);
  const gap = biggestGapOf(m);
  if (!demand && !growth && !gap) return null;
  const fact = (label, value, green) => el('div', {},
    el('div', { style: { fontSize: '8px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 } }, label),
    el('div', { style: { fontSize: '11px', fontWeight: 800, color: green ? 'var(--green)' : 'var(--ink)', marginTop: '2px' } }, value));
  return el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px', background: '#f7f6f1', borderRadius: '10px', padding: '10px' } },
    demand ? fact('Market demand', demand) : el('div', {}),
    growth ? fact('Demand growth', growth, true) : el('div', {}),
    gap ? fact('Biggest gap', gap) : fact('Biggest gap', 'None — you have the skills'));
}
