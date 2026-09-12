// SkillUp — State forecast / future demand (lightweight signal cards)
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, card, chipRow, chip, bar, loadingState, errorState, emptyState, sectionHead,
} from '../components/ui.js';

function render(container) {
  container.replaceChildren(loadingState('Loading demand forecast…'));
  api.stateDashboard()
    .then((d) => {
      const signals = (d?.futureDemandIndicators ?? d?.futureDemand ?? d?.forecast ?? []).map((f) => ({
        name: f?.skillName || f?.role || f?.name || '—',
        current: f?.currentDemand ?? f?.current ?? null,
        future: f?.futureDemand ?? f?.expected ?? null,
        direction: f?.direction || '↑',
        affectedSkills: f?.affectedSkills ?? [],
        affectedRoles: f?.affectedRoles ?? f?.roles ?? [],
        note: f?.signal || f?.note || '',
      }));

      if (!signals.length) {
        container.replaceChildren(card('Forecast / Future Demand', 'Expected demand direction by skill and role',
          emptyState('No forecast signals available yet')));
        return;
      }

      const maxVal = Math.max(1, ...signals.map((s) => Math.max(s.current ?? 0, s.future ?? 0)));

      container.replaceChildren(
        sectionHead('Forecast / Future Demand', 'Directional demand signals — not measured outcomes'),
        el('div', { class: 'grid' },
          signals.map((s) => card(null, null,
            el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              el('b', { style: { fontSize: '13px' } }, s.name),
              el('span', { class: 'pill ok' }, `${s.direction} Rising`)),
            s.note ? el('div', { class: 'muted', style: { fontSize: '10px', margin: '6px 0' } }, s.note) : null,
            el('div', { style: { margin: '10px 0 4px' } },
              el('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '3px' } },
                el('span', {}, 'Current demand'), el('b', {}, s.current == null ? '—' : String(s.current))),
              bar(Math.round(((s.current ?? 0) / maxVal) * 100)),
              el('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', margin: '8px 0 3px' } },
                el('span', {}, 'Future demand'), el('b', {}, s.future == null ? '—' : String(s.future))),
              bar(Math.round(((s.future ?? 0) / maxVal) * 100))),
            (s.affectedSkills.length || s.affectedRoles.length)
              ? chipRow([
                  ...s.affectedSkills.slice(0, 4).map((x) => chip(typeof x === 'string' ? x : x?.name || '—')),
                  ...s.affectedRoles.slice(0, 3).map((x) => chip(typeof x === 'string' ? x : x?.title || '—', true)),
                ])
              : null))));
    })
    .catch((err) => {
      container.replaceChildren(errorState(err.message || 'Could not load the forecast',
        () => render(container)));
    });
}

registerRoute('/state/forecast', { title: 'Forecast / Future Demand', roles: ['STATE_ADMIN'], render });
