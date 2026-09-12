// SkillUp — Training Centre: Capacity
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, pageTitle, card, statCards, listRow, statusPill,
  loadingState, errorState, emptyState, pairedBars, barLegend,
} from '../components/ui.js';

function num(...vals) {
  for (const v of vals) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

registerRoute('/centre/capacity', {
  title: 'Capacity',
  roles: ['TRAINING_CENTRE'],
  render(container) {
    container.replaceChildren(pageTitle(
      'Training Centre',
      'Training Capacity',
      'Your available capacity against what assigned actions require. Figures reflect what the system currently records.'));
    const body = el('div', {});
    container.append(body);
    body.replaceChildren(loadingState('Loading capacity…'));

    async function load() {
      let plans;
      try {
        plans = await api.actionPlans();
      } catch (err) {
        body.replaceChildren(errorState(err.message || 'Could not load capacity', load));
        return;
      }
      const list = Array.isArray(plans) ? plans : (plans?.actionPlans ?? plans?.plans ?? []);

      let target = 0; let planned = 0; let current = 0; let assigned = 0;
      const rows = [];
      for (const p of list || []) {
        const items = p?.items || p?.actionItems || [];
        const itemCount = items.length || 1;
        assigned += items.length;
        const pTarget = num(p?.targetCapacity, p?.targetBatches, p?.targetBatchSize, p?.target);
        const pCurrent = num(p?.currentCapacity, p?.currentBatches, p?.plannedBatches, p?.current);
        target += pTarget;
        current += pCurrent;
        planned += num(p?.plannedCapacity, p?.plannedBatches);
        rows.push({ plan: p, pTarget, pCurrent, itemCount });
      }
      const available = Math.max(0, target - planned);
      const gap = planned - current;

      body.replaceChildren(
        statCards([
          { label: 'Target capacity', value: target },
          { label: 'Available capacity', value: available },
          { label: 'Assigned actions', value: assigned },
          { label: 'Gap vs assigned', value: gap > 0 ? gap : 0 },
        ]),
        card('Capacity vs assigned requirement',
          'What each assigned action needs versus what is currently in place at your centre',
          rows.length
            ? el('div', {},
                barLegend('Required (target)', 'In place (current)'),
                pairedBars(rows.filter(({ pTarget, pCurrent }) => pTarget + pCurrent > 0).map(({ plan, pTarget, pCurrent }) => ({
                  label: plan?.title || 'Untitled plan',
                  a: pTarget,
                  b: pCurrent,
                  gap: pTarget - pCurrent > 0 ? String(pTarget - pCurrent) : null,
                })), { aName: 'Required', bName: 'In place' }))
            : emptyState('No action plans found for your centre.')),
        card('Capacity vs assigned actions',
          'Target capacity is what your centre is planned for; the gap is what assigned actions still need to reach it.',
          rows.length
            ? el('div', {}, rows.map(({ plan, pTarget, pCurrent, itemCount }) => listRow({
                title: plan?.title || 'Untitled plan',
                meta: `${itemCount} action${itemCount === 1 ? '' : 's'} · current ${pCurrent} / target ${pTarget}`,
                right: statusPill(plan?.status),
              })))
            : emptyState('No action plans found for your centre.')),
        card('Note',
          null,
          el('p', { class: 'muted', style: { fontSize: '12px', lineHeight: '1.6' } },
            'Capacity figures are shown as recorded in the system. If a plan does not report capacity fields, it is counted by its number of assigned actions only. Raise a request if you need trainers, equipment or infrastructure to close a gap.')));
    }

    load();
  },
});
