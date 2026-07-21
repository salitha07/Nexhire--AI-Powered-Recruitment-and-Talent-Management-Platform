import api from './api';

/**
 * POST /api/interviews/prep/{applicationId}
 * Get AI-generated interview prep suggestions (mode, duration, focus areas, questions).
 * Recruiter only.
 */
export const getInterviewPrep = async (applicationId) => {
  const res = await api.post(`/api/interviews/prep/${applicationId}`);
  return res.data;
};

/**
 * POST /api/interviews
 * Schedule an interview for an application.
 * Recruiter only.
 */
export const scheduleInterview = async (dto) => {
  const res = await api.post('/api/interviews', dto);
  return res.data;
};

/**
 * GET /api/interviews/my
 * Candidate: get own upcoming and past interviews.
 */
export const getMyInterviews = async () => {
  const res = await api.get('/api/interviews/my');
  return res.data;
};

/**
 * GET /api/interviews/application/{applicationId}
 * Recruiter: get interviews for a specific application they own.
 */
export const getInterviewsForApplication = async (applicationId) => {
  const res = await api.get(`/api/interviews/application/${applicationId}`);
  return res.data;
};
