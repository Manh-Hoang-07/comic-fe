"use client";

import { useState, useCallback } from "react";
import apiClient from "@/lib/api/client";
import { publicEndpoints, adminEndpoints } from "@/lib/api/endpoints";
import type { SystemConfigGeneral } from "./useSystemConfigCache";

// ===== TYPES =====

export interface UseSystemConfigFetchOptions {
  group: string;
  isAdmin: boolean;
}

export interface UseSystemConfigFetchResult {
  data: SystemConfigGeneral | null;
  loading: boolean;
  error: unknown;
  setData: React.Dispatch<React.SetStateAction<SystemConfigGeneral | null>>;
  fetchData: () => Promise<SystemConfigGeneral>;
}

// ===== HELPERS =====

const resolveEndpoint = (group: string, isAdmin: boolean): string => {
  // Nếu là admin, ưu tiên dùng adminEndpoints
  if (isAdmin) {
    return adminEndpoints.systemConfigs.getByGroup(group);
  }

  // Sử dụng API mới cho general config
  if (group === "general") return publicEndpoints.systemConfigs.general;
  // Fallback về API cũ cho các group khác
  return publicEndpoints.systemConfigs.getByGroup(group);
};

const normalizeConfigData = (
  responseData: unknown
): SystemConfigGeneral => {
  let configData: SystemConfigGeneral;

  // Nếu API trả về format có wrapper { success, data, ... }
  if (
    responseData &&
    typeof responseData === "object" &&
    !Array.isArray(responseData)
  ) {
    const obj = responseData as Record<string, unknown>;
    // Kiểm tra nếu có structure { success, data, ... }
    if (
      obj.data &&
      typeof obj.data === "object" &&
      !Array.isArray(obj.data)
    ) {
      configData = obj.data as SystemConfigGeneral;
    } else {
      // Nếu không có wrapper, dùng trực tiếp responseData
      configData = obj as SystemConfigGeneral;
    }

    // Map legacy fields nếu cần
    if (configData.site_name && !configData.name) {
      configData.name = configData.site_name;
    }
    return configData;
  }

  // Nếu API trả về array của config items (format cũ)
  if (Array.isArray(responseData)) {
    configData = {};
    (responseData as { key?: string; value?: unknown }[]).forEach((item) => {
      if (item?.key && item.value !== undefined) {
        configData[item.key] = item.value;
      }
    });
    return configData;
  }

  return {};
};

// ===== HOOK =====

/**
 * Hook xử lý fetching system config từ API
 */
export function useSystemConfigFetch(
  options: UseSystemConfigFetchOptions
): UseSystemConfigFetchResult {
  const { group, isAdmin } = options;

  const [data, setData] = useState<SystemConfigGeneral | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchData = useCallback(async (): Promise<SystemConfigGeneral> => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = resolveEndpoint(group, isAdmin);
      const response = await apiClient.get(endpoint);
      const configData = normalizeConfigData(response.data);

      // Nếu backend trả về rỗng/không hợp lệ, throw error
      if (
        group === "general" &&
        (!configData || Object.keys(configData).length === 0)
      ) {
        throw new Error("Empty system config response from API");
      }

      setData(configData);
      return configData;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [group, isAdmin]);

  return {
    data,
    loading,
    error,
    setData,
    fetchData,
  };
}
