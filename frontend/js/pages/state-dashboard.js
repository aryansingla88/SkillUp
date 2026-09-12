// SkillUp — State Admin dashboard (Maharashtra-wide strategic view)
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import {
  el, card, statCards, chipRow, chip, listRow, loadingState, errorState, emptyState, sectionHead,
} from '../components/ui.js';

function render(container) {
  container.replaceChildren(loadingState('Loading state dashboard…'));
  api.stateDashboard()
    .then((d) => {
      const gaps = d?.criticalSkillGaps ?? d?.skillGaps ?? [];
      const emerging = d?.emergingSkills ?? [];
      const atRisk = d?.districtsAtRisk ?? [];
      const mismatches = d?.curriculumMismatches ?? [];
      const sectors = d?.highGrowthSectors ?? [];
      const priorities = d?.districtPriorities ?? d?.topDistrictPriorities ?? [];

      container.replaceChildren(
        statCards([
          { label: 'Critical Skill Gaps', value: d?.criticalGapCount ?? gaps.length },
          { label: 'Emerging Skills', value: d?.emergingSkillCount ?? emerging.length },
          { label: 'Districts at Risk', value: d?.districtsAtRiskCount ?? atRisk.length },
          { label: 'Curriculum Mismatches', value: d?.curriculumMismatchCount ?? mismatches.length },
        ]),

        card('High-Growth Sectors', 'Sectors with rising demand across Maharashtra',
          sectors.length
            ? chipRow(sectors.map((s) => (typeof s === 'string' ? chip(s, true) : chip(s?.name || s?.sector || '—', true))))
            : emptyState('No sector data available yet')),

        card('Top District Priorities', 'Click a district to review its priority detail',
          priorities.length
            ? priorities.map((p) => listRow({
                title: p?.districtName || p?.district || '—',
                meta: p?.reason || p?.summary || '',
                score: p?.priorityScore ?? p?.score,
                onClick: () => navigate('/state/priorities'),
              }))
            : emptyState('No district priorities computed yet')),

        el('div', { class: 'grid' },
          card('Emerging Skills', 'New demand signals appearing across districts',
            emerging.length
              ? chipRow(emerging.map((s) => chip(s?.name || (typeof s === 'string' ? s : '—'))))
              : emptyState('No emerging skills detected yet')),
          card('Critical Gaps', 'Skills in short supply statewide',
            gaps.length
              ? gaps.map((g) => listRow({
                  title: g?.skillName || g?.skill || g?.name || '—',
                  meta: g?.districtName || g?.sectorName || '',
                  right: g?.severity || g?.level || '',
                }))
              : emptyState('No critical gaps recorded'))));
    })
    .catch((err) => {
      container.replaceChildren(errorState(err.message || 'Could not load the state dashboard',
        () => render(container)));
    });
}

registerRoute('/state/dashboard', { title: 'State Dashboard', roles: ['STATE_ADMIN'], render });
