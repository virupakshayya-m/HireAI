import api from "./api";

export const createJob = async (jobData) => {
  try {
    const response = await api.post("/jobs", jobData);

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllJobs = async (filters = {}) => {
  const response = await api.get("/jobs", {
    params: filters,
  });

  return response.data;
};

export const getMyJobs = async (params = {}) => {
  try {
    const response = await api.get("/jobs/me", {
      params,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);

  return response.data;
};

export const applyForJob = async (id) => {
  const response = await api.post(`/jobs/${id}/apply`);

  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await api.patch(`/jobs/${id}`, jobData);

  return response.data;
};

export const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);

  return response.data;
};
