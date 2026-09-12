// SkillUp — UI component kit (hyperscript + shared components).
// All components use the class names defined in css/global.css and css/components.css.
//
// Exports:
//   el(tag, attrs, ...children)
//   pageTitle(label, heading, sub)
//   card(title, desc, ...children)          — white card; children appended to body
//   cardHead(title, desc, linkBtn)          — the .head row only
//   statCards(items, {dark})                — [{label, value}]; dark variant renders inside .hero-style stats
//   chip(text, hot) / chipRow(chips)
//   statusPill(status)                      — maps status string to tone class
//   badge(text)
//   bar(pct) / progBar(pct)
//   listRow({title, meta, right, score, onClick})
//   dataTable(columns, rows, {onRow})       — columns [{key, label, render}], rows are objects
//   emptyState(msg) / loadingState(msg) / errorState(msg, onRetry)
//   toast(msg, type='ok'|'err')
//   modal({title, body, actions})           — returns {close, root}
//   confirmModal(message, onYes, danger)
//   sectionHead(title, desc)
//   heroPanel({kicker, title, desc, stats})
//   whyPanel(items)                         — checklist items [{title, desc}]
//   progressMetrics([{label, current, target}])
//   formField(label, inputEl)
//   btn(label, {class, onClick, ...})

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k === 'value') node.value = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k in node && k !== 'list' && typeof v !== 'string') node[k] = v;
    else node.setAttribute(k, v);
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

export function btn(label, { class: cls = 'dark', onClick, ...rest } = {}) {
  return el('button', { class: `btn ${cls}`, onclick: onClick, type: 'button', ...rest }, label);
}

export function pageTitle(label, heading, sub) {
  return el('div', {},
    el('div', { class: 'label' }, label),
    el('h1', {}, heading),
    sub ? el('div', { class: 'sub' }, sub) : null);
}

export function sectionHead(title, desc) {
  return el('div', { class: 'head', style: { marginBottom: '14px' } },
    el('div', {}, el('h2', {}, title), desc ? el('div', { class: 'desc' }, desc) : null));
}

export function cardHead(title, desc, linkBtn) {
  return el('div', { class: 'head' },
    el('div', {}, el('h2', {}, title), desc ? el('div', { class: 'desc' }, desc) : null),
    linkBtn || null);
}

export function card(title, desc, ...children) {
  const body = el('div', {});
  children.flat(Infinity).forEach((c) => { if (c != null) body.append(c); });
  return el('div', { class: 'card' },
    title ? cardHead(title, desc) : null,
    body);
}

export function chip(text, hot = false) {
  return el('span', { class: `chip${hot ? ' hot' : ''}` }, text);
}

export function chipRow(chips) {
  return el('div', {}, (chips || []).map((c) => (typeof c === 'string' ? chip(c) : c)));
}

const PILL_TONES = {
  ok: ['COMPLETED', 'FULFILLED', 'ALIGNED'],
  warn: ['IN_PROGRESS', 'UNDER_REVIEW', 'PARTIAL'],
  info: ['DRAFT', 'RAISED', 'PLANNED'],
  bad: ['MISSING', 'REJECTED', 'DROPPED', 'OUTDATED'],
  darkp: ['APPROVED', 'ASSIGNED'],
};

export function statusPill(status) {
  const s = String(status || '').toUpperCase();
  let tone = 'info';
  for (const [t, list] of Object.entries(PILL_TONES)) {
    if (list.includes(s)) { tone = t; break; }
  }
  return el('span', { class: `pill ${tone}` }, s.replace(/_/g, ' '));
}

export function badge(text) {
  return el('span', { class: 'badge' }, text);
}

export function bar(pct) {
  const p = Math.max(0, Math.min(100, Number(pct) || 0));
  return el('div', { class: 'bar' }, el('i', { style: { width: `${p}%` } }));
}

export function progBar(pct) {
  const p = Math.max(0, Math.min(100, Number(pct) || 0));
  return el('div', { class: 'prog' }, el('i', { style: { width: `${p}%` } }));
}

