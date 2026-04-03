"use client";

import { useState, useEffect } from "react";
import { adminComicService } from "@/lib/api/admin/comic";
import { AdminComicCategory, AdminMeta } from "@/types/comic";
import { useToastContext } from "@/contexts/ToastContext";

interface ComicCategoryListProps {
    onEdit: (category: AdminComicCategory) => void;
    refreshTrigger?: number;
}

export default function ComicCategoryList({ onEdit, refreshTrigger }: ComicCategoryListProps) {
    const [categories, setCategories] = useState<AdminComicCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState<AdminMeta | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { showSuccess, showError } = useToastContext();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await adminComicService.getCategories({ page, limit: 10, search });
            setCategories(response.data as any);
            setMeta(response.meta || null);
        } catch (error: any) {
            showError(error?.response?.data?.message || "Không thể tải danh mục");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search, refreshTrigger]);

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;

        try {
            await adminComicService.deleteCategory(id);
            showSuccess("Xóa danh mục thành công");
            fetchCategories();
        } catch (error: any) {
            showError(error?.response?.data?.message || "Không thể xóa danh mục");
        }
    };

    if (loading && categories.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm danh mục..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{category.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onEdit(category)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
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


