"use client";

import { useMemo } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import Modal from "@/components/UI/Feedback/Modal";
import ChapterFilter from "./ChapterFilter";
import CreateChapter from "./CreateChapter";
import EditChapter from "./EditChapter";
import PageManager from "./PageManager";
import { AdminChapter } from "@/types/comic";
import { useSearchParams, useRouter } from "next/navigation";
import { formatDateTime } from "@/utils/formatters";

import Link from "next/link";
import { adminComicService } from "@/lib/api/admin/comic";
import { useState, useEffect } from "react";

export default function AdminChapters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const comicId = searchParams.get("comic_id");
    const [comicTitle, setComicTitle] = useState<string | null>(null);

    useEffect(() => {
        if (comicId) {
            adminComicService.getComic(Number(comicId))
                .then(comic => setComicTitle(comic.title))
                .catch(() => setComicTitle(null));
        } else {
            setComicTitle(null);
        }
    }, [comicId]);

    const listOptions = useMemo(
        () => ({
            endpoints: {
                list: adminEndpoints.chapters.list,
                create: adminEndpoints.chapters.create,
                update: (id: string | number) => adminEndpoints.chapters.update(id),
                delete: (id: string | number) => adminEndpoints.chapters.delete(id),
                show: (id: string | number) => adminEndpoints.chapters.show(id),
            },
            messages: {
                createSuccess: "Đã tạo chương mới thành công",
                updateSuccess: "Đã cập nhật chương thành công",
                deleteSuccess: "Đã xóa chương thành công",
            },
            customModals: ["managePages"],
            transformItem: (item: any) => item,
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
        openModal,
        closeModal,
        updateFilters,
        changePage,
        handleCreate,
        handleUpdate,
        handleDelete,
        getSerialNumber,
        hasData,
    } = useAdminListPage(listOptions);

    return (
        <div className="admin-chapters">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        {comicId && (
                            <Link
                                href="/admin/comics"
                                className="p-1 -ml-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Quay lại thư viện"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                        )}
                        <h1 className="font-primary text-2xl font-bold text-gray-900">
                            {comicTitle ? `Chương truyện: ${comicTitle}` : "Danh sách chương"}
                        </h1>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        {comicId ? `Đang xem các chương của bộ truyện "${comicTitle || comicId}"` : "Quản lý mục lục các chương truyện"}
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm chương mới
                </button>
            </div>

            <ChapterFilter initialFilters={filters} onUpdateFilters={updateFilters} />

            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <SkeletonLoader type="table" rows={6} columns={6} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Tiêu đề chương
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Số trang
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Lượt xem
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {items.map((chapter: AdminChapter, index) => (
                                    <tr key={chapter.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {chapter.title}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {chapter.chapter_label && (
                                                        <span className="text-xs font-medium text-gray-500">
                                                            {chapter.chapter_label}
                                                        </span>
                                                    )}
                                                    {chapter.comic && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                            Truyện: {chapter.comic.title}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {chapter._count?.pages || 0} trang
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${chapter.status === "published"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {chapter.status === "published" ? "Công khai" : "Bản nháp"}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {chapter.view_count?.toLocaleString() || 0}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                                            {formatDateTime(chapter.created_at)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                            <Actions
                                                item={chapter}
                                                onEdit={() => openEditModal(chapter)}
                                                onDelete={() => openDeleteModal(chapter)}
                                                additionalActions={[
                                                    {
                                                        label: "Quản lý Trang",
                                                        icon: "photo",
                                                        action: () => openModal("managePages", chapter),
                                                        className: "text-blue-600 hover:text-blue-700",
                                                    },
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-gray-500 italic">
                                            Không tìm thấy chương nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {hasData && (
                <div className="mt-8">
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
                <CreateChapter
                    show={modals.create}
                    comicId={comicId}
                    apiErrors={apiErrors}
                    onClose={closeCreateModal}
                    onCreated={handleCreate}
                />
            )}

            {modals.edit && selectedItem && (
                <EditChapter
                    show={modals.edit}
                    chapter={selectedItem}
                    apiErrors={apiErrors}
                    onClose={closeEditModal}
                    onUpdated={(data) => handleUpdate(selectedItem.id, data)}
                />
            )}

            {/* Page Manager Modal */}
            <Modal
                show={modals.managePages}
                onClose={() => closeModal("managePages")}
                title={`Quản lý trang - ${selectedItem?.title}`}
                size="xl"
            >
                {selectedItem && (
                    <PageManager
                        chapter={selectedItem}
                        onClose={() => closeModal("managePages")}
                    />
                )}
            </Modal>

            {selectedItem && (
                <ConfirmModal
                    show={modals.delete}
                    title="Xác nhận xóa chương"
                    message={`Bạn có chắc chắn muốn xóa chương #${selectedItem.chapter_index}: ${selectedItem.title}?`}
                    onClose={closeDeleteModal}
                    onConfirm={() => handleDelete(selectedItem.id)}
                    confirmText="Xác nhận xóa"
                />
            )}
        </div>
    );
}


