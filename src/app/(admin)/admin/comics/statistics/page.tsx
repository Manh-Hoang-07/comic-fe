"use client";

import { useState, useEffect, useMemo } from "react";
import { adminStatsService } from "@/lib/api/admin/analytics";
import {
    AdminDashboardAnalytics,
    AdminViewHistoryItem,
    AdminAnalyticsComicStat
} from "@/types/comic";
import { useToastContext } from "@/contexts/ToastContext";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import DateRangeFilter from "@/components/UI/Filters/DateRangeFilter";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import Image from "next/image";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, subDays } from "date-fns";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function ComicStatsPage() {
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
        end: format(new Date(), "yyyy-MM-dd")
    });

    const [topFilter, setTopFilter] = useState({
        sortBy: 'views' as 'views' | 'follows' | 'rating',
        limit: 10
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

    // Chart Data
    const chartData = useMemo(() => ({
        labels: viewHistory.map(item => format(new Date(item.date), "dd/MM")),
        datasets: [
            {
                label: 'Lượt xem',
                data: viewHistory.map(item => item.count),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    }), [viewHistory]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f3f4f6',
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        },
    };

    return (
        <div className="w-full p-4 space-y-6">
            <PageMeta
                title="Thống kê & Báo cáo"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Thống kê" },
                ]}
            />

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Thống kê truyện tranh</h1>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Tổng số truyện"
                    value={dashboard?.total_comics || 0}
                    loading={loadingDashboard}
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                    color="text-blue-600 bg-blue-50"
                />
                <StatCard
                    title="Tổng lượt xem"
                    value={dashboard?.total_views || 0}
                    loading={loadingDashboard}
                    icon={
                        <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                    }
                    color="text-green-600 bg-green-50"
                />
                <StatCard
                    title="Lượt theo dõi"
                    value={dashboard?.total_follows || 0}
                    loading={loadingDashboard}
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
                    color="text-pink-600 bg-pink-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Views Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Biểu đồ lượt xem</h2>
                        <div className="w-full sm:w-auto">
                            <DateRangeFilter
                                value={historyDateRange}
                                onChange={setHistoryDateRange}
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-h-[300px] flex items-center justify-center">
                        {loadingHistory ? (
                            <div className="w-full space-y-2">
                                <div className="h-64 bg-gray-50 rounded animate-pulse"></div>
                            </div>
                        ) : viewHistory.length > 0 ? (
                            <Bar data={chartData} options={chartOptions} />
                        ) : (
                            <p className="text-gray-500 italic">Không có dữ liệu trong khoảng thời gian này</p>
                        )}
                    </div>
                </div>

                {/* Top Statistics Table */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex flex-col gap-4 mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Xếp hạng truyện</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <SelectFilter
                                value={topFilter.sortBy}
                                options={[
                                    { label: "Lượt xem", value: "views" },
                                    { label: "Lượt theo dõi", value: "follows" },
                                    { label: "Đánh giá", value: "rating" },
                                ]}
                                onChange={(val) => setTopFilter(prev => ({ ...prev, sortBy: val as any }))}
                            />
                            <SelectFilter
                                value={topFilter.limit.toString()}
                                options={[
                                    { label: "Top 5", value: "5" },
                                    { label: "Top 10", value: "10" },
                                    { label: "Top 20", value: "20" },
                                    { label: "Top 50", value: "50" },
                                ]}
                                onChange={(val) => setTopFilter(prev => ({ ...prev, limit: parseInt(String(val)) }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loadingTop ? (
                            <SkeletonLoader type="list" items={5} />
                        ) : topComics.length > 0 ? (
                            topComics.map((item, index) => (
                                <div key={item.comic.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${index === 0 ? "bg-yellow-100 text-yellow-700" :
                                        index === 1 ? "bg-gray-100 text-gray-700" :
                                            index === 2 ? "bg-orange-100 text-orange-700" :
                                                "text-gray-400"
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="relative w-10 h-14 flex-shrink-0">
                                        <Image
                                            src={item.comic.cover_image || "/placeholder-comic.png"}
                                            alt={item.comic.title}
                                            fill
                                            className="object-cover rounded border border-gray-100"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{item.comic.title}</p>
                                        <p className="text-xs text-gray-500">{item.comic.author}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-blue-600">
                                            {topFilter.sortBy === 'views' ? item.stats.view_count.toLocaleString() :
                                                topFilter.sortBy === 'follows' ? item.stats.follow_count.toLocaleString() :
                                                    (item.stats.rating_sum / (item.stats.rating_count || 1)).toFixed(1)}
                                        </p>
                                        <p className="text-[10px] uppercase text-gray-400 font-medium">
                                            {topFilter.sortBy === 'views' ? 'Lượt xem' :
                                                topFilter.sortBy === 'follows' ? 'Follows' :
                                                    'Rating'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 italic py-10">Không có dữ liệu</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, loading }: any) {
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {icon}
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}


