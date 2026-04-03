import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/lib/api/client";
import { publicEndpoints, userEndpoints } from "@/lib/api/endpoints";
import { setTokenToCookie, clearTokenFromCookie, getTokenFromCookie } from "@/lib/api/utils";
import { initializeUserGroups } from "@/lib/group/utils";

// ===== TYPES =====

interface User {
  id: number;
  name?: string;
  username?: string;
  email: string;
  phone?: string;
  role?: string;
  permissions?: string[];
  status?: string;
  avatar?: string;
  image?: string;
  birthday?: string;
  gender?: string;
  address?: string;
  about?: string;
  created_at?: string;
  updated_at?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterData {
  name: string;
  username?: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

interface ResetPasswordData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

interface AuthResult {
  success: boolean;
  data?: any;
  message?: string;
  errors?: Record<string, string[]>;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  userRole: string;
  userPermissions: string[];
  isFetchingUser: boolean;
  lastFetchTime: number;
  isInitialized: boolean;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  sendOtpRegister: (email: string) => Promise<AuthResult>;
  sendOtpForgotPassword: (email: string) => Promise<AuthResult>;
  resetPassword: (data: ResetPasswordData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  fetchUserInfo: (force?: boolean) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  refreshUserInfo: () => Promise<void>;
  refreshToken: () => Promise<AuthResult>;
  initFromStorage: () => Promise<boolean>;
  clearAuthState: () => void;
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  canAll: (permissions: string[]) => boolean;
  setUser: (user: User) => void;
}

const fetchCacheDuration = 30000; // Cache trong 30 giây

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      isAuthenticated: false,
      user: null,
      userRole: "",
      userPermissions: [],
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
        return permissions.some((permission) => get().can(permission));
      },

      canAll: (permissions: string[]): boolean => {
        if (!Array.isArray(permissions)) return false;
        return permissions.every((permission) => get().can(permission));
      },

      // Actions
      login: async (credentials: LoginCredentials): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.login, credentials);

          if (response.data.success) {
            set({ isAuthenticated: true });

            // Lưu token vào cookie (API mới trả về data.token)
            if (response.data.data?.token) {
              const days = credentials.remember ? 30 : 7;
              setTokenToCookie(response.data.data.token, "auth_token", days);
            }

            // Lưu thông tin user từ response (API mới trả về data.user)
            if (response.data.data?.user) {
              const user = response.data.data.user;
              set({
                user,
                userRole: user.role || "user",
                userPermissions: user.permissions || [],
              });

              // Lưu vào localStorage
              if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem(
                  "userPermissions",
                  JSON.stringify(user.permissions || [])
                );
              }
            }

            // QUAN TRỌNG: Xóa thông tin group cũ khi đăng nhập lại
            // Group ID sẽ được set lại khi vào trang admin
            if (typeof window !== "undefined") {
              localStorage.removeItem("user_groups");
              localStorage.removeItem("selected_group_id");
              clearTokenFromCookie("group_id");
            }

