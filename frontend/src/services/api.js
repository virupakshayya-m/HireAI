import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    // 1. Extract backend error message
    if (error.response?.data?.errors) {
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

    // 2. Prevent infinite loops
    if (
      originalRequest.url.includes("/auth/refresh-token") ||
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    // 3. Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        localStorage.setItem("accessToken", res.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        if (refreshError.response?.data?.message) {
          refreshError.message = refreshError.response.data.message;
        } else {
          refreshError.message = "Session expired. Please log in again.";
        }
        // Using window.location to force a redirect if desired, but just rejecting is fine as context handles it.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
