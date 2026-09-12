// SkillUp — candidate dashboard: profile summary, top matches, skill gaps,
// readiness, learning guidance, and a clear "what to do next".
import { registerRoute, navigate } from '../router.js';
import { api } from '../api.js';
import {
  el, card, chipRow, chip, emptyState, loadingState, errorState, bar,
  readinessCircle, whyPanel, statCards,
} from '../components/ui.js';
import { pick, nameOf, idOf, careerValueRow } from './candidate-util.js';

function matchesOf(d) {
  return d?.matches ?? d?.careerMatches ?? d?.topMatches ?? d?.topCareerMatches ?? [];
}

function gapsOf(d) {
  return d?.skillGaps ?? d?.gaps ?? d?.topSkillGaps ?? [];
}

function matchPct(m) {
  return Math.round(Number(pick(m, ['matchPercent', 'matchPercentage', 'matchScore', 'score', 'percent'], 0)) || 0);
}

function matchReason(m) {
  return pick(m, ['reason', 'why', 'summary', 'explanation'], null);
}

function render(container) {
  container.replaceChildren(loadingState('Loading your dashboard…'));

  api.candidateDashboard().then((d) => {
    const profile = d?.profile ?? d?.candidate ?? {};
    const user = d?.user ?? {};
    const name = pick(profile, ['name', 'fullName'], null) ||
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || 'Candidate';
    const district = pick(profile, ['district', 'districtName'], user?.district) || '—';
    const matches = matchesOf(d);
    const gaps = gapsOf(d);
    const readiness = Math.round(Number(pick(d, ['readiness', 'readinessScore', 'readinessPercent'], 0)) || 0);
    const missing = d?.missingSkills ?? d?.readinessMissingSkills ??
      gaps.map((g) => nameOf(pick(g, ['skill'], g))).filter(Boolean);
    const guidance = pick(d, ['learningGuidance', 'guidance', 'recommendedResource', 'recommendation'], null);
    const resource = guidance && typeof guidance === 'object'
      ? (guidance.resource ?? guidance.learningResource ?? guidance)
      : null;

    // --- profile summary ---
    const profileCard = card('Profile Summary', 'A quick look at your profile', el('div', { class: 'readiness' },
      el('div', { class: 'bigavatar' }, String(name).trim().charAt(0).toUpperCase() || 'C'),
      el('div', {},
        el('div', { style: { fontSize: '15px', fontWeight: 800 } }, name),
        el('div', { class: 'muted', style: { fontSize: '11px', color: 'var(--muted)' } }, `District: ${district}`))));

    // --- top career matches ---
    const matchBody = matches.length
      ? matches.slice(0, 5).map((m) => {
          const pct = matchPct(m);
          const roleName = nameOf(pick(m, ['jobRole', 'role', 'career'], m));
          const reason = matchReason(m);
          return el('div', { class: 'career', style: { padding: '10px 0', borderBottom: '1px solid #efeee8' } },
            el('div', { class: 'ctop' },
              el('div', { class: 'cname' }, roleName),
              el('div', { class: 'match' }, `${pct}% match`)),
            reason ? el('div', { class: 'reason' }, reason) : null,
            careerValueRow(m),
            el('div', { class: 'matchbar', style: { marginTop: '6px' } }, bar(pct)));
        })
      : emptyState('No career matches yet — add your skills to get matches.');
    const matchCard = card('Top Career Matches', 'Roles that fit the skills you have', matchBody);

    // --- top skill gaps ---
    const gapBody = gaps.length
      ? el('div', {}, gaps.slice(0, 6).map((g) => {
          const skill = pick(g, ['skill'], g);
          return el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #efeee8' } },
            el('div', { style: { fontSize: '12px', fontWeight: 700 } }, nameOf(skill)),
            el('span', { class: 'gapchip' }, pick(g, ['priority', 'gapLevel', 'severity'], 'Gap') || 'Gap'));
        }))
      : emptyState('No skill gaps found — nice work.');
    const gapCard = card('Top Skill Gaps', 'Skills your target roles ask for that you have not added yet', gapBody);

    // --- readiness ---
    const readinessCard = card('Readiness', 'How close you are to your goal role', el('div', { class: 'readpanel' },
      readinessCircle(readiness),
      el('div', { style: { flex: 1 } },
        el('div', { style: { fontSize: '12px', fontWeight: 800, marginBottom: '6px' } },
          missing.length ? 'Skills still missing:' : 'You have the key skills for your goal role.'),
        missing.length ? chipRow(missing.slice(0, 8).map((m) => chip(String(m)))) : null)));

    // --- learning guidance ---
    const guidanceCard = card('Learning Guidance', 'One recommended resource to start with',
      resource ? el('div', {},
        el('div', { style: { fontSize: '13px', fontWeight: 800 } }, nameOf(resource)),
        resource?.provider || resource?.url
          ? el('div', { class: 'muted', style: { fontSize: '10px', color: 'var(--muted)', margin: '3px 0 8px' } },
              [resource?.provider, resource?.type].filter(Boolean).join(' · '))
          : null,
        el('div', { class: 'why' },
          el('div', {}, el('b', {}, '✓ Why this resource'),
            'This resource covers a high-priority skill missing from your target role.')))
      : emptyState('No recommendation yet — set a career goal and add your skills.'));

    // --- what to do next (data-driven, specific) ---
    const goalName = nameOf(pick(d, ['careerGoal', 'goal', 'targetRole', 'goalRole'], null)) ||
      pick(d, ['careerGoalName', 'targetRoleName'], null);
    const topMatch = matches.length ? matches.reduce((a, b) => (matchPct(a) >= matchPct(b) ? a : b)) : null;
    const topGap = gaps.length
      ? gaps.reduce((a, b) => {
          const pr = (g) => String(pick(g, ['priority', 'gapLevel', 'severity'], '')).toUpperCase();
          return (pr(b) === 'HIGH' && pr(a) !== 'HIGH') ? b : a;
        })
      : null;
    const gapSkill = topGap ? nameOf(pick(topGap, ['skill'], topGap)) : null;
    const reqLvl = topGap ? pick(topGap, ['requiredLevel', 'required'], null) : null;
    const curLvl = topGap ? pick(topGap, ['currentLevel', 'current'], null) : null;

    const steps = [];
    if (!goalName && topMatch) {
      steps.push({
        title: `1. Set ${nameOf(pick(topMatch, ['jobRole', 'role', 'career'], topMatch))} as your career goal`,
        desc: `It is your strongest match at ${matchPct(topMatch)}%${matchReason(topMatch) ? ` — ${matchReason(topMatch)}` : ''}. A goal turns generic advice into a concrete plan.`,
        action: { label: 'Review Career Matches', path: '/candidate/matches' },
      });
    }
    if (gapSkill) {
      steps.push({
        title: `2. Close your highest-impact gap: ${gapSkill}`,
        desc: `Your target role needs ${reqLvl ? reqLvl.toString().toLowerCase() : 'a higher'} level and you are at ${curLvl ? curLvl.toString().toLowerCase() : 'none'}${missing.length > 1 ? `. It is one of ${missing.length} skills standing between you and your goal` : ''}.`,
        action: { label: 'See Skill Gaps', path: '/candidate/gaps' },
      });
    }
    if (resource) {
      steps.push({
        title: `3. Start learning: ${nameOf(resource)}`,
        desc: 'It covers a high-priority skill missing from your target role — the fastest single move you can make right now.',
        action: { label: 'Open Learning Guidance', path: '/candidate/guidance' },
      });
    } else if (!gapSkill && !goalName) {
      steps.push({ title: '1. Add your skills', desc: 'Your matches and gaps are built from the skills you add — the more accurate your profile, the sharper the recommendations.', action: { label: 'Go to My Skills', path: '/candidate/skills' } });
    }
    if (readiness > 0 && (goalName || topMatch)) {
      steps.push({
        title: `${steps.length + 1}. You are at ${readiness}% readiness${goalName ? ` for ${goalName}` : ''}`,
        desc: readiness >= 80
          ? 'You are close — finish the remaining gaps and you are ready to apply.'
          : `Each missing skill you close raises this. ${missing.length ? `Focus on: ${missing.slice(0, 3).join(', ')}.` : 'Add your current skills so readiness can be measured properly.'}`,
      });
    }
    const firstAction = steps.find((s) => s.action)?.action;
    const nextCard = card('What to do next', null,
      steps.length
        ? whyPanel(steps.map((s) => ({ title: s.title, desc: s.desc })))
        : emptyState('Add your skills to get personalised next steps.'),
      firstAction
        ? el('div', { style: { marginTop: '12px' } },
            el('button', { class: 'btn ghost small', type: 'button', onclick: () => navigate(firstAction.path) }, firstAction.label))
        : null);

    container.replaceChildren(
      el('div', { class: 'grid' },
        profileCard, readinessCard,
        matchCard, gapCard,
        guidanceCard, nextCard));
  }).catch((err) => {
    container.replaceChildren(errorState(err?.message || 'Could not load your dashboard',
      () => render(container)));
  });
}

registerRoute('/candidate/dashboard', {
  title: 'Dashboard',
  roles: ['CANDIDATE'],
  render,
});
