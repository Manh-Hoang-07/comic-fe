import React from 'react';
import Link from 'next/link';
import { Comic } from '@/types/comic';
import { ComicCard } from './ComicCard';

interface ComicSectionProps {
    title: string;
    comics: Comic[];
    viewAllLink?: string;
    className?: string;
}

function ComicSectionInner({ title, comics, viewAllLink, className = "" }: ComicSectionProps) {
    if (!comics || comics.length === 0) return null;

    return (
        <section className={`mb-12 ${className}`}>
            <div className="mb-6 flex items-center justify-between border-l-4 border-red-500 pl-4">
                <h2 className="text-2xl font-extrabold uppercase tracking-wide text-gray-800">{title}</h2>
                {viewAllLink && (
                    <Link href={viewAllLink} prefetch={false} className="text-sm font-semibold text-red-500 transition-colors hover:text-red-600">
                        Xem tất cả
                    </Link>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] md:gap-6">
                {comics.map((comic) => (
                    <ComicCard key={comic.id} comic={comic} />
                ))}
            </div>
        </section>
    );
}

export const ComicSection = React.memo(ComicSectionInner);
