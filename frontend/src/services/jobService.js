import api from "./api";

export const getAllJobs = async (filters = {}) => {
  const response = await api.get("/jobs", {
    params: filters,
  });

  return response.data;
};

export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);

  return response.data;
};

export const applyForJob = async (id) => {
  const response = await api.post(`/jobs/${id}/apply`);

  return response.data;
};
