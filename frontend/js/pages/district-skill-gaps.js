// District admin — skill gap intelligence table.
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import { el, card, dataTable, loadingState, errorState, badge, pairedBars, barLegend, quadrantMatrix } from '../components/ui.js';
import { myDistrict, asArray } from './district-shared.js';

registerRoute('/district/skill-gaps', {
  title: 'Skill Gap Intelligence',
  roles: ['DISTRICT_ADMIN'],
  async render(container) {
    container.replaceChildren(loadingState('Loading skill gaps…'));
    try {
      const districtId = await myDistrict();
      if (!districtId) throw new Error('No district assigned to your account');
      const data = await api.districtSkillGaps(districtId);
      const gaps = asArray(data?.skillGaps ?? data?.gaps ?? data);
      const chartRows = gaps
        .map((g) => {
          const skill = g?.skill?.name || g?.skill || g?.skillName || 'Skill';
          const role = g?.jobRole?.name || g?.jobRole || g?.jobRoleName || '';
          return {
            label: role ? `${skill} · ${role}` : skill,
            gapRef: g,
            a: Number(g?.demand ?? NaN),
          b: Number(g?.trainingCapacity ?? g?.capacity ?? NaN),
            gap: g?.gap != null ? String(g.gap) : (Number.isFinite(Number(g?.demand)) && Number.isFinite(Number(g?.trainingCapacity ?? g?.capacity)) ? String(Number(g.demand) - Number(g.trainingCapacity ?? g.capacity)) : null),
          };
        })
        .filter((r) => Number.isFinite(r.a) && Number.isFinite(r.b))
        .sort((x, y) => (y.a - y.b) - (x.a - x.b))
        .slice(0, 6);
      const maxDemand = Math.max(...chartRows.map((r) => r.a), 0) || 1;
      const maxShort = Math.max(...chartRows.map((r) => r.a - r.b), 0) || 1;
      const dots = chartRows.map((r) => ({
        label: r.label,
        x: Math.round((r.a / maxDemand) * 100),
        y: Math.round(((r.a - r.b) / maxShort) * 100),
        tinyLabel: r.label.split('·')[0].trim().slice(0, 12),
        onClick: () => navigate(`/gap/${districtId}/${r.gapRef?.id ?? gaps.indexOf(r.gapRef)}`),
      }));
      container.replaceChildren(
        card('Demand vs Training Supply', 'Where the district needs intervention most — required workers vs trained capacity',
          barLegend('Demand', 'Training capacity'),
          gaps.length && chartRows.length
            ? pairedBars(chartRows, { aName: 'Demand', bName: 'Capacity' })
            : el('div', { class: 'empty' }, 'No demand/capacity figures to chart yet')),
        card('Priority Matrix', 'Demand (→) vs shortage (↑) — top-right gaps need training now. Click a dot to open the gap.',
          quadrantMatrix(dots, { xLabel: 'Demand', yLabel: 'Shortage' })),
        card(
        'Skill Gaps', 'Demand vs training capacity across roles in your district',
        gaps.length
          ? dataTable([
              { key: 'jobRole', label: 'Job Role', render: (r) => r.jobRole?.name || r.jobRole || r.jobRoleName || '—' },
              { key: 'skill', label: 'Skill', render: (r) => r.skill?.name || r.skill || r.skillName || '—' },
              { key: 'demand', label: 'Demand', render: (r) => r.demand ?? '—' },
              { key: 'capacity', label: 'Training Capacity', render: (r) => r.trainingCapacity ?? r.capacity ?? '—' },
              { key: 'gap', label: 'Gap', render: (r) => badge(String(r.gap ?? r.gapSize ?? '—')) },
              { key: 'score', label: 'Priority Score', render: (r) => `${r.priorityScore ?? r.priority ?? '—'}` },
              { key: 'growth', label: 'Demand Growth', render: (r) => r.demandGrowth != null ? `${r.demandGrowth}%` : '—' },
            ], gaps, { onRow: (r) => navigate(`/gap/${districtId}/${r.id ?? gaps.indexOf(r)}`) })
          : el('div', { class: 'empty' }, 'No skill gap data available')));
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load skill gaps',
        () => this.render(container)));
    }
  },
});
