import api from "./api";

// Create a new company
export const createCompany = async (companyData) => {
  try {
    const response = await api.post("/companies", companyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fetch the current recruiter's company
export const getMyCompany = async () => {
  try {
    const response = await api.get("/companies/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update the current recruiter's company
export const updateCompany = async (companyData) => {
  try {
    const response = await api.patch("/companies/me", companyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
