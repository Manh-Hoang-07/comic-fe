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

interface SimpleBannerProps {
  locationCode: string;
  index?: number;
  containerClass?: string;
}

export default function SimpleBanner({
  locationCode,
  index = 0,
  containerClass = "",
}: SimpleBannerProps) {
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
    ["banners", "simple", locationCode],
    publicEndpoints.banners.getByLocation(locationCode),
    undefined,
    { enabled: !!locationCode, staleTime: 5 * 60 * 1000 }
  );

  const bannersData: Banner[] = Array.isArray(rawData) ? rawData : (rawData?.data ? (Array.isArray(rawData.data) ? rawData.data : []) : []);
  const banner = bannersData.length > 0 ? (bannersData[index] || bannersData[0]) : null;
  const error = queryError ? "Không thể tải banner" : null;

  if (loading) {
    return (
      <div className={`simple-banner bg-gray-100 rounded-lg animate-pulse ${containerClass}`}>
        <div className="h-48 bg-gray-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`simple-banner bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 ${containerClass}`}>
        {error}
      </div>
    );
  }

  if (!banner) {
    return null;
  }

  return (
    <div className={`simple-banner relative overflow-hidden rounded-lg shadow-md ${containerClass}`}>
      <div className="relative">
        {banner.image && (
          <Image
            src={getImageUrl(banner.image) || "/default.svg"}
            alt={banner.title || "Banner"}
            width={800}
            height={400}
            className="w-full h-auto object-cover"
          />
        )}

        {(banner.title || banner.subtitle || banner.button_text) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white w-full">
              {banner.title && <h2 className="text-2xl md:text-3xl font-bold mb-2">{banner.title}</h2>}
              {banner.subtitle && <p className="text-lg mb-4 opacity-90">{banner.subtitle}</p>}
              {banner.description && <p className="text-sm mb-4 opacity-80">{banner.description}</p>}
              {banner.button_text && banner.link && (
                <a
                  href={banner.link}
                  target={banner.link_target || "_self"}
                  rel={banner.link_target === "_blank" ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
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
        )}
      </div>
    </div>
  );
}




