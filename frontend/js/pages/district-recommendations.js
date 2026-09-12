// District admin — recommendations list with type filter chips.
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import { el, card, listRow, emptyState, loadingState, errorState, statusPill, badge } from '../components/ui.js';
import { myDistrict, asArray } from './district-shared.js';

const TYPES = ['ALL', 'TRAINING', 'CURRICULUM', 'STRATEGIC'];

registerRoute('/district/recommendations', {
  title: 'Recommendations',
  roles: ['DISTRICT_ADMIN'],
  async render(container) {
    container.replaceChildren(loadingState('Loading recommendations…'));
    let active = 'ALL';
    let all = [];

    const draw = () => {
      const rows = all.filter((r) => active === 'ALL' || (r.type || '').toUpperCase() === active);
      container.replaceChildren(
        el('div', { class: 'filters' },
          TYPES.map((t) => el('button', {
            class: `filter${t === active ? ' on' : ''}`,
            onclick: () => { active = t; draw(); },
          }, t))),
        card('Recommendations', 'System suggestions linked to skill gaps in your district',
          rows.length
            ? rows.map((r) => listRow({
                title: el('span', {}, badge(r.type || '—'), ' ', r.title || 'Recommendation'),
                meta: `${r.skillGap?.skill?.name || r.skillGap?.skill || r.skillGap || 'Skill gap'} · Priority score ${r.priorityScore ?? r.priority ?? '—'}`,
                right: statusPill(r.status),
                onClick: () => navigate(`/recommendation/${r.id}`),
              }))
            : emptyState('No recommendations match this filter')));
    };

    try {
      const districtId = await myDistrict();
      const data = await api.recommendations();
      all = asArray(data?.recommendations ?? data);
      // Filter to this district when the payload carries a district reference.
      all = all.filter((r) => !r.districtId || !districtId || String(r.districtId) === String(districtId));
      draw();
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load recommendations',
        () => this.render(container)));
    }
  },
});
