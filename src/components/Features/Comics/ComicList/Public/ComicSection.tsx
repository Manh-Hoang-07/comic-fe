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

export const ComicSection: React.FC<ComicSectionProps> = ({ title, comics, viewAllLink, className = "" }) => {
    if (!comics || comics.length === 0) return null;

    return (
        <section className={`mb-12 ${className}`}>
            <div className="section-title">
                <h2>{title}</h2>
                {viewAllLink && (
                    <Link href={viewAllLink} className="view-all">
                        Xem tất cả
                    </Link>
                )}
            </div>
            <div className="comic-grid">
                {comics.map((comic) => (
                    <ComicCard key={comic.id} comic={comic} />
                ))}
            </div>
        </section>
    );
};


