// SkillUp — Training Centre: Dashboard (execution-focused)
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, pageTitle, card, statCards, listRow, statusPill,
  loadingState, errorState, emptyState, chip, progBar,
} from '../components/ui.js';

// Defensive: an action plan may carry its items under `items` or `actionItems`,
// or be a flat plan-level assignment. Collect whatever the API provides.
function collectItems(plans) {
  const items = [];
  for (const p of plans || []) {
    const list = p?.items || p?.actionItems || [];
    if (list.length) {
      for (const it of list) items.push({ ...it, planTitle: p?.title, planId: p?.id });
    } else if (p && p.status != null && (p.progress != null || p.target != null || p.targetBatches != null)) {
      items.push({ ...p, planTitle: p?.title, planId: p?.id });
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

function isPending(req) {
  const s = String(req?.status || '').toUpperCase();
  return s === 'RAISED' || s === 'UNDER_REVIEW' || s === 'DRAFT';
}

function isLive(it) {
  const s = String(it?.status || '').toUpperCase();
  return s === 'IN_PROGRESS' || s === 'ASSIGNED' || s === 'APPROVED';
}

registerRoute('/centre/dashboard', {
  title: 'Dashboard',
  roles: ['TRAINING_CENTRE'],
  render(container) {
    container.replaceChildren(pageTitle(
      'Training Centre',
      'Centre Dashboard',
      'Your assigned actions, progress and pending requests — everything you need to deliver.'));

    const body = el('div', {});
    container.append(body);
    body.replaceChildren(loadingState('Loading your dashboard…'));

    async function load() {
      let plans, requests;
      try {
        [plans, requests] = await Promise.all([api.actionPlans(), api.requests()]);
      } catch (err) {
        body.replaceChildren(errorState(err.message || 'Could not load dashboard', load));
        return;
      }

      const items = collectItems(Array.isArray(plans) ? plans : (plans?.actionPlans ?? plans?.plans ?? []));
      const live = items.filter(isLive);
      const pending = (Array.isArray(requests) ? requests : (requests?.requests ?? [])).filter(isPending);
      const avg = items.length
        ? Math.round(items.reduce((a, it) => a + itemProgress(it), 0) / items.length)
        : 0;

      body.replaceChildren(
        statCards([
          { label: 'Assigned actions', value: items.length },
          { label: 'In execution', value: live.length },
          { label: 'Pending requests', value: pending.length },
          { label: 'Average progress', value: `${avg}%` },
        ]),
        card('Assigned actions', 'Actions assigned to your centre — click one to update progress.',
          items.length
            ? el('div', {}, items.map((it) => listRow({
                title: it?.title || it?.name || 'Untitled action',
                meta: el('div', {},
                  el('span', {}, it?.planTitle ? `${it.planTitle} · ` : ''),
                  el('span', {}, `Progress ${itemProgress(it)}%`)),
                right: el('div', { class: 'end', style: { display: 'flex', alignItems: 'center', gap: '10px' } },
                  statusPill(it?.status),
                  el('div', { style: { width: '90px' } }, progBar(itemProgress(it)))),
                onClick: () => { if (it?.id) location.hash = `#/centre/action/${it.id}`; },
              })))
            : emptyState('No actions assigned to your centre yet.')),
        card('Pending requests', 'Requests awaiting a response.',
          pending.length
            ? el('div', {}, pending.slice(0, 5).map((r) => listRow({
                title: r?.title || r?.type || 'Request',
                meta: r?.description || '',
                right: statusPill(r?.status),
              })))
            : emptyState('No pending requests.')));
    }

    load();
  },
});
