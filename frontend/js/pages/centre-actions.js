// SkillUp — Training Centre: Assigned Actions
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import {
  el, pageTitle, dataTable, statusPill, progBar,
  loadingState, errorState,
} from '../components/ui.js';

function collectItems(plans) {
  const items = [];
  for (const p of plans || []) {
    const list = p?.items || p?.actionItems || [];
    if (list.length) {
      for (const it of list) items.push({ ...it, planTitle: p?.title });
    } else if (p && p.status != null && (p.progress != null || p.target != null || p.targetBatches != null)) {
      items.push({ ...p, planTitle: p?.title });
    }
  }
  return items;
}

function itemProgress(it) {
  if (it?.progress != null) return Number(it.progress) || 0;
  const c = Number(it?.current ?? it?.currentBatches ?? 0) || 0;
  const t = Number(it?.target ?? it?.targetBatches ?? 0) || 0;
  return t ? Math.round((c / t) * 100) : 0;
}

registerRoute('/centre/actions', {
  title: 'Assigned Actions',
  roles: ['TRAINING_CENTRE'],
  render(container) {
    container.replaceChildren(pageTitle(
      'Training Centre',
      'Assigned Actions',
      'All actions assigned to your centre. Open one to update progress metric by metric.'));
    const body = el('div', {});
    container.append(body);
    body.replaceChildren(loadingState('Loading assigned actions…'));

    async function load() {
      let plans;
      try {
        plans = await api.actionPlans();
      } catch (err) {
        body.replaceChildren(errorState(err.message || 'Could not load actions', load));
        return;
      }
      const items = collectItems(Array.isArray(plans) ? plans : (plans?.actionPlans ?? plans?.plans ?? []));

      body.replaceChildren(dataTable([
        { key: 'title', label: 'Action', render: (r) => r?.title || r?.name || 'Untitled action' },
        {
          key: 'target', label: 'Target', render: (r) => {
            const t = r?.target ?? r?.targetBatches ?? r?.targetBatchSize;
            return t != null ? String(t) : '—';
          },
        },
        {
          key: 'progress', label: 'Progress', width: '180px', render: (r) => {
            const p = itemProgress(r);
            return el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              el('div', { style: { flex: '1' } }, progBar(p)),
              el('span', { class: 'muted', style: { fontSize: '10px' } }, `${p}%`));
          },
        },
        { key: 'status', label: 'Status', render: (r) => statusPill(r?.status) },
      ], items, { onRow: (r) => { if (r?.id != null) navigate(`/centre/action/${r.id}`); } }));
    }

    load();
  },
});
