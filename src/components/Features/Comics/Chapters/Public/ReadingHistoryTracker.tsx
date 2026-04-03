"use client";

import { useEffect } from "react";
import { userComicService } from "@/lib/api/user/comic";
import { useAuthStore } from "@/lib/store/authStore";

interface ReadingHistoryTrackerProps {
    comicId: string | number;
    chapterId: string | number;
}

export function ReadingHistoryTracker({ comicId, chapterId }: ReadingHistoryTrackerProps) {
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        const hasToken = typeof window !== 'undefined' && document.cookie.includes('auth_token');
        if (isAuthenticated && hasToken && comicId && chapterId) {
            userComicService.updateReadingHistory({ comic_id: comicId, chapter_id: chapterId })
                .catch(err => {
                    // Avoid logging if it's an auth error, status check shouldn't spam console
                    if (err.response?.status !== 401 && err.response?.status !== 403) {
                        console.error("Failed to update reading history:", err);
                    }
                });
        }
    }, [isAuthenticated, comicId, chapterId]);

    return null;
}
