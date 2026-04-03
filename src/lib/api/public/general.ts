import { serverFetch } from "@/lib/api/server-client";
import { AboutSection, TeamMember, SystemConfig } from "@/types/api";
import { publicEndpoints } from "@/lib/api/endpoints";

/**
 * Lấy danh sách giới thiệu
 */
export async function getAboutSections() {
    const { data } = await serverFetch<AboutSection[]>(publicEndpoints.aboutSections.list, {
        revalidate: 3600,
        tags: ["about"],
        skipCookies: true // Giúp trang có thể render tĩnh (static)
    });
    return data || [];
}

/**
 * Lấy danh sách nhân sự
 */
export async function getStaffList() {
    const { data } = await serverFetch<TeamMember[]>(publicEndpoints.staff.list, {
        revalidate: 3600,
        tags: ["staff"],
        skipCookies: true // Giúp trang có thể render tĩnh (static)
    });
    return data || [];
}

import { cache } from "react";

/**
 * Lấy cấu hình hệ thống
 * Sử dụng React.cache để memoize trong cùng một request
 */
export const getSystemConfig = cache(async (group: string = "general") => {
    const { data } = await serverFetch<SystemConfig>(publicEndpoints.systemConfigs.getByGroup(group), {
        revalidate: 600, // Cache 10 phút
        tags: ["system-config", `system-config-${group}`],
        skipCookies: true
    });
    return data;
});


