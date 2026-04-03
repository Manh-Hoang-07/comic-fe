import { ComicReview, PaginatedResponse } from "@/types/comic";
import { serverFetch } from "@/lib/api/server-client";

export async function getComicReviews(comicId: string, params: {
    page?: number;
    limit?: number;
}): Promise<PaginatedResponse<ComicReview> | null> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());

    const { data, meta: responseMeta, error } = await serverFetch<ComicReview[]>(
        `/public/reviews/comics/${comicId}?${query.toString()}`,
        { skipCookies: true }
    );

    if (error || !data) return null;

    const items = Array.isArray(data) ? data : [];
    const meta = responseMeta || {
        page: params.page || 1,
        limit: params.limit || 20,
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    return { data: items, meta };
}


