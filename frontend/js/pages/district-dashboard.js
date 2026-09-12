// District admin — dashboard.
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import {
  el, card, statCards, listRow, emptyState, loadingState, errorState,
  sectionHead, progressMetrics, statusPill, badge,
} from '../components/ui.js';
import { myDistrict, asArray } from './district-shared.js';

registerRoute('/district/dashboard', {
  title: 'District Dashboard',
  roles: ['DISTRICT_ADMIN'],
  async render(container) {
    container.replaceChildren(loadingState('Loading district dashboard…'));
    let districtId;
    try {
      districtId = await myDistrict();
      if (!districtId) throw new Error('No district assigned to your account');
      const d = await api.districtDashboard(districtId);
      renderDash(container, districtId, d || {});
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load dashboard',
        () => this.render(container)));
    }
  },
});

function renderDash(container, districtId, d) {
  const gaps = asArray(d.skillGaps ?? d.gaps);
  const recs = asArray(d.pendingRecommendations ?? d.recommendations).filter(
    (r) => (r.status || '').toUpperCase() === 'DRAFT' || (r.status || '').toUpperCase() === 'PENDING');
  const plans = asArray(d.actionPlans).filter(
    (p) => ['APPROVED', 'IN_PROGRESS'].includes((p.status || '').toUpperCase()));
  const critical = gaps.filter((g) => (g.priority ?? g.priorityScore ?? 0) >= 75);

  const alerts = asArray(d.alerts).map((a) => el('div', { class: 'alert' },
    el('div', { class: a.severity === 'HIGH' ? 'dot orange' : 'dot' }),
    el('div', {}, el('b', {}, a.title || a.message || 'Alert'),
      el('p', {}, a.detail || a.description || ''))));

  const metrics = asArray(d.progressMetrics).map((m) => ({
    label: m.label || m.metric, current: m.current ?? 0, target: m.target ?? 0,
  }));

  container.replaceChildren(
    el('div', { style: { marginBottom: '18px' } },
      statCards([
        { label: 'Critical Gaps', value: d.criticalGaps ?? critical.length },
        { label: 'Priority Skills', value: d.prioritySkills ?? gaps.length },
        { label: 'Training Capacity', value: d.trainingCapacity ?? d.totalCapacity ?? '—' },
        { label: 'Pending Recommendations', value: d.pendingRecommendationsCount ?? recs.length },
        { label: 'Active Action Plans', value: d.activeActionPlans ?? plans.length },
      ])),

    card('Priority Skill Gaps', 'Highest priority gaps in your district — click to inspect',
      gaps.length
        ? gaps.slice(0, 6).map((g) => listRow({
            title: g.skill?.name || g.skill || g.skillName || 'Skill',
            meta: `${g.jobRole?.name || g.jobRole || g.jobRoleName || 'Role'} · Gap: ${g.gap ?? g.gapSize ?? '—'}`,
            score: g.priorityScore ?? g.priority,
            onClick: () => navigate(`/gap/${districtId}/${g.id}`),
          }))
        : emptyState('No skill gap data available')),

    card('Implementation Progress', 'Delivery across active action plans',
      metrics.length
        ? progressMetrics(metrics)
        : emptyState('No implementation progress to show')),

    card('Alerts', null,
      alerts.length ? alerts : emptyState('No alerts right now')),

    card('Pending Recommendations', 'System suggestions awaiting your decision',
      recs.length
        ? recs.map((r) => listRow({
            title: r.title || 'Recommendation',
            meta: `${r.type || ''} · Priority ${r.priorityScore ?? r.priority ?? '—'}`,
            right: statusPill(r.status),
            onClick: () => navigate(`/recommendation/${r.id}`),
          }))
        : emptyState('No pending recommendations')),

    card('Active Action Plans', null,
      plans.length
        ? plans.map((p) => listRow({
            title: p.title || 'Action plan',
            meta: `${p.progress ?? 0}% complete`,
            right: statusPill(p.status),
            onClick: () => navigate(`/action-plan/${p.id}`),
          }))
        : emptyState('No active action plans')));
}
