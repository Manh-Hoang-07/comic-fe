"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";

interface Banner {
  id: number;
  title?: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
  link_target?: string;
  button_text?: string;
  button_color?: string;
  text_color?: string;
}

interface BannerSliderProps {
  locationCode: string;
  autoplay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
  containerClass?: string;
  heightClass?: string;
}

export default function BannerSlider({
  locationCode,
  autoplay = true,
  interval = 5000,
  showArrows = true,
  showIndicators = true,
  containerClass = "",
  heightClass = "h-64 md:h-96",
}: BannerSliderProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const getImageUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    if (path.startsWith("/")) {
      return `${apiBase}${path}`;
    }
    return path;
  };

  const fetchBanners = useCallback(async () => {
    if (!locationCode) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(publicEndpoints.banners.getByLocation(locationCode));
      let bannersData: Banner[] = [];

      if (response.data?.success && response.data?.data) {
        bannersData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        bannersData = response.data;
      }

      setBanners(bannersData);
    } catch (err: any) {
      console.error("Error fetching banners:", err);
      setError("Không thể tải banner");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, [locationCode]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const currentBanner = banners[currentIndex] || null;

  const nextBanner = useCallback(() => {
    if (isTransitioning || banners.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, banners.length]);

  const prevBanner = useCallback(() => {
    if (isTransitioning || banners.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, banners.length]);

  const goToBanner = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, currentIndex]);

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!autoplay || banners.length <= 1) return;
    stopAutoplay();
    autoplayIntervalRef.current = setInterval(() => {
      nextBanner();
    }, interval);
  }, [autoplay, banners.length, interval, stopAutoplay, nextBanner]);

  useEffect(() => {
    if (banners.length > 0) {
      startAutoplay();
    }
    return () => {
      stopAutoplay();
    };
  }, [banners.length, startAutoplay, stopAutoplay]);

  const getCtaStyle = (banner: Banner) => {
    const bg = banner.button_color || "#3B82F6";
    return {
      backgroundColor: bg,
      color: banner.text_color || "#ffffff",
    };
  };

  if (loading) {
    return (
      <div className={`banner-slider relative overflow-hidden rounded-lg ${containerClass}`}>
        <div className={`flex items-center justify-center bg-gray-100 ${heightClass}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`banner-slider relative overflow-hidden rounded-lg ${containerClass}`}>
        <div className={`flex items-center justify-center bg-gray-100 ${heightClass}`}>
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className={`banner-slider relative overflow-hidden rounded-lg ${containerClass}`}>
        <div className={`flex items-center justify-center bg-gray-100 ${heightClass}`}>
          <p className="text-gray-500">Không có banner nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`banner-slider relative overflow-hidden rounded-lg shadow-md ${containerClass}`}>
      <div className="relative">
        <div className={`relative overflow-hidden ${heightClass}`}>
          {currentBanner && (
            <div key={currentBanner.id} className="relative w-full h-full">
              {currentBanner.image && (
                <Image
                  src={getImageUrl(currentBanner.image) || "/default.svg"}
                  alt={currentBanner.title || "Banner"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}

              {(currentBanner.title || currentBanner.subtitle || currentBanner.button_text) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    {currentBanner.title && (
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">{currentBanner.title}</h2>
                    )}
                    {currentBanner.subtitle && (
                      <p className="text-lg mb-4 opacity-90">{currentBanner.subtitle}</p>
                    )}
                    {currentBanner.description && (
                      <p className="text-sm mb-4 opacity-80">{currentBanner.description}</p>
                    )}
                    {currentBanner.button_text && currentBanner.link && (
                      <a
                        href={currentBanner.link}
                        target={currentBanner.link_target || "_self"}
                        rel={currentBanner.link_target === "_blank" ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                        style={getCtaStyle(currentBanner)}
                      >
                        {currentBanner.button_text}
                        {currentBanner.link_target === "_blank" && (
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        )}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {banners.length > 1 && showArrows && (
          <>
            <button
              type="button"
              onClick={prevBanner}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
              aria-label="Banner trước"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={nextBanner}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
              aria-label="Banner tiếp theo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {banners.length > 1 && showIndicators && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                onClick={() => goToBanner(index)}
                type="button"
                className="group w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90"
                aria-label={`Đến banner ${index + 1}`}
                aria-current={index === currentIndex ? "true" : undefined}
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-200 ${index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/50 group-hover:bg-white/70 w-2"
                    }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



