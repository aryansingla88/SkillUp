// District admin — labour market intelligence (view only).
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, card, statCards, listRow, emptyState, loadingState, errorState, badge,
} from '../components/ui.js';
import { myDistrict, asArray } from './district-shared.js';

registerRoute('/district/labour-market', {
  title: 'Labour Market',
  roles: ['DISTRICT_ADMIN'],
  async render(container) {
    container.replaceChildren(loadingState('Loading labour market intelligence…'));
    try {
      const districtId = await myDistrict();
      const [gapData, rolesData, skillsData, sectorsData] = await Promise.all([
        api.districtSkillGaps(districtId),
        api.jobRoles().catch(() => []),
        api.skills().catch(() => []),
        api.sectors().catch(() => []),
      ]);
      const gaps = asArray(gapData?.skillGaps ?? gapData?.gaps ?? gapData);
      const roles = asArray(rolesData?.jobRoles ?? rolesData);
      const skills = asArray(skillsData?.skills ?? skillsData);
      const sectors = asArray(sectorsData?.sectors ?? sectorsData);

      const byRole = {};
      gaps.forEach((g) => {
        const name = g.jobRole?.name || g.jobRole || g.jobRoleName || 'Other';
        byRole[name] = (byRole[name] || 0) + (Number(g.demand) || 0);
      });
      const roleRows = Object.entries(byRole).sort((a, b) => b[1] - a[1]);
      const topSkills = [...gaps].sort((a, b) =>
        (b.priorityScore ?? b.priority ?? 0) - (a.priorityScore ?? a.priority ?? 0));

      const bySector = {};
      gaps.forEach((g) => {
        const s = g.sector || g.sectorName || 'Other';
        bySector[s] = (bySector[s] || 0) + (Number(g.demand) || 0);
      });

      container.replaceChildren(
        el('div', { style: { marginBottom: '16px' } }, statCards([
          { label: 'Job Roles Tracked', value: roles.length || roleRows.length },
          { label: 'Skills Tracked', value: skills.length || topSkills.length },
          { label: 'Sectors Covered', value: sectors.length || Object.keys(bySector).length },
        ])),
        card('High-Demand Job Roles', 'Aggregate demand across skill gaps',
          roleRows.length
            ? roleRows.map(([name, demand]) => listRow({
                title: name, meta: `Total demand: ${demand}`, right: badge(`${demand}`) }))
            : emptyState('No demand data available')),
        card('In-Demand Skills', 'Ranked by priority score',
          topSkills.length
            ? topSkills.slice(0, 10).map((g) => listRow({
                title: g.skill?.name || g.skill || g.skillName || 'Skill',
                meta: `Growth ${g.demandGrowth != null ? `${g.demandGrowth}%` : '—'} · Future demand ${g.futureDemand ?? '—'}`,
                score: g.priorityScore ?? g.priority,
              }))
            : emptyState('No skill demand signals')),
        card('Demand by Sector', null,
          Object.keys(bySector).length
            ? Object.entries(bySector).sort((a, b) => b[1] - a[1]).map(([name, demand]) =>
                listRow({ title: name, meta: `Demand ${demand}`, right: badge(`${demand}`) }))
            : emptyState('No sector demand data')));
    } catch (err) {
      container.replaceChildren(errorState(err.message || 'Could not load labour market data',
        () => this.render(container)));
    }
  },
});
