// SkillUp — candidate career matches: role cards with match %, matched and
// missing skills, a simple explanation, and "Set as Goal".
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import {
  el, card, chip, chipRow, emptyState, loadingState, errorState, btn, bar, toast,
} from '../components/ui.js';
import { pick, nameOf, idOf, careerValueRow } from './candidate-util.js';

function matchesOf(d) {
  return d?.matches ?? d?.careerMatches ?? d?.topMatches ?? [];
}

function matchPct(m) {
  return Math.round(Number(pick(m, ['matchPercent', 'matchPercentage', 'matchScore', 'score', 'percent'], 0)) || 0);
}

function matchedOf(m) {
  const v = m?.matchedSkills ?? m?.matched ?? m?.skillsMatched ?? [];
  return Array.isArray(v) ? v : [];
}

function missingOf(m) {
  const v = m?.missingSkills ?? m?.missing ?? m?.skillGaps ?? [];
  return Array.isArray(v) ? v : [];
}

function explain(m) {
  const own = pick(m, ['reason', 'why', 'summary', 'explanation'], null);
  if (own) return own;
  const have = matchedOf(m).length;
  const miss = missingOf(m).length;
  const total = have + miss;
  if (!total) return 'Add your skills to see why this role matches you.';
  if (!miss) return `You have all ${total} key skill${total === 1 ? '' : 's'} this role needs.`;
  return `You already have ${have} of ${total} key skills this role needs. Learn the missing ${miss} to get closer.`;
}

function render(container) {
  container.replaceChildren(loadingState('Loading career matches…'));

  const load = () => api.candidateDashboard().then((d) => {
    const matches = matchesOf(d);

    const body = matches.length
      ? el('div', { class: 'grid two' },
          matches.map((m) => {
            const pct = matchPct(m);
            const role = pick(m, ['jobRole', 'role', 'career'], m) ?? {};
            const roleName = nameOf(role) || nameOf(m);
            const roleId = idOf(role) ?? pick(m, ['jobRoleId', 'roleId'], null);
            const setBtn = btn('Set as Goal', {
              class: 'dark small',
              onClick: () => {
                if (setBtn.disabled) return;
                setBtn.disabled = true;
                api.updateCandidateProfile({ targetJobRoleId: roleId })
                  .then(() => {
                    toast(`${roleName} set as your career goal`);
                    navigate('/candidate/goal');
                  })
                  .catch((err) => {
                    toast(err?.message || 'Could not set goal', 'err');
                    setBtn.disabled = false;
                  });
              },
            });
            return el('div', { class: 'box' },
              el('div', { class: 'ctop', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                el('div', {},
                  el('div', { style: { fontSize: '13px', fontWeight: 800 } }, roleName),
                  el('div', { class: 'score', style: { fontSize: '23px', fontWeight: 900, color: 'var(--green)' } }, `${pct}%`)),
                setBtn),
              el('div', { class: 'matchbar', style: { margin: '8px 0' } }, bar(pct)),
              careerValueRow(m),
              el('div', { style: { fontSize: '10px', color: 'var(--muted2)', margin: '6px 0' } }, explain(m)),
              matchedOf(m).length
                ? el('div', { style: { marginTop: '6px' } },
                    el('div', { class: 'blabel', style: { fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' } }, 'Matched Skills'),
                    chipRow(matchedOf(m).map((s) => chip(nameOf(pick(s, ['skill'], s))))))
                : null,
              missingOf(m).length
                ? el('div', { style: { marginTop: '6px' } },
                    el('div', { class: 'blabel', style: { fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' } }, 'Missing Skills'),
                    el('div', {}, missingOf(m).map((s) => el('span', { class: 'gapchip' }, nameOf(pick(s, ['skill'], s))))))
                : null);
          }))
      : emptyState('No career matches yet. Add your skills on the My Skills page so we can match you to roles.');

    container.replaceChildren(
      el('div', { class: 'card' },
        el('div', { class: 'head' },
          el('div', {},
            el('h2', {}, 'Career Matches'),
            el('div', { class: 'desc' }, 'Roles ranked by how well your current skills fit them')),
          btn('My Skills', { class: 'ghost small', onClick: () => navigate('/candidate/skills') })),
        body));
  }).catch((err) => {
    container.replaceChildren(errorState(err?.message || 'Could not load career matches', () => render(container)));
  });

  load();
}

registerRoute('/candidate/matches', {
  title: 'Career Matches',
  roles: ['CANDIDATE'],
  render,
});
