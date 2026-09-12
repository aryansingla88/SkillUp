// District admin — curriculum intelligence: coverage of required skills per curriculum.
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import { el, card, emptyState, loadingState, errorState, statusPill, pairedBars, barLegend } from '../components/ui.js';
import { asArray } from './district-shared.js';

// Market requirement %, falling back to 100 when only coverage is known.
function requiredPct(g) {
  const v = Number(g?.marketRequirementPct ?? g?.requiredPct ?? g?.demandPct ?? g?.requirementPct);
  return Number.isFinite(v) ? v : 100;
}

// Curriculum coverage % — numeric fields, or a status word mapped to a %.
const COVERAGE_MAP = { ALIGNED: 100, PARTIAL: 50, OUTDATED: 25, MISSING: 0 };
function coveredPct(g) {
  const v = Number(g?.coveragePct ?? g?.curriculumPct ?? g?.coveragePercent);
  if (Number.isFinite(v)) return v;
  const s = String(g?.status || g?.coverage || '').toUpperCase();
  return s in COVERAGE_MAP ? COVERAGE_MAP[s] : NaN;
}

registerRoute('/district/curriculum', {
  title: 'Curriculum Intelligence',
  roles: ['DISTRICT_ADMIN'],
  async render(container) {
    container.replaceChildren(loadingState('Loading curricula…'));
    let curricula = [];
    try {
      const data = await api.curricula();
      curricula = asArray(data?.curricula ?? data);
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load curricula',
        () => this.render(container)));
      return;
    }
    if (!curricula.length) { container.replaceChildren(emptyState('No curricula found')); return; }

    let selectedId = curricula[0].id;
    const select = el('select', {
      class: 'inp',
      style: { maxWidth: '340px', marginBottom: '14px' },
      onchange: (e) => { selectedId = e.target.value; draw(); },
    }, curricula.map((c) => el('option', { value: c.id, selected: c.id === selectedId },
      c.name || c.title || `Curriculum ${c.id}`)));

    const holder = el('div', {});
    container.replaceChildren(select, holder);

    async function draw() {
      holder.replaceChildren(loadingState('Loading curriculum gaps…'));
      try {
        const gaps = asArray(await api.curriculumGaps(selectedId));
        const cur = curricula.find((c) => String(c.id) === String(selectedId)) || {};
        holder.replaceChildren(card(
          cur.name || cur.title || 'Curriculum',
          'Required skills and how well the current curriculum covers them',
          gaps.length
            ? gaps.map((g) => el('div', { class: 'row' },
                el('div', {},
                  el('div', { class: 'name' }, g.skill?.name || g.skill || g.skillName || 'Skill'),
                  el('div', { class: 'muted' },
                    `Job role: ${g.jobRole?.name || g.jobRole || g.jobRoleName || '—'}`)),
                el('div', {}),
                el('div', { class: 'end' }, statusPill(g.status || g.coverage || 'MISSING'))))
            : emptyState('No skill coverage data for this curriculum')));
      } catch (err) {
        holder.replaceChildren(errorState(err.message || 'Could not load curriculum gaps', draw));
      }
    }
    draw();
  },
});
