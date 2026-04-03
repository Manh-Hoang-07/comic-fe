import { api } from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";
import { ComicReview } from "@/types/comic";

export interface CreateReviewRequest {
    rating: number;
    content?: string;
}

export const reviewService = {
    /**
     * Get list of reviews by current user
     */
    getMyReviews: async (): Promise<ComicReview[]> => {
        const response = await api.get<{ data: ComicReview[] }>(userEndpoints.reviews.list);
        return response.data.data;
    },

    /**
     * Submit or update a review for a comic
     */
    submitReview: async (comicId: string | number, data: CreateReviewRequest): Promise<ComicReview> => {
        const response = await api.post<{ data: ComicReview }>(userEndpoints.reviews.comic(comicId), data);
        return response.data.data;
    },

    /**
     * Delete my review for a comic
     */
    deleteReview: async (comicId: string | number): Promise<{ success: boolean }> => {
        const response = await api.delete<{ success: boolean }>(userEndpoints.reviews.comic(comicId));
        return response.data;
    }
};


