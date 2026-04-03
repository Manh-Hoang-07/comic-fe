"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { userComicService } from "@/lib/api/user/comic";
import { Bookmark } from "@/types/comic";
import { useToastContext } from "@/contexts/ToastContext";
import { TrashIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/store/authStore";

export default function UserBookmarksClient() {
    const [loading, setLoading] = useState(true);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const { isAuthenticated } = useAuthStore();
    const { showError, showSuccess } = useToastContext();

    const fetchBookmarks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await userComicService.getBookmarks();
            setBookmarks(data);
        } catch (error) {
            showError("Không thể tải danh sách bookmark");
        } finally {
            setLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        const hasToken = typeof window !== 'undefined' && document.cookie.includes('auth_token');
        if (isAuthenticated && hasToken) {
            fetchBookmarks();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, fetchBookmarks]);

    const handleDelete = async (id: string | number) => {
        if (!confirm("Bạn có chắc muốn xóa bookmark này?")) return;

        try {
            await userComicService.deleteBookmark(id);
            setBookmarks(prev => prev.filter(b => b.id !== id));
            showSuccess("Đã xóa bookmark");
        } catch (error) {
            showError("Không thể xóa bookmark");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse h-40">
                                <div className="flex gap-4">
                                    <div className="w-20 h-28 bg-gray-200 rounded-lg"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/4 mt-4"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-1">Đánh dấu của tôi</h1>
                        <p className="text-gray-500 font-medium">Lưu lại vị trí bạn đang đọc dở</p>
                    </div>
                </div>

                {bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map((bookmark) => (
                            <div key={bookmark.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                                <div className="flex gap-4">
                                    <div className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                                        {/* Debug Log */}
                                        {/* {console.log("Rendering bookmark:", bookmark)} */}
                                        <Image
                                            src={bookmark.chapter.comic.cover_image || "/placeholder-comic.png"}
                                            alt={bookmark.chapter.comic.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Link
                                                href={`/chapters/${bookmark.chapter_id}`}
                                                className="p-2 bg-white rounded-full text-red-600 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
                                            >
                                                <BookOpenIcon className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <Link href={`/comics/${bookmark.chapter.comic.slug}`}>
                                                <h3 className="font-black text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors uppercase text-sm tracking-tight">{bookmark.chapter.comic.title}</h3>
                                            </Link>
                                            <p className="text-sm font-bold text-gray-500 mt-1">{bookmark.chapter.title}</p>
                                            <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase">
                                                Trang {bookmark.page_number}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-400 font-medium uppercase">{new Date(bookmark.created_at).toLocaleDateString()}</span>
                                            <button
                                                onClick={() => handleDelete(bookmark.id)}
                                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpenIcon className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Chưa có đánh dấu nào</h3>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Bắt đầu đọc và lưu lại vị trí trang để dễ dàng quay lại sau này.</p>
                        <Link
                            href="/comics"
                            className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black transition shadow-lg shadow-gray-200"
                        >
                            Khám phá ngay
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
