import { cookies } from "next/headers";

const getBaseUrl = () => {
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
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
): Promise<{ data: T | null; meta?: any; error: string | null }> {
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
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

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
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error(`[API Fetch] TIMEOUT: ${endpoint}`);
            return { data: null, error: "Connection Timeout" };
        }
        console.error(`[Server Fetch Error] ${endpoint}:`, error.message);
        return { data: null, error: error.message };
    }
}
