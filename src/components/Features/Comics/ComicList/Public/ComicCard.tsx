import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Comic } from '@/types/comic';
import { formatNumber } from '@/utils/formatters';

interface ComicCardProps {
    comic: Comic;
    priority?: boolean;
}

export const ComicCard = memo<ComicCardProps>(function ComicCard({ comic, priority = false }) {
    return (
        <Link
            href={`/comics/${comic.slug}`}
            prefetch={false}
            className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]"
        >
            <div className="relative aspect-[2/3] overflow-hidden">
                <Image
                    src={comic.cover_image || '/images/no-cover.svg'}
                    alt={comic.title}
                    fill
                    quality={80}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    priority={priority}
                    loading={priority ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {comic.status === 'completed' && (
                    <div className="absolute left-2.5 top-2.5 z-10 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">FULL</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-between bg-gradient-to-t from-black/70 to-transparent px-2.5 pb-2.5 pt-5 text-xs text-white transition-all duration-300 group-hover:pb-3">
                    <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                        {formatNumber(comic.stats.view_count)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                        {formatNumber(comic.stats.follow_count)}
                    </span>
                </div>
            </div>
            <div className="flex grow flex-col p-3">
                <h3
                    className="mb-1 line-clamp-2 h-[2.8rem] text-base font-bold leading-[1.4] text-[#2d3436]"
                    title={comic.title}
                >
                    {comic.title}
                </h3>
                {comic.last_chapter && (
                    <div className="mt-auto text-sm text-[#636e72]">
                        {comic.last_chapter.chapter_label}
                    </div>
                )}
            </div>
        </Link>
    );
});



