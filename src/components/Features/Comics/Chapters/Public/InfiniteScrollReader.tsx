'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ReadingToolbar } from "@/components/Features/Comics/Chapters/Public/ReadingToolbar";
import { ReadingHistoryTracker } from "@/components/Features/Comics/Chapters/Public/ReadingHistoryTracker";
import { CommentSection } from "@/components/Features/Comics/Comments/Public/CommentSection";
import { fetchChapterFullData } from '@/app/(public)/chapters/actions';

interface ChapterData {
    id: string;
    chapterDetail: any;
    pages: any[];
    nextChapter: any;
    prevChapter: any;
    chaptersData: any[];
    commentsData: any[];
}

export default function InfiniteScrollReader({ initialData }: { initialData: ChapterData }) {
    const [chapters, setChapters] = useState<ChapterData[]>([initialData]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(!!initialData.nextChapter);
    const observerTarget = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const chapterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Load next chapter function
    const loadNextChapter = useCallback(async () => {
        if (loading || !hasMore) return;

        const lastChapter = chapters[chapters.length - 1];
        if (!lastChapter.nextChapter) {
            setHasMore(false);
            return;
        }

        setLoading(true);
        try {
            const nextData = await fetchChapterFullData(lastChapter.nextChapter.id);
            if (nextData) {
                setChapters(prev => [...prev, nextData as ChapterData]);
                // If the new chapter doesn't have a next chapter, stop loading more
                if (!nextData.nextChapter) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load next chapter", error);
        } finally {
            setLoading(false);
        }
    }, [chapters, loading, hasMore]);

    // Intersection Observer for Infinite Scroll Trigger
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadNextChapter();
                }
            },
            { threshold: 0.1, rootMargin: '200px' } // Load slightly before reaching bottom
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loadNextChapter, hasMore, loading]);

    // Intersection Observer for URL Update
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const chapterId = entry.target.getAttribute('data-chapter-id');
                        if (chapterId) {
                            // Update URL without reload
                            window.history.replaceState(null, '', `/chapters/${chapterId}`);
                            // Also update document title if possible, or leave it
                            // document.title = `Chapter ${chapterId} | Comic Haven`; // Optional
                        }
                    }
                });
            },
            {
                threshold: 0,
                // Trigger when the element crosses the middle of the screen
                // 'margin-top margin-right margin-bottom margin-left'
                // This creates a "detection line" near the top of the viewport
                rootMargin: '-45% 0px -50% 0px'
            }
        );

        Object.values(chapterRefs.current).forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [chapters]);

    return (
        <div className="flex flex-col items-center w-full">
            {chapters.map((chapter, index) => (
                <div
                    key={chapter.id}
                    className="w-full flex flex-col items-center"
                    ref={el => { chapterRefs.current[chapter.id] = el }} // Assign ref
                    data-chapter-id={chapter.id}
                >
                    {/* Toolbar for EACH chapter (optional, maybe only needed for the current one in view?) 
                        Decision: Toolbar might be sticky or global. 
                        Render Toolbar only for the active chapter might be tricky.
                        Let's keep ReadingToolbar logic global if it handles navigation.
                        But here, let's render a simple chapter separator/header.
                    */}

                    {index > 0 && (
                        <div className="w-full py-8 text-center bg-gray-50 border-y border-gray-200 my-8">
                            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">
                                Chuyển sang chương tiếp theo
                            </h3>
                            <p className="text-gray-900 font-black text-2xl mt-2">
                                {chapter.chapterDetail?.chapter_label}: {chapter.chapterDetail?.title}
                            </p>
                        </div>
                    )}

                    {/* Always render ReadingHistoryTracker for each chapter to update history when it mounts */}
                    {(chapter.chapterDetail?.comic?.id || chapter.chapterDetail?.comic_id) && (
                        <ReadingHistoryTracker
                            comicId={chapter.chapterDetail?.comic?.id || chapter.chapterDetail?.comic_id}
                            chapterId={chapter.id}
                        />
                    )}

                    {/* Content Area */}
                    <div className="container mx-auto max-w-4xl py-6 flex flex-col items-center">
                        <div className="space-y-0 w-full shadow-2xl">
                            {chapter.pages && chapter.pages.map((page, pageIndex) => (
                                <div key={`${chapter.id}-page-${pageIndex}`} className="relative w-full overflow-hidden bg-white flex justify-center">
                                    <Image
                                        src={page.image_url}
                                        alt={`Page ${page.page_number}`}
                                        width={800}
                                        height={1200}
                                        unoptimized
                                        className="w-full h-auto object-contain select-none"
                                        loading="lazy" // Always lazy except maybe first few of first chapter
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Chapter Footer / Navigation (Only show for the last loaded chapter or if no next chapter) */}
                        <div className="mt-16 mb-20 flex flex-col items-center px-4 w-full">
                            {/* Toolbar specifically for this chapter context */}
                            <ReadingToolbar
                                nextChapter={chapter.nextChapter}
                                prevChapter={chapter.prevChapter}
                                chapters={chapter.chaptersData}
                                currentChapterId={chapter.id}
                            />

                            <div className="w-full mt-16 border-t border-gray-100 pt-12">
                                <CommentSection
                                    comicId={chapter.chapterDetail?.comic?.id || chapter.chapterDetail?.comic_id || ""}
                                    chapterId={chapter.id}
                                    comments={chapter.commentsData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Loading Indicator / Observer Target */}
            <div ref={observerTarget} className="w-full py-12 flex justify-center items-center">
                {loading && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-red-600 animate-spin" />
                        <span className="text-gray-500 font-medium animate-pulse">Đang tải chương tiếp theo...</span>
                    </div>
                )}
                {!hasMore && chapters.length > 0 && (
                    <div className="text-gray-400 font-bold uppercase tracking-widest py-8">
                        Đã hết chương mới
                    </div>
                )}
            </div>
        </div>
    );
}
