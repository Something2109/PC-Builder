import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_HOST ?? ""}/api`,
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

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (err: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the failed request was the refresh token request itself, redirect to login
      if (originalRequest.url === "/auth/refresh" || originalRequest.url?.endsWith("/auth/refresh")) {
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/auth")
        ) {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh");
        processQueue(null);
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/auth")
        ) {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      const { status, data } = error.response;
      console.error(`API Error [${status}]:`, data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
