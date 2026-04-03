"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { userComicService } from "@/lib/api/user/comic";
import { Follow } from "@/types/comic";
import { useToastContext } from "@/contexts/ToastContext";
import { useAuthStore } from "@/lib/store/authStore";
import { BookmarkIcon, XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function UserFollowsClient() {
    const [loading, setLoading] = useState(true);
    const [follows, setFollows] = useState<Follow[]>([]);
    const { isAuthenticated } = useAuthStore();
    const { showError, showSuccess } = useToastContext();

    const fetchFollows = useCallback(async () => {
        setLoading(true);
        try {
            const data = await userComicService.getFollows();
            setFollows(data);
        } catch (error) {
            showError("Không thể tải danh sách theo dõi");
        } finally {
            setLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        const hasToken = typeof window !== 'undefined' && document.cookie.includes('auth_token');
        if (isAuthenticated && hasToken) {
            fetchFollows();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, fetchFollows]);

    const handleUnfollow = async (comicId: string | number) => {
        if (!confirm("Bạn có chắc muốn bỏ theo dõi bộ truyện này?")) return;

        try {
            await userComicService.unfollowComic(comicId);
            setFollows(prev => prev.filter(f => f.comic_id !== comicId));
            showSuccess("Đã bỏ theo dõi");
        } catch (error) {
            showError("Không thể thực hiện thao tác");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[2/3] bg-gray-200 rounded-2xl mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
                        <h1 className="text-3xl font-black text-gray-900 mb-1">Đang theo dõi</h1>
                        <p className="text-gray-500 font-medium">Nhận thông báo khi có chương mới</p>
                    </div>
                </div>

                {follows.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {follows.map((follow) => (
                            <div key={follow.id} className="group relative">
                                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-sm shadow-gray-200 group-hover:shadow-xl group-hover:shadow-gray-300 transition-all group-hover:-translate-y-1">
                                    <Image
                                        src={follow.comic.cover_image || "/placeholder-comic.png"}
                                        alt={follow.comic.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleUnfollow(follow.comic_id); }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg hover:bg-red-700 transition-transform hover:rotate-90"
                                            title="Bỏ theo dõi"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>

                                        <Link
                                            href={`/comics/${follow.comic.slug}`}
                                            className="w-full py-2 bg-white text-gray-900 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1 hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            Chi tiết <ChevronRightIcon className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <Link href={`/comics/${follow.comic.slug}`}>
                                        <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors uppercase text-xs tracking-tight">{follow.comic.title}</h3>
                                    </Link>
                                    <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase">{follow.comic.status === 'completed' ? 'Hoàn thành' : 'Đang ra'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookmarkIcon className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Chưa theo dõi truyện nào</h3>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Theo dõi truyện để nhận được thông báo nhanh nhất khi có chương mới ra mắt.</p>
                        <Link
                            href="/comics"
                            className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black transition shadow-lg shadow-gray-200"
                        >
                            Khám phá truyện hay
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
