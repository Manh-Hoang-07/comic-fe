import { api } from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { AdminResponse, Comment } from "@/types/comic";

export const adminCommentService = {
    /**
     * Get list of comic comments
     */
    getList: async (params: {
        page?: number;
        limit?: number;
        search?: string;
        comic_id?: string;
        status?: string;
    }): Promise<AdminResponse<Comment[]>> => {
        const response = await api.get<AdminResponse<Comment[]>>(adminEndpoints.comicComments.list, { params });
        return response.data;
    },

    /**
     * Update comment status (e.g., hide/show)
     */
    updateStatus: async (id: string | number, status: string): Promise<{ success: boolean }> => {
        const response = await api.patch<{ success: boolean }>(adminEndpoints.comicComments.updateStatus(id), { status });
        return response.data;
    },

    /**
     * Delete a comment
     */
    delete: async (id: string | number): Promise<{ success: boolean }> => {
        const response = await api.delete<{ success: boolean }>(adminEndpoints.comicComments.delete(id));
        return response.data;
    }
};


