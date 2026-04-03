"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export interface HeroBannerData {
    id?: number;
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    mobile_image?: string;
    button_text?: string;
    link?: string;
    link_target?: string;
    titleColor?: string;
    subtitleColor?: string;
    descriptionColor?: string;
    backgroundColor?: string;
}

interface HeroBannerProps {
    // Option 1: Truyền data trực tiếp
    data?: HeroBannerData | HeroBannerData[];

    // Option 2: Lấy từ API theo location code
    locationCode?: string;

    // Option 3: Lấy từ API theo banner ID
    bannerId?: number;

    // Customization
    containerClass?: string;
    imagePosition?: "left" | "right";
    showSkeleton?: boolean;
    imageOnly?: boolean; // Chỉ hiển thị ảnh, không có text/button
    autoPlay?: boolean;
    interval?: number;
}

export default function HeroBanner({
    data,
    locationCode,
    bannerId,
    containerClass = "",
    imagePosition = "right",
    showSkeleton = true,
    imageOnly = false,
    autoPlay = true,
    interval = 5000,
}: HeroBannerProps) {
    const [banners, setBanners] = useState<HeroBannerData[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

    const getImageUrl = (path: string | null | undefined): string => {
        if (!path) return "/placeholder-banner.jpg";
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }
        if (path.startsWith("/")) {
            return `${apiBase}${path}`;
        }
        return path;
    };

    const transformApiBanner = (apiBanner: any): HeroBannerData | null => {
        if (!apiBanner.title || (!apiBanner.image && !apiBanner.mobile_image)) {
            return null;
        }

        return {
            id: apiBanner.id,
            title: apiBanner.title,
            subtitle: apiBanner.subtitle || "",
            description: apiBanner.description || "",
            image: apiBanner.image,
            mobile_image: apiBanner.mobile_image || apiBanner.image_mobile,
            button_text: apiBanner.button_text || "",
            link: apiBanner.link || "",
            link_target: apiBanner.link_target || "_self",
            titleColor: apiBanner.title_color || apiBanner.metadata?.title_color,
            subtitleColor: apiBanner.subtitle_color || apiBanner.metadata?.subtitle_color,
            descriptionColor: apiBanner.description_color || apiBanner.metadata?.description_color,
            backgroundColor: apiBanner.background_color || apiBanner.metadata?.background_color,
        };
    };

    const fetchBannerData = useCallback(async () => {
        if (data) {
            setBanners(Array.isArray(data) ? data : [data]);
            return;
        }

        if (!locationCode && !bannerId) {
            setBanners([]);
            return;
        }

        setLoading(true);

        try {
            let response;

            if (bannerId) {
                response = await api.get(publicEndpoints.banners.show(bannerId));
                if (response.data?.success && response.data?.data) {
                    const transformed = transformApiBanner(response.data.data);
                    setBanners(transformed ? [transformed] : []);
                }
            } else if (locationCode) {
                // Fetch theo location code - Sử dụng query param theo API của bạn
                response = await api.get(`${publicEndpoints.banners.list}?locationCode=${locationCode}`);
                let bannersData: any[] = [];

                if (response.data?.success && response.data?.data) {
                    bannersData = Array.isArray(response.data.data) ? response.data.data : [];
                } else if (Array.isArray(response.data)) {
                    bannersData = response.data;
                }

                const transformedBanners = bannersData
                    .map(transformApiBanner)
                    .filter((b): b is HeroBannerData => b !== null);

                setBanners(transformedBanners);
            }
        } catch (err: any) {
            console.error("Error fetching banner:", err);
            setBanners([]);
        } finally {
            setLoading(false);
        }
    }, [data, locationCode, bannerId]);

    useEffect(() => {
        fetchBannerData();
    }, [fetchBannerData]);

    // Auto play logic
    useEffect(() => {
        if (!autoPlay || banners.length <= 1 || isPaused) return;

        const nextSlide = () => {
            setActiveIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        };

        timeoutRef.current = setInterval(nextSlide, interval);

        return () => {
            if (timeoutRef.current) clearInterval(timeoutRef.current);
        };
    }, [autoPlay, banners.length, interval, isPaused]);

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    };

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setIsPaused(true);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
        setIsPaused(false);
    };

    const onMouseDown = (e: React.MouseEvent) => {
        setTouchStart(e.clientX);
        setIsDragging(true);
        setIsPaused(true);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setTouchEnd(e.clientX);
        }
    };

    const onMouseUp = () => {
        if (isDragging) {
            if (touchStart && touchEnd) {
                const distance = touchStart - touchEnd;
                if (distance > minSwipeDistance) handleNext();
                else if (distance < -minSwipeDistance) handlePrev();
            }
            setIsDragging(false);
            setTouchStart(null);
            setTouchEnd(null);
            setIsPaused(false);
        }
    };

    if (loading && showSkeleton) {
        return (
            <div className={`hero-banner bg-gray-50 rounded-lg overflow-hidden ${containerClass}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center animate-pulse">
                        <div className="space-y-6">
                            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-8 bg-gray-200 rounded w-full"></div>
                            <div className="h-20 bg-gray-200 rounded w-full"></div>
                            <div className="h-12 bg-gray-200 rounded w-40"></div>
                        </div>
                        <div className="aspect-[4/3] bg-gray-200 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (banners.length === 0) return null;

    return (
        <div
            className={`relative group overflow-hidden select-none ${containerClass} ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
                setIsPaused(false);
                if (isDragging) onMouseUp();
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        >
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
                {banners.map((banner, index) => (
                    <div
                        key={banner.id || index}
                        className="min-w-full relative pointer-events-none"
                        style={{ backgroundColor: banner.backgroundColor || "#F9FAFB" }}
                    >
                        <div className="pointer-events-auto">
                            {imageOnly ? (
                                <div className="relative w-full aspect-[21/9] md:aspect-[16/6] lg:aspect-[21/7]">
                                    <picture>
                                        {banner.mobile_image && (
                                            <source media="(max-width: 768px)" srcSet={getImageUrl(banner.mobile_image)} />
                                        )}
                                        <Image
                                            src={getImageUrl(banner.image)}
                                            alt={banner.title}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                            unoptimized
                                        />
                                    </picture>
                                </div>
                            ) : (
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${imagePosition === "left" ? "lg:flex-row-reverse" : ""}`}>
                                        {/* Content */}
                                        <div className={`${imagePosition === "left" ? "lg:order-2" : "lg:order-1"} space-y-8 relative z-10`}>
                                            <div className="space-y-4">
                                                {banner.subtitle && (
                                                    <h2
                                                        className="text-lg md:text-xl font-semibold tracking-wide uppercase"
                                                        style={{ color: banner.subtitleColor || "#3B82F6" }}
                                                    >
                                                        {banner.subtitle}
                                                    </h2>
                                                )}
                                                <h1
                                                    className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight"
                                                    style={{ color: banner.titleColor || "#111827" }}
                                                >
                                                    {banner.title}
                                                </h1>
                                                {banner.description && (
                                                    <p
                                                        className="text-lg md:text-xl leading-relaxed max-w-2xl opacity-80"
                                                        style={{ color: banner.descriptionColor || "#4B5563" }}
                                                    >
                                                        {banner.description}
                                                    </p>
                                                )}
                                            </div>

                                            {banner.button_text && banner.link && (
                                                <div className="flex flex-wrap gap-4">
                                                    <Link
                                                        href={banner.link}
                                                        target={banner.link_target || "_self"}
                                                        className="inline-flex items-center justify-center px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all duration-300 shadow-xl hover:shadow-primary/40 transform hover:-translate-y-1"
                                                    >
                                                        {banner.button_text}
                                                        <ChevronRightIcon className="ml-2 w-5 h-5" />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>

                                        {/* Image */}
                                        <div className={`${imagePosition === "left" ? "lg:order-1" : "lg:order-2"} relative`}>
                                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]">
                                                <Image
                                                    src={getImageUrl(banner.image)}
                                                    alt={banner.title}
                                                    fill
                                                    className="object-cover"
                                                    priority={index === 0}
                                                    unoptimized
                                                />
                                                {/* Subtle overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                                            </div>
                                            {/* Decorative elements */}
                                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Indicators */}
            {banners.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "w-10 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}


