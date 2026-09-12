// SkillUp — candidate skill gaps: table of required vs current level with
// gap size and priority pills.
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, card, emptyState, loadingState, errorState, dataTable, statusPill, chip,
  pairedBars, barLegend,
} from '../components/ui.js';
import { pick, nameOf, idOf } from './candidate-util.js';

const LEVEL_ORDER = { BASIC: 1, INTERMEDIATE: 2, ADVANCED: 3 };
const LEVEL_PCT = { BASIC: 33, INTERMEDIATE: 66, ADVANCED: 100 };
const GAP_TONE = { High: 'bad', Medium: 'warn', Low: 'ok' };

// Map a level value (string or object) to a 0-100 percentage for charting.
function levelPct(v) {
  if (v == null) return null;
  if (typeof v === 'number' && Number.isFinite(v)) return Math.max(0, Math.min(100, v));
  const s = String(typeof v === 'object' ? (nameOf(v) || pick(v, ['proficiency', 'level'], '')) : v).toUpperCase();
  if (LEVEL_PCT[s] != null) return LEVEL_PCT[s];
  const n = parseFloat(s);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null;
}

function gapsOf(d) {
  return d?.skillGaps ?? d?.gaps ?? d?.topSkillGaps ?? [];
}

function levelOf(g, keys) {
  const v = pick(g, keys, null);
  if (v == null) return '—';
  if (typeof v === 'object') return nameOf(v) || String(pick(v, ['proficiency', 'level'], '—'));
  return String(v);
}

function gapSize(g) {
  const own = pick(g, ['gap', 'gapSize', 'gapLevel', 'severity'], null);
  if (own && typeof own === 'string' && GAP_TONE[own]) return own;
  // Derive from required vs current level when possible.
  const reqRaw = pick(g, ['requiredLevel', 'requiredProficiency', 'targetLevel'], null);
  const curRaw = pick(g, ['currentLevel', 'currentProficiency', 'yourLevel'], null);
  const req = typeof reqRaw === 'string' ? LEVEL_ORDER[reqRaw.toUpperCase()] : null;
  const cur = typeof curRaw === 'string' ? LEVEL_ORDER[curRaw.toUpperCase()] : null;
  if (req != null && cur != null) {
    const diff = req - cur;
    if (diff >= 2 || (diff >= 1 && req === 3)) return 'High';
    if (diff === 1) return 'Medium';
    return 'Low';
  }
  return 'Medium';
}

function render(container) {
  container.replaceChildren(loadingState('Loading your skill gaps…'));

  api.candidateDashboard().then((d) => {
    const gaps = gapsOf(d);

    const rows = gaps.map((g) => {
      const skill = pick(g, ['skill'], g) ?? {};
      return {
        _g: g,
        skill: nameOf(skill) || nameOf(g),
        required: levelOf(g, ['requiredLevel', 'requiredProficiency', 'targetLevel', 'required']),
        current: levelOf(g, ['currentLevel', 'currentProficiency', 'yourLevel', 'current']),
        gap: gapSize(g),
        priority: String(pick(g, ['priority'], '—')).toUpperCase(),
      };
    });

    const table = dataTable([
      { key: 'skill', label: 'Skill' },
      { key: 'required', label: 'Required Level' },
      { key: 'current', label: 'Current Level' },
      {
        key: 'gap', label: 'Gap',
        render: (r) => el('span', { class: `pill ${GAP_TONE[r.gap] || 'info'}` }, r.gap),
      },
      {
        key: 'priority', label: 'Priority',
        render: (r) => (r.priority === 'HIGH'
          ? el('span', { class: 'pill bad' }, 'HIGH')
          : el('span', { class: 'pill info' }, r.priority)),
      },
    ], rows);

    const chartRows = rows
      .map((r) => ({
        label: r.skill,
        a: levelPct(pick(r._g, ['requiredLevel', 'requiredProficiency', 'targetLevel', 'required'], null)),
        b: levelPct(pick(r._g, ['currentLevel', 'currentProficiency', 'yourLevel', 'current'], null)),
        aLabel: 'Required',
        bLabel: 'You',
      }))
      .filter((r) => r.a != null && r.b != null)
      .slice(0, 6);

    container.replaceChildren(
      card('Your Skill Gap', 'The level your goal role needs vs the level you have today',
        barLegend('Required', 'You'),
        gaps.length && chartRows.length
          ? pairedBars(chartRows, { aName: 'Required', bName: 'You' })
          : emptyState('No level data to chart yet — the table below shows what the system recorded.')),
      el('div', { class: 'card' },
        el('div', { class: 'head' },
          el('div', {},
            el('h2', {}, 'Skill Gaps'),
            el('div', { class: 'desc' }, 'What your goal role needs vs the level you have today'))),
        gaps.length
          ? table
          : emptyState('No skill gaps found — you are well placed for your goal role.')));
  }).catch((err) => {
    container.replaceChildren(errorState(err?.message || 'Could not load skill gaps',
      () => render(container)));
  });
}

registerRoute('/candidate/gaps', {
  title: 'Skill Gaps',
  roles: ['CANDIDATE'],
  render,
});
