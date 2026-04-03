"use client";

import { useState, useEffect, useCallback } from "react";
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

interface BannerGridProps {
  locationCode: string;
  containerClass?: string;
}

export default function BannerGrid({ locationCode, containerClass = "" }: BannerGridProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className={`banner-grid ${containerClass}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2" />
                <div className="h-3 bg-gray-300 rounded mb-2" />
                <div className="h-8 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`banner-grid ${containerClass}`}>
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
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
      <div className={`banner-grid ${containerClass}`}>
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500">Không có banner nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`banner-grid ${containerClass}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="relative h-48 overflow-hidden group">
              {banner.image && (
                <Image
                  src={getImageUrl(banner.image) || "/default.svg"}
                  alt={banner.title || "Banner"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  unoptimized
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="absolute bottom-4 left-4 right-4">
                  {banner.link && (
                    <a
                      href={banner.link}
                      target={banner.link_target || "_self"}
                      rel={banner.link_target === "_blank" ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      Xem chi tiết
                      {banner.link_target === "_blank" && (
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>

            <div className="p-4">
              {banner.title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{banner.title}</h3>
              )}
              {banner.subtitle && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{banner.subtitle}</p>
              )}
              {banner.description && (
                <p className="text-xs text-gray-500 mb-4 line-clamp-3">{banner.description}</p>
              )}

              {banner.button_text && banner.link && (
                <a
                  href={banner.link}
                  target={banner.link_target || "_self"}
                  rel={banner.link_target === "_blank" ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center w-full px-4 py-2 rounded-lg font-medium text-center transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: banner.button_color || "#3B82F6",
                    color: banner.text_color || "#ffffff",
                  }}
                >
                  {banner.button_text}
                  {banner.link_target === "_blank" && (
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        ))}
      </div>
    </div>
  );
}



