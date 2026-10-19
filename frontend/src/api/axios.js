import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const TOKEN_KEY = "mps_admin_token";

const api = axios.create({
  baseURL,
  headers: { Accept: "application/json" },
  timeout: 15 * 60 * 1000, // big video uploads on slow internet
});

// Attach the admin token (if logged in) to every request
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    /* storage unavailable */
  }
  return config;
});

// If the admin session expired, tell the app to log out (admin pages then show login)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    if (err.response?.status === 401 && !url.includes("/auth/login")) {
      window.dispatchEvent(new Event("mps-unauthorized"));
    }
    return Promise.reject(err);
  }
);

export default api;
