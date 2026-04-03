import { api } from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";
import { Bookmark, ReadingHistory, Follow } from "@/types/comic";

export const userComicService = {
    // Bookmark
    getBookmarks: async (): Promise<Bookmark[]> => {
        const response = await api.get<{ data: any }>(userEndpoints.bookmarks.list);
        const data = response.data.data;
        return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
    },
    createBookmark: async (data: { chapter_id: string | number; page_number: number }): Promise<Bookmark> => {
        const response = await api.post<{ data: Bookmark }>(userEndpoints.bookmarks.create, data);
        return response.data.data;
    },
    deleteBookmark: async (id: string | number): Promise<{ success: boolean }> => {
        const response = await api.delete<{ success: boolean }>(userEndpoints.bookmarks.delete(id));
        return response.data;
    },

    // Reading History
    getReadingHistory: async (): Promise<ReadingHistory[]> => {
        const response = await api.get<{ data: any }>(userEndpoints.readingHistory.list);
        const data = response.data.data;
        return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
    },
    updateReadingHistory: async (data: { comic_id: string | number; chapter_id: string | number }): Promise<ReadingHistory> => {
        const response = await api.post<{ data: ReadingHistory }>(userEndpoints.readingHistory.update, data);
        return response.data.data;
    },
    deleteReadingHistory: async (comicId: string | number): Promise<{ success: boolean }> => {
        const response = await api.delete<{ success: boolean }>(userEndpoints.readingHistory.delete(comicId));
        return response.data;
    },

    // Follows
    getFollows: async (): Promise<Follow[]> => {
        const response = await api.get<{ data: any }>(userEndpoints.follows.list);
        const data = response.data.data;
        return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
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
        return response.data.data || { is_following: false };
    }
};
