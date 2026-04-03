import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

const TOKEN_NAME = "auth_token";

// Server-side: đọc token từ cookie (giống Nuxt)
export function getServerAuthToken(): string | null {
  const jar = cookies() as unknown as ReadonlyRequestCookies;
  const c = jar.get(TOKEN_NAME)?.value;
  return c ?? null;
}

// Client-side helpers (skeleton, có thể mở rộng sau)
export function getClientAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const [name, value] = part.trim().split("=");
    if (name === TOKEN_NAME && value) {
      return decodeURIComponent(value);
    }
  }
  return null;
}




