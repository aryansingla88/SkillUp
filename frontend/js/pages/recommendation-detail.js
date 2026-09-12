// Shared — recommendation detail with approve/reject (district + state admin).
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import {
  el, card, badge, statusPill, whyPanel, loadingState, errorState, toast,
  confirmModal, modal, btn,
} from '../components/ui.js';
import { backLink, asArray } from './district-shared.js';

registerRoute('/recommendation/:id', {
  title: 'Recommendation Detail',
  roles: ['DISTRICT_ADMIN', 'STATE_ADMIN'],
  async render(container, params) {
    container.replaceChildren(loadingState('Loading recommendation…'));
    const load = async () => this.render(container, params);
    try {
      const data = await api.recommendation(params.id);
      renderRec(container, data?.recommendation ?? data, load);
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load recommendation', load));
    }
  },
});

function renderRec(container, r, reload) {
  if (!r) { container.replaceChildren(errorState('Recommendation not found')); return; }
  const status = (r.status || '').toUpperCase();
  const isDraft = status === 'DRAFT' || status === 'PENDING';
  const gap = r.skillGap || r.gap || null;
  const factors = asArray(r.priorityFactors ?? r.factors);
  const actions = asArray(r.suggestedActions ?? r.actions);
  const evidence = asArray(r.evidence);

  const actionsRow = isDraft ? el('div', { class: 'recactions' },
    btn('Reject', {
      class: 'danger',
      onClick: () => {
        const remarks = el('textarea', { class: 'inp', placeholder: 'Reason for rejection (required)' });
        modal({
          title: 'Reject recommendation',
          body: el('div', {}, el('p', { style: { marginBottom: '10px' } }, 'Please record why this recommendation is being rejected.'), remarks),
          actions: [
            { label: 'Cancel', class: 'ghost' },
            {
              label: 'Yes, reject', class: 'danger',
              onClick: async (close) => {
                try {
                  await api.rejectRecommendation(r.id, remarks.value.trim());
                  close();
                  toast('Recommendation rejected');
                  reload();
                } catch (err) { toast(err.message || 'Rejection failed', 'err'); }
              },
            },
          ],
        });
      },
    }),
    btn('Approve', {
      class: 'dark',
      onClick: () => confirmModal(
        'Approve this recommendation? An action plan can then be created from it.',
        async () => {
          try {
            await api.approveRecommendation(r.id);
            toast('Recommendation approved');
            reload();
          } catch (err) { toast(err.message || 'Approval failed', 'err'); }
        }),
    })) : null;

  container.replaceChildren(
    backLink('Back to recommendations', '/district/recommendations'),
    el('div', { class: 'card' },
      el('div', { class: 'head' },
        el('div', {},
          el('div', { class: 'recmeta' },
            badge(r.type || 'RECOMMENDATION'),
            statusPill(r.status),
            isDraft ? el('span', { class: 'pill info' }, 'System suggestion awaiting human decision') : null),
          el('h2', {}, r.title || 'Recommendation'),
          r.description ? el('div', { class: 'desc' }, r.description) : null)),
      r.priorityScore != null || r.priority != null
        ? el('p', { style: { fontSize: '11px', color: 'var(--muted)' } },
            `Priority score: ${r.priorityScore ?? r.priority}`)
        : null,
      factors.length
        ? el('div', { style: { margin: '14px 0' } },
            el('h2', { style: { fontSize: '13px', marginBottom: '8px' } }, 'Priority factors'),
            whyPanel(factors.map((f) => typeof f === 'string' ? { title: f } : { title: f.title || f.name, desc: f.desc || f.description })))
        : null,
      gap ? el('div', { style: { margin: '14px 0' } },
        el('h2', { style: { fontSize: '13px', marginBottom: '6px' } }, 'Linked skill gap'),
        el('p', { style: { fontSize: '11px' } },
          `${gap.skill?.name || gap.skill || gap.skillName || 'Skill'} · ${gap.jobRole?.name || gap.jobRole || gap.jobRoleName || 'Role'} · Gap ${gap.gap ?? '—'}`),
        gap.districtId || r.districtId
          ? btn('View gap detail', {
              class: 'link',
              onClick: () => navigate(`/gap/${gap.districtId || r.districtId}/${gap.id}`),
            })
          : null) : null,
      evidence.length
        ? card('Evidence', null,
            el('ul', { style: { fontSize: '11px', paddingLeft: '18px', lineHeight: '1.8' } },
              evidence.map((e) => el('li', {}, typeof e === 'string' ? e : (e.description || e.summary || JSON.stringify(e))))))
        : null,
      actions.length
        ? card('Suggested actions', null,
            el('ol', { style: { fontSize: '11px', paddingLeft: '18px', lineHeight: '1.8' } },
              actions.map((a) => el('li', {}, typeof a === 'string' ? a : (a.description || a.action || a.title)))))
        : null,
      actionsRow));
}
