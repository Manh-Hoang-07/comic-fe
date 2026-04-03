"use client";

import { useState, useEffect } from "react";
import { adminComicService } from "@/lib/api/admin/comic";
import { AdminComic, AdminMeta } from "@/types/comic";
import { useToastContext } from "@/contexts/ToastContext";
import Image from "next/image";

interface ComicListProps {
    onEdit: (comic: AdminComic) => void;
    onViewChapters: (comic: AdminComic) => void;
    refreshTrigger?: number;
}

export default function ComicList({ onEdit, onViewChapters, refreshTrigger }: ComicListProps) {
    const [comics, setComics] = useState<AdminComic[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState<AdminMeta | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const { showSuccess, showError } = useToastContext();

    const fetchComics = async () => {
        try {
            setLoading(true);
            const response = await adminComicService.getComics({
                page,
                limit: 10,
                search,
                status: status || undefined
            });
            setComics(response.data as any);
            setMeta(response.meta || null);
        } catch (error: any) {
            showError(error?.response?.data?.message || "Không thể tải danh sách truyện");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search, status, refreshTrigger]);

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa truyện này?")) return;

        try {
            await adminComicService.deleteComic(id);
            showSuccess("Xóa truyện thành công");
            fetchComics();
        } catch (error: any) {
            showError(error?.response?.data?.message || "Không thể xóa truyện");
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            draft: "bg-gray-100 text-gray-800",
            published: "bg-green-100 text-green-800",
            completed: "bg-blue-100 text-blue-800",
            hidden: "bg-red-100 text-red-800",
        };
        const labels: Record<string, string> = {
            draft: "Nháp",
            published: "Đã xuất bản",
            completed: "Hoàn thành",
            hidden: "Ẩn",
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status] || badges.draft}`}>
                {labels[status] || status}
            </span>
        );
    };

    if (loading && comics.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm truyện..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="draft">Nháp</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="hidden">Ẩn</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truyện</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chương</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lượt xem</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {comics.map((comic) => (
                            <tr key={comic.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 flex-shrink-0 relative">
                                            <Image
                                                src={comic.cover_image || "/placeholder-comic.png"}
                                                alt={comic.title}
                                                fill
                                                className="rounded object-cover"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{comic.title}</div>
                                            {comic.is_featured && (
                                                <span className="text-xs text-yellow-600">⭐ Nổi bật</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comic.author}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex flex-wrap gap-1">
                                        {comic.categories?.slice(0, 2).map((cat) => (
                                            <span key={cat.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                {cat.name}
                                            </span>
                                        ))}
                                        {comic.categories?.length > 2 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                +{comic.categories.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(comic.status)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comic.chapters_count || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comic.view_count || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onViewChapters(comic)}
                                        className="text-purple-600 hover:text-purple-900"
                                    >
                                        Chương
                                    </button>
                                    <button
                                        onClick={() => onEdit(comic)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(comic.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Trước
                    </button>
                    <span className="px-4 py-2">
                        Trang {page} / {meta.totalPages}
                    </span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === meta.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}


