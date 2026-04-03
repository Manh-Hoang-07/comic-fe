import apiClient from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";

export interface Group {
  id: number;
  code: string;
  name: string;
  type: string;
  description?: string;
  status?: string;
  context_id?: number;
  owner_id?: number;
  metadata?: Record<string, any>;
  joined_at?: string;
  roles?: Array<{
    id: number;
    code: string;
    name: string;
  }>;
}

/**
 * Lấy groups của user, lưu vào localStorage và auto-select nếu cần
 * API: GET /api/user/groups
 *
 * @param token - JWT token (optional, sẽ lấy từ cookie nếu không có)
 * @returns Promise<Group[]> - Danh sách groups của user
 */
export async function initializeUserGroups(token?: string): Promise<Group[]> {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    // Lấy groups của user
    // API: GET /api/user/groups
    const response = await apiClient.get(userEndpoints.groups.list);

    // Parse response (có thể là array trực tiếp hoặc { success: true, data: [...] })
    let groupsData: any[] = [];
    if (Array.isArray(response.data)) {
      groupsData = response.data;
    } else if (response.data?.success && Array.isArray(response.data.data)) {
      groupsData = response.data.data;
    } else if (Array.isArray(response.data?.data)) {
      groupsData = response.data.data;
    }

    // Normalize group IDs (đảm bảo là number)
    const groups: Group[] = (groupsData || []).map((g: any) => ({
      ...g,
      id: typeof g.id === "string" ? parseInt(g.id, 10) : g.id,
    }));

    // Lưu groups vào localStorage
    localStorage.setItem("user_groups", JSON.stringify(groups));

    // Auto-select group logic
    const savedGroupId = localStorage.getItem("selected_group_id");

    if (groups.length === 1) {
      // Nếu chỉ có 1 group → Auto-select
      const groupId = String(groups[0].id);
      localStorage.setItem("selected_group_id", groupId);
    } else if (groups.length > 1) {
      // Có nhiều groups → kiểm tra group đã chọn trước đó
      if (savedGroupId) {
        // Kiểm tra xem group đã chọn có còn trong danh sách không
        const groupExists = groups.some((g) => String(g.id) === savedGroupId);
        if (groupExists) {
          // Giữ group đã chọn
          localStorage.setItem("selected_group_id", savedGroupId);
        } else {
          // Group không còn hợp lệ → chọn group đầu tiên làm default
          localStorage.setItem("selected_group_id", String(groups[0].id));
        }
      } else {
        // Chưa có group được chọn → chọn group đầu tiên làm default
        localStorage.setItem("selected_group_id", String(groups[0].id));
      }
    }

    return groups;
  } catch (error) {
    console.error("Failed to initialize user groups:", error);
    // Trả về mảng rỗng nếu có lỗi
    return [];
  }
}

/**
 * Lấy group đã chọn từ localStorage
 * @returns Group | null
 */
export function getSelectedGroup(): Group | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const groupId = localStorage.getItem("selected_group_id");
    const groupsJson = localStorage.getItem("user_groups");

    if (!groupId || !groupsJson) {
      return null;
    }

    const groups: Group[] = JSON.parse(groupsJson);
    const group = groups.find((g) => String(g.id) === groupId);

    return group || null;
  } catch (error) {
    console.error("Failed to get selected group:", error);
    return null;
  }
}

/**
 * Lấy tất cả groups từ localStorage
 * @returns Group[]
 */
export function getUserGroups(): Group[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const groupsJson = localStorage.getItem("user_groups");
    if (!groupsJson) {
      return [];
    }

    return JSON.parse(groupsJson) as Group[];
  } catch (error) {
    console.error("Failed to get user groups:", error);
    return [];
  }
}



