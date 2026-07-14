// src/services/aiApi.js
import api from './api';

/**
 * Calls the backend to run AI analysis on a job application.
 * JWT is automatically attached by the Axios interceptor in api.js.
 * @param {number} applicationId
 * @returns {Promise<{id, applicationId, matchScore, extractedSkills, recommendation, createdAt}>}
 */
export const rankCandidate = async (applicationId) => {
  const res = await api.post(`/api/ai/rank/${applicationId}`);
  return res.data;
};

/**
 * Fetches the last saved AI result for an application (no re-analysis).
 * @param {number} applicationId
 */
export const getAIResult = async (applicationId) => {
  const res = await api.get(`/api/ai/result/${applicationId}`);
  return res.data;
};
