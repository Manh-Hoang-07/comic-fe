"use client";

import { useState, useMemo, useCallback } from "react";

// ===== TYPES =====

export interface SystemConfigGeneral {
  [key: string]: unknown;
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
  contact_channels?: Record<string, unknown>;
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

export interface SystemConfigCacheData {
  data: SystemConfigGeneral;
  timestamp: number;
  ttl: number;
}

// ===== CONSTANTS =====

export const CACHE_TTL = 60 * 60 * 1000; // 1 giờ
const CACHE_KEY_PREFIX = "SystemConfig-cache";

// ===== STORAGE HELPERS =====

const getStorageKey = (group: string) =>
  group === "general" ? CACHE_KEY_PREFIX : `${CACHE_KEY_PREFIX}:${group}`;

export const isCacheExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > CACHE_TTL;
};

const getCacheFromStorage = (group: string): SystemConfigCacheData | null => {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(getStorageKey(group));
    if (!cached) return null;

    const parsedCache: SystemConfigCacheData = JSON.parse(cached);

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

const saveCacheToStorage = (
  group: string,
  cache: SystemConfigCacheData
): void => {
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

// ===== HOOK =====

export interface UseSystemConfigCacheOptions {
  group: string;
  enableCache: boolean;
}

export interface UseSystemConfigCacheResult {
  cache: SystemConfigCacheData | null;
  isCacheValid: boolean;
  setCache: React.Dispatch<React.SetStateAction<SystemConfigCacheData | null>>;
  saveToCache: (configData: SystemConfigGeneral) => void;
  loadFromStorage: () => SystemConfigCacheData | null;
  clearCache: () => void;
}

/**
 * Hook xử lý TTL caching logic (memory + localStorage) cho system config
 */
export function useSystemConfigCache(
  options: UseSystemConfigCacheOptions
): UseSystemConfigCacheResult {
  const { group, enableCache } = options;

  const [cache, setCache] = useState<SystemConfigCacheData | null>(null);

  const isCacheValid = useMemo(() => {
    if (!enableCache || !cache) return false;
    return !isCacheExpired(cache.timestamp);
  }, [enableCache, cache]);

  const saveToCache = useCallback(
    (configData: SystemConfigGeneral): void => {
      if (!enableCache) return;

      const cacheData: SystemConfigCacheData = {
        data: configData,
        timestamp: Date.now(),
        ttl: CACHE_TTL,
      };

      setCache(cacheData);
      saveCacheToStorage(group, cacheData);
    },
    [enableCache, group]
  );

  const loadFromStorage = useCallback((): SystemConfigCacheData | null => {
    if (typeof window === "undefined") return null;
    return getCacheFromStorage(group);
  }, [group]);

  const clearCache = useCallback((): void => {
    setCache(null);
    clearCacheFromStorage(group);
  }, [group]);

  return {
    cache,
    isCacheValid,
    setCache,
    saveToCache,
    loadFromStorage,
    clearCache,
  };
}
