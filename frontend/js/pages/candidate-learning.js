// SkillUp — candidate learning: track courses/videos/certifications, update
// status and progress, add or remove entries.
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, card, chip, chipRow, emptyState, loadingState, errorState, formField, btn,
  modal, confirmModal, toast, statusPill, progBar,
} from '../components/ui.js';
import {
  pick, nameOf, idOf, levelSelect, skillSearchModal, runMutation,
  LEARNING_TYPES, LEARNING_STATUSES,
} from './candidate-util.js';

function typeOf(item) {
  const t = pick(item, ['type', 'resourceType', 'format'], 'OTHER');
  const up = String(t).toUpperCase();
  return LEARNING_TYPES.includes(up) ? up : 'OTHER';
}

function statusOf(item) {
  const s = String(pick(item, ['status'], 'PLANNED')).toUpperCase();
  return LEARNING_STATUSES.includes(s) ? s : 'PLANNED';
}

function progressOf(item) {
  return Math.max(0, Math.min(100, Math.round(Number(pick(item, ['progress', 'progressPercent', 'percent'], 0)) || 0)));
}

function skillsOf(item) {
  const v = item?.skills ?? item?.skill ?? [];
  const arr = Array.isArray(v) ? v : (v ? [v] : []);
  return arr.map((s) => nameOf(pick(s, ['skill'], s)));
}

function titleOf(item) {
  return pick(item, ['title', 'name'], null) ||
    nameOf(pick(item, ['learningResource', 'resource'], item)) || 'Learning item';
}

function openUpdateModal(item, refresh) {
  const lid = idOf(item);
  const statusSel = levelSelect(statusOf(item), LEARNING_STATUSES);
  const progInput = el('input', { class: 'inp', type: 'number', min: '0', max: '100', value: progressOf(item) });
  const save = btn('Save', { class: 'dark' });
  const m = modal({
    title: `Update — ${titleOf(item)}`,
    body: el('div', {},
      formField('Status', statusSel),
      formField('Progress (0–100)', progInput)),
    actions: [{ label: 'Cancel', class: 'ghost' }, { label: 'Save', class: 'dark', onClick: () => {} }],
  });
  save.addEventListener('click', () => runMutation(save, async () => {
    await api.updateCandidateLearning(lid, {
      status: statusSel.value,
      progress: Math.max(0, Math.min(100, Number(progInput.value) || 0)),
    });
    m.close();
  }, { success: 'Learning updated', refresh }));
  m.root.querySelector('.mactions').lastChild.replaceWith(save);
}

function openAddModal(refresh) {
  const title = el('input', { class: 'inp', placeholder: 'e.g. Basic Electrical Safety' });
  const typeSel = levelSelect('COURSE', LEARNING_TYPES);
  const progInput = el('input', { class: 'inp', type: 'number', min: '0', max: '100', value: '0' });
  let pickedSkill = null;
  const skillLabel = el('div', { class: 'inp', style: { display: 'flex', alignItems: 'center', color: 'var(--muted)' } }, 'Pick a skill (optional)');
  const save = btn('Add Learning', { class: 'dark' });
  const m = modal({
    title: 'Add Learning',
    body: el('div', {},
      formField('Title', title),
      formField('Type', typeSel),
      formField('Progress (0–100)', progInput),
      formField('Linked skill', el('div', {
        class: 'add', style: { padding: '10px' },
        onclick: () => skillSearchModal('Link a skill', (s) => {
          pickedSkill = s;
          skillLabel.replaceChildren(nameOf(s));
        }),
      }, skillLabel))),
    actions: [{ label: 'Cancel', class: 'ghost' }, { label: 'Add Learning', class: 'dark', onClick: () => {} }],
  });
  save.addEventListener('click', () => runMutation(save, async () => {
    const body = {
      title: title.value.trim(),
      type: typeSel.value,
      progress: Math.max(0, Math.min(100, Number(progInput.value) || 0)),
    };
    if (!body.title) throw new Error('Please enter a title');
    const sid = pickedSkill ? idOf(pickedSkill) : null;
    if (sid != null) body.skillId = sid;
    await api.addCandidateLearning(body);
    m.close();
  }, { success: 'Learning added', refresh }));
  m.root.querySelector('.mactions').lastChild.replaceWith(save);
}

function render(container) {
  container.replaceChildren(loadingState('Loading your learning…'));

  const load = () => api.candidateLearning().then((data) => {
    const items = Array.isArray(data) ? data : (data?.learning ?? data?.items ?? data?.content ?? []);

    const cards = items.map((item) => el('div', { class: 'course' },
      el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' } },
        el('div', {},
          el('h3', {}, titleOf(item)),
          el('div', { class: 'cmeta', style: { fontSize: '10px', color: 'var(--muted)', marginTop: '3px' } },
            [typeOf(item), pick(item, ['provider'], null)].filter(Boolean).join(' · '))),
        statusPill(statusOf(item))),
      el('div', { style: { margin: '10px 0 4px' } }, progBar(progressOf(item))),
      skillsOf(item).length ? chipRow(skillsOf(item).map((s) => chip(s))) : null,
      el('div', { style: { display: 'flex', gap: '6px', marginTop: '10px' } },
        btn('Update', { class: 'ghost small', onClick: () => openUpdateModal(item, load) }),
        btn('Remove', {
          class: 'danger small',
          onClick: () => confirmModal(`Remove "${titleOf(item)}" from your learning list?`, () => {
            api.removeCandidateLearning(idOf(item))
              .then(() => { toast('Learning item removed'); load(); })
              .catch((err) => toast(err?.message || 'Could not remove item', 'err'));
          }, true),
        }))));

    const addCard = el('div', { class: 'add', onclick: () => openAddModal(load) },
      '+ Add Learning', el('div', { style: { fontSize: '9px', marginTop: '4px' } }, 'Track a course, video or certification'));

    container.replaceChildren(
      el('div', { class: 'card' },
        el('div', { class: 'head' },
          el('div', {},
            el('h2', {}, 'Learning'),
            el('div', { class: 'desc' }, 'Track what you are learning for your goal role')),
        ),
        items.length
          ? el('div', { class: 'grid two' }, [...cards, addCard])
          : el('div', {}, emptyState('Nothing tracked yet. Add a course, video or certification to get started.'), addCard),
        el('div', { style: { marginTop: '14px', fontSize: '10px', color: 'var(--muted2)' } },
          'Note: completing a learning item does not mean expert proficiency — update your skill level separately on the My Skills page.')));
  }).catch((err) => {
    container.replaceChildren(errorState(err?.message || 'Could not load your learning', () => render(container)));
  });

  load();
}

registerRoute('/candidate/learning', {
  title: 'Learning',
  roles: ['CANDIDATE'],
  render,
});
