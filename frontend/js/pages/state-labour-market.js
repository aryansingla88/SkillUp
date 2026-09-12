// SkillUp — State labour market intelligence (Maharashtra-wide)
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, card, chip, chipRow, listRow, bar, loadingState, errorState, emptyState, formField, sectionHead,
  pairedBars, barLegend, fmtNum, cardHead,
} from '../components/ui.js';

function roleList(roles, title, desc) {
  return card(title, desc,
    roles.length
      ? roles.slice(0, 8).map((r) => listRow({
          title: r?.title || r?.name || '—',
          meta: r?.sectorName || r?.sector || '',
          right: r?.demandLevel || r?.demand || '',
        }))
      : emptyState('No role data available'));
}

function render(container) {
  container.replaceChildren(loadingState('Loading labour market intelligence…'));

  const filters = { sector: 'All', district: 'All' };

  const content = el('div', {});
  container.replaceChildren(content);

  Promise.allSettled([api.stateDashboard(), api.districts(), api.jobRoles(), api.skills(), api.sectors()])
    .then(([dashRes, distRes, rolesRes, skillsRes, sectorsRes]) => {
      if (dashRes.status === 'rejected' && rolesRes.status === 'rejected') {
        content.replaceChildren(errorState('Could not load labour market data',
          () => render(container)));
        return;
      }
      const dash = dashRes.status === 'fulfilled' ? dashRes.value : {};
      const districts = distRes.status === 'fulfilled' ? (distRes.value ?? []) : [];
      const roles = rolesRes.status === 'fulfilled' ? (rolesRes.value ?? []) : [];
      const skills = skillsRes.status === 'fulfilled' ? (skillsRes.value ?? []) : [];
      const sectors = sectorsRes.status === 'fulfilled' ? (sectorsRes.value ?? []) : [];

      const sectorNames = [...new Set(sectors.map((s) => s?.name || (typeof s === 'string' ? s : null)).filter(Boolean))];
      const districtSel = el('select', { class: 'inp', style: { maxWidth: '220px' } },
        el('option', { value: 'All' }, 'All districts'),
        districts.map((d) => el('option', { value: String(d?.id ?? d?.name) }, d?.name || String(d?.id))));

      const paint = () => {
        const sectorOk = (name) =>
          filters.sector === 'All' || String(name || '').toLowerCase().includes(filters.sector.toLowerCase());

        const demandRoles = roles.filter((r) => sectorOk(r?.sectorName || r?.sector));
        const hotSkills = skills.filter((s) => sectorOk(s?.sectorName || s?.sector)).slice(0, 10);
        const bySector = sectors.map((s) => {
          const n = s?.name || (typeof s === 'string' ? s : '—');
          const count = roles.filter((r) => (r?.sectorName || r?.sector) === n).length;
          return { name: n, count };
        }).filter((s) => s.count > 0 || filters.sector === 'All');

        content.replaceChildren(
          card('Filters', 'Narrow the statewide view by sector or district',
            el('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' } },
              formField('Sector', chipRow([
                chip(filters.sector === 'All' ? '● All' : 'All'),
                ...sectorNames.map((n) => chip(n, n === filters.sector)),
              ])),
              el('div', { class: 'field', style: { minWidth: '220px' } },
                el('label', {}, 'District'), districtSel))),

          el('div', { class: 'grid' },
            roleList(demandRoles, 'High-Demand Job Roles', 'Roles with strongest current demand'),
            card('High-Demand Skills', 'Skills most requested by employers',
              hotSkills.length
                ? chipRow(hotSkills.map((s) => chip(s?.name || '—', true)))
                : emptyState('No skill demand data'))),

          el('div', { class: 'grid' },
            card('Demand by Sector', 'Role counts per sector',
              bySector.length
                ? bySector.map((s) => el('div', { style: { marginBottom: '10px' } },
                    el('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' } },
                      el('b', {}, s.name), el('span', { class: 'muted' }, `${s.count} roles`)),
                    bar(Math.min(100, s.count * 12))))
                : emptyState('No sector demand data')),
            card('Future-Demand Indicators', 'Signals from the state dashboard',
              (dash?.futureDemandIndicators ?? dash?.futureDemand ?? []).length
                ? (dash.futureDemandIndicators ?? dash.futureDemand).map((f) => listRow({
                    title: f?.skillName || f?.role || f?.name || '—',
                    meta: f?.signal || f?.note || '',
                    right: f?.direction || '↑',
                  }))
                : emptyState('No future-demand signals yet'))));
      };

      content.addEventListener('click', (e) => {
        const c = e.target.closest('.chip');
        if (!c) return;
        const t = c.textContent.replace('● ', '').trim();
        filters.sector = t === 'All' ? 'All' : t;
        paint();
      });
      districtSel.addEventListener('change', () => { filters.district = districtSel.value; });
      paint();

      // Demand vs trained supply, aggregated across districts.
      const gapCard = card('Demand vs Trained Supply', 'Top skills statewide — required workers vs current training capacity',
        loadingState('Aggregating district data…'));
      content.append(gapCard);
      const distIds = districts.map((d) => d?.id).filter((id) => id != null);
      if (!distIds.length) {
        gapCard.replaceChildren(emptyState('No district data available to aggregate.'));
        return;
      }
      Promise.allSettled(distIds.map((id) => api.districtSkillGaps(id)))
        .then((results) => {
          const bySkill = new Map();
          for (const res of results) {
            if (res.status !== 'fulfilled' || !res.value) continue;
            const gaps = Array.isArray(res.value) ? res.value : (res.value?.skillGaps ?? res.value?.gaps ?? []);
            for (const g of gaps || []) {
              const skill = g?.skill?.name || g?.skill || g?.skillName;
              if (!skill) continue;
              const cur = bySkill.get(skill) || { label: skill, a: 0, b: 0 };
              cur.a += Number(g?.demand) || 0;
              cur.b += Number(g?.trainingCapacity ?? g?.capacity) || 0;
              bySkill.set(skill, cur);
            }
          }
          const chartRows = [...bySkill.values()]
            .map((r) => ({ ...r, gap: Math.max(0, r.a - r.b), aDisplay: fmtNum(r.a), bDisplay: fmtNum(r.b) }))
            .sort((x, y) => (y.a + y.b) - (x.a + x.b))
            .slice(0, 6);
          gapCard.replaceChildren(
            cardHead('Demand vs Trained Supply', 'Top skills statewide — required workers vs current training capacity'),
            barLegend('Demand', 'Trained supply'),
            chartRows.length
              ? pairedBars(chartRows, { aName: 'Demand', bName: 'Trained supply' })
              : emptyState('No demand/capacity figures reported by districts yet'));
        });
    });
}

registerRoute('/state/labour-market', { title: 'Labour Market Intelligence', roles: ['STATE_ADMIN'], render });
