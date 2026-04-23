"use client";

import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import { formatNumber } from "@/utils/formatters";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import ComicFilter from "./ComicFilter";
import CreateComic from "./CreateComic";
import EditComic from "./EditComic";
import { AdminComic } from "@/types/comic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getStatusBadge } from "@/config/constants/status";
import { COMIC_STATUS_BADGES } from "@/components/Features/Comics/constants";

const endpoints = adminEndpoints.comics;

export default function AdminComics() {
    const router = useRouter();
    const {
        data, actions, ui,
        createModal, editModal, deleteModal,
        handleDeleteConfirm, openCreate, openEdit, openDelete,
    } = useCrudList({
        endpoint: endpoints.list,
        deleteSuccessMessage: "Đã xóa truyện thành công",
    });

    const { items, loading, pagination, filters, hasData } = data;
    const { getSerialNumber } = ui;

    return (
        <div className="admin-comics">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold font-primary text-gray-900">Thư viện truyện</h1>
                <button
                    onClick={() => openCreate(endpoints.create)}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm truyện mới
                </button>
            </div>

            <ComicFilter initialFilters={filters} onUpdateFilters={actions.updateFilters} />

            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <SkeletonLoader type="table" rows={6} columns={6} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        STT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Truyện
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Tác giả
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Thống kê
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {items.map((comic: AdminComic, index) => {
                                    const badge = getStatusBadge(comic.status, COMIC_STATUS_BADGES);
                                    return (
                                        <tr key={comic.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {getSerialNumber(index)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-100 shadow-sm">
                                                        <Image
                                                            src={comic.cover_image || "/placeholder-comic.png"}
                                                            alt={comic.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="max-w-[200px]">
                                                        <div className="truncate text-sm font-semibold text-gray-900">
                                                            {comic.title}
                                                        </div>
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {comic.categories?.slice(0, 2).map((cat) => (
                                                                <span
                                                                    key={cat.id}
                                                                    className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gray-500"
                                                                >
                                                                    {cat.name}
                                                                </span>
                                                            ))}
                                                            {comic.is_featured && (
                                                                <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-yellow-700">
                                                                    Nổi bật
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {comic.author}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${badge.className}`}
                                                >
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <svg
                                                            className="h-3.5 w-3.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                        <span>{formatNumber(comic.view_count)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                        <svg
                                                            className="h-3.5 w-3.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                                            />
                                                        </svg>
                                                        <span>{comic.chapters_count || 0} chương</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                                <Actions
                                                    item={comic}
                                                    onEdit={() => openEdit(comic, endpoints)}
                                                    onDelete={() => openDelete(comic, endpoints, "title")}
                                                    additionalActions={[
                                                        {
                                                            label: "Chương truyện",
                                                            icon: "document-text",
                                                            action: () => router.push(`/admin/chapters?comic_id=${comic.id}`),
                                                            className: "text-purple-600 hover:text-purple-700",
                                                        },
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">
                                            Không tìm thấy truyện nào
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
                        onPageChange={actions.changePage}
                    />
                </div>
            )}

            {createModal.isOpen && createModal.data && (
                <CreateComic
                    show={createModal.isOpen}
                    createApi={createModal.data.createApi}
                    onClose={createModal.close}
                    onSuccess={() => {
                        createModal.close();
                        actions.refresh();
                    }}
                />
            )}

            {editModal.isOpen && editModal.data && (
                <EditComic
                    show={editModal.isOpen}
                    target={editModal.data}
                    onClose={editModal.close}
                    onSuccess={() => {
                        editModal.close();
                        actions.refresh();
                    }}
                />
            )}

            {deleteModal.isOpen && deleteModal.data && (
                <ConfirmModal
                    show={deleteModal.isOpen}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa truyện "${deleteModal.data.displayName}"? Dữ liệu các chương truyện cũng sẽ bị xóa.`}
                    onClose={deleteModal.close}
                    onConfirm={handleDeleteConfirm}
                    confirmText="Xác nhận xóa"
                />
            )}
        </div>
    );
}
