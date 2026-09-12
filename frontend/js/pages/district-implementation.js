// District admin — implementation tracking of action plans.
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import { el, card, listRow, emptyState, loadingState, errorState, statusPill, progressMetrics } from '../components/ui.js';
import { asArray } from './district-shared.js';

const METRIC_KEYS = ['BATCH', 'TRAINER', 'EQUIPMENT', 'INFRASTRUCTURE'];

registerRoute('/district/implementation', {
  title: 'Implementation',
  roles: ['DISTRICT_ADMIN'],
  async render(container) {
    container.replaceChildren(loadingState('Loading implementation progress…'));
    try {
      const data = await api.actionPlans();
      const all = asArray(data?.actionPlans ?? data);
      const plans = all.filter((p) => ['IN_PROGRESS', 'COMPLETED', 'APPROVED'].includes((p.status || '').toUpperCase()));
      container.replaceChildren(card(
        'Implementation', 'Action plans in flight, with delivery metrics per plan',
        plans.length
          ? plans.map((p) => {
              const raw = p.progressMetrics ?? p.metrics ?? [];
              const metrics = METRIC_KEYS.map((k) => {
                const m = asArray(raw).find((x) =>
                  (x.label || x.metric || '').toUpperCase().includes(k));
                return m
                  ? { label: k, current: m.current ?? m.done ?? 0, target: m.target ?? m.planned ?? 0 }
                  : { label: k, current: 0, target: 0 };
              });
              return el('div', { style: { padding: '12px 0', borderBottom: '1px solid #efeee8' } },
                listRow({
                  title: p.title || 'Action plan',
                  meta: `${p.progress ?? 0}% overall`,
                  right: statusPill(p.status),
                  onClick: () => navigate(`/action-plan/${p.id}`),
                }),
                el('div', { style: { marginTop: '8px' } }, progressMetrics(metrics)));
            })
          : emptyState('No action plans in progress or completed')));
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load implementation progress',
        () => this.render(container)));
    }
  },
});
