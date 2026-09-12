// District admin — action plans list + create-new entry point.
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import { el, card, listRow, emptyState, loadingState, errorState, statusPill, modal } from '../components/ui.js';
import { asArray } from './district-shared.js';

registerRoute('/district/action-plans', {
  title: 'Action Plans',
  roles: ['DISTRICT_ADMIN'],
  async render(container) {
    container.replaceChildren(loadingState('Loading action plans…'));
    try {
      const data = await api.actionPlans();
      const plans = asArray(data?.actionPlans ?? data);
      container.replaceChildren(
        card('Action Plans', 'Plans converting approved recommendations into delivery',
          el('div', { style: { marginBottom: '10px', textAlign: 'right' } },
            el('button', {
              class: 'btn dark',
              onclick: () => openNewPlanModal(),
            }, '+ New Action Plan')),
          plans.length
            ? plans.map((p) => listRow({
                title: p.title || 'Action plan',
                meta: `From: ${p.recommendation?.title || p.recommendationTitle || 'Recommendation'} · ${p.progress ?? 0}% complete`,
                right: statusPill(p.status),
                onClick: () => navigate(`/action-plan/${p.id}`),
              }))
            : emptyState('No action plans yet — start from an approved recommendation')));
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load action plans',
        () => this.render(container)));
    }
  },
});

async function openNewPlanModal() {
  let recs = [];
  try {
    const data = await api.recommendations();
    recs = asArray(data?.recommendations ?? data)
      .filter((r) => (r.status || '').toUpperCase() === 'APPROVED');
  } catch (err) {
    modal({ title: 'Could not load recommendations', body: err.message || 'Please try again.' });
    return;
  }
  if (!recs.length) {
    modal({
      title: 'No approved recommendations',
      body: 'Action plans are built from approved recommendations. Approve a recommendation first.',
    });
    return;
  }
  modal({
    title: 'Start an action plan',
    body: el('div', {}, el('p', { style: { marginBottom: '10px' } },
      'Pick an approved recommendation to build a draft action plan:'),
      recs.map((r) => el('div', {
        class: 'row',
        onclick: (e) => { e.currentTarget.closest('.overlay').remove(); navigate(`/action-plan/new/${r.id}`); },
      },
        el('div', {},
          el('div', { class: 'name' }, r.title || 'Recommendation'),
          el('div', { class: 'muted' }, `${r.type || ''} · Priority ${r.priorityScore ?? r.priority ?? '—'}`)),
        el('div', {}), el('div', {})))),
    actions: [{ label: 'Cancel', class: 'ghost' }],
  });
}
