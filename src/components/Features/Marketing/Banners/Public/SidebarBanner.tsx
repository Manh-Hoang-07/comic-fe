"use client";

import Image from "next/image";
import { env } from "@/config/env";
import { publicEndpoints } from "@/lib/api/endpoints";
import { useApiQuery } from "@/hooks/data/useApiQuery";

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

interface SidebarBannerProps {
  locationCode: string;
  limit?: number;
}

export default function SidebarBanner({ locationCode, limit = 3 }: SidebarBannerProps) {
  const apiBase = env.apiUrl;

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

  const { data: rawData, isLoading: loading, error: queryError } = useApiQuery<Record<string, unknown>>(
    ["banners", "sidebar", locationCode],
    publicEndpoints.banners.getByLocation(locationCode),
    undefined,
    { enabled: !!locationCode, staleTime: 5 * 60 * 1000 }
  );

  const allBanners: Banner[] = Array.isArray(rawData) ? rawData : (rawData?.data ? (Array.isArray(rawData.data) ? rawData.data : []) : []);
  const banners = allBanners.slice(0, limit);
  const error = queryError ? "Không thể tải banner" : null;

  if (loading) {
    return (
      <div className="sidebar-banner space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg animate-pulse">
            <div className="h-32 bg-gray-200 rounded-t-lg" />
            <div className="p-3">
              <div className="h-4 bg-gray-300 rounded mb-2" />
              <div className="h-3 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="sidebar-banner">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">{error}</div>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="sidebar-banner">
        <div className="bg-gray-50 rounded-lg p-4 text-gray-500 text-sm text-center">
          Không có banner
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-banner space-y-4">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="relative group">
            {banner.image && (
              <Image
                src={getImageUrl(banner.image) || "/default.svg"}
                alt={banner.title || "Banner"}
                width={300}
                height={128}
                className="w-full h-32 object-cover"
              />
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              {banner.link && (
                <a
                  href={banner.link}
                  target={banner.link_target || "_self"}
                  rel={banner.link_target === "_blank" ? "noopener noreferrer" : undefined}
                  className="text-white text-sm font-medium px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xem chi tiết
                </a>
              )}
            </div>
          </div>

          <div className="p-3">
            {banner.title && (
              <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{banner.title}</h3>
            )}
            {banner.subtitle && (
              <p className="text-xs text-gray-600 line-clamp-2">{banner.subtitle}</p>
            )}

            {banner.button_text && banner.link && (
              <a
                href={banner.link}
                target={banner.link_target || "_self"}
                rel={banner.link_target === "_blank" ? "noopener noreferrer" : undefined}
                className="inline-flex items-center w-full px-3 py-2 mt-2 rounded-lg text-xs font-medium text-center transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: banner.button_color || "#3B82F6",
                  color: banner.text_color || "#ffffff",
                }}
              >
                {banner.button_text}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}




