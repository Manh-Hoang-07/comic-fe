import { api } from "../client";
import { adminEndpoints } from "../endpoints";
import { ContentTemplate } from "@/types/api";

export interface ContentTemplateListParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: 'render' | 'file';
    type?: string;
    status?: 'active' | 'inactive';
}

export interface ContentTemplateListResponse {
    success: boolean;
    data: ContentTemplate[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ContentTemplateResponse {
    success: boolean;
    data: ContentTemplate;
}

export const contentTemplateService = {
    getList: async (params?: ContentTemplateListParams): Promise<ContentTemplateListResponse> => {
        const response = await api.get<ContentTemplateListResponse>(adminEndpoints.contentTemplates.list, { params });
        return response.data;
    },

    getDetail: async (id: string | number): Promise<ContentTemplateResponse> => {
        const response = await api.get<ContentTemplateResponse>(adminEndpoints.contentTemplates.show(id));
        return response.data;
    },

    create: async (data: Partial<ContentTemplate>): Promise<ContentTemplateResponse> => {
        const response = await api.post<ContentTemplateResponse>(adminEndpoints.contentTemplates.create, data);
        return response.data;
    },

    update: async (id: string | number, data: Partial<ContentTemplate>): Promise<ContentTemplateResponse> => {
        const response = await api.patch<ContentTemplateResponse>(adminEndpoints.contentTemplates.update(id), data);
        return response.data;
    },

    delete: async (id: string | number): Promise<{ success: boolean }> => {
        const response = await api.delete<{ success: boolean }>(adminEndpoints.contentTemplates.delete(id));
        return response.data;
    },

    test: async (id: string | number, payload: { to: string; variables: Record<string, any> }): Promise<{ success: boolean; data: any }> => {
        const response = await api.post<{ success: boolean; data: any }>(adminEndpoints.contentTemplates.test(id), payload);
        return response.data;
    },
};


