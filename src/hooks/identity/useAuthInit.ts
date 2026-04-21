"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/lib/store/authTypes";

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  user: User | null;
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

    // Defer auth check để không block main thread trong quá trình hydration
    const initializeAuth = async () => {
      try {
        if (!authStore.isInitialized) {
          await authStore.checkAuth();
        }
      } catch (error) {
        console.warn("Auth initialization failed silently:", error);
      }
    };

    // Dùng requestIdleCallback để chạy khi browser rảnh, fallback setTimeout
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(() => initializeAuth());
    } else {
      setTimeout(() => initializeAuth(), 100);
    }
  // Chạy 1 lần khi mount — authStore methods là Zustand actions ổn định, không cần deps
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
      isAdmin: authStore.can("admin"),
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



