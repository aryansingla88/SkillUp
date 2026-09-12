// Shared — action plan detail: view existing, or create a pre-filled draft from a recommendation.
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import {
  el, card, statusPill, loadingState, errorState, toast, formField,
  btn, confirmModal,
} from '../components/ui.js';
import { backLink, asArray } from './district-shared.js';

const FLOW = ['DRAFT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED'];

registerRoute('/action-plan/:id', {
  title: 'Action Plan',
  roles: ['DISTRICT_ADMIN'],
  async render(container, params) {
    container.replaceChildren(loadingState('Loading action plan…'));
    const load = async () => this.render(container, params);
    try {
      const data = await api.actionPlan(params.id);
      renderPlan(container, data?.actionPlan ?? data, load);
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load action plan', load));
    }
  },
});

registerRoute('/action-plan/new/:recommendationId', {
  title: 'Action Plan',
  roles: ['DISTRICT_ADMIN'],
  async render(container, params) {
    container.replaceChildren(loadingState('Preparing draft from recommendation…'));
    try {
      const data = await api.recommendation(params.recommendationId);
      const rec = data?.recommendation ?? data;
      if (!rec) throw new Error('Recommendation not found');
      const gap = rec.skillGap || rec.gap || {};
      renderDraftEditor(container, null, {
        recommendationId: rec.id,
        recommendation: rec,
        title: rec.title ? `Action plan — ${rec.title}` : '',
        objective: gap.skill || gap.skillName
          ? `Close the ${gap.skill?.name || gap.skill || gap.skillName} gap for ${gap.jobRole?.name || gap.jobRole || gap.jobRoleName || 'target roles'} in the district.`
          : (rec.description || ''),
        actions: asArray(rec.suggestedActions ?? rec.actions).map((a) => typeof a === 'string' ? a : (a.description || a.action || a.title || '')).filter(Boolean),
        stakeholders: asArray(rec.suggestedStakeholders ?? rec.stakeholders).map(String),
      });
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not prepare draft',
        () => this.render(container, params)));
    }
  },
});

function statusFlow(status) {
  const idx = FLOW.indexOf((status || 'DRAFT').toUpperCase());
  return el('div', { class: 'road', style: { gridTemplateColumns: '1fr 25px 1fr 25px 1fr 25px 1fr', margin: '14px 0' } },
    FLOW.map((s, i) => [
      el('div', { class: 'step', style: i === idx ? { background: 'var(--lime)' } : {} },
        el('b', {}, s.replace(/_/g, ' ')),
        el('span', {}, i < idx ? 'Done' : i === idx ? 'Current' : 'Pending')),
      i < FLOW.length - 1 ? el('div', { class: 'arrow' }, '→') : null,
    ]));
}

function renderPlan(container, p, reload) {
  if (!p) { container.replaceChildren(errorState('Action plan not found')); return; }
  const status = (p.status || 'DRAFT').toUpperCase();
  const isDraft = status === 'DRAFT';
  const actions = asArray(p.actions ?? p.actionItems);
  const stakeholders = asArray(p.stakeholders);

  const body = [
    backLink('Back to action plans', '/district/action-plans'),
    el('div', { class: 'card' },
      el('div', { class: 'head' },
        el('div', {}, el('h2', {}, p.title || 'Action plan'), statusPill(p.status))),
      statusFlow(p.status),
      p.objective ? el('p', { style: { fontSize: '12px', margin: '10px 0' } }, p.objective) : null,
      p.recommendation ? el('p', { style: { fontSize: '11px', color: 'var(--muted)' } },
        `From recommendation: ${p.recommendation.title || p.recommendation}`,
        btn('View recommendation', {
          class: 'link', style: { marginLeft: '8px' },
          onClick: () => navigate(`/recommendation/${p.recommendation.id || p.recommendationId}`),
        })) : null,
      actions.length ? card('Actions', null,
        el('ol', { style: { fontSize: '11px', paddingLeft: '18px', lineHeight: '1.8' } },
          actions.map((a) => el('li', {}, typeof a === 'string' ? a : (a.description || a.action || a.title))))) : null,
      stakeholders.length ? card('Stakeholders', null,
        el('div', {}, stakeholders.map((s) => el('span', { class: 'chip' }, typeof s === 'string' ? s : (s.name || s.role || String(s)))))) : null,
      p.progress != null ? el('p', { style: { fontSize: '11px', marginTop: '10px' } }, `Progress: ${p.progress}%`) : null),
  ];

  const controls = [];
  if (isDraft) {
    controls.push(btn('Edit draft', {
      class: 'ghost',
      onClick: () => renderDraftEditor(container, p.id, {
        recommendationId: p.recommendation?.id || p.recommendationId,
        title: p.title || '',
        objective: p.objective || '',
        actions: actions.map((a) => typeof a === 'string' ? a : (a.description || a.action || a.title || '')).filter(Boolean),
        stakeholders: stakeholders.map((s) => typeof s === 'string' ? s : (s.name || String(s))).filter(Boolean),
      }, reload),
    }));
  }
  if (status === 'DRAFT') {
    controls.push(btn('Approve plan', {
      class: 'dark',
      onClick: () => confirmModal('Approve this action plan? It will move to the APPROVED stage.', async () => {
        try {
          await api.approveActionPlan(p.id);
          toast('Action plan approved');
          reload();
        } catch (err) { toast(err.message || 'Approval failed', 'err'); }
      }),
    }));
  }
  if (controls.length) {
    body.push(el('div', { class: 'card' },
      el('div', { class: 'recactions' }, controls)));
  }
  container.replaceChildren(...body);
}

