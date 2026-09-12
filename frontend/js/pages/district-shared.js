// Shared helpers for district admin pages.
import { api } from '../api.js';
import { getUser } from '../state.js';
import { el, btn } from '../components/ui.js';

// Resolve the current user's district id; fallback to the first district.
export async function myDistrict() {
  const user = getUser() || {};
  if (user.districtId) return user.districtId;
  if (user.district && user.district.id) return user.district.id;
  const list = await api.districts();
  const first = (Array.isArray(list) ? list : list?.districts || [])[0];
  return first?.id ?? null;
}

export function backLink(label, path) {
  return el('div', { style: { marginBottom: '14px' } },
    btn(`← ${label}`, { class: 'ghost small', onClick: () => { location.hash = `#${path}`; } }));
}

export function asArray(x) {
  if (Array.isArray(x)) return x;
  if (x == null) return [];
  return [x];
}
