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
  const [banner, setBanner] = useState<Banner | null>(null);
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

  const fetchBanner = useCallback(async () => {
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

      if (bannersData.length > 0) {
        setBanner(bannersData[index] || bannersData[0]);
      } else {
        setBanner(null);
      }
    } catch (err: any) {
      console.error("Error fetching banner:", err);
      setError("Không thể tải banner");
      setBanner(null);
    } finally {
      setLoading(false);
    }
  }, [locationCode, index]);

  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

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
            unoptimized
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



