import { HomepageData, Comic, ComicChapter, ChapterDetail, PaginatedResponse, ComicCategory, ComicPage } from "@/types/comic";
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { ADMIN_PAGE_SIZE } from "@/config/constants";

export async function getComicHomepageData(): Promise<HomepageData | null> {
    const { data, error } = await serverFetch<HomepageData>(publicEndpoints.homepage, {
        revalidate: 120,
        skipCookies: true,
    });
    if (error) {
        console.error("Error fetching comic homepage data:", error);
        return null;
    }
    return data;
}

export async function getComics(params: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    comic_category_id?: string;
    is_featured?: boolean;
    [key: string]: string | number | boolean | undefined | null;
}): Promise<PaginatedResponse<Comic> | null> {
    const query = new URLSearchParams();

    // Thêm tất cả các params vào query string
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.append(key, value.toString());
        }
    });

    const { data, meta: responseMeta, error } = await serverFetch<Record<string, unknown>>(`${publicEndpoints.comics.list}?${query.toString()}`, {
        skipCookies: true,
    });
    if (error || !data) return null;

    // Chuẩn hóa response data: chấp nhận cả data là mảng trực tiếp hoặc data { data: [] }
    const items = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
    const meta = (responseMeta || data.meta || {
        page: params.page || 1,
        limit: params.limit || ADMIN_PAGE_SIZE,
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    }) as PaginatedResponse<Comic>["meta"];

    return { data: items, meta };
}

export async function getComicDetail(slug: string): Promise<Comic | null> {
    const { data, error } = await serverFetch<Comic>(publicEndpoints.comics.detail(slug), {
        revalidate: 300, // Cache 5 phut
        skipCookies: true,
    });
    if (error) return null;
    return data;
}

export async function getComicChapters(slug: string, page: number = 1): Promise<PaginatedResponse<ComicChapter> | null> {
    const { data, meta: responseMeta, error } = await serverFetch<Record<string, unknown>>(`${publicEndpoints.comics.chapters(slug)}?page=${page}`, {
        revalidate: 120, // Cache 2 phut
        skipCookies: true,
    });
    if (error || !data) return null;

    const items = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
    const meta = (responseMeta || data.meta || {
        page: page,
        limit: ADMIN_PAGE_SIZE,
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    }) as PaginatedResponse<ComicChapter>["meta"];

    return { data: items, meta };
}

export async function getChapterPages(chapterId: string): Promise<ComicPage[] | null> {
    const { data, error } = await serverFetch<ComicPage[]>(`/public/chapters/${chapterId}/pages`, {
        skipCookies: true
    });
    if (error) return null;
    return data;
}

export async function getChapterNavigation(chapterId: string, direction: 'next' | 'prev'): Promise<{ id: string } | null> {
    const { data, error } = await serverFetch<{ id: string }>(`/public/chapters/${chapterId}/${direction}`, {
        skipCookies: true
    });
    if (error) return null;
    return data;
}

export async function getComicCategories(): Promise<ComicCategory[]> {
    const { data, error } = await serverFetch<Record<string, unknown>>(publicEndpoints.comicCategories.list, {
        skipCookies: true,
    });
    if (error || !data) return [];

    return Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
}

export async function trackView(chapterId: string): Promise<void> {
    await serverFetch(`/public/chapters/${chapterId}/view`, {
        method: 'POST',
        skipCookies: true
    });
}

export async function getChapterDetail(chapterId: string): Promise<any | null> {
    const { data, error } = await serverFetch<Record<string, unknown>>(`/public/chapters/${chapterId}`, {
        skipCookies: true
    });
    if (error) return null;
    return data;
}


