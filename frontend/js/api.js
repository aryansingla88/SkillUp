// SkillUp — API client.
// All methods return parsed JSON or throw Error with .status/.body.

import { getToken } from './state.js';

const API_BASE = window.SkillUpAPI_BASE || '';

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const opts = {
    method,
    headers: { ...headers }
  };

  const token = getToken();

  if (token) {
    opts.headers.Authorization = `Bearer ${token}`;
  }

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

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const err = new Error(
      (data && data.message) || `Request failed (${res.status})`
    );

    err.status = res.status;
    err.body = data;

    throw err;
  }

  return data;
}

export const api = {

  // =========================================================
  // AUTH
  // =========================================================

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: { email, password }
    }),

  register: (data) =>
    request('/auth/register', {
      method: 'POST',
      body: data
    }),


  // =========================================================
  // REFERENCE DATA
  // =========================================================

  districts: () =>
    request('/districts'),

  sectors: () =>
    request('/sectors'),

  jobRoles: () =>
    request('/job-roles'),

  skills: () =>
    request('/skills'),

  subskills: (id) =>
    request(`/skills/${id}/subskills`),


  // =========================================================
  // STATE ADMIN
  // =========================================================

  stateDashboard: () =>
    request('/state/dashboard'),


  // =========================================================
  // DISTRICT
  // =========================================================

  districtDashboard: (id) =>
    request(`/districts/${id}/dashboard`),

  districtSkillGaps: (id) =>
    request(`/districts/${id}/skill-gaps`),


  // =========================================================
  // CURRICULUM
  // =========================================================

  curricula: () =>
    request('/curricula'),

  curriculum: (id) =>
    request(`/curricula/${id}`),

  curriculumGaps: (id) =>
    request(`/curricula/${id}/gaps`),


  // =========================================================
  // RECOMMENDATIONS
  // =========================================================

  recommendations: () =>
    request('/recommendations'),

  recommendation: (id) =>
    request(`/recommendations/${id}`),

  approveRecommendation: (id) =>
    request(`/recommendations/${id}/approve`, {
      method: 'POST'
    }),

  rejectRecommendation: (id, remarks) =>
    request(`/recommendations/${id}/reject`, {
      method: 'POST',
      body: { remarks }
    }),


  // =========================================================
  // ACTION PLANS
  // =========================================================

  actionPlans: () =>
    request('/action-plans'),

  createActionPlan: (data) =>
    request('/action-plans', {
      method: 'POST',
      body: data
    }),

  actionPlan: (id) =>
    request(`/action-plans/${id}`),

  updateActionPlan: (id, data) =>
    request(`/action-plans/${id}`, {
      method: 'PUT',
      body: data
    }),

  approveActionPlan: (id) =>
    request(`/action-plans/${id}/approve`, {
      method: 'POST'
    }),


  // =========================================================
  // COORDINATION / REQUESTS
  // =========================================================

  requests: () =>
    request('/requests'),

  createRequest: (data) =>
    request('/requests', {
      method: 'POST',
      body: data
    }),

  updateRequest: (id, data) =>
    request(`/requests/${id}`, {
      method: 'PUT',
      body: data
    }),


  // =========================================================
  // ACTION ITEMS / IMPLEMENTATION
  // =========================================================

  actionItem: (id) =>
    request(`/action-items/${id}`),

  actionItemProgress: (id) =>
    request(`/action-items/${id}/progress`),

  updateActionItemProgress: (id, data) =>
    request(`/action-items/${id}/progress`, {
      method: 'POST',
      body: data
    }),


  // =========================================================
  // CANDIDATE
  // =========================================================

  candidateProfile: () =>
    request('/candidate/profile'),

  updateCandidateProfile: (data) =>
    request('/candidate/profile', {
      method: 'PUT',
      body: data
    }),

  candidateSkills: () =>
    request('/candidate/skills'),

  addCandidateSkill: (data) =>
    request('/candidate/skills', {
      method: 'POST',
      body: data
    }),

  updateCandidateSkill: (skillId, data) =>
    request(`/candidate/skills/${skillId}`, {
      method: 'PUT',
      body: data
    }),

  removeCandidateSkill: (skillId) =>
    request(`/candidate/skills/${skillId}`, {
      method: 'DELETE'
    }),

  candidateLearning: () =>
    request('/candidate/learning'),

  addCandidateLearning: (data) =>
    request('/candidate/learning', {
      method: 'POST',
      body: data
    }),

  updateCandidateLearning: (id, data) =>
    request(`/candidate/learning/${id}`, {
      method: 'PUT',
      body: data
    }),

  removeCandidateLearning: (id) =>
    request(`/candidate/learning/${id}`, {
      method: 'DELETE'
    }),

  candidateDashboard: () =>
    request('/candidate/dashboard'),


  // =========================================================
  // LEARNING RESOURCES
  // =========================================================

  learningResources: () =>
    request('/learning-resources'),

  createLearningResource: (data) =>
    request('/learning-resources', {
      method: 'POST',
      body: data
    }),

  learningResource: (id) =>
    request(`/learning-resources/${id}`)
};