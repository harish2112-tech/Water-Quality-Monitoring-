import axios from "axios";

const api = axios.create({
  baseURL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://127.0.0.1:8000" 
    : "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach stored JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("wqm_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// On 401 responses, clear the stored token (session expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("wqm_token");
    }
    return Promise.reject(error);
  }
);

export default api;
