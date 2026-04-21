import apiClient from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";
import { normalizeListResponse } from "@/lib/api/response-normalizer";
import { storage } from "@/lib/storage";

export interface Group {
  id: number;
  code: string;
  name: string;
  type: string;
  description?: string;
  status?: string;
  context_id?: number;
  owner_id?: number;
  metadata?: Record<string, unknown>;
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

    // Parse response using centralized normalizer
    const groupsData = normalizeListResponse<Group>(response.data);

    // Normalize group IDs (đảm bảo là number)
    const groups: Group[] = groupsData.map((g) => ({
      ...g,
      id: typeof g.id === "string" ? parseInt(g.id, 10) : g.id,
    }));

    // Lưu groups vào localStorage
    storage.group.setGroups(groups);

    // Auto-select group logic
    const savedGroupId = storage.group.getSelected();

    if (groups.length === 1) {
      // Nếu chỉ có 1 group → Auto-select
      const groupId = String(groups[0].id);
      storage.group.setSelected(groupId);
    } else if (groups.length > 1) {
      // Có nhiều groups → kiểm tra group đã chọn trước đó
      if (savedGroupId) {
        // Kiểm tra xem group đã chọn có còn trong danh sách không
        const groupExists = groups.some((g) => String(g.id) === savedGroupId);
        if (groupExists) {
          // Giữ group đã chọn
          storage.group.setSelected(savedGroupId);
        } else {
          // Group không còn hợp lệ → chọn group đầu tiên làm default
          storage.group.setSelected(String(groups[0].id));
        }
      } else {
        // Chưa có group được chọn → chọn group đầu tiên làm default
        storage.group.setSelected(String(groups[0].id));
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
  try {
    const groupId = storage.group.getSelected();
    const groups = storage.group.getGroups();

    if (!groupId || groups.length === 0) {
      return null;
    }

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
  try {
    return storage.group.getGroups();
  } catch (error) {
    console.error("Failed to get user groups:", error);
    return [];
  }
}