export function statCards(items, { dark = false } = {}) {
  const cls = dark ? 'stat' : 'statcard';
  return el('div', { class: dark ? 'stats' : 'grid three' },
    (items || []).map((s) => el('div', { class: cls },
      el('b', {}, String(s.value)),
      el('span', {}, s.label))));
}

export function listRow({ title, meta, right, score, onClick }) {
  const mid = right != null
    ? el('div', { class: 'end' }, right)
    : score != null
      ? el('div', { class: 'green' }, `${score}%`)
      : null;
  return el('div', { class: 'row', onclick: onClick },
    el('div', {},
      el('div', { class: 'name' }, title),
      meta ? el('div', { class: 'muted' }, meta) : null),
    el('div', {}),
    mid || el('div', {}));
}

export function dataTable(columns, rows, { onRow } = {}) {
  const gridCols = columns.map((c) => c.width || '1fr').join(' ');
  const wrap = el('div', { class: 'tblwrap' },
    el('div', { class: 'tbl' },
    el('div', { class: 'thead', style: { gridTemplateColumns: gridCols } },
      columns.map((c) => el('div', {}, c.label))),
    (rows || []).map((r, i) => el('div', {
      class: 'trow',
      style: { gridTemplateColumns: gridCols },
      onclick: onRow ? () => onRow(r, i) : null,
    }, columns.map((c) => {
      const v = c.render ? c.render(r, i) : r[c.key];
      return el('div', {}, v == null ? '' : String(v));
    })))));
  if (!rows || !rows.length) return el('div', {}, wrap, emptyState('No records found'));
  return wrap;
}

export function emptyState(msg = 'Nothing here yet') {
  return el('div', { class: 'empty' }, msg);
}

export function loadingState(msg = 'Loading…') {
  return el('div', { class: 'loading' }, el('div', { class: 'spinner' }), el('span', {}, msg));
}

export function errorState(msg = 'Something went wrong', onRetry) {
  return el('div', { class: 'errstate' },
    el('p', {}, msg),
    onRetry ? btn('Retry', { class: 'ghost small', onClick: onRetry }) : null);
}

let toastTimer = null;
export function toast(msg, type = 'ok') {
  let t = document.querySelector('.toast');
  if (!t) { t = el('div', { class: 'toast' }); document.body.append(t); }
  t.className = `toast show${type === 'err' ? ' err' : ''}`;
  t.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

export function modal({ title, body, actions = [] }) {
  const root = el('div', { class: 'overlay' });
  const close = () => root.remove();
  root.addEventListener('click', (e) => { if (e.target === root) close(); });
  const box = el('div', { class: 'modal' },
    el('h2', {}, title),
    el('div', { class: 'mbody' }, body),
    el('div', { class: 'mactions' },
      actions.map((a) => btn(a.label, {
        class: a.class || 'ghost',
        onClick: () => { if (a.onClick) a.onClick(close); else close(); },
      }))));
  root.append(box);
  document.body.append(root);
  return { close, root };
}

export function confirmModal(message, onYes, danger = false) {
  return modal({
    title: danger ? 'Are you sure?' : 'Please confirm',
    body: message,
    actions: [
      { label: 'Cancel', class: 'ghost' },
      { label: danger ? 'Yes, reject' : 'Confirm', class: danger ? 'danger' : 'dark', onClick: (close) => { close(); onYes(); } },
    ],
  });
}

export function heroPanel({ kicker, title, desc, stats }) {
  return el('div', { class: 'hero' },
    el('div', { class: 'small' }, kicker),
    el('h2', {}, title),
    desc ? el('p', {}, desc) : null,
    stats && stats.length ? el('div', { class: 'stats' },
      stats.map((s) => el('div', { class: 'stat' },
        el('b', {}, String(s.value)),
        el('span', {}, s.label)))) : null);
}

export function whyPanel(items) {
  return el('div', { class: 'why' },
    (items || []).map((it) => el('div', {},
      el('b', {}, `✓ ${it.title}`),
      it.desc || '')));
}

export function progressMetrics(metrics) {
  return el('div', { class: 'grid three' },
    (metrics || []).map((m) => {
      const pct = m.target ? Math.round((m.current / m.target) * 100) : 0;
      return el('div', { class: 'metric' },
        el('div', { class: 'mtop' }, el('span', {}, m.label), el('b', {}, `${m.current}/${m.target}`)),
        bar(pct),
        el('div', { class: 'mnum' }, `${pct}% complete`));
    }));
}

export function formField(label, inputEl) {
  return el('div', { class: 'field' },
    el('label', {}, label),
    inputEl);
}

export function readinessCircle(pct) {
  const p = Math.max(0, Math.min(100, Number(pct) || 0));
  return el('div', { class: 'circle', style: { '--p': p } },
    el('div', { class: 'inner' }, el('span', {}, `${p}%`)));
}

// --- Minimal CSS charts (no library, on-palette) -------------------------

// Thousands-separated number: 2400 -> "2,400". Non-numbers pass through.
export function fmtNum(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return String(n ?? '');
  return v.toLocaleString('en-US');
}

// Width % for a bar value: clamped 0–100; zero renders no fill at all.
function barWidth(v, max) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0 || max <= 0) return '0%';
  return `${Math.min(100, Math.round((n / max) * 100))}%`;
}

