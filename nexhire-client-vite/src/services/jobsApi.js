// src/services/jobsApi.js
// Job Management API — connects to ASP.NET backend at http://localhost:5000/api/jobs
import api from './api';

/**
 * GET /api/jobs?search=&type=&location=
 * Public endpoint — no auth required
 */
export const getAllJobs = async (search = '', type = '', location = '') => {
  const params = {};
  if (search) params.search = search;
  if (type) params.type = type;
  if (location) params.location = location;

  const res = await api.get('/api/jobs', { params });
  return res.data;
};

/**
 * GET /api/jobs/:id
 * Public endpoint — no auth required
 */
export const getJobById = async (id) => {
  const res = await api.get(`/api/jobs/${id}`);
  return res.data;
};

/**
 * POST /api/jobs
 * Requires recruiter JWT token
 * @param {Object} data — { title, description, requirements, location, type, salaryRange }
 */
export const createJob = async (data) => {
  const res = await api.post('/api/jobs', data);
  return res.data;
};

/**
 * PUT /api/jobs/:id
 * Requires recruiter JWT token (must be the original poster)
 * @param {number} id
 * @param {Object} data — same shape as createJob
 */
export const updateJob = async (id, data) => {
  const res = await api.put(`/api/jobs/${id}`, data);
  return res.data;
};

/**
 * GET /api/jobs/mine
 * Returns only the authenticated recruiter's own job postings (by user ID).
 * Requires recruiter JWT token.
 */
export const getMyJobs = async () => {
  const res = await api.get('/api/jobs/mine');
  return res.data;
};

/**
 * DELETE /api/jobs/:id
 * Requires recruiter JWT token (must be the original poster)
 */
export const deleteJob = async (id) => {
  const res = await api.delete(`/api/jobs/${id}`);
  return res.data;
};
