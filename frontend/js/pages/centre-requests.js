// SkillUp — Training Centre: Requests
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, btn, card, formField, modal, statusPill, toast,
  loadingState, errorState, emptyState,
} from '../components/ui.js';

function fmt(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? String(ts) : d.toLocaleString();
}

function requestTitle(r) {
  return r?.title || (r?.type ? `${String(r.type).charAt(0) + String(r.type).slice(1).toLowerCase()} request` : 'Request');
}

function relatedAction(r) {
  return r?.actionItemTitle || r?.actionTitle
    || (r?.actionItemId != null ? `Action #${r.actionItemId}` : '—');
}

registerRoute('/centre/requests', {
  title: 'Requests',
  roles: ['TRAINING_CENTRE'],
  render(container) {
    container.replaceChildren(
      el('div', { class: 'head', style: { marginBottom: '14px' } },
        el('div', {},
          el('div', { class: 'label' }, 'Training Centre'),
          el('h1', { style: { fontSize: '22px' } }, 'Requests'),
          el('div', { class: 'sub' }, 'Requests you have raised for trainers, equipment or infrastructure.')),
        el('div', { class: 'end' },
          btn('New Request', { class: 'dark small', onClick: () => openNewRequestModal(load) }))));

    const body = el('div', {});
    container.append(body);
    body.replaceChildren(loadingState('Loading requests…'));

    async function load() {
      let requests;
      try {
        requests = await api.requests();
      } catch (err) {
        body.replaceChildren(errorState(err.message || 'Could not load requests', load));
        return;
      }
      const list = (Array.isArray(requests) ? requests : (requests?.requests ?? []))
        .slice()
        .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));

      body.replaceChildren(list.length
        ? el('div', {}, list.map((r) => el('div', { class: 'card', style: { marginBottom: '12px' } },
            el('div', { class: 'head' },
              el('div', {},
                el('h2', {}, requestTitle(r)),
                el('div', { class: 'desc' }, r?.description || '')),
              statusPill(r?.status)),
            el('div', { class: 'muted', style: { fontSize: '11px', display: 'flex', gap: '16px', flexWrap: 'wrap' } },
              el('span', {}, `Related action: ${relatedAction(r)}`),
              el('span', {}, `Raised: ${fmt(r?.createdAt)}`),
              el('span', {}, `Updated: ${fmt(r?.updatedAt)}`)))))
        : emptyState('No requests raised yet. Use “New Request” to ask for trainers, equipment or infrastructure.'));
    }

    load();
  },
});

function openNewRequestModal(onDone) {
  const type = el('select', { class: 'inp' },
    el('option', { value: 'TRAINER' }, 'Trainer'),
    el('option', { value: 'EQUIPMENT' }, 'Equipment'),
    el('option', { value: 'INFRASTRUCTURE' }, 'Infrastructure'));
  const desc = el('textarea', { class: 'inp', rows: '4', placeholder: 'Describe what you need and why…' });
  modal({
    title: 'New request',
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
            await api.createRequest({ type: type.value, description: desc.value.trim() });
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
