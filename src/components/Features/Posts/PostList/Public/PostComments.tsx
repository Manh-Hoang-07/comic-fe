'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PostComment } from '@/types/api';
import { publicEndpoints } from '@/lib/api/endpoints';
import { api } from '@/lib/api/client';
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/contexts/ToastContext";
import { ChatBubbleLeftRightIcon, EllipsisHorizontalIcon, PaperAirplaneIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { formatDate } from "@/utils/formatters";

interface PostCommentsProps {
    postId: string;
}

interface CommentItemProps {
    comment: PostComment;
    currentUserId?: string;
    onReply: (parentId: string, content: string) => Promise<void>;
    postId: string;
}

const CommentItem = ({ comment, currentUserId, onReply, postId }: CommentItemProps) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit/Delete features are currently disabled as endpoints are not confirmed
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
                            {comment.user?.name?.charAt(0) || comment.guest_name?.charAt(0) || "?"}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative hover:border-blue-100 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                {comment.user?.name || comment.guest_name || "Khách"}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase font-medium">{formatDate(comment.created_at)}</span>
                        </div>

                        {/* Actions menu placeholder - enable if edit/delete APIs exist */}
                        {/* {isOwner && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowActions(!showActions)}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <EllipsisHorizontalIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )} */}
                    </div>

                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</div>
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
                                    placeholder={`Trả lời ${comment.user?.name || comment.guest_name || "người dùng"}...`}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm resize-none h-20"
                                />
                            </div>
                            <button
                                disabled={isSubmitting || !replyContent.trim()}
                                className="self-end p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-200"
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
                                postId={postId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export function PostComments({ postId }: PostCommentsProps) {
    const [comments, setComments] = useState<PostComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user, isAuthenticated } = useAuthStore();
    const { showSuccess, showError } = useToastContext();

    const fetchComments = useCallback(async () => {
        try {
            const response = await api.get(publicEndpoints.posts.comments(postId));
            // Ensure we handle both direct array or paginated response structure
            const data = response.data.data || response.data;
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId, fetchComments]);

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        if (!isAuthenticated) {
            showError("Bạn cần đăng nhập để bình luận");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post(publicEndpoints.posts.comments(postId), { content });
            setContent("");
            showSuccess("Đã đăng bình luận!");
            fetchComments();
        } catch (error) {
            console.error('Failed to post comment:', error);
            showError("Có lỗi xảy ra khi đăng bình luận");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (parentId: string, replyContent: string) => {
        if (!isAuthenticated) {
            showError("Bạn cần đăng nhập để trả lời");
            throw new Error("Unauthorized");
        }

        try {
            await api.post(publicEndpoints.posts.comments(postId), {
                content: replyContent,
                parent_id: parentId
            });
            showSuccess("Đã trả lời bình luận!");
            fetchComments();
        } catch (error) {
            console.error('Failed to reply:', error);
            showError("Có lỗi xảy ra khi trả lời");
            throw error;
        }
    };

    const totalComments = comments.reduce((acc, curr) => {
        const countReplies = (c: PostComment): number => 1 + (c.replies?.reduce((subAcc, subCurr) => subAcc + countReplies(subCurr), 0) || 0);
        return acc + countReplies(curr);
    }, 0);

    return (
        <div className="mt-12 space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500" />
                Bình luận ({totalComments})
            </h3>

            <form onSubmit={handlePostComment} className="relative group">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-28 text-sm shadow-sm"
                />
                <div className="absolute bottom-3 right-3">
                    <button
                        disabled={isSubmitting || !content.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-200"
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
                            postId={postId}
                        />
                    ))
                )}
            </div>
        </div>
    );
}



