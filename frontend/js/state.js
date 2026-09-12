// SkillUp — session state with localStorage persistence (guarded for non-DOM envs)
const LS_TOKEN = 'skillup.token';
const LS_USER = 'skillup.user';
const hasStorage = typeof localStorage !== 'undefined';

const listeners = new Set();

export function getToken() {
  return hasStorage ? localStorage.getItem(LS_TOKEN) : null;
}

export function setToken(token) {
  if (hasStorage) localStorage.setItem(LS_TOKEN, token);
}

export function getUser() {
  if (!hasStorage) return null;
  try { return JSON.parse(localStorage.getItem(LS_USER) || 'null'); }
  catch { return null; }
}

export function setUser(user) {
  if (hasStorage) localStorage.setItem(LS_USER, JSON.stringify(user));
}

export function clearSession() {
  if (hasStorage) {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
  }
  emitAuth();
}

export function isAuthenticated() {
  return !!getToken();
}

export function hasRole(role) {
  const user = getUser();
  return !!user && user.role === role;
}

export function onAuthChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emitAuth() {
  listeners.forEach((fn) => fn(getUser()));
}
