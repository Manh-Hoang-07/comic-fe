"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  user: any;
}

export interface AuthInitResult {
  isClientReady: boolean;
  shouldRenderAuthContent: boolean;
  safeAuthState: AuthState;
}

/**
 * Hook để khởi tạo auth và kiểm tra client ready
 */
export function useAuthInit(): AuthInitResult {
  const [isClientReady, setIsClientReady] = useState(false);
  const authStore = useAuthStore();

  useEffect(() => {
    // Đánh dấu client đã sẵn sàng
    setIsClientReady(true);

    // Kiểm tra session thực tế với server khi khởi chạy app
    const initializeAuth = async () => {
      try {
        // Chỉ chạy checkAuth nếu chưa được khởi tạo
        if (!authStore.isInitialized) {
          await authStore.checkAuth();
        }
      } catch (error) {
        console.warn("Auth initialization failed silently:", error);
      }
    };

    initializeAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Computed để kiểm tra xem có nên render auth-dependent content không
  const shouldRenderAuthContent = useMemo(() => {
    // Chỉ render khi client đã sẵn sàng và auth đã được khởi tạo
    return isClientReady && authStore.isInitialized;
  }, [isClientReady, authStore.isInitialized]);

  // Computed để lấy trạng thái auth an toàn
  const safeAuthState = useMemo((): AuthState => {
    if (!shouldRenderAuthContent) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        isUser: false,
        user: null,
      };
    }

    return {
      isAuthenticated: authStore.isAuthenticated,
      isAdmin: authStore.userRole === "admin",
      isUser: authStore.userRole === "user",
      user: authStore.user,
    };
  }, [shouldRenderAuthContent, authStore]);

  return {
    isClientReady,
    shouldRenderAuthContent,
    safeAuthState,
  };
}



