import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AxiosError } from "axios";
import apiClient from "@/lib/api/client";
import { publicEndpoints, userEndpoints } from "@/lib/api/endpoints";
import { setTokenToCookie, clearTokenFromCookie, getTokenFromCookie } from "@/lib/api/utils";
import { initializeUserGroups } from "@/lib/group/utils";
import { storage } from "@/lib/storage";
import type { User, LoginCredentials, RegisterData, ResetPasswordData, AuthResult, AuthState, AuthActions } from "./authTypes";
import { EMPTY_AUTH_STATE } from "./authTypes";

// Re-export types cho backward compatibility
export type { User, LoginCredentials, RegisterData, ResetPasswordData, AuthResult, AuthState, AuthActions };

const FETCH_CACHE_DURATION = 30000; // 30 giây

/** Xóa user data khỏi localStorage */
function clearLocalUserData() {
  storage.user.clearData();
  storage.user.clearPermissions();
}

/** Xóa tất cả auth + group data khỏi localStorage & cookies */
function clearAllLocalData() {
  clearLocalUserData();
  storage.group.clearGroups();
  storage.group.clearSelected();
  clearTokenFromCookie("group_id");
}

/** Lưu user data vào localStorage */
function persistUserData(user: User) {
  storage.user.setData(user);
  storage.user.setPermissions(user.permissions || []);
}

/** Extract user state từ API user object */
function userToState(user: User) {
  return {
    user,
    userRole: user.role || "user",
    userPermissions: user.permissions || [],
    isAuthenticated: true,
  };
}

type ApiError = AxiosError<{ message?: string; errors?: Record<string, string[]> }>;

