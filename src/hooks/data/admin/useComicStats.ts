"use client";

import { useState, useEffect } from "react";
import { adminStatsService } from "@/lib/api/admin/analytics";
import {
    AdminDashboardAnalytics,
    AdminViewHistoryItem,
    AdminAnalyticsComicStat,
} from "@/types/comic";
import { useToastContext } from "@/contexts/ToastContext";
import { format, subDays } from "date-fns";

export function useComicStats() {
    const { showError } = useToastContext();

    // States
    const [dashboard, setDashboard] = useState<AdminDashboardAnalytics | null>(null);
    const [viewHistory, setViewHistory] = useState<AdminViewHistoryItem[]>([]);
    const [topComics, setTopComics] = useState<AdminAnalyticsComicStat[]>([]);

    const [loadingDashboard, setLoadingDashboard] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [loadingTop, setLoadingTop] = useState(true);

    // Filters
    const [historyDateRange, setHistoryDateRange] = useState({
        start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
        end: format(new Date(), "yyyy-MM-dd"),
    });

    const [topFilter, setTopFilter] = useState({
        sortBy: "views" as "views" | "follows" | "rating",
        limit: 10,
    });

    // Fetch Dashboard
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoadingDashboard(true);
                const data = await adminStatsService.getDashboard();
                setDashboard(data);
            } catch (error) {
                showError("Không thể tải tổng quan thống kê");
            } finally {
                setLoadingDashboard(false);
            }
        };
        fetchDashboard();
    }, [showError]);

    // Fetch View History
    useEffect(() => {
        const fetchHistory = async () => {
            if (!historyDateRange.start || !historyDateRange.end) return;
            try {
                setLoadingHistory(true);
                const data = await adminStatsService.getViewHistory(
                    historyDateRange.start,
                    historyDateRange.end
                );
                setViewHistory(data);
            } catch (error) {
                showError("Không thể tải lịch sử lượt xem");
            } finally {
                setLoadingHistory(false);
            }
        };
        fetchHistory();
    }, [historyDateRange, showError]);

    // Fetch Top Comics
    useEffect(() => {
        const fetchTop = async () => {
            try {
                setLoadingTop(true);
                const data = await adminStatsService.getComicsRanking(topFilter);
                setTopComics(data);
            } catch (error) {
                showError("Không thể tải xếp hạng truyện");
            } finally {
                setLoadingTop(false);
            }
        };
        fetchTop();
    }, [topFilter, showError]);

    return {
        dashboard,
        viewHistory,
        topComics,
        loadingDashboard,
        loadingHistory,
        loadingTop,
        historyDateRange,
        setHistoryDateRange,
        topFilter,
        setTopFilter,
    };
}
