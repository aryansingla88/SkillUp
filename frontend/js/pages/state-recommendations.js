// SkillUp — State recommendations (read-and-review, links to shared detail route)
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import {
  el, card, chipRow, chip, loadingState, errorState, emptyState, dataTable, statusPill, badge,
} from '../components/ui.js';

const TYPE_TONES = { TRAINING: 'warn', CURRICULUM: 'info', STRATEGIC: 'darkp' };

function render(container) {
  container.replaceChildren(loadingState('Loading state recommendations…'));
  api.recommendations()
    .then((list) => {
      const recs = (list ?? []).map((r) => ({
        id: r?.id,
        type: r?.type || r?.category || 'STRATEGIC',
        what: r?.title || r?.what || r?.description || '—',
        why: r?.why || r?.rationale || '',
        area: r?.affectedArea || r?.districtName || r?.sectorName || 'Statewide',
        status: r?.status || 'DRAFT',
      }));

      if (!recs.length) {
        container.replaceChildren(card('State Recommendations', 'System-generated recommendations across Maharashtra',
          emptyState('No recommendations yet')));
        return;
      }

      const byType = (t) => recs.filter((r) => r.type.toUpperCase() === t);

      container.replaceChildren(
        chipRow(['TRAINING', 'CURRICULUM', 'STRATEGIC']
          .map((t) => chip(`${t} · ${byType(t).length}`, byType(t).length > 0))),
        ...['TRAINING', 'CURRICULUM', 'STRATEGIC'].map((t) => {
          const items = byType(t);
          if (!items.length) return null;
          return card(`${t} Recommendations`, null,
            items.map((r) => card(null, null,
              el('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' } },
                el('b', { style: { fontSize: '12px' } }, r.what),
                statusPill(r.status)),
              r.why ? el('p', { class: 'muted', style: { fontSize: '10px', margin: '6px 0' } }, r.why) : null,
              el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' } },
                badge(r.area),
                el('a', {
                  href: `#/recommendation/${r.id}`,
                  style: { fontSize: '11px', fontWeight: '700', color: 'inherit' },
                }, 'View detail →')))));
        }));
    })
    .catch((err) => {
      container.replaceChildren(errorState(err.message || 'Could not load recommendations',
        () => render(container)));
    });
}

registerRoute('/state/recommendations', { title: 'State Recommendations', roles: ['STATE_ADMIN'], render });
