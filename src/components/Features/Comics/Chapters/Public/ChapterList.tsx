import React from 'react';
import Link from 'next/link';
import { ComicChapter } from '@/types/comic';
import { formatDate } from '@/utils/formatters';

interface ChapterListProps {
    chapters: ComicChapter[];
    comicSlug: string;
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters, comicSlug }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Danh sách chương</h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
                    {chapters.map((chapter) => (
                        <Link
                            key={chapter.id}
                            href={`/chapters/${chapter.id}`}
                            className="bg-white p-4 hover:bg-gray-50 flex justify-between items-center transition-colors group"
                        >
                            <span className="text-gray-700 font-medium group-hover:text-red-500">
                                {chapter.chapter_label}: {chapter.title}
                            </span>
                            <span className="text-xs text-gray-400">
                                {formatDate(chapter.created_at)}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};


