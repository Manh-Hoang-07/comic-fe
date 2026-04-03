import { api } from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { AdminDashboardAnalytics, AdminAnalyticsComicStat, AdminViewHistoryItem } from "@/types/comic";

export const adminStatsService = {
    /**
     * Get dashboard analytics summary
     */
    getDashboard: async (): Promise<AdminDashboardAnalytics> => {
        const response = await api.get<{ data: AdminDashboardAnalytics }>(adminEndpoints.analytics.dashboard);
        return response.data.data;
    },

    /**
     * Get comic rankings/stats
     */
    getComicsRanking: async (params: {
        limit?: number;
        sortBy?: 'views' | 'follows' | 'rating';
    }): Promise<AdminAnalyticsComicStat[]> => {
        const response = await api.get<{ data: AdminAnalyticsComicStat[] }>(adminEndpoints.analytics.comics, { params });
        return response.data.data;
    },

    /**
     * Get view history chart data
     */
    getViewHistory: async (startDate: string, endDate: string): Promise<AdminViewHistoryItem[]> => {
        const response = await api.get<{ data: AdminViewHistoryItem[] }>(adminEndpoints.analytics.views, {
            params: { startDate, endDate }
        });
        return response.data.data;
    }
};


