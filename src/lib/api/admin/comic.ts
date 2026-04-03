import { api } from "../client";
import { adminEndpoints } from "../endpoints/admin";
import {
    AdminComicCategory,
    AdminComic,
    AdminChapter,
    AdminResponse,
    ComicStatsOverview,
    ComicTrendingData,
    AdminChapterPage
} from "@/types/comic";

export const adminComicService = {
    // Categories
    getCategories: async (params?: { page?: number; limit?: number; search?: string }) => {
        const { data } = await api.get<AdminResponse<AdminComicCategory[]>>(adminEndpoints.comicCategories.list, { params });
        return data;
    },
    getCategory: async (id: number) => {
        const { data } = await api.get<AdminComicCategory>(adminEndpoints.comicCategories.show(id));
        return data;
    },
    createCategory: async (body: Partial<AdminComicCategory>) => {
        const { data } = await api.post<AdminComicCategory>(adminEndpoints.comicCategories.create, body);
        return data;
    },
    updateCategory: async (id: number, body: Partial<AdminComicCategory>) => {
        const { data } = await api.put<AdminComicCategory>(adminEndpoints.comicCategories.update(id), body);
        return data;
    },
    deleteCategory: async (id: number) => {
        const { data } = await api.delete<boolean>(adminEndpoints.comicCategories.delete(id));
        return data;
    },

    // Comics
    getComics: async (params?: { page?: number; limit?: number; search?: string; category_id?: number; status?: string }) => {
        const { data } = await api.get<AdminResponse<AdminComic[]>>(adminEndpoints.comics.list, { params });
        return data;
    },
    getComic: async (id: number) => {
        const { data } = await api.get<AdminComic>(adminEndpoints.comics.show(id));
        return data;
    },
    createComic: async (body: any) => {
        const { data } = await api.post<AdminComic>(adminEndpoints.comics.create, body);
        return data;
    },
    updateComic: async (id: number, body: any) => {
        const { data } = await api.put<AdminComic>(adminEndpoints.comics.update(id), body);
        return data;
    },
    deleteComic: async (id: number) => {
        const { data } = await api.delete(adminEndpoints.comics.delete(id));
        return data;
    },
    uploadCover: async (id: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post<AdminComic>(adminEndpoints.comics.uploadCover(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    // Chapters
    getChapters: async (params?: { page?: number; limit?: number; comic_id?: number }) => {
        const { data } = await api.get<AdminResponse<AdminChapter[]>>(adminEndpoints.chapters.list, { params });
        return data;
    },
    getChapter: async (id: number) => {
        const { data } = await api.get<AdminChapter>(adminEndpoints.chapters.show(id));
        return data;
    },
    createChapter: async (body: any) => {
        const { data } = await api.post<AdminChapter>(adminEndpoints.chapters.create, body);
        return data;
    },
    updateChapter: async (id: number, body: any) => {
        const { data } = await api.put<AdminChapter>(adminEndpoints.chapters.update(id), body);
        return data;
    },
    deleteChapter: async (id: number) => {
        const { data } = await api.delete(adminEndpoints.chapters.delete(id));
        return data;
    },
    uploadPages: async (id: number, files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        const { data } = await api.post<AdminChapterPage[]>(adminEndpoints.chapters.uploadPages(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },
    updatePages: async (id: number, pages: any[]) => {
        const { data } = await api.put(adminEndpoints.chapters.updatePages(id), { pages });
        return data;
    },

    // Stats
    getStatsOverview: async () => {
        const { data } = await api.get<ComicStatsOverview>(adminEndpoints.comicStats.overview);
        return data;
    },
    getTopViewed: async (params?: { period?: string; limit?: number }) => {
        const { data } = await api.get<AdminComic[]>(adminEndpoints.comicStats.topViewed, { params });
        return data;
    },
    getTopFollowed: async (params?: { limit?: number }) => {
        const { data } = await api.get<AdminComic[]>(adminEndpoints.comicStats.topFollowed, { params });
        return data;
    },
    getTrending: async (days: number = 7) => {
        const { data } = await api.get<ComicTrendingData[]>(adminEndpoints.comicStats.trending, { params: { days } });
        return data;
    },
};


