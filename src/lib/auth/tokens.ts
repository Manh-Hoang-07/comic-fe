import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { storage } from "@/lib/storage";

const TOKEN_NAME = "auth_token";

// Server-side: đọc token từ cookie (giống Nuxt)
export function getServerAuthToken(): string | null {
  const jar = cookies() as unknown as ReadonlyRequestCookies;
  const c = jar.get(TOKEN_NAME)?.value;
  return c ?? null;
}

/**
 * Client-side: lấy auth token.
 * Ưu tiên đọc từ cookie (vì cookie luôn gửi kèm request),
 * fallback sang localStorage (backward compatible).
 *
 * Trả về null nếu chạy ở server (SSR).
 */
export function getClientAuthToken(): string | null {
  if (typeof document === "undefined") return null;

  // 1. Thử lấy từ cookie trước
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const [name, ...rest] = part.trim().split("=");
    if (name === TOKEN_NAME) {
      // Dùng rest.join("=") phòng trường hợp value chứa "="
      const rawValue = rest.join("=");
      if (rawValue) {
        try {
          return decodeURIComponent(rawValue);
        } catch {
          return rawValue;
        }
      }
    }
  }

  // 2. Fallback: lấy từ localStorage
  return storage.auth.getToken();
}
