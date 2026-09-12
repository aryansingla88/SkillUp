// SkillUp — candidate career goal: view current goal, pick a new one from job roles.
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, card, emptyState, loadingState, errorState, btn, toast, modal,
} from '../components/ui.js';
import { pick, nameOf, idOf } from './candidate-util.js';

// Detect which profile field holds the goal role id, based on profile shape.
function goalFieldOf(profile) {
  const candidates = ['targetJobRoleId', 'jobRoleId', 'careerGoalId', 'goalJobRoleId', 'targetRoleId'];
  for (const k of candidates) if (profile && profile[k] != null) return k;
  return 'targetJobRoleId';
}

function goalOf(profile) {
  return pick(profile, ['targetJobRole', 'jobRole', 'careerGoal', 'goalRole', 'targetRole'], null);
}

function render(container) {
  container.replaceChildren(loadingState('Loading your career goal…'));

  Promise.all([api.candidateProfile(), api.jobRoles()]).then(([profileData, rolesData]) => {
    const profile = profileData?.profile ?? profileData?.candidate ?? profileData ?? {};
    const roles = Array.isArray(rolesData) ? rolesData : (rolesData?.jobRoles ?? rolesData?.content ?? []);
    const field = goalFieldOf(profile);
    const goalObj = goalOf(profile);
    const goalId = profile[field] ?? idOf(goalObj);
    const goalName = nameOf(goalObj) || nameOf(roles.find((r) => idOf(r) === goalId)) || null;

    const changeBtn = btn('Change Goal', {
      class: 'ghost small',
      onClick: () => {
        let pending = false;
        const list = el('div', {},
          roles.length
            ? roles.map((r) => el('div', {
                class: 'row',
                onclick: () => {
                  if (pending) return;
                  pending = true;
                  api.updateCandidateProfile({ [field]: idOf(r) })
                    .then(() => { toast(`Career goal set to ${nameOf(r)}`); m.close(); render(container); })
                    .catch((err) => { toast(err?.message || 'Could not save goal', 'err'); pending = false; });
                },
              },
                el('div', {}, el('div', { class: 'name' }, nameOf(r))),
                el('div', {}), el('div', {})))
            : emptyState('No job roles available right now.'));
        const m = modal({ title: 'Choose a career goal', body: list, actions: [{ label: 'Close', class: 'ghost' }] });
      },
    });

    const goalPanel = goalName
      ? el('div', { class: 'goal' },
          el('div', {},
            el('h2', {}, `Current Career Goal: ${goalName}`),
            el('p', {}, 'Your matches, gaps and learning guidance are based on this role.')),
          changeBtn)
      : el('div', { class: 'goal' },
          el('div', {},
            el('h2', {}, 'No career goal yet'),
            el('p', {}, 'Explore career matches to pick one — it focuses your skill gaps and learning guidance.')),
          changeBtn);

    container.replaceChildren(
      goalPanel,
      el('div', { style: { height: '17px' } }),
      card('Why pick a goal?', 'A goal turns general advice into a clear next step',
        el('div', { class: 'why' },
          el('div', {}, el('b', {}, '✓ Clear skill gaps'), 'See exactly which skills your target role needs that you do not have yet.'),
          el('div', {}, el('b', {}, '✓ Focused learning'), 'Get resource recommendations for the skills that matter most.'),
          el('div', {}, el('b', {}, '✓ Better matches'), 'Track how close you are to being ready for the role.'))));
  }).catch((err) => {
    container.replaceChildren(errorState(err?.message || 'Could not load your career goal',
      () => render(container)));
  });
}

registerRoute('/candidate/goal', {
  title: 'Career Goal',
  roles: ['CANDIDATE'],
  render,
});
