"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import apiClient from "@/lib/api/client";
import { publicEndpoints, adminEndpoints } from "@/lib/api/endpoints";

// ===== TYPES =====

export interface SystemConfigGeneral {
  [key: string]: any;
  site_name?: string;
  site_description?: string;
  site_logo?: string | null;
  site_favicon?: string | null;
  site_email?: string | null;
  site_phone?: string | null;
  site_address?: string | null;
  site_copyright?: string | null;
  timezone?: string;
  locale?: string;
  currency?: string;
  contact_channels?: any;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
  google_analytics_id?: string | null;
  google_search_console?: string | null;
  facebook_pixel_id?: string | null;
  twitter_site?: string | null;
}

export interface SystemConfigCache {
  data: SystemConfigGeneral;
  timestamp: number;
  ttl: number;
}

export interface SystemConfigOptions {
  forceRefresh?: boolean;
  enableCache?: boolean;
  isAdmin?: boolean;
}

export interface SystemConfigResult {
  data: SystemConfigGeneral | null;
  loading: boolean;
  error: any;
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
  getConfigValue: (key: string, defaultValue?: any) => any;
}

// ===== CACHE MANAGEMENT =====

const CACHE_TTL = 60 * 60 * 1000; // 1 giờ
const CACHE_KEY_PREFIX = "SystemConfig-cache";

const getStorageKey = (group: string) =>
  group === "general" ? CACHE_KEY_PREFIX : `${CACHE_KEY_PREFIX}:${group}`;

const isCacheExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > CACHE_TTL;
};

const getCacheFromStorage = (group: string): SystemConfigCache | null => {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(getStorageKey(group));
    if (!cached) return null;

    const parsedCache: SystemConfigCache = JSON.parse(cached);

    // Kiểm tra cache có hết hạn không
    if (isCacheExpired(parsedCache.timestamp)) {
      localStorage.removeItem(getStorageKey(group));
      return null;
    }

    return parsedCache;
  } catch (error) {
    localStorage.removeItem(getStorageKey(group));
    return null;
  }
};

const saveCacheToStorage = (group: string, cache: SystemConfigCache): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(getStorageKey(group), JSON.stringify(cache));
  } catch (error) {
    // Error saving cache to localStorage
  }
};

const clearCacheFromStorage = (group: string): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(getStorageKey(group));
  } catch (error) {
    // Error clearing cache from localStorage
  }
};

/**
 * Composable để lấy cấu hình hệ thống với cache 1 giờ
 */
export function useSystemConfig(
  group: string = "general",
  options: SystemConfigOptions = {}
): SystemConfigResult {
  const { forceRefresh = false, enableCache = true, isAdmin = false } = options;

  const [data, setData] = useState<SystemConfigGeneral | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [cache, setCache] = useState<SystemConfigCache | null>(null);

  // Computed để kiểm tra cache có hợp lệ không
  const isCacheValid = useMemo(() => {
    if (!enableCache || !cache) return false;
    return !isCacheExpired(cache.timestamp);
  }, [enableCache, cache]);

  const resolveEndpoint = useCallback((): string => {
    // Nếu là admin, ưu tiên dùng adminEndpoints
    if (isAdmin) {
      return adminEndpoints.systemConfigs.getByGroup(group);
    }

    // Sử dụng API mới cho general config
    if (group === "general") return publicEndpoints.systemConfigs.general;
    // Fallback về API cũ cho các group khác
    return publicEndpoints.systemConfigs.getByGroup(group);
  }, [group, isAdmin]);

  const normalizeConfigData = useCallback(
    (responseData: any): SystemConfigGeneral => {
      let configData: SystemConfigGeneral;

      // Nếu API trả về format có wrapper { success, data, ... }
      if (
        responseData &&
        typeof responseData === "object" &&
        !Array.isArray(responseData)
      ) {
        // Kiểm tra nếu có structure { success, data, ... }
        if (
          responseData.data &&
          typeof responseData.data === "object" &&
          !Array.isArray(responseData.data)
        ) {
          configData = responseData.data;
        } else {
          // Nếu không có wrapper, dùng trực tiếp responseData
          configData = responseData;
        }

        // Map legacy fields nếu cần
        if ((configData as any).site_name && !(configData as any).name) {
          (configData as any).name = (configData as any).site_name;
        }
        return configData;
      }

      // Nếu API trả về array của config items (format cũ)
      if (Array.isArray(responseData)) {
        configData = {};
        responseData.forEach((item: any) => {
          if (item?.key && item.value !== undefined) {
            (configData as any)[item.key] = item.value;
          }
        });
        return configData;
      }

      return {};
    },
    []
  );

  const applyConfigData = useCallback(
    (configData: SystemConfigGeneral): void => {
      setData(configData);

      if (enableCache) {
        const cacheData: SystemConfigCache = {
          data: configData,
          timestamp: Date.now(),
          ttl: CACHE_TTL,
        };

        setCache(cacheData);
        saveCacheToStorage(group, cacheData);
      }
    },
    [enableCache, group]
  );

  // Function để fetch data từ API
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = resolveEndpoint();
      const response = await apiClient.get(endpoint);
      const configData = normalizeConfigData(response.data);

      // Nếu backend trả về rỗng/không hợp lệ, throw error
      if (group === "general" && (!configData || Object.keys(configData).length === 0)) {
        throw new Error("Empty system config response from API");
      }

      applyConfigData(configData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [resolveEndpoint, normalizeConfigData, applyConfigData, group]);

  // Function để lấy data (từ cache hoặc fetch mới)
  const getData = useCallback(async (): Promise<SystemConfigGeneral | null> => {
    // Nếu tắt cache hoặc force refresh, luôn gọi API mới
    if (!enableCache || forceRefresh) {
      await fetchData();
      return data;
    }

    // Kiểm tra cache từ localStorage nếu chưa có trong memory (client only)
    if (!cache && typeof window !== "undefined") {
      const cachedData = getCacheFromStorage(group);
      if (cachedData) {
        setCache(cachedData);
        setData(cachedData.data);
        return cachedData.data;
      }
    }

    // Nếu có cache hợp lệ, dùng cache
    if (isCacheValid && cache) {
      setData(cache.data);
      return cache.data;
    }

    // Fetch data mới nếu cache không hợp lệ
    await fetchData();
    return data;
  }, [enableCache, forceRefresh, cache, isCacheValid, group, fetchData, data]);

  // Function để clear cache
  const clearCache = useCallback((): void => {
    setCache(null);
    setData(null);
    clearCacheFromStorage(group);
  }, [group]);

  // Function để refresh data (force fetch)
  const refresh = useCallback(async (): Promise<void> => {
    await fetchData();
  }, [fetchData]);

  // Function để lấy một config value cụ thể
  const getConfigValue = useCallback(
    (key: string, defaultValue: any = null): any => {
      if (!data) return defaultValue;
      return data[key] ?? defaultValue;
    },
    [data]
  );

  const systemInfo = useMemo(
    () => ({
      name: getConfigValue("site_name") || getConfigValue("name", ""),
      version: getConfigValue("version", ""),
      timezone: getConfigValue("timezone", "Asia/Ho_Chi_Minh"),
    }),
    [getConfigValue]
  );

  // Load data on mount
  useEffect(() => {
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    isCacheValid,
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



