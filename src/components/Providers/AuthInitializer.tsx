"use client";

import { useAuthInit } from "@/hooks/useAuthInit";

/**
 * Component để khởi tạo và verify authentication khi ứng dụng load
 * Đặt component này ở Root Layout
 */
export function AuthInitializer() {
    useAuthInit();
    return null;
}
