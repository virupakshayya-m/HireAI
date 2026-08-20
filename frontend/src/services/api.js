import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    // 1. Extract backend error message and attach it directly to the error object
    if (error.response?.data?.errors) {
      // Handle Zod validation errors (e.g., { password: ["Too short"] })
      const errorMessages = Object.values(error.response.data.errors).flat();
      error.message = errorMessages.join(", ");
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.response?.status >= 500) {
      error.message = "An internal server error occurred. Please try again later.";
    } else if (!error.response) {
      error.message = "Network error. Please check your internet connection.";
    }

    const originalRequest = error.config;

    // 2. Prevent infinite loops or retrying login/register requests
    if (
      originalRequest.url.includes("/auth/refresh-token") ||
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    // 3. Handle token refresh for 401 Unauthorized errors on protected routes
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, we should still return the formatted refresh error or just a clean message
        if (refreshError.response?.data?.message) {
          refreshError.message = refreshError.response.data.message;
        } else {
          refreshError.message = "Session expired. Please log in again.";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
