"use client";

import React, { useState, useEffect, lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Comic } from '@/types/comic';

// Lazy load Swiper để tránh render-blocking CSS/JS
const SwiperCarousel = lazy(() => import('./TrendingHeroSwiper'));

interface TrendingHeroProps {
    comics: Comic[];
}

export const TrendingHero: React.FC<TrendingHeroProps> = ({ comics }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // If no comics, don't render
    if (!comics || comics.length === 0) return null;

    const featuredComics = comics.slice(0, 8); // Top 8 comics
    const firstComic = featuredComics[0];

    if (!isMounted && firstComic) {
        return (
            <section className="relative w-full mb-10 group/hero">
                <div className="w-full h-[320px] md:h-[360px] lg:h-[380px] rounded-xl overflow-hidden shadow-xl bg-white border border-gray-100">
                    <Link href={`/comics/${firstComic.slug}`} prefetch={false} className="block w-full h-full">
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    src={firstComic.cover_image}
                                    alt="Background"
                                    fill
                                    quality={25}
                                    priority
                                    className="object-cover blur-[60px] opacity-20 scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent/50 lg:w-4/5 z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                        </div>
                        <div className="relative z-20 w-full h-full container mx-auto px-4 md:px-8 lg:px-12 flex items-center gap-6 lg:gap-10">
                            <div className="hidden md:block flex-shrink-0 relative z-20">
                                <div className="w-[160px] lg:w-[200px] aspect-[2/3] rounded-lg shadow-2xl overflow-hidden ring-1 ring-gray-900/5">
                                    <Image
                                        src={firstComic.cover_image}
                                        alt={firstComic.title}
                                        width={200}
                                        height={300}
                                        priority
                                        fetchPriority="high"
                                        quality={75}
                                        className="w-full h-full object-cover"
                                        sizes="(max-width: 1024px) 160px, 200px"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center text-left space-y-2 lg:space-y-3 pr-4 lg:pr-20">
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight tracking-tight line-clamp-2">
                                    {firstComic.title}
                                </h2>
                                <p className="hidden md:block text-gray-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 max-w-2xl">
                                    {firstComic.description || "Đang cập nhật nội dung..."}
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        );
    }

    // SSR fallback đã render ở trên, giờ hydrate với Swiper lazy
    return (
        <section className="relative w-full mb-10 group/hero">
            <Suspense fallback={
                <div className="w-full h-[320px] md:h-[360px] lg:h-[380px] rounded-xl overflow-hidden shadow-xl bg-white border border-gray-100" />
            }>
                <SwiperCarousel comics={featuredComics} />
            </Suspense>
        </section>
    );
};

