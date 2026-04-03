"use client";

import { useMemo } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import ComicCategoryFilter from "./ComicCategoryFilter";
import CreateComicCategory from "./CreateComicCategory";
import EditComicCategory from "./EditComicCategory";
import { AdminComicCategory } from "@/types/comic";

export default function AdminComicCategories() {
    const listOptions = useMemo(
        () => ({
            endpoints: {
                list: adminEndpoints.comicCategories.list,
                create: adminEndpoints.comicCategories.create,
                update: (id: string | number) => adminEndpoints.comicCategories.update(id),
                delete: (id: string | number) => adminEndpoints.comicCategories.delete(id),
                show: (id: string | number) => adminEndpoints.comicCategories.show(id),
            },
            messages: {
                createSuccess: "Đã tạo danh mục truyện thành công",
                updateSuccess: "Đã cập nhật danh mục truyện thành công",
                deleteSuccess: "Đã xóa danh mục truyện thành công",
            },
        }),
        []
    );

    const {
        items,
        loading,
        pagination,
        filters,
        apiErrors,
        modals,
        selectedItem,
        openCreateModal,
        closeCreateModal,
        openEditModal,
        closeEditModal,
        openDeleteModal,
        closeDeleteModal,
        updateFilters,
        changePage,
        handleCreate,
        handleUpdate,
        handleDelete,
        getSerialNumber,
        hasData,
    } = useAdminListPage(listOptions);

    return (
        <div className="admin-comic-categories">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="font-primary text-2xl font-bold text-gray-900 leading-none">Danh mục truyện</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm danh mục mới
                </button>
            </div>

            <ComicCategoryFilter initialFilters={filters} onUpdateFilters={updateFilters} />

            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <SkeletonLoader type="table" rows={5} columns={5} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        STT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Tên danh mục
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Slug
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Mô tả
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {items.map((category: AdminComicCategory, index) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {getSerialNumber(index)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{category.name}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {category.slug}
                                        </td>
                                        <td className="max-w-md px-6 py-4 text-sm text-gray-500">
                                            <p className="truncate" title={category.description}>
                                                {category.description || "-"}
                                            </p>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                            <Actions
                                                item={category}
                                                onEdit={() => openEditModal(category)}
                                                onDelete={() => openDeleteModal(category)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                            Không tìm thấy danh mục nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {hasData && (
                <div className="mt-6">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        onPageChange={changePage}
                    />
                </div>
            )}

            {/* Standardized Modals */}
            {modals.create && (
                <CreateComicCategory
                    show={modals.create}
                    apiErrors={apiErrors}
                    onClose={closeCreateModal}
                    onCreated={handleCreate}
                />
            )}

            {modals.edit && selectedItem && (
                <EditComicCategory
                    show={modals.edit}
                    category={selectedItem}
                    apiErrors={apiErrors}
                    onClose={closeEditModal}
                    onUpdated={(data) => handleUpdate(selectedItem.id, data)}
                />
            )}

            {selectedItem && (
                <ConfirmModal
                    show={modals.delete}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa danh mục "${selectedItem.name}"? Hành động này không thể hoàn tác.`}
                    onClose={closeDeleteModal}
                    onConfirm={() => handleDelete(selectedItem.id)}
                    confirmText="Xác nhận xóa"
                />
            )}
        </div>
    );
}


