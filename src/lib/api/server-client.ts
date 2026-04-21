import { cookies } from "next/headers";
import { env } from "@/config/env";
import { createLogger } from "@/lib/logger";

const log = createLogger('api:server');

const getBaseUrl = () => {
    let baseUrl = env.apiUrl;
    if (!baseUrl.endsWith("/api")) {
        baseUrl = `${baseUrl.replace(/\/$/, "")}/api`;
    }
    return baseUrl;
};

const API_URL = getBaseUrl();

interface FetchOptions extends RequestInit {
    revalidate?: number | false;
    tags?: string[];
    skipCookies?: boolean;
}

/**
 * Server-side Fetch Utility
 * Tự động xử lý Base URL, Cookies (Auth & GroupId) và Caching cho Next.js
 */
export async function serverFetch<T = any>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<{ data: T | null; meta?: Record<string, unknown>; error: string | null }> {
    try {
        let token: string | undefined;
        let groupId: string | undefined;

        if (!options.skipCookies) {
            try {
                const cookieStore = await cookies();
                token = cookieStore.get("auth_token")?.value;
                groupId = cookieStore.get("group_id")?.value;
            } catch (e) {
                // Outside request context (e.g. static generation)
            }
        }

        const cleanEndpoint = endpoint.replace(/^\/?api\//, "").replace(/^\//, "");
        const url = endpoint.startsWith("http")
            ? endpoint
            : `${API_URL}/${cleanEndpoint}`;

        const headers = new Headers(options.headers);

        if (token) headers.set("Authorization", `Bearer ${token}`);
        if (groupId) headers.set("X-Group-Id", groupId);
        if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

        const { revalidate, tags, ...restOptions } = options;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout (giam tu 10s)

        try {
            const response = await fetch(url, {
                ...restOptions,
                headers,
                signal: controller.signal,
                next: {
                    revalidate: revalidate !== undefined ? revalidate : 3600,
                    tags: tags || [],
                },
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const json = await response.json();
            return { data: json.data, meta: json.meta, error: null };
        } finally {
            clearTimeout(timeoutId);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                log.error(`TIMEOUT: ${endpoint}`);
                return { data: null, error: "Connection Timeout" };
            }
            log.error(`Fetch failed: ${endpoint}`, error.message);
            return { data: null, error: error.message };
        }
        return { data: null, error: "Unknown error" };
    }
}
