"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ListBulletIcon,
    XMarkIcon,
    CheckIcon
} from "@heroicons/react/24/outline";
import { BookmarkButton } from "./BookmarkButton";

interface ReadingToolbarProps {
    nextChapter: { id: string } | null;
    prevChapter: { id: string } | null;
    chapters: any[];
    currentChapterId: string;
}

export const ReadingToolbar: React.FC<ReadingToolbarProps> = ({
    nextChapter,
    prevChapter,
    chapters = [],
    currentChapterId
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showSelector, setShowSelector] = useState(false);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== "undefined") {
                const currentScrollY = window.scrollY;
                if (Math.abs(currentScrollY - lastScrollY) > 30) {
                    if (currentScrollY > lastScrollY && currentScrollY > 150) {
                        setIsVisible(false);
                    } else {
                        setIsVisible(true);
                    }
                    setLastScrollY(currentScrollY);
                }
            }
        };

        window.addEventListener("scroll", controlNavbar, { passive: true });
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [lastScrollY]);

    return (
        <>
            {/* Minimalist Bottom Navigation Bar */}
            <div className={`fixed bottom-8 inset-x-0 z-[100] px-4 flex justify-center transition-all duration-500 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}>
                <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-1.5 shadow-xl flex items-center gap-1.5 ring-1 ring-black/5">
                    {/* Previous Icon Button */}
                    {prevChapter ? (
                        <Link
                            href={`/chapters/${prevChapter.id}`}
                            className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition-all active:scale-90"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </Link>
                    ) : (
                        <div className="w-12 h-12 flex items-center justify-center text-gray-200 rounded-xl">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </div>
                    )}

                    <BookmarkButton chapterId={currentChapterId} />

                    {/* Chapter Selector Pill */}
                    <button
                        onClick={() => setShowSelector(true)}
                        className="h-12 flex items-center gap-2 px-6 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all active:scale-95"
                    >
                        <ListBulletIcon className="w-5 h-5" />
                        <span>Chương</span>
                    </button>

                    {/* Next Icon Button */}
                    {nextChapter ? (
                        <Link
                            href={`/chapters/${nextChapter.id}`}
                            className="w-12 h-12 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all active:scale-90 shadow-lg shadow-red-200"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </Link>
                    ) : (
                        <div className="w-12 h-12 flex items-center justify-center text-gray-200 rounded-xl">
                            <ChevronRightIcon className="w-6 h-6" />
                        </div>
                    )}
                </div>
            </div>

            {/* Chapter Selection Modal/Drawer */}
            <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-all duration-300 ${showSelector ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSelector(false)} />

                {/* Modal Content */}
                <div className={`relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 transform ${showSelector ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-gray-900 font-bold text-xl tracking-tight">Danh sách chương</h3>
                            <p className="text-gray-400 text-sm mt-0.5">Tổng số {chapters.length} chương</p>
                        </div>
                        <button
                            onClick={() => setShowSelector(false)}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto p-4 space-y-1">
                        {chapters.map((chapter) => (
                            <Link
                                key={chapter.id}
                                href={`/chapters/${chapter.id}`}
                                onClick={() => setShowSelector(false)}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${chapter.id == currentChapterId ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <div className="flex flex-col">
                                    <span className="line-clamp-1">{chapter.title}</span>
                                    <span className="opacity-50 text-[11px] font-medium mt-0.5">{chapter.chapter_label}</span>
                                </div>
                                {chapter.id == currentChapterId && <CheckIcon className="w-5 h-5" />}
                            </Link>
                        ))}
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <button
                            onClick={() => setShowSelector(false)}
                            className="w-full py-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-2xl font-bold text-sm transition-all shadow-sm active:scale-95"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};


