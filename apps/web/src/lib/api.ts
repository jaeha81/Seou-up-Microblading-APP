import axios from "axios";

const api = axios.create({
  // Use empty baseURL to go through Next.js proxy (rewrites in next.config.js)
  // Set NEXT_PUBLIC_API_URL only when calling the API directly (e.g., production)
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 30000,
});

// Attach JWT token from localStorage if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const SUPPORTED_LOCALES = ["en", "ko", "th", "vi"];

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/auth/")) {
        const segments = window.location.pathname.split("/");
        const locale = SUPPORTED_LOCALES.includes(segments[1]) ? segments[1] : "en";
        window.location.href = `/${locale}/auth/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
