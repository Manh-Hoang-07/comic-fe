'use server';

import { getChapterPages, getChapterNavigation, getChapterDetail, getComicChapters, trackView, getComicDetail } from "@/lib/api/public/comic";
import { getChapterComments } from "@/lib/api/public/comment";

export async function fetchChapterFullData(chapterId: string) {
    try {
        const chapterDetail = await getChapterDetail(chapterId);
        if (!chapterDetail) return null;

        // Fetch parallel data
        const [pages, nextChapter, prevChapter, chaptersData, commentsData] = await Promise.all([
            getChapterPages(chapterId),
            getChapterNavigation(chapterId, 'next'),
            getChapterNavigation(chapterId, 'prev'),
            chapterDetail?.comic?.slug ? getComicChapters(chapterDetail.comic.slug, 1) : Promise.resolve(null),
            getChapterComments(chapterId, 1) // Fetch comments for the chapter
        ]);

        // Track view silently
        trackView(chapterId).catch(err => console.error("Track view failed", err));

        // Normalize chapters data
        const normalizedChapters = chaptersData ? (Array.isArray(chaptersData) ? chaptersData : (chaptersData.data || [])) : [];

        // Ensure comic detail is present if missing in chapterDetail (sometimes API structure varies)
        // Adjust based on your actual API response structure

        return {
            id: chapterId,
            chapterDetail,
            pages: pages || [],
            nextChapter,
            prevChapter,
            chaptersData: normalizedChapters,
            commentsData: commentsData?.data || []
        };
    } catch (error) {
        console.error("Error fetching chapter data:", error);
        return null;
    }
}
