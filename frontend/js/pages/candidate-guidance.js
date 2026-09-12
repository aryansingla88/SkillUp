// SkillUp — candidate learning guidance: for each top gap skill, a recommended
// resource with a plain reason; start learning or add your own resource.
import { registerRoute } from '../router.js';
import { api } from '../api.js';
import {
  el, card, emptyState, loadingState, errorState, formField, btn, modal, toast,
} from '../components/ui.js';
import {
  pick, nameOf, idOf, levelSelect, skillSearchModal, runMutation,
  LEARNING_TYPES,
} from './candidate-util.js';

function gapsOf(d) {
  return d?.skillGaps ?? d?.gaps ?? d?.topSkillGaps ?? [];
}

function skillIdOf(g) {
  const s = pick(g, ['skill'], g);
  return idOf(s);
}

// Resources whose skill reference matches the gap skill (best effort).
function resourcesFor(resources, g) {
  const sid = skillIdOf(g);
  if (sid == null) return [];
  return resources.filter((r) => {
    const rs = r?.skill ?? r?.skills ?? null;
    if (Array.isArray(rs)) return rs.some((x) => idOf(pick(x, ['skill'], x)) === sid);
    return idOf(rs) === sid;
  });
}

function openOwnResourceModal(gapName, refresh) {
  const title = el('input', { class: 'inp', placeholder: 'e.g. EV Battery Maintenance Handbook' });
  const typeSel = levelSelect('COURSE', LEARNING_TYPES);
  const provider = el('input', { class: 'inp', placeholder: 'Provider or link (optional)' });
  let pickedSkill = null;
  const skillLabel = el('span', {}, gapName || 'Pick a skill');
  const save = btn('Add Resource', { class: 'dark' });
  const m = modal({
    title: 'Add your own resource',
    body: el('div', {},
      formField('Title', title),
      formField('Type', typeSel),
      formField('Provider / link', provider),
      formField('Skill it covers', el('div', {
        class: 'add', style: { padding: '10px' },
        onclick: () => skillSearchModal('Skill it covers', (s) => {
          pickedSkill = s;
          skillLabel.replaceChildren(nameOf(s));
        }),
      }, skillLabel))),
    actions: [{ label: 'Cancel', class: 'ghost' }, { label: 'Add Resource', class: 'dark', onClick: () => {} }],
  });
  save.addEventListener('click', () => runMutation(save, async () => {
    if (!title.value.trim()) throw new Error('Please enter a title');
    const body = { title: title.value.trim(), type: typeSel.value };
    if (provider.value.trim()) body.provider = provider.value.trim();
    const sid = pickedSkill ? idOf(pickedSkill) : null;
    if (sid != null) body.skillId = sid;
    const created = await api.createLearningResource(body);
    // Best effort: also add it to the candidate's learning list when we can.
    const rid = idOf(created) ?? idOf(created?.resource) ?? null;
    try {
      const learn = { title: body.title, type: body.type };
      if (rid != null) learn.learningResourceId = rid;
      if (sid != null) learn.skillId = sid;
      await api.addCandidateLearning(learn);
      toast('Resource added and saved to your learning list');
    } catch {
      toast('Resource added');
    }
    m.close();
  }, { refresh }));
  m.root.querySelector('.mactions').lastChild.replaceWith(save);
}

function render(container) {
  container.replaceChildren(loadingState('Preparing your learning guidance…'));

  const load = () => Promise.all([api.candidateDashboard(), api.learningResources()]).then(([d, resData]) => {
    const gaps = gapsOf(d);
    const resources = Array.isArray(resData) ? resData : (resData?.resources ?? resData?.content ?? []);

    const rows = gaps.slice(0, 6).map((g) => {
      const s = pick(g, ['skill'], g) ?? {};
      const sName = nameOf(s) || nameOf(g);
      const matches = resourcesFor(resources, g);
      const res = matches[0] ?? null;
      const startBtn = btn('Start Learning', {
        class: 'dark small',
        onClick: () => runMutation(startBtn, async () => {
          const body = { title: nameOf(res) || `Learning: ${sName}` };
          const rid = idOf(res);
          if (rid != null) body.learningResourceId = rid;
          const sid = skillIdOf(g);
          if (sid != null) body.skillId = sid;
          await api.addCandidateLearning(body);
        }, { success: 'Added to your learning list' }),
      });
      return el('div', { class: 'box', style: { marginBottom: '12px' } },
        el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' } },
          el('div', {},
            el('div', { class: 'blabel', style: { fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' } }, 'Target Skill'),
            el('div', { style: { fontSize: '13px', fontWeight: 800 } }, sName)),
          res ? startBtn : null),
        el('div', { style: { marginTop: '8px' } },
          el('div', { class: 'blabel', style: { fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' } }, 'Recommended Resource'),
          res
            ? el('div', { style: { fontSize: '12px', fontWeight: 700, marginTop: '2px' } },
                nameOf(res),
                res?.provider ? el('span', { style: { fontWeight: 400, color: 'var(--muted)', fontSize: '10px' } }, ` · ${res.provider}`) : null)
            : el('div', { style: { fontSize: '11px', color: 'var(--muted2)', marginTop: '2px' } },
                'No resource is linked to this skill yet — add your own below.')),
        el('div', { style: { marginTop: '8px', fontSize: '10px', color: 'var(--muted2)' } },
          res ? 'This resource covers a high-priority skill missing from your target role.' : ''));
    });

    const ownBtn = btn('Add own resource', {
      class: 'ghost small',
      onClick: () => openOwnResourceModal(gaps[0] ? nameOf(pick(gaps[0], ['skill'], gaps[0])) : '', load),
    });

    container.replaceChildren(
      el('div', { class: 'card' },
        el('div', { class: 'head' },
          el('div', {},
            el('h2', {}, 'Learning Guidance'),
            el('div', { class: 'desc' }, 'One clear next step for each skill you are missing')),
          ownBtn),
        gaps.length
          ? el('div', {}, rows)
          : emptyState('No skill gaps right now — set a career goal or add skills to get guidance.')));
  }).catch((err) => {
    container.replaceChildren(errorState(err?.message || 'Could not load learning guidance', () => render(container)));
  });

  load();
}

registerRoute('/candidate/guidance', {
  title: 'Learning Guidance',
  roles: ['CANDIDATE'],
  render,
});
