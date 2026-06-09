import axios from "axios";
import { getBackendPath } from "../utils/path";

const axiosInstance = axios.create({
  baseURL: getBackendPath("/api").href,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;

  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

axiosInstance.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();

  if (method && ["post", "put", "delete", "patch"].includes(method)) {
    const csrfToken = getCookie("CSRF_Token");

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - redirect to login or clear auth context
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/auth")
        ) {
          window.location.href = "/auth/login";
        }
      }

      // Add more specific error handling if needed
      console.error(`API Error [${status}]:`, data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
