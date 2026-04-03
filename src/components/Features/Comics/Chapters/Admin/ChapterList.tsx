"use client";

import { useState, useEffect } from "react";
import { adminComicService } from "@/lib/api/admin/comic";
import { AdminChapter, AdminMeta } from "@/types/comic";
import { useToastContext } from "@/contexts/ToastContext";

interface ChapterListProps {
    comicId?: number;
    onEdit: (chapter: AdminChapter) => void;
    onManagePages: (chapter: AdminChapter) => void;
    refreshTrigger?: number;
}

export default function ChapterList({ comicId, onEdit, onManagePages, refreshTrigger }: ChapterListProps) {
    const [chapters, setChapters] = useState<AdminChapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState<AdminMeta | null>(null);
    const [page, setPage] = useState(1);
    const { showSuccess, showError } = useToastContext();

    const fetchChapters = async () => {
        try {
            setLoading(true);
            const response = await adminComicService.getChapters({
                page,
                limit: 20,
                comic_id: comicId
            });
            setChapters(response.data as any);
            setMeta(response.meta || null);
        } catch (error: any) {
            showError(error?.response?.data?.message || "Không thể tải danh sách chương");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChapters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, comicId, refreshTrigger]);

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa chương này?")) return;

        try {
            await adminComicService.deleteChapter(id);
            showSuccess("Xóa chương thành công");
            fetchChapters();
        } catch (error: any) {
            showError(error?.response?.data?.message || "Không thể xóa chương");
        }
    };

    if (loading && chapters.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số thứ tự</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhãn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lượt xem</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {chapters.map((chapter) => (
                            <tr key={chapter.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{chapter.chapter_index}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{chapter.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chapter.chapter_label || "-"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${chapter.status === "published"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                        }`}>
                                        {chapter.status === "published" ? "Đã xuất bản" : "Nháp"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chapter.view_count || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(chapter.created_at).toLocaleDateString("vi-VN")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onManagePages(chapter)}
                                        className="text-purple-600 hover:text-purple-900"
                                    >
                                        Trang
                                    </button>
                                    <button
                                        onClick={() => onEdit(chapter)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(chapter.id)}
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

            {chapters.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    Chưa có chương nào. Hãy thêm chương mới!
                </div>
            )}

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


