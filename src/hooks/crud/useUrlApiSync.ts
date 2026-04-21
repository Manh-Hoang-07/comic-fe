"use client";

import { useState, useCallback } from "react";
import { useUrlListSync } from "./useUrlListSync";
import apiClient from "@/lib/api/client";
import { normalizeResponse } from "@/lib/api/response-normalizer";

/**
 * Composable đơn giản để đồng bộ hóa URL và API
 * - Lấy list theo query URL (page, limit, filter, sort)
 * - Hỗ trợ CRUD cơ bản nếu truyền endpoint tương ứng
 */
export function useUrlApiSync<T extends { id: number | string } = { id: number | string } & Record<string, unknown>>(config: {
  endpoint: string;
  createEndpoint?: string;
  updateEndpoint?: (id: number | string) => string;
  deleteEndpoint?: (id: number | string) => string;
  transformItem?: (item: T) => T;
}) {
  const {
    endpoint,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    transformItem,
  } = config;

  // Base list composable (URL sync, pagination, filters...)
  const listComposable = useUrlListSync<T>({ endpoint, transformItem });

  const [apiErrors, setApiErrors] = useState<Record<string, string | string[]>>({});
  const [isMutating, setIsMutating] = useState(false);

  // CRUD (chỉ tạo nếu có endpoint)
  type ApiErr = { response?: { data?: Record<string, string | string[]> } };
  const createItem = createEndpoint
    ? async (itemData: Record<string, unknown>) => {
      setIsMutating(true);
      setApiErrors({});

      try {
        const response = await apiClient.post(createEndpoint, itemData);
        const payload = normalizeResponse<T>(response.data);
        const newItem = transformItem && payload ? transformItem(payload) : payload;

        // Refresh list to get updated data
        await listComposable.refresh();

        return newItem;
      } catch (err: unknown) {
        setApiErrors((err as ApiErr).response?.data ?? {});
        throw err;
      } finally {
        setIsMutating(false);
      }
    }
    : undefined;

  const updateItem = updateEndpoint
    ? async (id: number | string, itemData: Record<string, unknown>) => {
      setIsMutating(true);
      setApiErrors({});

      try {
        const endpointUrl = updateEndpoint(id);
        const response = await apiClient.put(endpointUrl, itemData);
        const payload = normalizeResponse<T>(response.data);
        const updatedItem = transformItem && payload ? transformItem(payload) : payload;

        // Refresh list to get updated data
        await listComposable.refresh();

        return updatedItem;
      } catch (err: unknown) {
        setApiErrors((err as ApiErr).response?.data ?? {});
        throw err;
      } finally {
        setIsMutating(false);
      }
    }
    : undefined;

  const deleteItem = deleteEndpoint
    ? async (id: number | string) => {
      setIsMutating(true);
      setApiErrors({});

      try {
        await apiClient.delete(deleteEndpoint(id));

        // Refresh list to get updated data
        await listComposable.refresh();

        return true;
      } catch (err: unknown) {
        setApiErrors((err as ApiErr).response?.data ?? {});
        throw err;
      } finally {
        setIsMutating(false);
      }
    }
    : undefined;

  const clearApiErrors = useCallback(() => {
    setApiErrors({});
  }, []);

  return {
    // State
    loading: listComposable.loading || isMutating,
    items: listComposable.items,
    error: listComposable.error,
    pagination: listComposable.pagination,
    filters: listComposable.filters,

    // CRUD
    createItem,
    updateItem,
    deleteItem,

    // Errors
    apiErrors,
    clearApiErrors,

    // Methods
    changePage: listComposable.changePage,
    updateFilters: listComposable.updateFilters,
    updateSort: listComposable.updateSort,
    resetFilters: listComposable.resetFilters,
    resetAll: listComposable.resetAll,
    fetchFromUrl: listComposable.fetchFromUrl,
    refresh: listComposable.refresh,
  };
}



