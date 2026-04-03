'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api/client';
import { adminEndpoints } from '@/lib/api/endpoints/admin';
import { PostStatisticsOverview, PostViewStats } from '@/types/api';
import { format, subDays, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import Link from 'next/link';
import { BarChart3, TrendingUp, Eye, MessageSquare, FileText, Clock } from 'lucide-react';
import SkeletonLoader from '@/components/UI/Feedback/SkeletonLoader';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AdminPostStatistics() {
    const [overview, setOverview] = useState<PostStatisticsOverview | null>(null);
    const [selectedPostId, setSelectedPostId] = useState<string>('');
    const [postStats, setPostStats] = useState<PostViewStats[]>([]);
    const [startDate, setStartDate] = useState<string>(
        format(subDays(new Date(), 30), 'yyyy-MM-dd')
    );
    const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(false);

    const fetchOverview = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get<{ data: PostStatisticsOverview }>(
                adminEndpoints.posts.overview
            );
            setOverview(response.data.data);
        } catch (error) {
            console.error('Failed to fetch overview:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    const fetchPostStats = useCallback(async () => {
        if (!selectedPostId) return;

        try {
            setStatsLoading(true);
            const response = await apiClient.get<{ data: PostViewStats[] }>(
                adminEndpoints.posts.stats(selectedPostId),
                {
                    params: { start_date: startDate, end_date: endDate },
                }
            );
            setPostStats(response.data.data);
        } catch (error) {
            console.error('Failed to fetch post stats:', error);
        } finally {
            setStatsLoading(false);
        }
    }, [selectedPostId, startDate, endDate]);

    useEffect(() => {
        if (selectedPostId) {
            fetchPostStats();
        }
    }, [selectedPostId, fetchPostStats]);

    if (loading) {
        return (
            <div className="admin-post-statistics">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="text-blue-600" />
                        Thống kê bài viết
                    </h1>
                </div>
                <SkeletonLoader type="table" rows={10} columns={4} />
            </div>
        );
    }

    if (!overview) {
        return (
            <div className="admin-post-statistics">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Thống kê bài viết</h1>
                </div>
                <div className="bg-white shadow-md rounded-lg p-10 text-center text-gray-500">
                    Không thể tải dữ liệu thống kê
                </div>
            </div>
        );
    }

    // Chart data for post status distribution
    const statusChartData = {
        labels: ['Đã xuất bản', 'Bản nháp', 'Đã lên lịch'],
        datasets: [
            {
                data: [
                    overview.published_posts,
                    overview.draft_posts,
                    overview.scheduled_posts,
                ],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(59, 130, 246, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Chart data for comment status
    const commentChartData = {
        labels: ['Đã duyệt', 'Chờ duyệt'],
        datasets: [
            {
                data: [
                    overview.total_comments - overview.pending_comments,
                    overview.pending_comments,
                ],
                backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
                borderColor: ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)'],
                borderWidth: 2,
            },
        ],
    };

    // Chart data for post views over time
    const viewsChartData = {
        labels: postStats.map((stat) =>
            format(new Date(stat.view_date), 'dd/MM', { locale: vi })
        ),
        datasets: [
            {
                label: 'Lượt xem',
                data: postStats.map((stat) => stat.view_count),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
            },
        },
    };

    const lineChartOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="admin-post-statistics">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="text-blue-600" />
                    Thống kê bài viết
                </h1>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Tổng số bài viết</p>
                            <p className="text-2xl font-bold text-gray-900">{overview.total_posts.toLocaleString()}</p>
                        </div>
                        <FileText className="text-blue-500" size={32} />
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Đã xuất bản</p>
                            <p className="text-2xl font-bold text-gray-900">{overview.published_posts.toLocaleString()}</p>
                        </div>
                        <TrendingUp className="text-green-500" size={32} />
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Bản nháp</p>
                            <p className="text-2xl font-bold text-gray-900">{overview.draft_posts.toLocaleString()}</p>
                        </div>
                        <FileText className="text-yellow-500" size={32} />
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-cyan-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Đã lên lịch</p>
                            <p className="text-2xl font-bold text-gray-900">{overview.scheduled_posts.toLocaleString()}</p>
                        </div>
                        <Clock className="text-cyan-500" size={32} />
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Tổng bình luận</p>
                            <p className="text-2xl font-bold text-gray-900">{overview.total_comments.toLocaleString()}</p>
                        </div>
                        <MessageSquare className="text-purple-500" size={32} />
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Chờ duyệt</p>
                            <p className="text-2xl font-bold text-gray-900">{overview.pending_comments.toLocaleString()}</p>
                        </div>
                        <Clock className="text-red-500" size={32} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-purple-600 shadow-md rounded-lg p-6 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <p className="text-sm text-blue-100 mb-1">Lượt xem (30 ngày)</p>
                            <p className="text-3xl font-bold">{overview.total_views_last_30_days.toLocaleString()}</p>
                        </div>
                        <Eye className="text-white" size={40} />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">
                        Phân bố trạng thái bài viết
                    </h3>
                    <div style={{ height: '300px' }}>
                        <Doughnut data={statusChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">
                        Trạng thái bình luận
                    </h3>
                    <div style={{ height: '300px' }}>
                        <Doughnut data={commentChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Top Viewed Posts */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">
                    🔥 Top bài viết được xem nhiều nhất
                </h3>
                <div className="space-y-3">
                    {overview.top_viewed_posts.map((post, index) => (
                        <div
                            key={post.id}
                            className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/admin/postsss/${post.id}`}
                                    className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors block truncate"
                                >
                                    {post.name}
                                </Link>
                                <p className="text-xs text-gray-500 mt-1">
                                    Xuất bản:{' '}
                                    {(() => {
                                        if (!post.published_at) return 'Chưa xuất bản';
                                        const date = new Date(post.published_at);
                                        return isValid(date)
                                            ? format(date, 'dd/MM/yyyy HH:mm', { locale: vi })
                                            : 'Chưa xuất bản';
                                    })()}
                                </p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                                <p className="text-xl font-bold text-blue-600">
                                    {parseInt(post.view_count).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">lượt xem</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Individual Post Stats */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">
                    📊 Thống kê chi tiết theo bài viết
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label htmlFor="post-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn bài viết
                        </label>
                        <select
                            id="post-select"
                            value={selectedPostId}
                            onChange={(e) => setSelectedPostId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Chọn bài viết --</option>
                            {overview.top_viewed_posts.map((post) => (
                                <option key={post.id} value={post.id}>
                                    {post.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedPostId && (
                        <>
                            <div>
                                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Từ ngày
                                </label>
                                <input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Đến ngày
                                </label>
                                <input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}
                </div>

                {selectedPostId && (
                    <div className="mt-6">
                        {statsLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <SkeletonLoader type="table" rows={5} columns={2} />
                            </div>
                        ) : postStats.length > 0 ? (
                            <>
                                <h4 className="text-md font-semibold text-gray-900 mb-4">Lượt xem theo ngày</h4>
                                <div style={{ height: '400px' }}>
                                    <Line data={viewsChartData} options={lineChartOptions} />
                                </div>
                                <div className="flex gap-8 mt-6 pt-6 border-t">
                                    <div>
                                        <span className="text-sm text-gray-600">Tổng lượt xem:</span>
                                        <span className="ml-2 text-xl font-bold text-blue-600">
                                            {postStats
                                                .reduce((sum, stat) => sum + stat.view_count, 0)
                                                .toLocaleString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Trung bình/ngày:</span>
                                        <span className="ml-2 text-xl font-bold text-blue-600">
                                            {Math.round(
                                                postStats.reduce((sum, stat) => sum + stat.view_count, 0) /
                                                postStats.length
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                Không có dữ liệu thống kê trong khoảng thời gian này
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}




