import { api } from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { normalizeDetailResponse, normalizeListResponse } from "@/lib/api/response-normalizer";
import { AdminDashboardAnalytics, AdminAnalyticsComicStat, AdminViewHistoryItem } from "@/types/comic";

export const adminStatsService = {
    /**
     * Get dashboard analytics summary
     */
    getDashboard: async (): Promise<AdminDashboardAnalytics> => {
        const response = await api.get<{ data: AdminDashboardAnalytics }>(adminEndpoints.analytics.dashboard);
        return normalizeDetailResponse<AdminDashboardAnalytics>(response.data)!;
    },

    /**
     * Get comic rankings/stats
     */
    getComicsRanking: async (params: {
        limit?: number;
        sortBy?: 'views' | 'follows' | 'rating';
    }): Promise<AdminAnalyticsComicStat[]> => {
        const response = await api.get<{ data: AdminAnalyticsComicStat[] }>(adminEndpoints.analytics.comics, { params });
        return normalizeListResponse<AdminAnalyticsComicStat>(response.data);
    },

    /**
     * Get view history chart data
     */
    getViewHistory: async (startDate: string, endDate: string): Promise<AdminViewHistoryItem[]> => {
        const response = await api.get<{ data: AdminViewHistoryItem[] }>(adminEndpoints.analytics.views, {
            params: { startDate, endDate }
        });
        return normalizeListResponse<AdminViewHistoryItem>(response.data);
    }
};


