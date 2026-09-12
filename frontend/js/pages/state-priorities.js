// SkillUp — District priorities (state view) + read-only district intel route
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import {
  el, card, chipRow, chip, statCards, listRow, loadingState, errorState, emptyState, dataTable, statusPill,
  heatmap,
} from '../components/ui.js';

// Map a severity / priorityScore to a heatmap level.
function levelOf(gap, districtScore) {
  const sev = String(gap?.severity || gap?.level || gap?.gapLevel || '').toUpperCase();
  if (sev) {
    if (sev.includes('CRIT')) return 'Critical';
    if (sev.includes('HIGH')) return 'High';
    if (sev.includes('MED')) return 'Medium';
    if (sev.includes('LOW')) return 'Low';
  }
  const score = Number(gap?.priorityScore ?? gap?.score ?? districtScore ?? 0) || 0;
  if (score >= 90) return 'Critical';
  if (score >= 75) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

function gapName(g) {
  return (typeof g === 'string' ? g : (g?.skillName || g?.skill?.name || g?.name || '')) || '';
}

function prioritiesPage(container) {
  container.replaceChildren(loadingState('Loading district priorities…'));
  api.stateDashboard()
    .then((d) => {
      const rows = (d?.districtPriorities ?? d?.topDistrictPriorities ?? []).map((p) => ({
        id: p?.districtId ?? p?.id,
        district: p?.districtName || p?.district || '—',
        score: p?.priorityScore ?? p?.score ?? null,
        gaps: p?.majorSkillGaps ?? p?.skillGaps ?? [],
        demand: p?.demand ?? p?.demandLevel ?? '',
        capacity: p?.trainingCapacity ?? p?.capacity ?? '',
        growth: p?.growthSignal ?? p?.growth ?? '',
        reason: p?.reason || '',
      }));

      if (!rows.length) {
        container.replaceChildren(card('District Priorities', 'Ranked by priority score',
          emptyState('No district priorities computed yet')));
        return;
      }

      const heatHolder = el('div', {});
      container.replaceChildren(
        card('District Gap Heatmap', 'Major skill gaps by district — darker cells need urgent action',
          heatHolder),
        card('District Priorities', 'Click a row for a read-only district view',
          dataTable([
            { key: 'district', label: 'District' },
            { key: 'score', label: 'Priority', width: '80px', render: (r) => (r.score == null ? '—' : `${r.score}%`) },
            {
              key: 'gaps', label: 'Major Skill Gaps', render: (r) =>
                (r.gaps || []).slice(0, 3).map((g) => (typeof g === 'string' ? g : g?.skillName || g?.name || ''))
                  .filter(Boolean).join(', ') || '—',
            },
            { key: 'demand', label: 'Demand', width: '90px' },
            { key: 'capacity', label: 'Training Capacity', width: '110px' },
            { key: 'growth', label: 'Growth Signal', width: '100px' },
            { key: 'reason', label: 'Reason for Priority' },
          ], rows, { onRow: (r) => { if (r.id != null) navigate(`/district-intel/${r.id}`); } })));

      // Build heatmap rows: prefer per-district gap lists from the payload,
      // else fetch each district's skill gaps and take the top 4.
      const withGaps = rows.filter((r) => Array.isArray(r.gaps) && r.gaps.length &&
        r.gaps.some((g) => (typeof g === 'string' ? g : (g?.skillName || g?.skill?.name || g?.name))));
      const buildRows = (resolved) => resolved.map((r) => ({
        district: r.district,
        cells: (r.gaps || []).slice(0, 4).map((g) => ({
          skill: gapName(g),
          label: String(levelOf(g, r.score)).slice(0, 1),
          level: levelOf(g, r.score),
        })).filter((c) => c.skill),
      })).filter((r) => r.cells.length);

      if (withGaps.length) {
        heatHolder.replaceChildren(heatmap(buildRows(withGaps)));
      } else {
        heatHolder.replaceChildren(loadingState('Loading district gap detail…'));
        Promise.allSettled(rows.map((r) =>
          r.id != null ? api.districtSkillGaps(r.id).then((d) => ({ r, d })) : Promise.reject(new Error('no id'))))
          .then((results) => {
            const resolved = [];
            for (const res of results) {
              if (res.status !== 'fulfilled') continue;
              const gaps = Array.isArray(res.value.d) ? res.value.d
                : (res.value.d?.skillGaps ?? res.value.d?.gaps ?? []);
              resolved.push({ ...res.value.r, gaps: gaps.slice(0, 4) });
            }
            const built = buildRows(resolved);
            heatHolder.replaceChildren(built.length
              ? heatmap(built)
              : emptyState('No per-district gap detail available yet'));
          });
      }
    })
    .catch((err) => {
      container.replaceChildren(errorState(err.message || 'Could not load district priorities',
        () => prioritiesPage(container)));
    });
}

function districtIntelPage(container, params) {
  const id = params?.districtId;
  container.replaceChildren(loadingState('Loading district intelligence…'));
  api.districtDashboard(id)
    .then((d) => {
      const gaps = d?.skillGaps ?? [];
      const roles = d?.topRoles ?? d?.demandRoles ?? [];
      const curricula = d?.curricula ?? [];
      container.replaceChildren(
        el('div', { class: 'label' }, 'District Intelligence (read-only)'),
        el('h1', {}, d?.districtName || d?.name || `District ${id}`),
        el('div', { class: 'sub' }, 'Read-only view for state review — make changes in the district portal.'),
        statCards([
          { label: 'Skill Gaps', value: d?.skillGapCount ?? gaps.length },
          { label: 'Curricula', value: curricula.length },
          { label: 'Priority Score', value: d?.priorityScore ?? '—' },
        ]),
        el('div', { class: 'grid' },
          card('Skill Gaps', 'Recorded gaps in this district',
            gaps.length
              ? gaps.map((g) => listRow({
                  title: g?.skillName || g?.skill || g?.name || '—',
                  meta: g?.sectorName || '',
                  right: g?.severity || '',
                }))
              : emptyState('No skill gaps recorded')),
          card('In-Demand Roles', 'Roles employers are asking for',
            roles.length
              ? roles.map((r) => listRow({
                  title: r?.title || r?.name || '—',
                  meta: r?.sectorName || '',
                  right: r?.demand || '',
                }))
              : emptyState('No role demand data'))));
    })
    .catch((err) => {
      container.replaceChildren(errorState(err.message || 'Could not load this district',
        () => districtIntelPage(container, params)));
    });
}

registerRoute('/state/priorities', { title: 'District Priorities', roles: ['STATE_ADMIN'], render: prioritiesPage });
registerRoute('/district-intel/:districtId', { title: 'District Intelligence (read-only)', roles: ['STATE_ADMIN'], render: districtIntelPage });
