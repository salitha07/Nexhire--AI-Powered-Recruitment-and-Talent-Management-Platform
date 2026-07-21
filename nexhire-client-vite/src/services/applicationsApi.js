import api from './api';

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/api/uploads/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const applyToJob = async (data) => {
  const res = await api.post('/api/applications', data);
  return res.data;
};

export const getMyApplications = async () => {
  const res = await api.get('/api/applications/my');
  return res.data;
};

export const getApplicationsForJob = async (jobId) => {
  const res = await api.get(`/api/applications/job/${jobId}`);
  return res.data;
};

export const updateApplicationStatus = async (id, status) => {
  const res = await api.put(`/api/applications/${id}/status`, { status });
  return res.data;
};