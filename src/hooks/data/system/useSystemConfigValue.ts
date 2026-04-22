"use client";

import { useCallback, useMemo } from "react";
import type { SystemConfigGeneral } from "./useSystemConfigCache";

// ===== TYPES =====

export interface UseSystemConfigValueResult {
  getConfigValue: (key: string, defaultValue?: unknown) => unknown;
  systemInfo: {
    name: string;
    version: string;
    timezone: string;
  };
}

// ===== HOOK =====

/**
 * Hook cung cấp helper để lấy giá trị config cụ thể từ system config data
 */
export function useSystemConfigValue(
  data: SystemConfigGeneral | null
): UseSystemConfigValueResult {
  const getConfigValue = useCallback(
    (key: string, defaultValue: unknown = null): unknown => {
      if (!data) return defaultValue;
      return data[key] ?? defaultValue;
    },
    [data]
  );

  const systemInfo = useMemo(
    () => ({
      name: (data?.site_name ?? data?.name ?? "") as string,
      version: (data?.version ?? "") as string,
      timezone: (data?.timezone ?? "Asia/Ho_Chi_Minh") as string,
    }),
    [data]
  );

  return {
    getConfigValue,
    systemInfo,
  };
}
