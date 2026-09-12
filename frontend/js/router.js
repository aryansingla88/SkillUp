// SkillUp — tiny hash router.
// registerRoute(pattern, {title, roles, render(container, params)})
//   pattern like '/district/skill-gaps' or '/gap/:districtId/:gapId'
// navigate(path) / currentParams() / start()

const routes = [];
let paramsCache = {};

export function registerRoute(pattern, def) {
  const keys = [];
  const rx = new RegExp('^' + pattern.replace(/:[^/]+/g, (m) => {
    keys.push(m.slice(1));
    return '([^/]+)';
  }) + '$');
  routes.push({ pattern, def, rx, keys });
}

export function match(path) {
  for (const r of routes) {
    const m = path.match(r.rx);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      return { route: r, params };
    }
  }
  return null;
}

export function navigate(path) {
  if (location.hash === `#${path}`) {
    const Ev = typeof HashChangeEvent !== 'undefined' ? HashChangeEvent : Event;
    window.dispatchEvent(new Ev('hashchange'));
  } else {
    location.hash = `#${path}`;
  }
}

export function currentParams() {
  return paramsCache;
}

export function start(onRoute) {
  window.addEventListener('hashchange', () => route(onRoute));
  route(onRoute);
}

function route(onRoute) {
  const path = (location.hash || '#/').slice(1) || '/';
  const hit = match(path);
  paramsCache = hit ? hit.params : {};
  onRoute(hit ? hit.route.def : null, paramsCache, path);
}
