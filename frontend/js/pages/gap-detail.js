// Shared — skill gap detail (district admin + state admin).
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import { el, loadingState, errorState, whyPanel } from '../components/ui.js';
import { backLink, asArray } from './district-shared.js';

registerRoute('/gap/:districtId/:gapId', {
  title: 'Gap Detail',
  roles: ['DISTRICT_ADMIN', 'STATE_ADMIN'],
  async render(container, params) {
    container.replaceChildren(loadingState('Loading gap detail…'));
    const load = async () => this.render(container, params);
    try {
      const data = await api.districtSkillGaps(params.districtId);
      const gaps = asArray(data?.skillGaps ?? data?.gaps ?? data);
      let gap = gaps.find((g) => String(g.id) === String(params.gapId));
      if (!gap) gap = gaps[Number(params.gapId)]; // fallback: index-based lookup
      if (!gap) { container.replaceChildren(errorState('Skill gap not found', load)); return; }
      renderGap(container, params.districtId, gap);
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load gap detail', load));
    }
  },
});

function renderGap(container, districtId, g) {
  const skill = g.skill?.name || g.skill || g.skillName || 'Skill';
  const role = g.jobRole?.name || g.jobRole || g.jobRoleName || 'Role';
  const demand = g.demand ?? null;
  const capacity = g.trainingCapacity ?? g.capacity ?? null;
  const gap = g.gap ?? g.gapSize ?? null;
  const score = g.priorityScore ?? g.priority ?? null;
  const growth = g.demandGrowth ?? null;

  const why = [];
  if (demand != null && demand >= (capacity ?? 0)) {
    why.push({ title: 'Strong current demand', desc: `Current demand of ${demand} exceeds available training capacity.` });
  }
  if (gap != null && gap > 0) {
    why.push({ title: 'Large training-capacity shortage', desc: `A shortfall of ${gap} trainees per cycle against demand.` });
  }
  if (growth != null && growth > 0) {
    why.push({ title: 'High demand growth', desc: `Demand is growing at ${growth}% — the gap will widen without action.` });
  }
  if (g.futureDemand != null) {
    why.push({ title: 'Strong future demand', desc: 'Forecast signals point to sustained demand for this skill.' });
  }
  if (g.industryRelevance === true || (g.industryRelevance ?? 0) >= 0.6) {
    why.push({ title: 'Strong industry relevance', desc: 'Employers across local industry clusters actively seek this skill.' });
  }
  if (g.regionalRelevance === true || (g.regionalRelevance ?? 0) >= 0.6) {
    why.push({ title: 'High regional relevance', desc: 'This gap is pronounced in this district compared to the state average.' });
  }

  container.replaceChildren(
    backLink('Back to skill gaps', '/district/skill-gaps'),
    el('div', { class: 'hero' },
      el('div', { class: 'small' }, `DISTRICT · ${districtId} · SKILL GAP`),
      el('h2', {}, `${skill} — ${role}`),
      el('div', { class: 'gaphero', style: { width: '100%' } },
        el('div', { class: 'stats', style: { flex: '1' } },
          el('div', { class: 'stat' }, el('b', {}, demand != null ? String(demand) : '—'), el('span', {}, 'Demand')),
          el('div', { class: 'stat' }, el('b', {}, capacity != null ? String(capacity) : '—'), el('span', {}, 'Training Capacity')),
          el('div', { class: 'stat' }, el('b', {}, gap != null ? String(gap) : '—'), el('span', {}, 'Skill Gap')),
          el('div', { class: 'stat' }, el('b', {}, growth != null ? `${growth}%` : '—'), el('span', {}, 'Demand Growth'))),
        el('div', { class: 'gscore' },
          el('div', { class: 'score' }, score != null ? String(score) : '—'),
          el('span', {}, 'Priority Score')))),
    el('div', { class: 'card', style: { marginTop: '16px' } },
      el('div', { class: 'head' }, el('h2', {}, 'Why this is high priority')),
      why.length ? whyPanel(why) : el('div', { class: 'empty' }, 'No priority factors recorded for this gap.')));
}
