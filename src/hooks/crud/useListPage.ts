"use client";

import { useMemo, useCallback } from "react";
import { useUrlApiSync } from "./useUrlApiSync";
import { useToastContext } from "@/contexts/ToastContext";
import { useSerialNumber } from "../ui-ux/useSerialNumber";
import { useModals } from "./useModals";
import apiClient from "@/lib/api/client";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface UseListPageOptions {
  /** Endpoints cho CRUD operations */
  endpoints: {
    list: string;
    create?: string;
    update?: (id: string | number) => string;
    delete?: (id: string | number) => string;
    show?: (id: string | number) => string;
  };

  /** Transform item trước khi hiển thị */
  transformItem?: (item: any) => any;

  /** Custom error / success messages */
  messages?: {
    createSuccess?: string;
    createError?: string;
    updateSuccess?: string;
    updateError?: string;
    deleteSuccess?: string;
    deleteError?: string;
  };

  /** Callback khi item được tạo / cập nhật / xóa */
  onCreated?: (item: any) => void;
  onUpdated?: (item: any) => void;
  onDeleted?: (id: string | number) => void;

  /** Có cần fetch detail trước khi edit không */
  fetchDetailBeforeEdit?: boolean;

  /**
   * Tên các modal tuỳ chỉnh cần thêm (ngoài create/edit/delete).
   * Ví dụ: customModals: ["assignPermissions", "changePassword"]
   */
  customModals?: string[];
}

// ─── Modal helpers ────────────────────────────

export interface ModalHelper {
  /** Trạng thái tất cả modal: { create, edit, delete, ...customModals } */
  state: Record<string, boolean>;
  /** Item đang được chọn */
  selected: any;
  /** Mở modal theo tên, tuỳ chọn kèm item */
  open: (name: string, item?: any) => void;
  /** Đóng modal theo tên */
  close: (name: string) => void;
  /** Đóng tất cả modal */
  closeAll: () => void;
}

// ─── Actions ─────────────────────────────────

export interface CRUDActions {
  create: (data: any) => Promise<any>;
  update: (id: string | number, data: any) => Promise<any>;
  delete: (id: string | number) => Promise<void>;
  updateFilters: (filters: any) => void;
  changePage: (page: number) => void;
  refresh: () => void;
  clearApiErrors: () => void;
}

// ─── Result ──────────────────────────────────

export interface UseListPageResult {
  // Data
  items: any[];
  loading: boolean;
  pagination: any;
  filters: any;
  apiErrors: any;
  hasData: boolean;

  // Modal helpers (gom tất cả vào một object)
  modal: ModalHelper;

  // CRUD & navigation actions
  actions: CRUDActions;

  // Utilities
  getSerialNumber: (index: number) => number;
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useListPage(
  options: UseListPageOptions
): UseListPageResult {
  const {
    endpoints,
    transformItem,
    onCreated,
    onUpdated,
    onDeleted,
    messages = {},
    fetchDetailBeforeEdit = false,
    customModals = [],
  } = options;

  const { showSuccess: toastSuccess, showError: toastError } =
    useToastContext();

  // ── URL / API sync ──────────────────────────
  const composable = useUrlApiSync({
    endpoint: endpoints.list,
    createEndpoint: endpoints.create,
    updateEndpoint: endpoints.update,
    deleteEndpoint: endpoints.delete,
    transformItem,
  });

  // ── Modals ──────────────────────────────────
  const {
    modals,
    selectedItem,
    openEditModal: openEditModalBase,
    openModal,
    closeModal,
    closeAllModals,
  } = useModals({
    clearApiErrors: composable.clearApiErrors,
    customModals,
  });

  // ── Serial number ───────────────────────────
  const { getSerialNumber } = useSerialNumber(composable.pagination);

  // ── Computed ────────────────────────────────
  const hasData = useMemo(() => composable.items.length > 0, [composable.items]);

  // ── Smart openEdit (fetch detail nếu cần) ───
  const smartOpenEdit = useCallback(
    async (item: any) => {
      if (fetchDetailBeforeEdit && endpoints.show && item?.id) {
        try {
          const url =
            typeof endpoints.show === "function"
              ? endpoints.show(item.id)
              : endpoints.show;
          const response = await apiClient.get(url);
          const data =
            response.data?.data ?? response.data;
          openEditModalBase(data);
        } catch {
          toastError(messages.updateError || "Không thể tải thông tin chi tiết");
          openEditModalBase(item);
        }
      } else {
        openEditModalBase(item);
      }
    },
    [fetchDetailBeforeEdit, endpoints, toastError, messages, openEditModalBase]
  );

  // ── Modal helper object ─────────────────────
  const modal: ModalHelper = useMemo(
    () => ({
      state: modals as Record<string, boolean>,
      selected: selectedItem,
      open: (name: string, item?: any) => {
        if (name === "edit") {
          smartOpenEdit(item);
        } else {
          openModal(name, item);
        }
      },
      close: closeModal,
      closeAll: closeAllModals,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modals, selectedItem, smartOpenEdit, openModal, closeModal, closeAllModals]
  );

  // ── CRUD handlers ───────────────────────────
  const handleCreate = useCallback(
    async (data: any) => {
      try {
        const created = await composable.createItem?.(data);
        if (created) {
          toastSuccess(messages.createSuccess || "Tạo mới thành công");
          closeModal("create");
          onCreated?.(created);
          return created;
        }
      } catch (error: any) {
        toastError(
          error?.response?.data?.message ||
            messages.createError ||
            "Có lỗi xảy ra khi tạo mới"
        );
        throw error;
      }
    },
    [composable, toastSuccess, toastError, messages, closeModal, onCreated]
  );

  const handleUpdate = useCallback(
    async (id: string | number, data: any) => {
      try {
        const updated = await composable.updateItem?.(id, data);
        if (updated) {
          toastSuccess(messages.updateSuccess || "Cập nhật thành công");
          closeModal("edit");
          onUpdated?.(updated);
          return updated;
        }
      } catch (error: any) {
        toastError(
          error?.response?.data?.message ||
            messages.updateError ||
            "Có lỗi xảy ra khi cập nhật"
        );
        throw error;
      }
    },
    [composable, toastSuccess, toastError, messages, closeModal, onUpdated]
  );

  const handleDelete = useCallback(
    async (id: string | number) => {
      try {
        await composable.deleteItem?.(id);
        toastSuccess(messages.deleteSuccess || "Xóa thành công");
        closeModal("delete");
        onDeleted?.(id);
      } catch (error: any) {
        toastError(
          error?.response?.data?.message ||
            messages.deleteError ||
            "Có lỗi xảy ra khi xóa"
        );
      }
    },
    [composable, toastSuccess, toastError, messages, closeModal, onDeleted]
  );

  // ── Actions object ──────────────────────────
  const actions: CRUDActions = useMemo(
    () => ({
      create: handleCreate,
      update: handleUpdate,
      delete: handleDelete,
      updateFilters: composable.updateFilters,
      changePage: composable.changePage,
      refresh: composable.refresh,
      clearApiErrors: composable.clearApiErrors,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleCreate, handleUpdate, handleDelete, composable]
  );

  return {
    items: composable.items,
    loading: composable.loading,
    pagination: composable.pagination,
    filters: composable.filters,
    apiErrors: composable.apiErrors,
    hasData,
    modal,
    actions,
    getSerialNumber,
    toast: {
      success: toastSuccess,
      error: toastError,
    },
  };
}
