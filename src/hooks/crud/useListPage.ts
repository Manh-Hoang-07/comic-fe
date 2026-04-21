"use client";

import { useMemo, useCallback } from "react";
import { useUrlApiSync } from "./useUrlApiSync";
import { useToastContext } from "@/contexts/ToastContext";
import { useSerialNumber } from "../ui-ux/useSerialNumber";
import apiClient from "@/lib/api/client";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

/** Item tối thiểu từ API list — có id + các field tuỳ ý.
 *  Typed as `any` because the hook is entity-agnostic; consumers narrow via callback annotations. */
export type ListItem = any;

/** Pagination state trả về từ API */
export interface Pagination {
  page: number;
  totalPages: number;
  limit: number;
  totalItems: number;
}

export interface UseListPageOptions {
  /** Endpoint để lấy danh sách dữ liệu */
  endpoint: string;

  /** Transform item trước khi hiển thị (optional) */
  transformItem?: (item: ListItem) => ListItem;

  /** Tùy chọn prefix cho serial number */
  serialNumberPrefix?: string;
}

// ─── Actions ─────────────────────────────────

export interface ListPageActions {
  updateFilters: (filters: Record<string, any>) => void;
  changePage: (page: number) => void;
  refresh: () => Promise<void>;
  clearApiErrors: () => void;
}

// ─── Result ──────────────────────────────────

/** State danh sách */
export interface ListPageData {
  items: ListItem[];
  loading: boolean;
  pagination: Pagination;
  filters: Record<string, unknown>;
  apiErrors: Record<string, string | string[]>;
  hasData: boolean;
}

export interface ListPageUi {
  getSerialNumber: (index: number) => number;
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

export interface UseListPageResult {
  data: ListPageData;
  actions: ListPageActions;
  ui: ListPageUi;
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useListPage(options: UseListPageOptions): UseListPageResult {
  const { endpoint, transformItem } = options;

  const { showSuccess: toastSuccess, showError: toastError } =
    useToastContext();

  // ── URL / API sync ──────────────────────────
  // Sử dụng useUrlApiSync nhưng chỉ tập trung vào phần List
  const composable = useUrlApiSync({
    endpoint,
    transformItem,
  });

  // ── Serial number ───────────────────────────
  const { getSerialNumber } = useSerialNumber(composable.pagination);

  // ── Computed ────────────────────────────────
  const hasData = useMemo(() => composable.items.length > 0, [composable.items]);

  // ── Actions object ──────────────────────────
  const actions: ListPageActions = useMemo(
    () => ({
      updateFilters: composable.updateFilters,
      changePage: composable.changePage,
      refresh: composable.refresh,
      clearApiErrors: composable.clearApiErrors,
    }),
    [composable]
  );

  const data: ListPageData = useMemo(
    () => ({
      items: composable.items,
      loading: composable.loading,
      pagination: composable.pagination,
      filters: composable.filters,
      apiErrors: composable.apiErrors,
      hasData,
    }),
    [
      composable.items,
      composable.loading,
      composable.pagination,
      composable.filters,
      composable.apiErrors,
      hasData,
    ]
  );

  const ui: ListPageUi = useMemo(
    () => ({
      getSerialNumber,
      toast: {
        success: toastSuccess,
        error: toastError,
      },
    }),
    [getSerialNumber, toastSuccess, toastError]
  );

  return { data, actions, ui };
}

