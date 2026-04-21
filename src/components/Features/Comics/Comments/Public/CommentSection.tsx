"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { commentService } from "@/lib/api/user/comment";
import { useToastContext } from "@/contexts/ToastContext";
import { ChatBubbleLeftRightIcon, EllipsisHorizontalIcon, PaperAirplaneIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { formatDate } from "@/utils/formatters";
import { ComicComment } from "@/types/comic";
import { useAuthStore } from "@/lib/store/authStore";

interface CommentSectionProps {
    comicId: string | number;
    chapterId?: string | number;
    comments: ComicComment[];
    onCommentSuccess?: () => void;
}

interface CommentItemProps {
    comment: ComicComment;
    currentUserId?: string;
    onReply: (parentId: string | number, content: string) => Promise<void>;
    onEdit: (commentId: string | number, content: string) => Promise<void>;
    onDelete: (commentId: string | number) => Promise<void>;
    comicId: string | number;
    chapterId?: string | number;
}

const CommentItem = ({ comment, currentUserId, onReply, onEdit, onDelete, comicId, chapterId }: CommentItemProps) => {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [editContent, setEditContent] = useState(comment.content);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const isOwner = currentUserId && comment.user?.id && currentUserId === comment.user.id.toString();

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            await onReply(comment.id, replyContent);
            setIsReplying(false);
            setReplyContent("");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editContent.trim()) return;

        setIsSubmitting(true);
        try {
            await onEdit(comment.id, editContent);
            setIsEditing(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
            await onDelete(comment.id);
        }
    };

    return (
        <div className="flex gap-4 group">
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                    {comment.user?.image ? (
                        <Image
                            src={comment.user.image}
                            alt={comment.user.name || "User"}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-gray-50 uppercase">
                            {comment.user?.name?.charAt(0) || comment.user?.username?.charAt(0) || "?"}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative hover:border-blue-100 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                {comment.user?.name || comment.user?.username || "Người dùng"}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase font-medium">{formatDate(comment.created_at)}</span>
                        </div>

                        {(isOwner) && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowActions(!showActions)}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <EllipsisHorizontalIcon className="w-5 h-5" />
                                </button>
                                {showActions && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowActions(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 overflow-hidden">
                                            <button
                                                onClick={() => { setIsEditing(true); setShowActions(false); }}
                                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <PencilIcon className="w-3.5 h-3.5" /> Sửa
                                            </button>
                                            <button
                                                onClick={() => { handleDelete(); setShowActions(false); }}
                                                className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5 message-square-x" /> Xóa
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleEditSubmit} className="mt-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none"
                                rows={3}
                                autoFocus
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button" // Should be submit but prevent default for now if needed, actually submit is handled by form
                                    onClick={handleEditSubmit}
                                    disabled={isSubmitting || !editContent.trim()}
                                    className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</div>
                    )}
                </div>

                <div className="flex items-center gap-4 mt-2 px-2">
                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="text-xs font-bold text-gray-400 hover:text-blue-600 transition flex items-center gap-1"
                    >
                        Trả lời
                    </button>
                </div>

                {isReplying && (
                    <form onSubmit={handleReplySubmit} className="mt-3 ml-2">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Trả lời ${comment.user?.name || comment.user?.username || "người dùng"}...`}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm resize-none h-20"
                                />
                            </div>
                            <button
                                disabled={isSubmitting || !replyContent.trim()}
                                className="self-end p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition disabled:opacity-50 shadow-lg shadow-primary/20"
                            >
                                <PaperAirplaneIcon className="w-5 h-5 -rotate-45 translate-x-0.5 -translate-y-0.5" />
                            </button>
                        </div>
                    </form>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                currentUserId={currentUserId}
                                onReply={onReply}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                comicId={comicId}
                                chapterId={chapterId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export function CommentSection({ comicId, chapterId, comments: initialComments, onCommentSuccess }: CommentSectionProps) {
    const [comments, setComments] = useState<ComicComment[]>(initialComments || []);

    // Debug Client-side
    // console.log(`[CommentSection] Rendered with ${comments.length} comments`);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useToastContext();
    const { user, isAuthenticated } = useAuthStore();

    // Convert generic Comment type to ComicComment if needed, but we used ComicComment in props

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        if (!isAuthenticated) {
            showError("Bạn cần đăng nhập để bình luận");
            return;
        }

        setIsSubmitting(true);
        try {
            const newComment = await commentService.postComment({
                comic_id: comicId,
                chapter_id: chapterId,
                content: content
            });

            // Optimistic update: prepend new comment (assuming it's top level)
            // Note: In real app, we might need to conform the returned object to ComicComment structure if it differs slightly
            // But types say it returns Comment (ComicComment)

            // Re-fetch or just append. Spec says "Optimistic UI... FE should append".
            // However, the backend returns the created object, so we can use that.
            // We need to cast or ensure types match.
            const commentToAdd = {
                ...newComment,
                replies: [],
                user: newComment.user || {
                    id: user?.id || "",
                    name: user?.name || user?.username || "Người dùng",
                    image: user?.image || user?.avatar || null,
                    username: user?.username || ""
                }
            } as ComicComment;

            setComments([commentToAdd, ...comments]);
            showSuccess("Đã đăng bình luận!");
            setContent("");
            if (onCommentSuccess) onCommentSuccess();
        } catch (error) {
            showError("Có lỗi xảy ra khi đăng bình luận");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (parentId: string | number, replyContent: string) => {
        if (!isAuthenticated) {
            showError("Bạn cần đăng nhập để trả lời");
            throw new Error("Unauthorized");
        }

        try {
            const newReply = await commentService.postComment({
                comic_id: comicId,
                chapter_id: chapterId,
                parent_id: parentId,
                content: replyContent
            });

            // Optimistic update for nested reply
            // We need to traverse the tree to find the parent and add the reply
            const addReplyToTree = (list: ComicComment[]): ComicComment[] => {
                return list.map(item => {
                    if (item.id === parentId) {
                        const replyToAdd = {
                            ...newReply,
                            replies: [],
                            user: newReply.user || {
                                id: user?.id || "",
                                name: user?.name || user?.username || "Người dùng",
                                image: user?.image || user?.avatar || null,
                                username: user?.username || ""
                            }
                        } as ComicComment;

                        return {
                            ...item,
                            replies: [replyToAdd, ...(item.replies || [])]
                        };
                    } else if (item.replies && item.replies.length > 0) {
                        return {
                            ...item,
                            replies: addReplyToTree(item.replies)
                        };
                    }
                    return item;
                });
            };

            setComments(addReplyToTree(comments));
            showSuccess("Đã trả lời bình luận!");
        } catch (error) {
            showError("Có lỗi xảy ra khi trả lời");
            throw error;
        }
    };

    const handleEdit = async (commentId: string | number, newContent: string) => {
        try {
            await commentService.updateComment(commentId, newContent);

            const updateTree = (list: ComicComment[]): ComicComment[] => {
                return list.map(item => {
                    if (item.id === commentId) {
                        return { ...item, content: newContent };
                    } else if (item.replies && item.replies.length > 0) {
                        return { ...item, replies: updateTree(item.replies) };
                    }
                    return item;
                });
            };

            setComments(updateTree(comments));
            showSuccess("Đã cập nhật bình luận!");
        } catch (error) {
            showError("Có lỗi xảy ra khi cập nhật");
            throw error;
        }
    };

    const handleDelete = async (commentId: string | number) => {
        try {
            await commentService.deleteComment(commentId);

            const deleteFromTree = (list: ComicComment[]): ComicComment[] => {
                return list.filter(item => item.id !== commentId).map(item => {
                    if (item.replies && item.replies.length > 0) {
                        return { ...item, replies: deleteFromTree(item.replies) };
                    }
                    return item;
                });
            };

            setComments(deleteFromTree(comments));
            showSuccess("Đã xóa bình luận!");
        } catch (error) {
            showError("Có lỗi xảy ra khi xóa");
            throw error;
        }
    };

    return (
        <div className="mt-12 space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary" />
                Bình luận ({comments.length})
            </h3>

            <form onSubmit={handlePostComment} className="relative group">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none h-28 text-sm shadow-sm"
                />
                <div className="absolute bottom-3 right-3">
                    <button
                        disabled={isSubmitting || !content.trim()}
                        className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? "Đang gửi..." : (
                            <>
                                <PaperAirplaneIcon className="w-4 h-4 -rotate-45 -translate-y-0.5" />
                                Gửi
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={user?.id.toString()}
                            onReply={handleReply}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            comicId={comicId}
                            chapterId={chapterId}
                        />
                    ))
                )}
            </div>
        </div>
    );
}



