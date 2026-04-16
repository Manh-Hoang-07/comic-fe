"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import apiClient from "@/lib/api/client";

/**
 * Đồng bộ URL <-> API list (pagination, filters, sort) mà không bao gồm CRUD.
 * Dùng cho các trang chỉ cần danh sách.
 */
export function useUrlListSync<T extends { id: any } = any>(config: {
  endpoint: string;
  transformItem?: (item: T) => T;
}) {
  const { endpoint, transformItem } = config;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<any>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 10,
    totalItems: 0,
  });

  const getUrlParams = useCallback((): Record<string, any> => {
    const params: Record<string, any> = {};

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

      // Parse response theo format chuẩn: { success, data: { items, meta }, ... }
      let itemsData: any[] = [];
      let metaData: any = null;

      if (response.data?.success && response.data?.data) {
        // Format chuẩn: data.data.items và data.data.meta
        if (response.data.data.items && Array.isArray(response.data.data.items)) {
          itemsData = response.data.data.items;
          metaData = response.data.data.meta || null;
        } else if (Array.isArray(response.data.data)) {
          // Fallback: nếu data là array trực tiếp
          itemsData = response.data.data;
          metaData = response.data.meta || null;
        }
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Fallback: format cũ { data: [...], meta: {...} }
        itemsData = response.data.data;
        metaData = response.data.meta || null;
      } else if (Array.isArray(response.data)) {
        // Fallback: response trực tiếp là array
        itemsData = response.data;
      }

      const transformedData = transformItem
        ? itemsData.map(transformItem)
        : itemsData;
      setItems(transformedData);

      if (metaData) {
        const toNumber = (val: any): number | undefined => {
          if (val === null || val === undefined || val === "") return undefined;
          const n = typeof val === "number" ? val : parseInt(String(val), 10);
          return Number.isFinite(n) ? n : undefined;
        };

        const urlPage = toNumber(params.page) ?? 1;
        const urlLimit = toNumber(params.limit ?? params.per_page) ?? 10;

        setPagination((prev) => ({
          page:
            toNumber(
              metaData.page ??
                metaData.current_page ??
                metaData.currentPage ??
                metaData.page_index ??
                metaData.pageIndex
            ) ??
            urlPage ??
            prev.page,
          totalPages:
            toNumber(
              metaData.totalPages ??
                metaData.pageCount ??
                metaData.total_pages ??
                metaData.lastPage ??
                metaData.last_page
            ) ?? prev.totalPages,
          limit: toNumber(metaData.limit ?? metaData.per_page ?? metaData.perPage) ?? urlLimit ?? prev.limit,
          totalItems:
            toNumber(metaData.totalItems ?? metaData.total ?? metaData.total_items) ??
            prev.totalItems,
        }));
      }
    } catch (err: any) {
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
    (filters: Record<string, any>) => {
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



