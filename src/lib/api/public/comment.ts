import { Comment, PaginatedResponse } from "@/types/comic";
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";

export async function getComicComments(comicId: string, page: number = 1): Promise<PaginatedResponse<Comment> | null> {
    const { data, meta: responseMeta, error } = await serverFetch<any>(
        `${publicEndpoints.comments.comic(comicId)}?page=${page}`,
        {
            skipCookies: true,
            revalidate: 60 // Bình luận nên cập nhật nhanh hơn (1 phút)
        }
    );

    if (error || !data) return null;

    // Chuẩn hóa response data: chấp nhận cả data là mảng trực tiếp hoặc data { data: [] }
    const items = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
    const meta = responseMeta || data.meta || {
        page: page,
        limit: 20,
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    return { data: items, meta };
}

export async function getChapterComments(chapterId: string, page: number = 1): Promise<PaginatedResponse<Comment> | null> {
    const { data, meta: responseMeta, error } = await serverFetch<any>(
        `${publicEndpoints.comments.chapter(chapterId)}?page=${page}`,
        {
            skipCookies: true,
            revalidate: 60
        }
    );

    // CHỈNH SỬA: Log chi tiết hơn để debug
    const items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
    console.log(`[Comments Debug] Chapter ${chapterId}:`, {
        count: items.length,
        rawType: typeof data,
        isArray: Array.isArray(data)
    });

    if (error || !data) return null;
    const meta = responseMeta || data.meta || {
        page: page,
        limit: 20,
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    return { data: items, meta };
}


