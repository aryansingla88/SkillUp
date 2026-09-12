// SkillUp — API client. All methods return parsed JSON or throw Error with .status/.body
import { getToken } from './state.js';

const API_BASE = window.SkillUpAPI_BASE || '';

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const opts = { method, headers: { ...headers } };
  const token = getToken();
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, opts);
  } catch (e) {
    const err = new Error('Network error — could not reach the server');
    err.status = 0;
    err.body = null;
    throw err;
  }
  let data = null;
  const text = await res.text();
  if (text) { try { data = JSON.parse(text); } catch { data = text; } }
  if (!res.ok) {
    const err = new Error((data && data.message) || `Request failed (${res.status})`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export const api = {
  // auth
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  register: (data) => request('/api/auth/register', { method: 'POST', body: data }),
  me: () => request('/api/auth/me'),

  // state admin
  stateDashboard: () => request('/api/state/dashboard'),
  districts: () => request('/api/districts'),
  sectors: () => request('/api/sectors'),
  jobRoles: () => request('/api/job-roles'),
  skills: () => request('/api/skills'),
  subskills: (id) => request(`/api/skills/${id}/subskills`),

  // district
  districtDashboard: (id) => request(`/api/districts/${id}/dashboard`),
  districtSkillGaps: (id) => request(`/api/districts/${id}/skill-gaps`),

  // curriculum
  curricula: () => request('/api/curricula'),
  curriculum: (id) => request(`/api/curricula/${id}`),
  curriculumGaps: (id) => request(`/api/curricula/${id}/gaps`),

  // recommendations
  recommendations: () => request('/api/recommendations'),
  recommendation: (id) => request(`/api/recommendations/${id}`),
  approveRecommendation: (id) => request(`/api/recommendations/${id}/approve`, { method: 'POST' }),
  rejectRecommendation: (id, remarks) => request(`/api/recommendations/${id}/reject`, { method: 'POST', body: { remarks } }),

  // action plans
  actionPlans: () => request('/api/action-plans'),
  createActionPlan: (data) => request('/api/action-plans', { method: 'POST', body: data }),
  actionPlan: (id) => request(`/api/action-plans/${id}`),
  updateActionPlan: (id, data) => request(`/api/action-plans/${id}`, { method: 'PUT', body: data }),
  approveActionPlan: (id) => request(`/api/action-plans/${id}/approve`, { method: 'POST' }),

  // requests
  requests: () => request('/api/requests'),
  createRequest: (data) => request('/api/requests', { method: 'POST', body: data }),
  updateRequest: (id, data) => request(`/api/requests/${id}`, { method: 'PUT', body: data }),

  // action items (training centre)
  actionItem: (id) => request(`/api/action-items/${id}`),
  actionItemProgress: (id) => request(`/api/action-items/${id}/progress`),
  updateActionItemProgress: (id, data) => request(`/api/action-items/${id}/progress`, { method: 'POST', body: data }),

  // candidate
  candidateProfile: () => request('/api/candidate/profile'),
  updateCandidateProfile: (data) => request('/api/candidate/profile', { method: 'PUT', body: data }),
  candidateSkills: () => request('/api/candidate/skills'),
  addCandidateSkill: (data) => request('/api/candidate/skills', { method: 'POST', body: data }),
  updateCandidateSkill: (skillId, data) => request(`/api/candidate/skills/${skillId}`, { method: 'PUT', body: data }),
  removeCandidateSkill: (skillId) => request(`/api/candidate/skills/${skillId}`, { method: 'DELETE' }),
  candidateLearning: () => request('/api/candidate/learning'),
  addCandidateLearning: (data) => request('/api/candidate/learning', { method: 'POST', body: data }),
  updateCandidateLearning: (id, data) => request(`/api/candidate/learning/${id}`, { method: 'PUT', body: data }),
  removeCandidateLearning: (id) => request(`/api/candidate/learning/${id}`, { method: 'DELETE' }),
  candidateDashboard: () => request('/api/candidate/dashboard'),

  // learning resources
  learningResources: () => request('/api/learning-resources'),
  createLearningResource: (data) => request('/api/learning-resources', { method: 'POST', body: data }),
  learningResource: (id) => request(`/api/learning-resources/${id}`),
};
