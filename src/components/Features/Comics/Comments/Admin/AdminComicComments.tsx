"use client";

import { useState, Fragment } from "react";
import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import ComicCommentFilter from "./ComicCommentFilter";
import { Comment } from "@/types/comic";
import Image from "next/image";
import { User, MessageSquare, CornerDownRight, BookOpen, Layers } from "lucide-react";
import api from "@/lib/api/client";
import { formatDateTime as formatDate } from "@/utils/formatters";

const endpoints = adminEndpoints.comicComments;

export default function AdminComicComments() {
    const {
        data, actions, ui, toast,
        deleteModal, handleDeleteConfirm,
    } = useCrudList({
        endpoint: endpoints.list,
        deleteSuccessMessage: "Bình luận đã được xóa thành công",
    });

    const { items, loading, pagination, filters, hasData } = data;
    const { getSerialNumber } = ui;

    const [togglingId, setTogglingId] = useState<string | number | null>(null);

    const handleToggleStatus = async (comment: Comment) => {
        const newStatus = comment.status === "visible" ? "hidden" : "visible";
        setTogglingId(comment.id);
        try {
            await api.put(adminEndpoints.comicComments.update(comment.id), {
                status: newStatus,
            });
            toast.success(`Đã ${newStatus === "visible" ? "hiện" : "ẩn"} bình luận`);
            actions.refresh();
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái bình luận");
        } finally {
            setTogglingId(null);
        }
    };

    const renderCommentRows = (comment: Comment, index: number, depth = 0) => {
        const isReply = depth > 0;

        return (
            <Fragment key={comment.id}>
                <tr className={`
                    ${comment.status === "hidden" ? "bg-red-50" : ""}
                    ${isReply ? "bg-gray-50/30" : "bg-white"}
                    hover:bg-gray-50 transition-colors
                `}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {!isReply ? getSerialNumber(index) : ""}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center" style={{ paddingLeft: `${depth * 1.5}rem` }}>
                            {isReply && <CornerDownRight className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />}
                            <div className="h-8 w-8 flex-shrink-0">
                                {comment.user?.image ? (
                                    <Image
                                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                        src={comment.user.image}
                                        alt={comment.user.username || "User"}
                                        width={32}
                                        height={32}
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-gray-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-3 min-w-0 flex-1">
                                <div className="truncate text-sm font-medium text-gray-900">
                                    {comment.user?.username || "Khách"}
                                </div>
                                <div className="truncate text-xs text-gray-500">
                                    {comment.user?.email}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 break-words max-w-md">
                            {comment.content}
                        </div>
                        <div className="mt-1.5 flex flex-col gap-1 text-xs text-gray-400">
                            {comment.comic && (
                                <div className="flex items-center gap-1.5">
                                    <BookOpen className="w-3 h-3 flex-shrink-0" />
                                    <span className="flex-shrink-0">Truyện:</span>
                                    <a
                                        href={`/comics/${comment.comic.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[180px]"
                                        title={comment.comic.title}
                                    >
                                        {comment.comic.title}
                                    </a>
                                </div>
                            )}
                            {comment.chapter && (
                                <div className="flex items-center gap-1.5 ml-2">
                                    <Layers className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                    <span className="flex-shrink-0">Chương:</span>
                                    <a
                                        href={comment.chapter.slug ? `/comics/${comment.comic?.slug}/chapters/${comment.chapter.slug}` : '#'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-gray-600 hover:text-gray-900 hover:underline truncate max-w-[150px]"
                                        title={comment.chapter.title}
                                    >
                                        {comment.chapter.title}
                                    </a>
                                </div>
                            )}
                        </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                        <span
                            onClick={() => handleToggleStatus(comment)}
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 cursor-pointer transition-colors ${comment.status === 'visible'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                        >
                            {togglingId === comment.id ? '...' : (comment.status === 'visible' ? 'Công khai' : 'Đang ẩn')}
                        </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(comment.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                        <Actions
                            item={comment}
                            showView={false}
                            showEdit={false}
                            showDelete={true}
                            onDelete={() => deleteModal.open({
                                id: comment.id,
                                displayName: comment.user?.username || "Khách",
                                deleteApi: adminEndpoints.comicComments.delete(comment.id)
                            })}
                            additionalActions={[
                                {
                                    label: comment.status === 'visible' ? 'Ẩn bình luận' : 'Hiện bình luận',
                                    action: () => handleToggleStatus(comment),
                                    icon: comment.status === 'visible' ? 'eye-off' : 'eye',
                                    className: comment.status === 'visible' ? 'text-amber-600 hover:text-amber-700' : 'text-green-600 hover:text-green-700'
                                },
                            ]}
                        />
                    </td>
                </tr>
                {comment.replies && comment.replies.length > 0 &&
                    comment.replies.map((reply, rIndex) => renderCommentRows(reply, rIndex, depth + 1))
                }
            </Fragment>
        );
    };

    return (
        <div className="admin-comic-comments">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold font-primary text-gray-900 flex items-center gap-2">
                    <MessageSquare className="text-blue-600 w-6 h-6" />
                    Quản lý bình luận
                </h1>
            </div>

            <ComicCommentFilter initialFilters={filters} onUpdateFilters={actions.updateFilters} />

            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <SkeletonLoader type="table" rows={10} columns={6} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-16">
                                        STT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-64">
                                        Người gửi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Nội dung & Thông tin
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-24">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-40">
                                        Ngày gửi
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 w-24">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {items.map((comment: Record<string, unknown>, index: number) => renderCommentRows(comment as unknown as Comment, index))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">
                                            Không tìm thấy dữ liệu
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

            <ConfirmModal
                show={deleteModal.isOpen}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa bình luận này?"
                onClose={deleteModal.close}
                onConfirm={handleDeleteConfirm}
                confirmText="Xác nhận xóa"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
        </div>
    );
}
