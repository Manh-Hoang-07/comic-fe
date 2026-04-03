import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Comic } from '@/types/comic';
import { formatNumber } from '@/utils/formatters';

interface ComicCardProps {
    comic: Comic;
    priority?: boolean;
}

export const ComicCard: React.FC<ComicCardProps> = ({ comic, priority = false }) => {
    return (
        <Link href={`/comics/${comic.slug}`} className="comic-card">
            <div className="comic-card__image-container">
                <Image
                    src={comic.cover_image || 'https://placehold.co/300x450?text=No+Cover'}
                    alt={comic.title}
                    fill
                    className="comic-card__image"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    priority={priority}
                />
                <div className="comic-card__overlay" />
                {comic.status === 'completed' && (
                    <div className="comic-card__badge">FULL</div>
                )}
                <div className="comic-card__stats px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg">
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
            <div className="comic-card__content">
                <h3 className="comic-card__title" title={comic.title}>{comic.title}</h3>
                {comic.last_chapter && (
                    <div className="comic-card__chapter">
                        {comic.last_chapter.chapter_label}
                    </div>
                )}
            </div>
        </Link>
    );
};


