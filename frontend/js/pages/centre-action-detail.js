// SkillUp — Training Centre: Action Detail (P0 execution screen)
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, btn, card, formField, modal, statusPill, toast, progressMetrics,
  loadingState, errorState,
} from '../components/ui.js';

const METRICS = [
  { key: 'BATCH', label: 'Batches' },
  { key: 'TRAINER', label: 'Trainers' },
  { key: 'EQUIPMENT', label: 'Equipment' },
  { key: 'INFRASTRUCTURE', label: 'Infrastructure' },
];

// Normalise progress payload from api.actionItemProgress — accept several shapes.
function normMetrics(item, prog) {
  const byType = {};
  const list = prog?.metrics || prog?.progressMetrics || prog?.items || [];
  for (const m of Array.isArray(list) ? list : []) {
    const t = String(m?.metric || m?.type || m?.key || '').toUpperCase();
    if (!t) continue;
    byType[t] = {
      current: Number(m?.current ?? m?.done ?? 0) || 0,
      target: Number(m?.target ?? m?.goal ?? 0) || 0,
    };
  }
  // Fall back to fields on the item itself (e.g. item.currentTrainers / targetTrainers).
  for (const { key } of METRICS) {
    if (!byType[key]) {
      const low = key.toLowerCase();
      byType[key] = {
        current: Number(item?.[`current${low === 'batch' ? 'Batches' : low.charAt(0).toUpperCase() + low.slice(1)}`] ?? item?.[low]) || 0,
        target: Number(item?.[`target${low === 'batch' ? 'Batches' : low.charAt(0).toUpperCase() + low.slice(1)}`] ?? item?.[`target${low}`]) || 0,
      };
    }
  }
  return byType;
}

function overallStatus(byType) {
  const all = METRICS.map(({ key }) => byType[key]).filter((m) => m && m.target > 0);
  if (all.length && all.every((m) => m.current >= m.target)) return 'COMPLETED';
  if (all.some((m) => m.current > 0)) return 'IN_PROGRESS';
  return 'ASSIGNED';
}

registerRoute('/centre/action/:id', {
  title: 'Action Detail',
  roles: ['TRAINING_CENTRE'],
  render(container, params) {
    const id = params?.id;
    const body = el('div', {});
    container.replaceChildren(body);
    body.replaceChildren(loadingState('Loading action detail…'));

    async function load() {
      let item, prog;
      try {
        [item, prog] = await Promise.all([api.actionItem(id), api.actionItemProgress(id)]);
      } catch (err) {
        body.replaceChildren(errorState(err.message || 'Could not load this action', load));
        return;
      }
      item = item?.actionItem || item?.item || item || {};
      prog = prog?.progress || prog || {};
      const byType = normMetrics(item, prog);
      const overall = String(item?.status || '').toUpperCase() === 'COMPLETED'
        ? 'COMPLETED'
        : overallStatus(byType);
      const pctOf = (m) => (m.target ? Math.min(100, Math.round((m.current / m.target) * 100)) : 0);

      body.replaceChildren(
        el('div', { class: 'head', style: { marginBottom: '14px' } },
          el('div', {},
            el('div', { class: 'label' }, 'Assigned Action'),
            el('h1', { style: { fontSize: '22px' } }, item?.title || item?.name || 'Action detail'),
            el('div', { class: 'sub' }, item?.description || item?.planTitle || '')),
          el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
            statusPill(overall),
            btn('Raise Request', {
              class: 'outline small',
              onClick: () => openRequestModal(id, item, load),
            }))),

        card('Overall progress', 'Every metric at target marks this action as completed.',
          progressMetrics(METRICS.map(({ key, label }) => ({
            label, current: byType[key]?.current ?? 0, target: byType[key]?.target ?? 0,
          })))),

        card('Update progress', 'Report the current count for each metric. The saved values are shown immediately after update.',
          el('div', {}, METRICS.map(({ key, label }) => {
            const m = byType[key] || { current: 0, target: 0 };
            const full = m.target > 0 && m.current >= m.target;
            return el('div', {
              class: 'row',
            },
              el('div', {},
                el('div', { class: 'name' }, label),
                el('div', { class: 'muted' }, m.target > 0
                  ? `Current ${m.current} of target ${m.target} · ${pctOf(m)}%`
                  : 'No target set for this metric yet')),
              el('div', { class: 'end' },
                full
                  ? el('span', { class: 'pill ok' }, 'DONE')
                  : btn('Update Progress', {
                      class: 'ghost small',
                      onClick: () => openUpdateModal(id, key, label, m, load),
                    })));
          }))));
    }

    load();
  },
});

function openUpdateModal(id, metric, label, m, onDone) {
  const input = el('input', {
    class: 'inp', type: 'number', min: '0', step: '1', value: String(m.current ?? 0),
  });
  const { close } = modal({
    title: `Update ${label}`,
    body: el('div', {},
      formField(`Current ${label.toLowerCase()} (target ${m.target})`, input),
      el('div', { class: 'muted', style: { fontSize: '11px' } },
        'The value you enter is saved to the system and reflected right away.')),
    actions: [
      { label: 'Cancel', class: 'ghost' },
      {
        label: 'Save progress', class: 'dark',
        onClick: async (closeModal) => {
          const v = Number(input.value);
          if (!Number.isFinite(v) || v < 0) { toast('Enter a valid number', 'err'); return; }
          try {
            await api.updateActionItemProgress(id, { metric, current: v });
            toast(`${label} progress saved`);
            closeModal();
            if (onDone) onDone();
          } catch (err) {
            toast(err.message || 'Could not save progress', 'err');
          }
        },
      },
    ],
  });
  return close;
}

function openRequestModal(id, item, onDone) {
  const type = el('select', { class: 'inp' },
    el('option', { value: 'TRAINER' }, 'Trainer'),
    el('option', { value: 'EQUIPMENT' }, 'Equipment'),
    el('option', { value: 'INFRASTRUCTURE' }, 'Infrastructure'));
  const desc = el('textarea', { class: 'inp', rows: '4', placeholder: 'Describe what you need and why…' });
  modal({
    title: 'Raise a request',
    body: el('div', {},
      formField('Request type', type),
      formField('Description', desc)),
    actions: [
      { label: 'Cancel', class: 'ghost' },
      {
        label: 'Submit request', class: 'dark',
        onClick: async (close) => {
          if (!desc.value.trim()) { toast('Please describe the request', 'err'); return; }
          try {
            await api.createRequest({
              type: type.value,
              description: desc.value.trim(),
              actionItemId: id,
              actionItemTitle: item?.title || item?.name || undefined,
            });
            toast('Request submitted');
            close();
            if (onDone) onDone();
          } catch (err) {
            toast(err.message || 'Could not submit request', 'err');
          }
        },
      },
    ],
  });
}
