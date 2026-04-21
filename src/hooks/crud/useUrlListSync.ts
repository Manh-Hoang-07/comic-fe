"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import apiClient from "@/lib/api/client";
import { normalizeListWithMeta, normalizePaginationMeta } from "@/lib/api/response-normalizer";

/**
 * Đồng bộ URL <-> API list (pagination, filters, sort) mà không bao gồm CRUD.
 * Dùng cho các trang chỉ cần danh sách.
 */
export function useUrlListSync<T extends { id: number | string } = { id: number | string } & Record<string, unknown>>(config: {
  endpoint: string;
  transformItem?: (item: T) => T;
}) {
  const { endpoint, transformItem } = config;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 10,
    totalItems: 0,
  });

  const getUrlParams = useCallback((): Record<string, string | number> => {
    const params: Record<string, string | number> = {};

    searchParams.forEach((value, key) => {
      if (value !== undefined && value !== null) {
        if (key === "page" || key === "limit" || key === "per_page") {
          const parsed = parseInt(value, 10);
          if (!isNaN(parsed)) {
            params[key] = parsed;
          }
        } else {
          params[key] = value;
        }
      }
    });

    return params;
  }, [searchParams]);

  const fetchFromUrl = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = getUrlParams();
      const response = await apiClient.get(endpoint, { params });

      // Normalize response using centralized utilities
      const { items: itemsData, meta: metaData } = normalizeListWithMeta<T>(response.data);

      const transformedData = transformItem
        ? itemsData.map(transformItem)
        : itemsData;
      setItems(transformedData);

      if (metaData) {
        const urlPage = (typeof params.page === "number" ? params.page : parseInt(String(params.page), 10)) || 1;
        const urlLimit = (typeof (params.limit ?? params.per_page) === "number"
          ? (params.limit ?? params.per_page) as number
          : parseInt(String(params.limit ?? params.per_page), 10)) || 10;

        const normalized = normalizePaginationMeta(metaData, urlPage, urlLimit);

        setPagination((prev) => ({
          page: normalized.page ?? prev.page,
          totalPages: normalized.totalPages ?? prev.totalPages,
          limit: normalized.limit ?? prev.limit,
          totalItems: normalized.totalItems ?? prev.totalItems,
        }));
      }
    } catch (err: unknown) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, getUrlParams, transformItem]);

  // Fetch on mount and when searchParams change
  useEffect(() => {
    fetchFromUrl();
  }, [fetchFromUrl]);

  const changePage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page > 1) {
        params.set("page", page.toString());
      } else {
        params.delete("page");
      }
      if (!params.has("limit") && !params.has("per_page")) {
        params.set("limit", "10");
      }
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      router.push(url, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const updateFilters = useCallback(
    (filters: Record<string, string | number>) => {
      const params = new URLSearchParams();

      // Keep page and limit
      const page = searchParams.get("page");
      const limit = searchParams.get("limit") || searchParams.get("per_page");
      if (page) params.set("page", page);
      if (limit) params.set("limit", limit);

      // Add new filters
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });

      // Remove page when filtering
      params.delete("page");

      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      router.push(url, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const updateSort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc" = "desc") => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort_by", sortBy);
      params.set("sort_order", sortOrder);
      params.delete("page");
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      router.push(url, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams();
    const page = searchParams.get("page");
    const limit = searchParams.get("limit") || searchParams.get("per_page");
    if (page) params.set("page", page);
    if (limit) params.set("limit", limit);
    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    router.push(url, { scroll: false });
  }, [router, pathname, searchParams]);

  const resetAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const filters = useMemo(() => getUrlParams(), [getUrlParams]);

  return {
    loading,
    items,
    error,
    pagination,
    filters,
    changePage,
    updateFilters,
    updateSort,
    resetFilters,
    resetAll,
    fetchFromUrl,
    refresh: fetchFromUrl,
  };
}



