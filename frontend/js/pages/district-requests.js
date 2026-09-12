// District admin — requests / coordination log.
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, card, listRow, emptyState, loadingState, errorState, statusPill, modal,
  formField, btn, toast, pageTitle,
} from '../components/ui.js';
import { asArray } from './district-shared.js';

registerRoute('/district/requests', {
  title: 'Requests / Coordination',
  roles: ['DISTRICT_ADMIN'],
  async render(container) {
    container.replaceChildren(loadingState('Loading requests…'));
    try {
      const data = await api.requests();
      const reqs = asArray(data?.requests ?? data);
      container.replaceChildren(
        pageTitle('COORDINATION', 'Requests', 'Raise and track coordination requests across teams'),
        el('div', { style: { margin: '10px 0 14px' } },
          btn('+ New Request', { class: 'dark', onClick: () => openNewRequest(() => this.render(container)) })),
        card('Requests', null,
          reqs.length
            ? reqs.map((r) => listRow({
                title: r.title || r.subject || r.request || 'Request',
                meta: [
                  r.actionPlan?.title || r.actionPlan || r.relatedAction ? `Action: ${r.actionPlan?.title || r.actionPlan || r.relatedAction}` : null,
                  r.raisedBy?.name || r.raisedBy ? `Raised by: ${r.raisedBy?.name || r.raisedBy}` : null,
                  r.assignedTo?.name || r.assignedTo ? `Assigned to: ${r.assignedTo?.name || r.assignedTo}` : null,
                  r.createdAt ? `Raised: ${new Date(r.createdAt).toLocaleDateString()}` : null,
                  r.updatedAt ? `Updated: ${new Date(r.updatedAt).toLocaleDateString()}` : null,
                ].filter(Boolean).join(' · '),
                right: statusPill(r.status),
              }))
            : emptyState('No requests raised yet')));
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load requests',
        () => this.render(container)));
    }
  },
});

function openNewRequest(onDone) {
  const title = el('input', { class: 'inp', placeholder: 'e.g. Need additional welding trainers' });
  const description = el('textarea', { class: 'inp', placeholder: 'Describe what is needed and why' });
  const assignedTo = el('input', { class: 'inp', placeholder: 'Team or person (optional)' });

  const m = modal({
    title: 'New Request',
    body: el('div', {},
      formField('Request', title),
      formField('Details', description),
      formField('Assign to', assignedTo)),
    actions: [
      { label: 'Cancel', class: 'ghost' },
      {
        label: 'Submit request', class: 'dark',
        onClick: async (close) => {
          if (!title.value.trim()) { toast('Please describe the request', 'err'); return; }
          try {
            await api.createRequest({
              title: title.value.trim(),
              description: description.value.trim(),
              assignedTo: assignedTo.value.trim() || undefined,
            });
            close();
            toast('Request submitted');
            if (onDone) onDone();
          } catch (err) {
            toast(err.message || 'Could not submit request', 'err');
          }
        },
      },
    ],
  });
  return m;
}
