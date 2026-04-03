"use client";

import { useState, useCallback } from "react";
import { useUrlListSync } from "./useUrlListSync";
import apiClient from "@/lib/api/client";

/**
 * Composable đơn giản để đồng bộ hóa URL và API
 * - Lấy list theo query URL (page, limit, filter, sort)
 * - Hỗ trợ CRUD cơ bản nếu truyền endpoint tương ứng
 */
export function useUrlApiSync<T extends { id: any } = any>(config: {
  endpoint: string;
  createEndpoint?: string;
  updateEndpoint?: (id: any) => string;
  deleteEndpoint?: (id: any) => string;
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

  const [apiErrors, setApiErrors] = useState<any>({});
  const [isMutating, setIsMutating] = useState(false);

  // CRUD (chỉ tạo nếu có endpoint)
  const createItem = createEndpoint
    ? async (itemData: any) => {
      setIsMutating(true);
      setApiErrors({});

      try {
        const response = await apiClient.post(createEndpoint, itemData);
        // Parse response theo format chuẩn: { success, data: {...}, ... }
        let payload = null;
        if (response.data?.success && response.data?.data) {
          payload = response.data.data;
        } else if (response.data?.data) {
          payload = response.data.data;
        } else {
          payload = response.data;
        }
        const newItem = transformItem ? transformItem(payload) : payload;

        // Refresh list to get updated data
        await listComposable.refresh();

        return newItem;
      } catch (err: any) {
        setApiErrors(err.response?.data || err);
        throw err;
      } finally {
        setIsMutating(false);
      }
    }
    : undefined;

  const updateItem = updateEndpoint
    ? async (id: any, itemData: any) => {
      setIsMutating(true);
      setApiErrors({});

      try {
        const endpointUrl = updateEndpoint(id);
        const response = await apiClient.put(endpointUrl, itemData);
        // Parse response theo format chuẩn: { success, data: {...}, ... }
        let payload = null;
        if (response.data?.success && response.data?.data) {
          payload = response.data.data;
        } else if (response.data?.data) {
          payload = response.data.data;
        } else {
          payload = response.data;
        }
        const updatedItem = transformItem ? transformItem(payload) : payload;

        // Refresh list to get updated data
        await listComposable.refresh();

        return updatedItem;
      } catch (err: any) {
        setApiErrors(err.response?.data || err);
        throw err;
      } finally {
        setIsMutating(false);
      }
    }
    : undefined;

  const deleteItem = deleteEndpoint
    ? async (id: any) => {
      setIsMutating(true);
      setApiErrors({});

      try {
        await apiClient.delete(deleteEndpoint(id));

        // Refresh list to get updated data
        await listComposable.refresh();

        return true;
      } catch (err: any) {
        setApiErrors(err.response?.data || err);
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



