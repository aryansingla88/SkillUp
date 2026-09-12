// SkillUp — candidate skills: list, update proficiency, remove, add via search.
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, card, emptyState, loadingState, errorState, formField, btn, modal,
  confirmModal, toast, statusPill,
} from '../components/ui.js';
import { pick, nameOf, idOf, levelSelect, skillSearchModal, runMutation } from './candidate-util.js';

function skillOf(item) { return pick(item, ['skill'], item) ?? {}; }
function profOf(item) { return pick(item, ['proficiency', 'level', 'proficiencyLevel'], 'BASIC'); }

function openUpdateModal(item, refresh) {
  const sid = idOf(item) ?? idOf(skillOf(item));
  const name = nameOf(skillOf(item)) || nameOf(item);
  const select = levelSelect(profOf(item));
  const save = btn('Save', { class: 'dark' });
  const m = modal({
    title: `Update proficiency — ${name}`,
    body: formField('Proficiency', select),
    actions: [{ label: 'Cancel', class: 'ghost' }, { label: 'Save', class: 'dark', onClick: () => {} }],
  });
  save.addEventListener('click', () => runMutation(save, async () => {
    await api.updateCandidateSkill(sid, { proficiency: select.value });
    m.close();
  }, { success: 'Proficiency updated', refresh }));
  m.root.querySelector('.mactions').lastChild.replaceWith(save);
}

function openAddModal(refresh) {
  skillSearchModal('Add a skill', (skill) => {
    const select = levelSelect();
    const save = btn('Add skill', { class: 'dark' });
    const m = modal({
      title: `Add ${nameOf(skill)}`,
      body: formField('Your proficiency', select),
      actions: [{ label: 'Cancel', class: 'ghost' }, { label: 'Add skill', class: 'dark', onClick: () => {} }],
    });
    save.addEventListener('click', () => runMutation(save, async () => {
      await api.addCandidateSkill({ skillId: idOf(skill), proficiency: select.value });
      m.close();
    }, { success: `${nameOf(skill)} added`, refresh }));
    m.root.querySelector('.mactions').lastChild.replaceWith(save);
  });
}

function render(container) {
  container.replaceChildren(loadingState('Loading your skills…'));

  const load = () => api.candidateSkills().then((data) => {
    const items = Array.isArray(data) ? data : (data?.skills ?? data?.content ?? []);

    const list = items.length
      ? el('div', { class: 'grid three' },
          items.map((item) => {
            const sid = idOf(item) ?? idOf(skillOf(item));
            const name = nameOf(skillOf(item)) || nameOf(item);
            return el('div', { class: 'skillcard' },
              el('h3', {}, name),
              el('div', { style: { margin: '6px 0 10px' } }, statusPill(profOf(item))),
              el('div', { style: { display: 'flex', gap: '6px' } },
                btn('Update', { class: 'ghost small', onClick: () => openUpdateModal(item, load) }),
                btn('Remove', {
                  class: 'danger small',
                  onClick: () => confirmModal(`Remove ${name} from your skills?`, () => {
                    api.removeCandidateSkill(sid)
                      .then(() => { toast(`${name} removed`); load(); })
                      .catch((err) => toast(err?.message || 'Could not remove skill', 'err'));
                  }, true),
                })));
          }))
      : emptyState('You have not added any skills yet. Add your first skill to get career matches.');

    container.replaceChildren(
      el('div', { class: 'card' },
        el('div', { class: 'head' },
          el('div', {},
            el('h2', {}, 'My Skills'),
            el('div', { class: 'desc' }, `${items.length} skill${items.length === 1 ? '' : 's'} added`)),
          btn('+ Add Skill', { class: 'dark', onClick: () => openAddModal(load) })),
        list));
  }).catch((err) => {
    container.replaceChildren(errorState(err?.message || 'Could not load your skills', () => render(container)));
  });

  load();
}

registerRoute('/candidate/skills', {
  title: 'My Skills',
  roles: ['CANDIDATE'],
  render,
});
