import { api } from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";
import { Comment } from "@/types/comic";

export const commentService = {
    /**
     * Post a comment (or reply)
     */
    postComment: async (data: { comic_id: string | number; chapter_id?: string | number; parent_id?: string | number; content: string }): Promise<Comment> => {
        const response = await api.post<{ data: Comment }>(userEndpoints.comments.create, data);
        return response.data.data;
    },

    /**
     * Update my comment
     */
    updateComment: async (id: string | number, content: string): Promise<Comment> => {
        const response = await api.put<{ data: Comment }>(userEndpoints.comments.update(id), { content });
        return response.data.data;
    },

    /**
     * Delete my comment
     */
    deleteComment: async (commentId: string | number): Promise<{ success: boolean }> => {
        const response = await api.delete<{ success: boolean }>(userEndpoints.comments.delete(commentId));
        return response.data;
    }
};