// Horizontal bars: [{ label, value (number), display? (string) }]
// value is used for bar scaling (max item = 100%); display defaults to value.
export function hbars(items, { valueLabel = '' } = {}) {
  const rows = (items || []).filter((i) => i && i.label != null && Number.isFinite(Number(i.value)));
  if (!rows.length) return emptyState('No data to chart yet.');
  const max = Math.max(...rows.map((i) => Number(i.value)).filter((n) => n > 0), 0);
  return el('div', { class: 'hbars' }, rows.map((i) => {
    const v = Number(i.value);
    return el('div', { class: 'hbar-row' },
      el('div', { class: 'hbar-top' },
        el('span', { class: 'hbar-label', title: String(i.label) }, String(i.label)),
        el('span', { class: 'hbar-val' }, i.display != null ? String(i.display) : `${fmtNum(v)}${valueLabel}`)),
      el('div', { class: 'hbar-track', title: `${i.label}: ${i.display ?? v}` },
        el('div', {
          class: 'hbar-fill',
          style: { width: barWidth(v, max) },
        })));
  }));
}

// Paired comparison bars (required/demand vs available/current):
// [{ label, a, b, aLabel?, bLabel?, gap? }] — bar A dark, bar B lime.
export function pairedBars(items, { aName = 'Required', bName = 'Available' } = {}) {
  const rows = (items || []).filter((i) => i && i.label != null &&
    Number.isFinite(Number(i.a)) && Number.isFinite(Number(i.b)));
  if (!rows.length) return emptyState('No data to chart yet.');
  const max = Math.max(...rows.flatMap((i) => [Number(i.a), Number(i.b)]).filter((n) => n > 0), 0);
  const bar = (v, cls, label) => el('div', { class: 'hbar-track slim', title: `${label}: ${v}` },
    el('div', { class: `hbar-fill ${cls}`, style: { width: barWidth(v, max) } }));
  return el('div', { class: 'hbars' }, rows.map((i) => el('div', { class: 'hbar-row' },
    el('div', { class: 'hbar-top' },
      el('span', { class: 'hbar-label', title: String(i.label) }, String(i.label)),
      i.gap != null && Number(i.gap) > 0 ? el('span', { class: 'hbar-gap' }, `Gap: ${fmtNum(i.gap)}`) : el('span', {})),
    el('div', { class: 'hbar-pair' },
      el('div', { class: 'hbar-line' }, el('span', { class: 'hbar-tag' }, i.aLabel || aName), bar(Number(i.a), 'dark', i.aLabel || aName)),
      el('div', { class: 'hbar-line' }, el('span', { class: 'hbar-tag' }, i.bLabel || bName), bar(Number(i.b), '', i.bLabel || bName))))));
}

// Legend for pairedBars.
export function barLegend(aName, bName) {
  return el('div', { class: 'barlegend' },
    el('span', {}, el('i', { class: 'sw dark' }), ` ${aName}`),
    el('span', {}, el('i', { class: 'sw lime' }), ` ${bName}`));
}

