import { NextRequest, NextResponse } from "next/server";

/**
 * Public API: Lấy cấu hình chung (có cache 1 giờ)
 *
 * Route: GET /api/public/SystemConfig/general
 *
 * Ghi chú:
 * - API này có cache 1 giờ (3600 giây) để tối ưu hiệu năng.
 * - Cache key: 'public:general-config'
 * - Cache tự động bị xóa khi admin cập nhật config.
 * - Proxy đến backend API thực tế.
 */

const CACHE_TTL = 60 * 60 * 1000; // 1 giờ
const CACHE_KEY = "public:general-config";

// Simple in-memory cache (in production, use Redis or similar)
const cache = new Map<string, { data: any; timestamp: number }>();

export async function GET(request: NextRequest) {
  try {
    // Kiểm tra cache
    const cached = cache.get(CACHE_KEY);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      // Trả về dữ liệu từ cache
      return NextResponse.json(cached.data, {
        headers: {
          "X-Cache": "HIT",
        },
      });
    }

    // Gọi backend API
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${apiBase}/api/public/SystemConfig/general`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    // Lưu vào cache
    cache.set(CACHE_KEY, {
      data,
      timestamp: Date.now(),
    });

    return NextResponse.json(data, {
      headers: {
        "X-Cache": "MISS",
      },
    });
  } catch (error: any) {
    // Nếu có cache cũ, trả về cache cũ thay vì lỗi
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: {
          "X-Cache": "STALE",
        },
      });
    }

    // Nếu không có cache và backend lỗi, trả về config mặc định
    const defaultConfig = {
      site_name: process.env.NEXT_PUBLIC_SITE_NAME || "Cửa hàng",
      site_description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "",
      site_logo: null,
      site_favicon: null,
      site_email: null,
      site_phone: null,
      site_address: null,
      site_copyright: null,
      timezone: "Asia/Ho_Chi_Minh",
      locale: "vi",
      currency: "VND",
      contact_channels: null,
      meta_title: null,
      meta_description: null,
      meta_keywords: null,
      og_title: null,
      og_description: null,
      og_image: null,
      canonical_url: null,
      google_analytics_id: null,
      google_search_console: null,
      facebook_pixel_id: null,
      twitter_site: null,
    };

    // Proxy lỗi từ backend nhưng vẫn trả về default config
    return NextResponse.json(defaultConfig, {
      headers: {
        "X-Cache": "ERROR",
      },
    });
  }
}



