import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

/**
 * Get token from cookie or localStorage
 */
function getToken(): string | null {
  if (typeof window === "undefined") return null;

  // Try cookie first (like Nuxt)
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token") {
      return decodeURIComponent(value || "");
    }
  }

  // Fallback to localStorage
  return localStorage.getItem("auth_token");
}

/**
 * Get group ID: ưu tiên localStorage, fallback về cookie
 */
function getGroupId(): string | null {
  if (typeof window === "undefined") return null;

  // Ưu tiên localStorage (theo tài liệu mới)
  const storedGroupId = localStorage.getItem("selected_group_id");
  if (storedGroupId) {
    return storedGroupId;
  }

  // Fallback về cookie (backward compatible)
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "group_id") {
      return decodeURIComponent(value || "");
    }
  }

  return null;
}

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token and group ID
apiClient.interceptors.request.use(
  (config) => {
    // Tự động thêm token vào header nếu có
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Tự động thêm X-Group-Id header nếu có
    const groupId = getGroupId();
    if (groupId) {
      config.headers = config.headers || {};
      config.headers["X-Group-Id"] = String(groupId);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common error responses
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized: Token hết hạn → logout
      if (status === 401) {
        if (typeof window !== "undefined") {
          // Xóa token và group_id
          localStorage.removeItem("auth_token");
          localStorage.removeItem("selected_group_id");
          localStorage.removeItem("user_groups");

          // Xóa cookies
          document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "group_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

          // Redirect về login
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }

      // Handle 403 Forbidden: Không có quyền
      if (status === 403) {
        // Silent failing for forbidden requests, components should handle their own errors
        // Optionally redirect to login if we suspect session expiry
      }

      // Handle 500 Server Error
      if (status >= 500) {
        console.error("Server error:", error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config),
};

export default apiClient;



