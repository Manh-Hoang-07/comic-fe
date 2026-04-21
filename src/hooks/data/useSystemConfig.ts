"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSystemConfigFetch } from "./useSystemConfigFetch";
import { useSystemConfigCache } from "./useSystemConfigCache";
import { useSystemConfigValue } from "./useSystemConfigValue";

import type { SystemConfigGeneral, SystemConfigCacheData } from "./useSystemConfigCache";

/** @deprecated Use SystemConfigCacheData from useSystemConfigCache instead */
export type SystemConfigCache = SystemConfigCacheData;

// ===== TYPES =====

export interface SystemConfigOptions {
  forceRefresh?: boolean;
  enableCache?: boolean;
  isAdmin?: boolean;
}

export interface SystemConfigResult {
  data: SystemConfigGeneral | null;
  loading: boolean;
  error: unknown;
  isCacheValid: boolean;
  systemInfo: {
    name: string;
    version: string;
    timezone: string;
  };
  getData: () => Promise<SystemConfigGeneral | null>;
  fetchData: () => Promise<void>;
  refresh: () => Promise<void>;
  clearCache: () => void;
  getConfigValue: (key: string, defaultValue?: unknown) => unknown;
}

/**
 * Composable để lấy cấu hình hệ thống với cache 1 giờ
 *
 * Composite hook kết hợp:
 * - useSystemConfigFetch: fetching data từ API
 * - useSystemConfigCache: TTL caching (memory + localStorage)
 * - useSystemConfigValue: helper lấy config values
 */
export function useSystemConfig(
  group: string = "general",
  options: SystemConfigOptions = {}
): SystemConfigResult {
  const { forceRefresh = false, enableCache = true, isAdmin = false } = options;

  // --- Sub-hooks ---
  const fetcher = useSystemConfigFetch({ group, isAdmin });
  const cacher = useSystemConfigCache({ group, enableCache });
  const { getConfigValue, systemInfo } = useSystemConfigValue(fetcher.data);

  // Function để fetch data từ API và lưu cache
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const configData = await fetcher.fetchData();
      cacher.saveToCache(configData);
    } catch {
      // Error đã được set trong fetcher
    }
  }, [fetcher, cacher]);

  // Function để lấy data (từ cache hoặc fetch mới)
  const getData = useCallback(async (): Promise<SystemConfigGeneral | null> => {
    // Nếu tắt cache hoặc force refresh, luôn gọi API mới
    if (!enableCache || forceRefresh) {
      await fetchData();
      return fetcher.data;
    }

    // Kiểm tra cache từ localStorage nếu chưa có trong memory (client only)
    if (!cacher.cache && typeof window !== "undefined") {
      const cachedData = cacher.loadFromStorage();
      if (cachedData) {
        cacher.setCache(cachedData);
        fetcher.setData(cachedData.data);
        return cachedData.data;
      }
    }

    // Nếu có cache hợp lệ, dùng cache
    if (cacher.isCacheValid && cacher.cache) {
      fetcher.setData(cacher.cache.data);
      return cacher.cache.data;
    }

    // Fetch data mới nếu cache không hợp lệ
    await fetchData();
    return fetcher.data;
  }, [enableCache, forceRefresh, cacher, fetcher, fetchData]);

  // Function để clear cache
  const clearCache = useCallback((): void => {
    cacher.clearCache();
    fetcher.setData(null);
  }, [cacher, fetcher]);

  // Function để refresh data (force fetch)
  const refresh = useCallback(async (): Promise<void> => {
    await fetchData();
  }, [fetchData]);

  // Load data on mount — getData phụ thuộc vào `data` (circular dep nếu thêm vào deps).
  // Dùng ref pattern để tránh infinite loop khi dữ liệu load xong trigger effect tiếp.
  const getDataRef = useRef(getData);
  getDataRef.current = getData;
  useEffect(() => {
    getDataRef.current();
  }, []);

  return {
    data: fetcher.data,
    loading: fetcher.loading,
    error: fetcher.error,
    isCacheValid: cacher.isCacheValid,
    systemInfo,
    getData,
    fetchData,
    refresh,
    clearCache,
    getConfigValue,
  };
}

/**
 * Global hook để lấy cấu hình general (sử dụng ở mọi trang)
 */
export function useGlobalSystemConfig(): SystemConfigResult {
  return useSystemConfig("general", {
    enableCache: true,
    forceRefresh: false,
  });
}