            return {
              success: true,
              data: response.data.data,
              message: response.data.message,
            };
          } else {
            return {
              success: false,
              message: response.data.message || "Đăng nhập thất bại",
            };
          }
        } catch (error: any) {
          // Enhanced error handling theo API mới
          if (error.response?.status === 401) {
            return {
              success: false,
              message:
                error.response?.data?.message ||
                "Email hoặc mật khẩu không chính xác.",
            };
          } else if (error.response?.status === 400) {
            return {
              success: false,
              message: error.response?.data?.message || "Dữ liệu không hợp lệ",
              errors: error.response?.data?.errors,
            };
          } else if (error.code === "ECONNABORTED") {
            return {
              success: false,
              message: "Kết nối bị timeout, vui lòng thử lại",
            };
          } else if (!error.response) {
            return {
              success: false,
              message: "Không thể kết nối đến server",
            };
          }

          return {
            success: false,
            message: error.userMessage || "Lỗi kết nối",
          };
        }
      },

      register: async (data: RegisterData): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.register, data);

          if (response.data.success || response.status === 201) {
            return {
              success: true,
              data: response.data.data,
              message: response.data.message || "Đăng ký thành công.",
            };
          } else {
            return {
              success: false,
              message: response.data.message || "Đăng ký thất bại",
              errors: response.data.errors,
            };
          }
        } catch (error: any) {
          // Enhanced error handling
          if (error.response?.status === 400) {
            return {
              success: false,
              message: error.response?.data?.message || "Dữ liệu không hợp lệ",
              errors: error.response?.data?.errors,
            };
          } else if (error.response?.status === 422) {
            return {
              success: false,
              message: "Dữ liệu không hợp lệ",
              errors: error.response?.data?.errors,
            };
          } else if (error.code === "ECONNABORTED") {
            return {
              success: false,
              message: "Kết nối bị timeout, vui lòng thử lại",
            };
          } else if (!error.response) {
            return {
              success: false,
              message: "Không thể kết nối đến server",
            };
          }

          return {
            success: false,
            message: error.response?.data?.message || error.userMessage || "Lỗi kết nối",
          };
        }
      },

      sendOtpRegister: async (email: string): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.sendOtpRegister, { email });

          return {
            success: true,
            message: response.data.message || "Mã OTP đã được gửi đến email của bạn.",
          };
        } catch (error: any) {
          return {
            success: false,
            message: error.response?.data?.message || "Không thể gửi OTP. Vui lòng thử lại sau.",
            errors: error.response?.data?.errors,
          };
        }
      },

      sendOtpForgotPassword: async (email: string): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.sendOtpForgotPassword, { email });

          return {
            success: true,
            message: response.data.message || "Mã OTP đã được gửi đến email của bạn.",
          };
        } catch (error: any) {
          return {
            success: false,
            message: error.response?.data?.message || "Email không tồn tại hoặc lỗi server.",
            errors: error.response?.data?.errors,
          };
        }
      },

      resetPassword: async (data: ResetPasswordData): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.resetPassword, data);

          return {
            success: true,
            message: response.data.message || "Đổi mật khẩu thành công.",
          };
        } catch (error: any) {
          return {
            success: false,
            message: error.response?.data?.message || "Mã OTP sai hoặc hết hạn.",
            errors: error.response?.data?.errors,
          };
        }
      },

      logout: async (): Promise<void> => {
        try {
          await apiClient.post(userEndpoints.auth.logout);
        } catch (error) {
          // Ignore logout errors
        }

        // Xóa state
        set({
          isAuthenticated: false,
          user: null,
          userRole: "",
          userPermissions: [],
          lastFetchTime: 0,
        });

        // Xóa token khỏi cookie và localStorage
        clearTokenFromCookie();
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("userPermissions");
          // Xóa groups và group_id khi logout
          localStorage.removeItem("user_groups");
          localStorage.removeItem("selected_group_id");
          clearTokenFromCookie("group_id");
        }
      },

      fetchUserInfo: async (force: boolean = false): Promise<void> => {
        try {
          set({ isFetchingUser: true });

          // Kiểm tra token trước
          const token = getTokenFromCookie();

          if (!token) {
            set({
              isAuthenticated: false,
              user: null,
              userRole: "",
              userPermissions: [],
            });
            return;
          }

          const response = await apiClient.get(publicEndpoints.users.me);

          if (response.data.success && response.data.data) {
            const user = response.data.data;
            set({
              user,
              userRole: user.role || "user",
              userPermissions: user.permissions || [],
              isAuthenticated: true,
              lastFetchTime: Date.now(),
            });

            // Lưu vào localStorage cho offline access
            if (typeof window !== "undefined") {
              localStorage.setItem("user", JSON.stringify(user));
              localStorage.setItem(
                "userPermissions",
                JSON.stringify(user.permissions || [])
              );
            }
          } else {
            // Token không hợp lệ
            set({
              isAuthenticated: false,
              user: null,
              userRole: "",
              userPermissions: [],
            });
            clearTokenFromCookie();
          }
        } catch (error: any) {
          // Handle specific errors
          if (error.response?.status === 401) {
            // Token expired or invalid
            set({
              isAuthenticated: false,
              user: null,
              userRole: "",
              userPermissions: [],
            });
            clearTokenFromCookie();
            if (typeof window !== "undefined") {
              localStorage.removeItem("user");
              localStorage.removeItem("userPermissions");
            }
          } else if (error.response?.status === 403) {
            // User not authorized
            set({
              isAuthenticated: false,
              user: null,
              userRole: "",
              userPermissions: [],
            });
            if (typeof window !== "undefined") {
              localStorage.removeItem("user");
              localStorage.removeItem("userPermissions");
            }
          }
        } finally {
          set({ isFetchingUser: false });
        }
      },

      checkAuth: async (): Promise<boolean> => {
        // Đánh dấu đã khởi tạo
        set({ isInitialized: true });

        // Kiểm tra token trong cookie trước
        const token = getTokenFromCookie();
        if (!token) {
          set({
            isAuthenticated: false,
            user: null,
            userRole: "",
            userPermissions: [],
          });
          return false;
        }

        // Nếu đã có user info và chưa hết hạn cache, không cần gọi API
        const { isAuthenticated, user, lastFetchTime } = get();
        if (
          isAuthenticated &&
          user &&
          Date.now() - lastFetchTime < fetchCacheDuration
        ) {
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
            // Cập nhật token mới
            setTokenToCookie(response.data.data.token);

            return {
              success: true,
              data: response.data.data,
              message: response.data.message || "Làm mới token thành công.",
            };
          } else {
            return {
              success: false,
              message: response.data.message || "Làm mới token thất bại",
            };
          }
        } catch (error: any) {
          // Handle errors
          if (error.response?.status === 401) {
            // Token expired, logout user
            await get().logout();
            return {
              success: false,
              message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
            };
          }

          return {
            success: false,
            message: error.userMessage || "Lỗi khi làm mới token",
          };
        }
      },

      // Initialize auth from localStorage
      initFromStorage: async (): Promise<boolean> => {
        if (typeof window === "undefined") return false;

        const token = getTokenFromCookie();
        const storedUser = localStorage.getItem("user");
        const storedPermissions = localStorage.getItem("userPermissions");

        if (token && storedUser) {
          try {
            // Thử lấy thông tin user từ API để verify token
            const response = await apiClient.get(userEndpoints.profile.me);

            if (response.data.success) {
              // Cập nhật state
              const user = response.data.data;
              set({
                isAuthenticated: true,
                user,
                userRole: user.role || "user",
                userPermissions: user.permissions || [],
              });

              // Cập nhật localStorage
              localStorage.setItem("user", JSON.stringify(user));
              localStorage.setItem(
                "userPermissions",
                JSON.stringify(user.permissions || [])
              );

              return true;
            } else {
              // Token không hợp lệ, xóa state
              get().clearAuthState();
              return false;
            }
          } catch (error) {
            // Fallback: sử dụng data từ localStorage nếu API fail
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              set({
                isAuthenticated: true,
                user: userData,
                userRole: userData.role || "user",
                userPermissions: JSON.parse(storedPermissions || "[]"),
              });
              return true;
            } else {
              get().clearAuthState();
              return false;
            }
          }
        } else if (storedUser) {
          // Có user data nhưng không có token, xóa state
          get().clearAuthState();
          return false;
        }
        return false;
      },

      // Clear auth state
      clearAuthState: (): void => {
        set({
          isAuthenticated: false,
          user: null,
          userRole: "",
          userPermissions: [],
        });
        clearTokenFromCookie();
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("userPermissions");
          // Xóa groups và group_id khi logout
          localStorage.removeItem("user_groups");
          localStorage.removeItem("selected_group_id");
          clearTokenFromCookie("group_id");
        }
      },

      setUser: (user: User): void => {
        set({
          user,
          userRole: user.role || "user",
          userPermissions: user.permissions || [],
          isAuthenticated: true,
        });

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
          if (user.permissions) {
            localStorage.setItem("userPermissions", JSON.stringify(user.permissions));
          }
        }
      },
    }),
    {
      name: "auth-storage",
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        userRole: state.userRole,
        userPermissions: state.userPermissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

