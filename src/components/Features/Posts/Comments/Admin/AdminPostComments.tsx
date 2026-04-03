"use client";

import { useMemo, useState, Fragment } from "react";
import Image from "next/image";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import PostCommentsFilter from "./PostCommentsFilter";
import { PostComment } from "@/types/api";
import { User, MessageSquare, CornerDownRight, FileText } from "lucide-react";
import Modal from "@/components/UI/Feedback/Modal";

const formatDate = (dateString?: string): string => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

interface AdminPostCommentsProps {
    title?: string;
}

export default function AdminPostComments({
    title = "Quản lý bình luận bài viết",
}: AdminPostCommentsProps) {
    const listOptions = useMemo(
        () => ({
            endpoints: {
                list: adminEndpoints.postComments.list,
                delete: (id: string | number) => adminEndpoints.postComments.delete(id),
            },
            messages: {
                deleteSuccess: "Bình luận đã được xóa thành công",
            },
        }),
        []
    );

    const {
        items,
        loading,
        pagination,
        filters,
        modals,
        selectedItem,
        openDeleteModal,
        closeDeleteModal,
        updateFilters,
        changePage,
        handleDelete,
        getSerialNumber,
        hasData,
        refresh,
        showSuccess,
        showError,
    } = useAdminListPage(listOptions);

    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [viewComment, setViewComment] = useState<PostComment | null>(null);

    const handleToggleStatus = async (comment: PostComment) => {
        const newStatus = comment.status === "visible" ? "hidden" : "visible";
        setTogglingId(comment.id);
        try {
            const response = await api.put(adminEndpoints.postComments.updateStatus(comment.id), {
                status: newStatus,
            });
            if (response.data) {
                showSuccess(`Đã ${newStatus === "visible" ? "hiện" : "ẩn"} bình luận`);
                refresh();
            }
        } catch (error) {
            showError("Không thể cập nhật trạng thái bình luận");
        } finally {
            setTogglingId(null);
        }
    };

    const renderCommentRows = (comment: PostComment, index: number, depth = 0) => {
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
                            <div className="flex-shrink-0 h-8 w-8">
                                {comment.user?.image ? (
                                    <Image className="h-8 w-8 rounded-full object-cover border border-gray-200" src={comment.user.image} alt={comment.user.name || "User"} width={32} height={32} />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-3 min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate" title={comment.user?.name || comment.guest_name || "Khách"}>
                                    {comment.user?.name || comment.guest_name || "Khách"}
                                    {!comment.user_id && <span className="ml-1 text-xs text-gray-500">(Guest)</span>}
                                </div>
                                <div className="text-xs text-gray-500 truncate" title={comment.user?.email || comment.guest_email || "N/A"}>
                                    {comment.user?.email || comment.guest_email}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 break-words max-w-md line-clamp-2" title={comment.content}>
                            {comment.content}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400">
                            {comment.post && (
                                <>
                                    <FileText className="w-3 h-3 flex-shrink-0" />
                                    <span className="flex-shrink-0">Bài viết:</span>
                                    <a
                                        href={`/posts/${comment.post.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[180px]"
                                        title={comment.post.name}
                                    >
                                        {comment.post.name}
                                    </a>
                                </>
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
                            showView={false} // View handled by Modal
                            showEdit={false}
                            showDelete={true}
                            onDelete={() => openDeleteModal(comment)}
                            additionalActions={[
                                {
                                    label: "Xem chi tiết",
                                    action: () => setViewComment(comment),
                                    icon: "eye",
                                },
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
                    comment.replies.map((reply, rIndex) => renderCommentRows(reply as any, rIndex, depth + 1))
                }
            </Fragment>
        );
    };

    return (
        <div className="admin-post-comments">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 font-primary text-gray-900">
                    <MessageSquare className="text-blue-600 w-6 h-6" />
                    {title}
                </h1>
            </div>

            <PostCommentsFilter
                initialFilters={filters}
                onUpdateFilters={updateFilters}
            />

            <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-6 border border-gray-200">
                {loading ? (
                    <SkeletonLoader type="table" rows={10} columns={6} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Người gửi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung & Thông tin</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Ngày gửi</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((comment: PostComment, index) => renderCommentRows(comment, index))}
                                {!loading && items.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-10 py-10 text-center text-gray-500 italic">
                                            Không có bình luận nào
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

            {/* View Detail Modal */}
            <Modal
                show={!!viewComment}
                title="Chi tiết bình luận"
                onClose={() => setViewComment(null)}
                footer={
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setViewComment(null)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Đóng
                        </button>
                        {viewComment && (
                            <button
                                onClick={() => {
                                    handleToggleStatus(viewComment);
                                    setViewComment(null);
                                }}
                                className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${viewComment.status === 'visible' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}`}
                            >
                                {viewComment.status === 'visible' ? 'Ẩn bình luận' : 'Hiện bình luận'}
                            </button>
                        )}
                    </div>
                }
            >
                {viewComment && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                {viewComment.user?.image ? (
                                    <Image src={viewComment.user.image} alt={viewComment.user.name || "User"} className="w-full h-full object-cover" width={48} height={48} />
                                ) : (
                                    <User className="text-blue-500 w-6 h-6" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-gray-900 leading-tight">
                                    {viewComment.user?.name || viewComment.guest_name || "Khách"}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {viewComment.user?.email || viewComment.guest_email || "N/A"}
                                </span>
                            </div>
                            <div className="ml-auto flex flex-col items-end">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider ${viewComment.status === 'visible' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {viewComment.status === 'visible' ? 'Công khai' : 'Đang ẩn'}
                                </span>
                                <span className="text-[10px] text-gray-400 mt-1">{formatDate(viewComment.created_at)}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 italic text-gray-800 leading-relaxed min-h-[100px]">
                            &quot;{viewComment.content}&quot;
                        </div>

                        {viewComment.post && (
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <span className="text-[10px] font-bold uppercase text-blue-400 tracking-widest block mb-1">Bài viết liên quan</span>
                                <a
                                    href={`/posts/${viewComment.post.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-700 font-bold hover:underline"
                                >
                                    {viewComment.post.name}
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {selectedItem && (
                <ConfirmModal
                    show={modals.delete}
                    title="Xác nhận xóa"
                    message={`Bình luận này sẽ bị xóa vĩnh viễn khỏi hệ thống. Bạn có chắc chắn muốn xóa bình luận của "${selectedItem.user?.name || selectedItem.guest_name || "Khách"}"?`}
                    onClose={closeDeleteModal}
                    onConfirm={() => handleDelete(selectedItem.id)}
                    confirmText="Xác nhận xóa"
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                />
            )}
        </div>
    );
}
