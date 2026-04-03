"use client";

import { useState, useEffect, useCallback } from "react";
import { userComicService } from "@/lib/api/user/comic";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/contexts/ToastContext";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";

interface FollowButtonProps {
    comicId: string | number;
    className?: string;
}

export function FollowButton({ comicId, className = "" }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuthStore();
    const { showError, showSuccess } = useToastContext();

    const checkStatus = useCallback(async () => {
        try {
            const res = await userComicService.checkFollowStatus(comicId);
            setIsFollowing(res.is_following);
        } catch (error: any) {
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                console.error("Failed to check follow status", error);
            }
        }
    }, [comicId]);

    useEffect(() => {
        if (isAuthenticated && typeof window !== 'undefined' && document.cookie.includes('auth_token')) {
            checkStatus();
        }
    }, [isAuthenticated, comicId, checkStatus]);

    const handleToggleFollow = async () => {
        if (!isAuthenticated) {
            showError("Bạn cần đăng nhập để theo dõi truyện");
            return;
        }

        setIsLoading(true);
        try {
            if (isFollowing) {
                await userComicService.unfollowComic(comicId);
                setIsFollowing(false);
                showSuccess("Đã bỏ theo dõi truyện");
            } else {
                await userComicService.followComic(comicId);
                setIsFollowing(true);
                showSuccess("Đã theo dõi truyện thành công");
            }
        } catch (error) {
            showError("Có lỗi xảy ra, vui lòng thử lại sau");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleFollow}
            disabled={isLoading}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition ${isFollowing
                ? "bg-red-50 border-2 border-red-600 text-red-600 hover:bg-red-100"
                : "bg-white border-2 border-red-600 text-red-600 hover:bg-red-50"
                } ${className} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {isFollowing ? (
                <>
                    <BookmarkSolidIcon className="w-5 h-5" />
                    Đang theo dõi
                </>
            ) : (
                <>
                    <BookmarkIcon className="w-5 h-5" />
                    Theo dõi
                </>
            )}
        </button>
    );
}
