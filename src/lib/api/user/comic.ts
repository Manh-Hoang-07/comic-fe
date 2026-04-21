import { api } from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";
import { normalizeListResponse, normalizeDetailResponse } from "@/lib/api/response-normalizer";
import { Bookmark, ReadingHistory, Follow } from "@/types/comic";

export const userComicService = {
    // Bookmark
    getBookmarks: async (): Promise<Bookmark[]> => {
        const response = await api.get<{ data: Bookmark[] | { data: Bookmark[] } }>(userEndpoints.bookmarks.list);
        return normalizeListResponse<Bookmark>(response.data);
    },
    createBookmark: async (data: { chapter_id: string | number; page_number: number }): Promise<Bookmark> => {
        const response = await api.post<{ data: Bookmark }>(userEndpoints.bookmarks.create, data);
        return normalizeDetailResponse<Bookmark>(response.data)!;
    },
    deleteBookmark: async (id: string | number): Promise<{ success: boolean }> => {
        const response = await api.delete<{ success: boolean }>(userEndpoints.bookmarks.delete(id));
        return response.data;
    },

    // Reading History
    getReadingHistory: async (): Promise<ReadingHistory[]> => {
        const response = await api.get<{ data: ReadingHistory[] | { data: ReadingHistory[] } }>(userEndpoints.readingHistory.list);
        return normalizeListResponse<ReadingHistory>(response.data);
    },
    updateReadingHistory: async (data: { comic_id: string | number; chapter_id: string | number }): Promise<ReadingHistory> => {
        const response = await api.post<{ data: ReadingHistory }>(userEndpoints.readingHistory.update, data);
        return normalizeDetailResponse<ReadingHistory>(response.data)!;
    },
    deleteReadingHistory: async (comicId: string | number): Promise<{ success: boolean }> => {
        const response = await api.delete<{ success: boolean }>(userEndpoints.readingHistory.delete(comicId));
        return response.data;
    },

    // Follows
    getFollows: async (): Promise<Follow[]> => {
        const response = await api.get<{ data: Follow[] | { data: Follow[] } }>(userEndpoints.follows.list);
        return normalizeListResponse<Follow>(response.data);
    },
    followComic: async (comicId: string | number): Promise<{ success: boolean }> => {
        const response = await api.post<{ success: boolean }>(userEndpoints.follows.follow(comicId));
        return response.data;
    },
    unfollowComic: async (comicId: string | number): Promise<{ success: boolean }> => {
        const response = await api.delete<{ success: boolean }>(userEndpoints.follows.unfollow(comicId));
        return response.data;
    },
    checkFollowStatus: async (comicId: string | number): Promise<{ is_following: boolean }> => {
        const response = await api.get<{ data: { is_following: boolean } }>(userEndpoints.follows.checkStatus(comicId));
        return normalizeDetailResponse<{ is_following: boolean }>(response.data) || { is_following: false };
    }
};