// Vertical funnel: [{label, value}] — centred stacked bars, widest at top,
// each bar's width proportional to value (first stage = 100%); charcoal
// bars, lime for the final stage.
export function funnel(stages) {
  const rows = (stages || []).filter((s) => s && s.label != null && Number.isFinite(Number(s.value)));
  if (!rows.length) return emptyState('No funnel data available yet.');
  const top = Math.max(...rows.map((s) => Number(s.value)), 0);
  return el('div', { class: 'funnel' }, rows.map((s, i) => {
    const v = Number(s.value);
    const w = top > 0 ? Math.max(6, Math.round((v / top) * 100)) : 0;
    const last = i === rows.length - 1;
    return el('div', { class: 'funnel-row' },
      el('div', { class: 'funnel-label', title: String(s.label) }, String(s.label)),
      el('div', { class: 'funnel-stage' },
        el('div', {
          class: `funnel-bar${last ? ' last' : ''}`,
          style: { width: `${w}%` },
          title: `${s.label}: ${fmtNum(v)}`,
        }, el('span', { class: 'funnel-val' }, fmtNum(v)))),
      el('div', { class: 'funnel-pct' }, top > 0 ? `${Math.round((v / top) * 100)}%` : ''));
  }));
}

// Priority scatter matrix: items [{label, x, y}] plotted on 0–100 axes.
// xLabel bottom-right, yLabel top-left, "TRAIN NOW" tag top-right.
export function quadrantMatrix(items, { xLabel = 'x', yLabel = 'y' } = {}) {
  const dots = (items || []).filter((i) => i && i.label != null &&
    Number.isFinite(Number(i.x)) && Number.isFinite(Number(i.y)));
  if (!dots.length) return emptyState('No data to plot yet.');
  return el('div', { class: 'qmatrix' },
    el('div', { class: 'qmatrix-ylabel' }, yLabel),
    el('div', { class: 'qmatrix-train' }, 'TRAIN NOW'),
    el('div', { class: 'qmatrix-box' },
      dots.map((d) => el('div', {
        class: 'qmatrix-dot',
        style: { left: `${Math.max(0, Math.min(100, Number(d.x)))}%`, bottom: `${Math.max(0, Math.min(100, Number(d.y)))}%` },
        title: `${d.label} — ${xLabel}: ${d.x}, ${yLabel}: ${d.y}`,
        onclick: typeof d.onClick === 'function' ? d.onClick : null,
      }, d.tinyLabel ? el('span', { class: 'qmatrix-tag' }, String(d.tinyLabel)) : null))),
    el('div', { class: 'qmatrix-xlabel' }, xLabel));
}

// Heatmap cell: text + severity level ('Critical'|'High'|'Medium'|'Low').
export function heatCell(text, level) {
  return el('span', { class: `heatcell ${String(level || 'Low').toLowerCase()}`, title: `${text || ''} — ${level || 'Low'}` },
    text != null && text !== '' ? String(text) : String(level || '').slice(0, 1));
}

// District × skill heat grid: rows [{district, cells: [{label, level}]}].
// First column = district (10px), header row = skill labels (9px).
export function heatmap(rows) {
  const data = (rows || []).filter((r) => r && r.district != null && Array.isArray(r.cells));
  if (!data.length) return emptyState('No heatmap data available yet.');
  const skills = [...new Set(data.flatMap((r) => r.cells.map((c) => c?.skill ?? c?.label ?? '')).filter(Boolean))].slice(0, 6);
  if (!skills.length) return emptyState('No heatmap data available yet.');
  return el('div', { class: 'tblwrap' },
    el('div', { class: 'heatmap' },
      el('div', { class: 'heatrow head' },
        el('div', { class: 'heatdist' }, ''),
        skills.map((s) => el('div', { class: 'heatskill', title: String(s) }, String(s)))),
      data.map((r) => el('div', { class: 'heatrow' },
        el('div', { class: 'heatdist', title: String(r.district) }, String(r.district)),
        skills.map((s) => {
          const c = (r.cells || []).find((x) => (x?.skill ?? x?.label) === s);
          return el('div', { class: 'heatcellbox' }, heatCell(c?.label, c?.level));
        })))));
}
