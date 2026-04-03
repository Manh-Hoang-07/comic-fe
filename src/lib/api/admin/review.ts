import { api } from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { ComicReview, ReviewStatistics, ReviewQueryParams, AdminResponse } from "@/types/comic";

export const adminReviewService = {
    /**
     * Get list of reviews with filters
     */
    getList: async (params: ReviewQueryParams): Promise<AdminResponse<ComicReview[]>> => {
        const response = await api.get<AdminResponse<ComicReview[]>>(adminEndpoints.reviews.list, { params });
        return response.data;
    },

    /**
     * Get review statistics
     */
    getStatistics: async (): Promise<ReviewStatistics> => {
        const response = await api.get<{ data: ReviewStatistics }>(adminEndpoints.reviews.statistics);
        return response.data.data;
    },

    /**
     * Update a review (e.g., content or rating)
     */
    update: async (id: string | number, data: Partial<ComicReview>): Promise<ComicReview> => {
        const response = await api.put<{ data: ComicReview }>(adminEndpoints.reviews.update(id), data);
        return response.data.data;
    },

    /**
     * Delete a review
     */
    delete: async (id: string | number): Promise<{ success: boolean }> => {
        const response = await api.delete<{ success: boolean }>(adminEndpoints.reviews.delete(id));
        return response.data;
    }
};


