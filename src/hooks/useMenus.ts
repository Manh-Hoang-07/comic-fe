import { useState, useCallback } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

export interface MenuTreeItem {
  id: number | string;
  name: string;
  code: string;
  path?: string | null;
  api_path?: string | null;
  icon?: string | null;
  type?: string;
  status?: string;
  parent_id?: number | string | null;
  sort_order?: number;
  is_public?: boolean;
  show_in_menu?: boolean;
  required_permission_id?: number | string | null;
  children?: MenuTreeItem[];
}

export function useMenus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMenuTree = useCallback(async (): Promise<MenuTreeItem[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<MenuTreeItem[]>(adminEndpoints.menus.tree);
      return response.data || [];
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Không thể lấy menu tree";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserMenus = useCallback(async (params?: { include_inactive?: boolean; flatten?: boolean }): Promise<MenuTreeItem[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ success: boolean; data: MenuTreeItem[] }>(adminEndpoints.userMenus.list, {
        params,
      });
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Không thể lấy menu người dùng";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getMenuTree,
    getUserMenus,
  };
}



