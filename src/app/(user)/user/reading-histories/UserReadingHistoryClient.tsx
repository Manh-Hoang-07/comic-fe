"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { userComicService } from "@/lib/api/user/comic";
import { ReadingHistory } from "@/types/comic";
import { useToastContext } from "@/contexts/ToastContext";
import { useAuthStore } from "@/lib/store/authStore";
import { ClockIcon, TrashIcon, BookOpenIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function UserReadingHistoryClient() {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<ReadingHistory[]>([]);
    const { isAuthenticated } = useAuthStore();
    const { showError, showSuccess } = useToastContext();

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const data = await userComicService.getReadingHistory();
            setHistory(data);
        } catch (error) {
            showError("Không thể tải lịch sử đọc");
        } finally {
            setLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        const hasToken = typeof window !== 'undefined' && document.cookie.includes('auth_token');
        if (isAuthenticated && hasToken) {
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, fetchHistory]);

    const handleDelete = async (comicId: string | number) => {
        if (!confirm("Bạn có chắc muốn xóa lịch sử đọc của bộ truyện này?")) return;

        try {
            await userComicService.deleteReadingHistory(comicId);
            setHistory(prev => prev.filter(item => item.comic_id !== comicId));
            showSuccess("Đã xóa lịch sử đọc");
        } catch (error) {
            showError("Không thể xóa lịch sử đọc");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse h-32 flex gap-4">
                                <div className="w-20 h-full bg-gray-200 rounded-xl"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/5"></div>
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
                        <h1 className="text-3xl font-black text-gray-900 mb-1">Lịch sử đọc</h1>
                        <p className="text-gray-500 font-medium">Danh sách các truyện bạn đã xem gần đây</p>
                    </div>
                </div>

                {history.length > 0 ? (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-xl hover:shadow-gray-200/50 transition-all group overflow-hidden">
                                <div className="flex gap-5">
                                    <div className="relative w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                                        <Image
                                            src={item.comic.cover_image || "/placeholder-comic.png"}
                                            alt={item.comic.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <Link href={`/comics/${item.comic.slug}`}>
                                                    <h3 className="font-extrabold text-gray-900 group-hover:text-red-600 transition-colors uppercase text-sm tracking-tight">{item.comic.title}</h3>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.comic_id)}
                                                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Xóa khỏi lịch sử"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="mt-2 text-sm">
                                                <span className="text-gray-400 font-medium">Đã đọc đến: </span>
                                                <Link
                                                    href={`/chapters/${item.chapter_id}`}
                                                    className="font-bold text-gray-700 hover:text-red-600 transition-colors inline-flex items-center gap-1"
                                                >
                                                    {item.chapter.title}
                                                    <ChevronRightIcon className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            <ClockIcon className="w-3.5 h-3.5" />
                                            Cập nhật {new Date(item.updated_at).toLocaleDateString()} lúc {new Date(item.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex items-center">
                                        <Link
                                            href={`/chapters/${item.chapter_id}`}
                                            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95 flex items-center gap-2"
                                        >
                                            <BookOpenIcon className="w-4 h-4" />
                                            Đọc tiếp
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ClockIcon className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Lịch sử trống</h3>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Bạn chưa đọc bất kỳ bộ truyện nào. Hãy khám phá và bắt đầu hành trình của mình!</p>
                        <Link
                            href="/comics"
                            className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black transition shadow-lg shadow-gray-200"
                        >
                            Dạo quanh một vòng
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
