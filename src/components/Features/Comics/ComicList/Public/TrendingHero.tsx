"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, formatNumber } from '@/utils/formatters';
import { Comic } from '@/types/comic';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Play, Info, Star, Clock } from "lucide-react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

    return (
        <section className="relative w-full mb-10 group/hero">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect={'fade'}
                fadeEffect={{ crossFade: true }}
                speed={800}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                loop={true}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination-custom',
                    bulletClass: 'swiper-pagination-bullet-custom',
                    bulletActiveClass: 'swiper-pagination-bullet-active-custom',
                }}
                className="w-full h-[320px] md:h-[360px] lg:h-[380px] rounded-xl overflow-hidden shadow-xl bg-white border border-gray-100"
            >
                {featuredComics.map((comic) => (
                    <SwiperSlide key={comic.id} className="relative w-full h-full group/slide cursor-pointer">
                        <Link href={`/comics/${comic.slug}`} className="block w-full h-full">
                            {/* 1. Dynamic Background Layer */}
                            <div className="absolute inset-0 w-full h-full overflow-hidden">
                                {/* Blurry Bg - Lighter for light mode */}
                                <div className="absolute inset-0 w-full h-full">
                                    <Image
                                        src={comic.cover_image}
                                        alt="Background"
                                        fill
                                        priority={true}
                                        quality={10}
                                        className="object-cover blur-[60px] opacity-20 scale-110"
                                    />
                                </div>
                                {/* Gradient Overlay for Readability - White based */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent/50 lg:w-4/5 z-10" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                            </div>

                            {/* 2. Main Content Container */}
                            <div className="relative z-20 w-full h-full container mx-auto px-4 md:px-8 lg:px-12 flex items-center gap-6 lg:gap-10">

                                {/* Poster Image (Vertical Rectangle) */}
                                <div className="hidden md:block flex-shrink-0 relative z-20">
                                    <div className="w-[160px] lg:w-[200px] aspect-[2/3] rounded-lg shadow-2xl overflow-hidden ring-1 ring-gray-900/5 group-hover/slide:scale-[1.02] transition-transform duration-500">
                                        <Image
                                            src={comic.cover_image}
                                            alt={comic.title}
                                            width={200}
                                            height={300}
                                            priority={true}
                                            className="w-full h-full object-cover"
                                            sizes="(max-width: 1024px) 160px, 200px"
                                        />
                                    </div>
                                </div>

                                {/* Text Info */}
                                <div className="flex-1 flex flex-col justify-center text-left space-y-2 lg:space-y-3 pr-4 lg:pr-20">

                                    {/* Top Badge */}
                                    <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-red-600 text-[10px] md:text-xs font-black uppercase tracking-widest bg-red-50 border border-red-100">
                                            <Star className="w-3 h-3 fill-current" />
                                            Trending
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight tracking-tight line-clamp-2 animate-fade-in-up group-hover/slide:text-red-600 transition-colors duration-300" style={{ animationDelay: '0.2s' }}>
                                        {comic.title}
                                    </h2>

                                    {/* Meta Info (Categories, Status) */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                        <div className="flex flex-wrap gap-1.5">
                                            {comic.categories.slice(0, 3).map((cat) => (
                                                <span key={cat.id} className="text-gray-600 font-bold hover:text-red-600 transition-colors bg-gray-100 px-2 py-0.5 rounded">
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="flex items-center gap-1 text-yellow-500 font-bold">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-gray-700">{comic.stats?.rating_sum ? (Number(comic.stats.rating_sum) / Math.max(1, Number(comic.stats.rating_count))).toFixed(1) : '4.9'}</span>
                                        </span>
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                            <span>{formatNumber(comic.stats?.view_count)}</span>
                                        </span>
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                            <span>{formatNumber(comic.stats?.follow_count)}</span>
                                        </span>
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{formatDate(comic.last_chapter_updated_at)}</span>
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="hidden md:block text-gray-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                        {comic.description || "Đang cập nhật nội dung..."}
                                    </p>

                                    {/* Chapter Info */}
                                    {comic.last_chapter && (
                                        <div className="inline-block mt-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                                            <span className="text-white font-bold text-sm bg-red-600 px-4 py-1.5 rounded-full shadow-lg shadow-red-200">
                                                {comic.last_chapter.chapter_label || `Chapter ${comic.last_chapter.chapter_index}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}

                {/* Custom Navigation Arrows */}
                <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 hover:bg-red-600 rounded-full flex items-center justify-center text-gray-800 hover:text-white cursor-pointer transition-all opacity-0 group-hover/hero:opacity-100 hover:scale-110 shadow-md border border-gray-100">
                    <ChevronLeft className="w-5 h-5" />
                </div>
                <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 hover:bg-red-600 rounded-full flex items-center justify-center text-gray-800 hover:text-white cursor-pointer transition-all opacity-0 group-hover/hero:opacity-100 hover:scale-110 shadow-md border border-gray-100">
                    <ChevronRight className="w-5 h-5" />
                </div>

                {/* Custom Pagination */}
                <div className="absolute bottom-4 right-8 z-30 flex justify-end gap-1.5">
                    <div className="swiper-pagination-custom flex gap-1.5"></div>
                </div>
            </Swiper>

            <style jsx global>{`
                .swiper-pagination-bullet-custom {
                    width: 24px;
                    height: 4px;
                    background: rgba(0, 0, 0, 0.2); /* Darker for light mode */
                    border-radius: 2px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .swiper-pagination-bullet-active-custom {
                    background: #dc2626; /* red-600 */
                    width: 32px;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    opacity: 0;
                    animation: fadeInUp 0.6s ease-out forwards;
                }
            `}</style>
        </section>
    );
};
