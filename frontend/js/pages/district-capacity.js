// District admin — training capacity overview.
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import { el, card, dataTable, emptyState, loadingState, errorState, badge } from '../components/ui.js';
import { myDistrict, asArray } from './district-shared.js';

registerRoute('/district/capacity', {
  title: 'Training Capacity',
  roles: ['DISTRICT_ADMIN'],
  async render(container) {
    container.replaceChildren(loadingState('Loading training capacity…'));
    try {
      const districtId = await myDistrict();
      const data = await api.districtSkillGaps(districtId);
      const gaps = asArray(data?.skillGaps ?? data?.gaps ?? data);
      // Derive centre-level rows from skill gap records (defensive field access).
      const rows = gaps.map((g) => {
        const capacity = g.trainingCapacity ?? g.capacity ?? null;
        const demand = g.demand ?? null;
        const shortage = (demand != null && capacity != null) ? Math.max(0, demand - capacity) : null;
        return {
          centre: g.trainingCentre?.name || g.trainingCentre || g.centre || g.centreName || 'District centres',
          role: g.jobRole?.name || g.jobRole || g.jobRoleName || '—',
          skill: g.skill?.name || g.skill || g.skillName || '—',
          capacity, demand, shortage,
        };
      });
      container.replaceChildren(card(
        'Training Capacity', 'Capacity vs demand, with derived shortage where both figures exist',
        rows.length
          ? dataTable([
              { key: 'centre', label: 'Training Centre' },
              { key: 'role', label: 'Job Role' },
              { key: 'skill', label: 'Skill' },
              { key: 'capacity', label: 'Capacity', render: (r) => r.capacity ?? '—' },
              { key: 'demand', label: 'Demand', render: (r) => r.demand ?? '—' },
              { key: 'shortage', label: 'Shortage', render: (r) => r.shortage != null ? badge(String(r.shortage)) : '—' },
            ], rows)
          : emptyState('No capacity data available')));
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load training capacity',
        () => this.render(container)));
    }
  },
});
