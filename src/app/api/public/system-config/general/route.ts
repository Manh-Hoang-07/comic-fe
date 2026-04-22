import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import { cacheGet, cacheSet } from "@/lib/redis";

const CACHE_TTL_SECONDS = 60 * 60; // 1 giờ
const CACHE_KEY = "public:general-config";

export async function GET(request: NextRequest) {
  try {
    // Kiểm tra cache (Redis hoặc in-memory tùy REDIS_ENABLED)
    const cached = await cacheGet(CACHE_KEY);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        headers: { "X-Cache": "HIT" },
      });
    }

    // Gọi backend API
    const response = await fetch(
      `${env.apiUrl}/api/public/SystemConfig/general`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    // Lưu vào cache
    await cacheSet(CACHE_KEY, JSON.stringify(data), CACHE_TTL_SECONDS);

    return NextResponse.json(data, { headers: { "X-Cache": "MISS" } });
  } catch (error: unknown) {
    // Stale fallback từ cache nếu backend lỗi
    const stale = await cacheGet(CACHE_KEY);
    if (stale) {
      return NextResponse.json(JSON.parse(stale), {
        headers: { "X-Cache": "STALE" },
      });
    }

    // Default config nếu không có cache và backend lỗi
    const defaultConfig = {
      site_name: env.siteName,
      site_description: env.siteDescription,
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

    return NextResponse.json(defaultConfig, { headers: { "X-Cache": "ERROR" } });
  }
}
