import api from "@/services/api";

// Fetch the logged-in candidate's profile
export const getMyProfile = async () => {
  try {
    const response = await api.get("/profile/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update candidate bio and skills
export const updateMyProfile = async (profileData) => {
  try {
    const response = await api.patch("/profile/me", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Upload resume file to Cloudinary
export const uploadResume = async (formData) => {
  try {
    // Note: We don't need to manually set 'Content-Type': 'multipart/form-data'. 
    // Axios handles boundary generation automatically when passing a FormData object.
    const response = await api.put("/profile/resume", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
