import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Extract backend error message and attach it directly to the error object
    // so components using error.message get the user-friendly text instead of Axios' default
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.response?.status >= 500) {
      error.message = "An internal server error occurred. Please try again later.";
    } else if (!error.response) {
      error.message = "Network error. Please check your internet connection.";
    }

    return Promise.reject(error);
  },
);

export default api;
