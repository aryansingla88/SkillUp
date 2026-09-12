// SkillUp — State skill trends (ranked emerging-skill growth view)
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  card, chip, loadingState, errorState, emptyState, dataTable, badge, hbars,
} from '../components/ui.js';

function render(container) {
  container.replaceChildren(loadingState('Loading skill trends…'));
  api.stateDashboard()
    .then((d) => {
      const trends = (d?.emergingSkills ?? d?.skillTrends ?? [])
        .map((s) => ({
          skill: s?.name || s?.skillName || '—',
          growth: s?.growthPct ?? s?.growth ?? s?.growthPercent ?? null,
          roles: s?.affectedRoles ?? s?.roles ?? [],
          sector: s?.sectorName || s?.sector || '',
        }))
        .sort((a, b) => (b.growth ?? 0) - (a.growth ?? 0));

      if (!trends.length) {
        container.replaceChildren(card('Skill Trends', 'Emerging skills ranked by growth',
          emptyState('No trend data available yet')));
        return;
      }

      const growthRows = trends
        .filter((t) => t.growth != null && Number.isFinite(Number(t.growth)))
        .slice(0, 8)
        .map((t) => ({ label: t.skill, value: Number(t.growth), display: `+${t.growth}%` }));
      container.replaceChildren(
        card('Skills Growing Fastest', 'Where the Maharashtra market is moving — demand growth by skill',
          growthRows.length ? hbars(growthRows, { valueLabel: '%' })
            : emptyState('No growth figures available yet')),
        card('Ranked Skill Trends', 'Emerging skills sorted by growth rate',
          dataTable([
            { key: 'rank', label: '#', width: '40px', render: (r, i) => String(i + 1) },
            { key: 'skill', label: 'Skill' },
            { key: 'growth', label: 'Growth', width: '90px', render: (r) => (r.growth == null ? '—' : `+${r.growth}%`) },
            {
              key: 'roles', label: 'Affected Roles', render: (r) =>
                (r.roles || []).slice(0, 3).map((x) => (typeof x === 'string' ? x : x?.title || x?.name || ''))
                  .filter(Boolean).join(', ') || '—',
            },
            { key: 'sector', label: 'Sector', width: '130px', render: (r) => r.sector || '—' },
          ], trends)),
        card('Fastest Growing', 'Top movers this period',
          trends.filter((t) => t.growth != null).slice(0, 5)
            .map((t) => chip(`${t.skill} +${t.growth}%`, true))));
    })
    .catch((err) => {
      container.replaceChildren(errorState(err.message || 'Could not load skill trends',
        () => render(container)));
    });
}

registerRoute('/state/trends', { title: 'Skill Trends', roles: ['STATE_ADMIN'], render });