/** Xử lý error response thành AuthResult */
function handleAuthError(error: unknown, defaultMessage: string): AuthResult {
  const e = error as ApiError;
  if (e.response?.status === 401) {
    return { success: false, message: e.response?.data?.message || "Email hoặc mật khẩu không chính xác." };
  }
  if (e.response?.status === 400 || e.response?.status === 422) {
    return { success: false, message: e.response?.data?.message || "Dữ liệu không hợp lệ", errors: e.response?.data?.errors };
  }
  if (e.code === "ECONNABORTED") {
    return { success: false, message: "Kết nối bị timeout, vui lòng thử lại" };
  }
  if (!e.response) {
    return { success: false, message: "Không thể kết nối đến server" };
  }
  return { success: false, message: e.response?.data?.message || defaultMessage };
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      ...EMPTY_AUTH_STATE,
      isFetchingUser: false,
      lastFetchTime: 0,
      isInitialized: false,

      // Permission methods
      can: (permission: string): boolean => {
        const { userPermissions } = get();
        if (!userPermissions || !Array.isArray(userPermissions)) return false;
        return userPermissions.includes(permission);
      },

      canAny: (permissions: string[]): boolean => {
        if (!Array.isArray(permissions)) return false;
        return permissions.some((p) => get().can(p));
      },

      canAll: (permissions: string[]): boolean => {
        if (!Array.isArray(permissions)) return false;
        return permissions.every((p) => get().can(p));
      },

      // Auth Actions
      login: async (credentials: LoginCredentials): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.login, credentials);

          if (response.data.success) {
            set({ isAuthenticated: true });

            if (response.data.data?.token) {
              const days = credentials.remember ? 30 : 7;
              setTokenToCookie(response.data.data.token, "auth_token", days);
            }

            if (response.data.data?.user) {
              const user = response.data.data.user;
              set(userToState(user));
              persistUserData(user);
            }

            // Xóa group cũ khi đăng nhập lại
            storage.group.clearGroups();
            storage.group.clearSelected();
            clearTokenFromCookie("group_id");

            return { success: true, data: response.data.data, message: response.data.message };
          }

          return { success: false, message: response.data.message || "Đăng nhập thất bại" };
        } catch (error: unknown) {
          return handleAuthError(error, "Lỗi kết nối");
        }
      },

      register: async (data: RegisterData): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.register, data);

          if (response.data.success || response.status === 201) {
            return { success: true, data: response.data.data, message: response.data.message || "Đăng ký thành công." };
          }

          return { success: false, message: response.data.message || "Đăng ký thất bại", errors: response.data.errors };
        } catch (error: unknown) {
          return handleAuthError(error, "Lỗi kết nối");
        }
      },

      sendOtpRegister: async (email: string): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.sendOtpRegister, { email });
          return { success: true, message: response.data.message || "Mã OTP đã được gửi đến email của bạn." };
        } catch (error: unknown) {
          const e = error as ApiError;
          return {
            success: false,
            message: e.response?.data?.message || "Không thể gửi OTP. Vui lòng thử lại sau.",
            errors: e.response?.data?.errors,
          };
        }
      },

      sendOtpForgotPassword: async (email: string): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.sendOtpForgotPassword, { email });
          return { success: true, message: response.data.message || "Mã OTP đã được gửi đến email của bạn." };
        } catch (error: unknown) {
          const e = error as ApiError;
          return {
            success: false,
            message: e.response?.data?.message || "Email không tồn tại hoặc lỗi server.",
            errors: e.response?.data?.errors,
          };
        }
      },

      resetPassword: async (data: ResetPasswordData): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.resetPassword, data);
          return { success: true, message: response.data.message || "Đổi mật khẩu thành công." };
        } catch (error: unknown) {
          const e = error as ApiError;
          return {
            success: false,
            message: e.response?.data?.message || "Mã OTP sai hoặc hết hạn.",
            errors: e.response?.data?.errors,
          };
        }
      },

      logout: async (): Promise<void> => {
        try {
          await apiClient.post(userEndpoints.auth.logout);
        } catch {
          // Ignore logout errors
        }

        set({ ...EMPTY_AUTH_STATE, lastFetchTime: 0 });
        clearTokenFromCookie();
        clearAllLocalData();
      },

      fetchUserInfo: async (force: boolean = false): Promise<void> => {
        try {
          set({ isFetchingUser: true });

          const token = getTokenFromCookie();
          if (!token) {
            set(EMPTY_AUTH_STATE);
            return;
          }

          const response = await apiClient.get(publicEndpoints.users.me);

          if (response.data.success && response.data.data) {
            const user = response.data.data;
            set({ ...userToState(user), lastFetchTime: Date.now() });
            persistUserData(user);
          } else {
            set(EMPTY_AUTH_STATE);
            clearTokenFromCookie();
          }
        } catch (error: unknown) {
          const e = error as ApiError;
          if (e.response?.status === 401 || e.response?.status === 403) {
            set(EMPTY_AUTH_STATE);
            if (e.response?.status === 401) clearTokenFromCookie();
            clearLocalUserData();
          }
        } finally {
          set({ isFetchingUser: false });
        }
      },

      checkAuth: async (): Promise<boolean> => {
        set({ isInitialized: true });

        const token = getTokenFromCookie();
        if (!token) {
          set(EMPTY_AUTH_STATE);
          return false;
        }

        const { isAuthenticated, user, lastFetchTime } = get();
        if (isAuthenticated && user && Date.now() - lastFetchTime < FETCH_CACHE_DURATION) {
          return true;
        }

        await get().fetchUserInfo();
        return get().isAuthenticated;
      },

      refreshUserInfo: async (): Promise<void> => {
        await get().fetchUserInfo(true);
      },

      refreshToken: async (): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.refresh);

          if (response.data.success && response.data.data?.token) {
            setTokenToCookie(response.data.data.token);
            return { success: true, data: response.data.data, message: response.data.message || "Làm mới token thành công." };
          }

          return { success: false, message: response.data.message || "Làm mới token thất bại" };
        } catch (error: unknown) {
          const e = error as ApiError;
          if (e.response?.status === 401) {
            await get().logout();
            return { success: false, message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" };
          }
          return { success: false, message: "Lỗi khi làm mới token" };
        }
      },

      initFromStorage: async (): Promise<boolean> => {
        if (typeof window === "undefined") return false;

        const token = getTokenFromCookie();
        const storedUser = storage.user.getData();
        const storedPermissions = storage.user.getPermissions();

        if (token && storedUser) {
          try {
            const response = await apiClient.get(userEndpoints.profile.me);

            if (response.data.success) {
              const user = response.data.data;
              set(userToState(user));
              persistUserData(user);
              return true;
            }

            get().clearAuthState();
            return false;
          } catch {
            // Fallback: dùng data từ localStorage nếu API fail
            if (storedUser) {
              set({
                ...userToState(storedUser),
                userPermissions: storedPermissions,
              });
              return true;
            }

            get().clearAuthState();
            return false;
          }
        }

        if (storedUser) {
          get().clearAuthState();
          return false;
        }

        return false;
      },

      clearAuthState: (): void => {
        set(EMPTY_AUTH_STATE);
        clearTokenFromCookie();
        clearAllLocalData();
      },

      setUser: (user: User): void => {
        set(userToState(user));
        persistUserData(user);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        userRole: state.userRole,
        userPermissions: state.userPermissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
