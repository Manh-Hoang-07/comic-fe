"use client";

import { useState, useEffect, useCallback } from "react";
import { userComicService } from "@/lib/api/user/comic";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/contexts/ToastContext";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";

interface BookmarkButtonProps {
    chapterId: string | number;
    pageNumber?: number;
    className?: string;
}

export function BookmarkButton({ chapterId, pageNumber = 1, className = "" }: BookmarkButtonProps) {
    const [bookmarkId, setBookmarkId] = useState<string | number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuthStore();
    const { showError, showSuccess } = useToastContext();

    const checkStatus = useCallback(async () => {
        try {
            const bookmarks = await userComicService.getBookmarks();
            const existing = bookmarks.find(b => b.chapter_id == chapterId);
            if (existing) {
                setBookmarkId(existing.id);
            }
        } catch (error: any) {
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                console.error("Failed to check bookmark status", error);
            }
        } finally {
            setIsLoading(false);
        }
    }, [chapterId]);

    useEffect(() => {
        const hasToken = typeof window !== 'undefined' && document.cookie.includes('auth_token');
        if (isAuthenticated && hasToken) {
            checkStatus();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, chapterId, checkStatus]);

    const handleToggleBookmark = async () => {
        if (!isAuthenticated) {
            showError("Bạn cần đăng nhập để đánh dấu trang");
            return;
        }

        setIsLoading(true);
        try {
            if (bookmarkId) {
                // Remove bookmark
                await userComicService.deleteBookmark(bookmarkId);
                setBookmarkId(null);
                showSuccess("Đã bỏ đánh dấu trang");
            } else {
                // Add bookmark
                const newBookmark = await userComicService.createBookmark({
                    chapter_id: chapterId,
                    page_number: pageNumber
                });
                setBookmarkId(newBookmark.id);
                showSuccess(`Đã đánh dấu trang ${pageNumber}`);
            }
        } catch (error) {
            showError("Có lỗi xảy ra khi thực hiện thao tác");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleBookmark}
            disabled={isLoading}
            title={bookmarkId ? "Bỏ đánh dấu trang" : "Đánh dấu trang"}
            className={`w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition-all active:scale-90 ${className}`}
        >
            {bookmarkId ? (
                <BookmarkSolidIcon className="w-6 h-6 text-red-600 animate-in zoom-in duration-300" />
            ) : (
                <BookmarkIcon className="w-6 h-6" />
            )}
        </button>
    );
}
