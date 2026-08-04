import api from "./api";

// Fetch all applications for the logged-in candidate
export const getMyApplications = async () => {
  try {
    const response = await api.get("/applications/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fetch all applicants for a specific job (Recruiter only)
export const getJobApplicants = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}/applicants`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update an application status (Recruiter only)
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await api.patch(`/applications/${applicationId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
