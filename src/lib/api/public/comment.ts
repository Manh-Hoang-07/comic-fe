import { Comment, PaginatedResponse } from "@/types/comic";
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { COMMENTS_PAGE_SIZE } from "@/config/constants";

export async function getComicComments(comicId: string, page: number = 1): Promise<PaginatedResponse<Comment> | null> {
    const { data, meta: responseMeta, error } = await serverFetch<Record<string, unknown>>(
        `${publicEndpoints.comments.comic(comicId)}?page=${page}`,
        {
            skipCookies: true,
            revalidate: 60 // Bình luận nên cập nhật nhanh hơn (1 phút)
        }
    );

    if (error || !data) return null;

    // Chuẩn hóa response data: chấp nhận cả data là mảng trực tiếp hoặc data { data: [] }
    const items = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
    const meta = (responseMeta || data.meta || {
        page: page,
        limit: COMMENTS_PAGE_SIZE,
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    }) as PaginatedResponse<Comment>["meta"];

    return { data: items, meta };
}

export async function getChapterComments(chapterId: string, page: number = 1): Promise<PaginatedResponse<Comment> | null> {
    const { data, meta: responseMeta, error } = await serverFetch<Record<string, unknown>>(
        `${publicEndpoints.comments.chapter(chapterId)}?page=${page}`,
        {
            skipCookies: true,
            revalidate: 60
        }
    );

    if (error || !data) return null;

    const items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
    const meta = (responseMeta || data.meta || {
        page: page,
        limit: COMMENTS_PAGE_SIZE,
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    }) as PaginatedResponse<Comment>["meta"];

    return { data: items, meta };
}


