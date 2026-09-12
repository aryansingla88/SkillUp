// SkillUp — District coordination (state view of cross-district requests)
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  card, loadingState, errorState, emptyState, dataTable, statusPill,
} from '../components/ui.js';

function render(container) {
  container.replaceChildren(loadingState('Loading coordination requests…'));
  api.requests()
    .then((list) => {
      const rows = (list ?? []).map((r) => ({
        id: r?.id,
        request: r?.title || r?.subject || r?.description || '—',
        district: r?.districtName || r?.district || '—',
        action: r?.relatedAction || r?.action || r?.actionPlanTitle || '',
        owner: r?.responsibleParty || r?.owner || r?.assignedTo || '—',
        status: r?.status || 'RAISED',
      }));

      container.replaceChildren(
        card('District Coordination', 'Requests raised by districts and their current status',
          rows.length
            ? dataTable([
                { key: 'request', label: 'Request' },
                { key: 'district', label: 'District', width: '130px' },
                { key: 'action', label: 'Related Action', width: '160px' },
                { key: 'owner', label: 'Responsible Party', width: '150px' },
                { key: 'status', label: 'Status', width: '120px', render: (r) => statusPill(r.status) },
              ], rows)
            : emptyState('No coordination requests yet')));
    })
    .catch((err) => {
      container.replaceChildren(errorState(err.message || 'Could not load coordination requests',
        () => render(container)));
    });
}

registerRoute('/state/coordination', { title: 'District Coordination', roles: ['STATE_ADMIN'], render });