// Draft editor used both for "new" (creates) and for editing an existing DRAFT.
function renderDraftEditor(container, planId, draft, reload) {
  const isNew = !planId;
  const title = el('input', { class: 'inp', value: draft.title || '' });
  const objective = el('textarea', { class: 'inp' }, draft.objective || '');
  const actionsVal = el('textarea', { class: 'inp', style: { minHeight: '110px' } },
    (draft.actions || []).join('\n'));
  const stakeholdersVal = el('input', { class: 'inp', value: (draft.stakeholders || []).join(', ') });

  const saveBtn = btn(isNew ? 'Save Draft' : 'Save changes', { class: 'dark' });
  const approveBtn = isNew ? btn('Save & Approve', { class: 'ghost' }) : null;

  const payload = () => ({
    title: title.value.trim(),
    objective: objective.value.trim(),
    actions: actionsVal.value.split('\n').map((s) => s.trim()).filter(Boolean),
    stakeholders: stakeholdersVal.value.split(',').map((s) => s.trim()).filter(Boolean),
    recommendationId: draft.recommendationId,
  });

  const doSave = async () => {
    if (!payload().title) { toast('Please give the plan a title', 'err'); return null; }
    try {
      const created = await api.createActionPlan(payload());
      toast('Draft action plan saved');
      return created?.actionPlan?.id ?? created?.id ?? null;
    } catch (err) { toast(err.message || 'Save failed', 'err'); return null; }
  };

  const doApprove = async (id) => {
    try {
      await api.approveActionPlan(id);
      toast('Action plan approved');
      navigate(`/action-plan/${id}`);
    } catch (err) { toast(err.message || 'Approval failed', 'err'); }
  };

  saveBtn.addEventListener('click', async () => {
    if (saveBtn.disabled) return;
    saveBtn.disabled = true;
    try {
      if (isNew) {
        const id = await doSave();
        if (id) navigate(`/action-plan/${id}`);
      } else {
        await api.updateActionPlan(planId, payload());
        toast('Changes saved');
        reload ? reload() : navigate(`/action-plan/${planId}`);
      }
    } finally { saveBtn.disabled = false; }
  });

  if (approveBtn) {
    approveBtn.addEventListener('click', async () => {
      if (approveBtn.disabled) return;
      approveBtn.disabled = true;
      const id = await doSave();
      if (id) await doApprove(id);
      approveBtn.disabled = false;
    });
  }

  container.replaceChildren(
    backLink('Back to action plans', '/district/action-plans'),
    el('div', { class: 'card apeditor' },
      el('div', { class: 'head' },
        el('div', {},
          el('h2', {}, isNew ? 'New Action Plan (Draft)' : 'Edit Action Plan'),
          el('div', { class: 'desc' }, 'System-prepared draft from the recommendation — review and adjust before saving.')),
        statusPill('DRAFT')),
      statusFlow('DRAFT'),
      formField('Title', title),
      formField('Objective', objective),
      formField('Actions (one per line)', actionsVal),
      formField('Stakeholders (comma separated)', stakeholdersVal),
      el('div', { class: 'recactions' }, approveBtn, saveBtn)));
}
