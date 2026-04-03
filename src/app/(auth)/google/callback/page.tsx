"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { setTokenToCookie } from "@/lib/api/utils";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { fetchUserInfo } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const error = searchParams.get("error");
        const expiresIn = searchParams.get("expiresIn");

        if (error) {
            router.push(`/login?error=${error}`);
            return;
        }

        if (token) {
            // 1. Lưu token vào cookie
            setTokenToCookie(token);

            // Lưu refreshToken vào localStorage nếu cần thiết
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            // 2. Fetch user info để cập nhật state trong store
            fetchUserInfo(true)
                .then(() => {
                    // 3. Redirect user vào app
                    router.push("/dashboard/admin");
                })
                .catch((err) => {
                    console.error("Failed to fetch user info", err);
                    router.push("/login?error=auth_failed");
                });
        } else {
            // Nếu không có token và không có error, có thể do truy cập trực tiếp URL
            // Redirect về login
            router.push("/login?error=invalid_callback");
        }
    }, [searchParams, router, fetchUserInfo]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Đang xử lý đăng nhập...</h2>
                <p className="text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
            </div>
        </div>
    );
}


