"use client";

import { useState, useCallback } from "react";
import apiClient from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import { useAuthStore } from "@/lib/store/authStore";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone?: string;
  name?: string;
  image?: string;
  status: string;
  email_verified_at?: string | null;
  phone_verified_at?: string | null;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    id: number;
    user_id: number;
    birthday?: string;
    gender?: string;
    address?: string;
    about?: string;
    created_at: string;
    updated_at: string;
  };
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  image?: string;
  birthday?: string;
  gender?: string;
  address?: string;
  about?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface UserManagementResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: any;
}

export function useUserManagement() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { showSuccess, showError } = useToastContext();
  const authStore = useAuthStore();

  // Lấy thông tin user hiện tại
  const getCurrentUser = useCallback(async (): Promise<UserProfile | null> => {
    try {
      setLoading(true);
      const response = await apiClient.get(publicEndpoints.users.me);

      if (response.data.success && response.data.data) {
        setUser(response.data.data);
        return response.data.data;
      } else {
        showError(response.data.message || "Không thể lấy thông tin user");
        return null;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Không thể lấy thông tin user";
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Cập nhật thông tin user
  const updateProfile = useCallback(
    async (data: UpdateProfileData): Promise<UserManagementResult> => {
      try {
        setLoading(true);
        const response = await apiClient.patch(
          publicEndpoints.users.updateProfile,
          data
        );

        if (response.data.success) {
          // Cập nhật user trong store
          if (response.data.data) {
            setUser(response.data.data);
            // Cập nhật auth store
            authStore.setUser(response.data.data);
            // Refresh user info trong store
            await authStore.refreshUserInfo();
          }

          showSuccess(
            response.data.message || "Cập nhật thông tin thành công"
          );
          return {
            success: true,
            message: response.data.message || "Cập nhật thông tin thành công",
            data: response.data.data,
          };
        } else {
          const errorMessage =
            response.data.message || "Cập nhật thông tin thất bại";
          showError(errorMessage);
          return {
            success: false,
            message: errorMessage,
            errors: response.data.errors,
          };
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
        showError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          errors: error.response?.data?.errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError, authStore]
  );

  // Đổi mật khẩu
  const changePassword = useCallback(
    async (data: ChangePasswordData): Promise<UserManagementResult> => {
      try {
        setLoading(true);
        const response = await apiClient.patch(
          publicEndpoints.users.changePassword,
          data
        );

        if (response.data.success) {
          showSuccess(response.data.message || "Đổi mật khẩu thành công");
          return {
            success: true,
            message: response.data.message || "Đổi mật khẩu thành công",
          };
        } else {
          const errorMessage =
            response.data.message || "Đổi mật khẩu thất bại";
          showError(errorMessage);
          return {
            success: false,
            message: errorMessage,
            errors: response.data.errors,
          };
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
        showError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          errors: error.response?.data?.errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  // Đăng xuất
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await apiClient.post(publicEndpoints.auth.logout);
    } catch (error) {
      // Ignore logout errors, vẫn tiếp tục xóa state
      console.error("Logout error:", error);
    } finally {
      // Xóa state trong auth store
      await authStore.logout();
      setLoading(false);
    }
  }, [authStore]);

  return {
    loading,
    user,
    getCurrentUser,
    updateProfile,
    changePassword,
    logout,
  };
}



