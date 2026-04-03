import { serverFetch } from "@/lib/api/server-client";
import { Menu } from "@/types/api";
import { publicEndpoints } from "@/lib/api/endpoints";

/**
 * Lấy danh sách menu public
 */
export async function getPublicMenus() {
    const { data } = await serverFetch<Menu[]>(publicEndpoints.menus.list, {
        revalidate: 3600,
        tags: ["menus"],
        skipCookies: true
    });
    return data || [];
}
