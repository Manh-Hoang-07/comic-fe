"use client";

import { useState, useMemo, useCallback } from "react";
import { useUrlApiSync } from "./useUrlApiSync";
import { useToastContext } from "@/contexts/ToastContext";
import { useSerialNumber } from "./useSerialNumber";
import { useAdminModals } from "./useAdminModals";
import apiClient from "@/lib/api/client";

/**
 * Options cho useAdminListPage
 */
export interface UseAdminListPageOptions {
  /**
   * Endpoints cho CRUD operations
   */
  endpoints: {
    list: string;
    create?: string;
    update?: (id: string | number) => string;
    delete?: (id: string | number) => string;
    show?: (id: string | number) => string;
  };

  /**
   * Transform item trước khi hiển thị
   */
  transformItem?: (item: any) => any;

  /**
   * Custom title và button text
   */
  defaults?: {
    title?: string;
    createButtonText?: string;
  };

  /**
   * Callback khi item được tạo
   */
  onCreated?: (item: any) => void;

  /**
   * Callback khi item được cập nhật
   */
  onUpdated?: (item: any) => void;

  /**
   * Callback khi item bị xóa
   */
  onDeleted?: (id: string | number) => void;

  /**
   * Custom error messages
   */
  messages?: {
    createSuccess?: string;
    createError?: string;
    updateSuccess?: string;
    updateError?: string;
    deleteSuccess?: string;
    deleteError?: string;
  };

  /**
   * Có cần fetch detail trước khi edit không
   */
  fetchDetailBeforeEdit?: boolean;

  /**
   * Custom modals cần thêm vào
   */
  customModals?: string[];
}

/**
 * Kết quả trả về từ useAdminListPage
 */
export interface UseAdminListPageResult {
  // State
  items: any[];
  loading: boolean;
  pagination: any;
  filters: any;
  apiErrors: any;
  hasData: boolean;

  // Modals
  modals: any;
  selectedItem: any;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (item: any) => void;
  closeEditModal: () => void;
  openDeleteModal: (item: any) => void;
  closeDeleteModal: () => void;

  // Actions
  updateFilters: (newFilters: any) => void;
  changePage: (page: number) => void;
  refresh: () => void;
  clearApiErrors: () => void;
  handleCreate: (itemData: any) => Promise<any>;
  handleUpdate: (id: string | number, itemData: any) => Promise<any>;
  handleDelete: (id: string | number) => Promise<void>;
  openModal: (modalName: string, item?: any) => void;
  closeModal: (modalName: string) => void;

  // Utils
  getSerialNumber: (index: number) => number;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

/**
 * Hook để quản lý trang admin list với CRUD operations
 */
export function useAdminListPage(
  options: UseAdminListPageOptions
): UseAdminListPageResult {
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

  // Setup URL API sync
  const composable = useUrlApiSync({
    endpoint: endpoints.list,
    createEndpoint: endpoints.create,
    updateEndpoint: endpoints.update,
    deleteEndpoint: endpoints.delete,
    transformItem,
  });

  // Setup modals
  const {
    modals,
    selectedItem,
    openCreateModal,
    closeCreateModal,
    openEditModal: openEditModalBase,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openModal,
    closeModal,
  } = useAdminModals({
    clearApiErrors: composable.clearApiErrors,
    customModals,
  });

  // Setup serial number
  const { getSerialNumber } = useSerialNumber(composable.pagination);

  // Computed
  const hasData = useMemo(() => composable.items.length > 0, [composable.items]);

  // Custom openEditModal nếu cần fetch detail
  const openEditModal = useCallback(
    async (item: any) => {
      if (fetchDetailBeforeEdit && endpoints.show && item?.id) {
        try {
          const showEndpoint =
            typeof endpoints.show === "function"
              ? endpoints.show(item.id)
              : endpoints.show;
          const response = await apiClient.get(showEndpoint);
          // Parse response theo format chuẩn: { success, data: {...}, ... }
          let data = null;
          if (response.data?.success && response.data?.data) {
            data = response.data.data;
          } else if (response.data?.data) {
            data = response.data.data;
          } else {
            data = response.data;
          }
          openEditModalBase(data);
        } catch (error: any) {
          toastError(messages.updateError || "Không thể tải thông tin chi tiết");
          // Fallback to original item
          openEditModalBase(item);
        }
      } else {
        openEditModalBase(item);
      }
    },
    [fetchDetailBeforeEdit, endpoints, toastError, messages, openEditModalBase]
  );

  // Handle create
  const handleCreate = useCallback(
    async (itemData: any) => {
      try {
        const createdItem = await composable.createItem?.(itemData);
        if (createdItem) {
          toastSuccess(messages.createSuccess || "Tạo mới thành công");
          closeCreateModal();
          if (onCreated) {
            onCreated(createdItem);
          }
          return createdItem;
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          messages.createError ||
          "Có lỗi xảy ra khi tạo mới";
        toastError(errorMessage);
        throw error;
      }
    },
    [composable, toastSuccess, toastError, messages, closeCreateModal, onCreated]
  );

  // Handle update
  const handleUpdate = useCallback(
    async (id: string | number, itemData: any) => {
      try {
        const updatedItem = await composable.updateItem?.(id, itemData);
        if (updatedItem) {
          toastSuccess(messages.updateSuccess || "Cập nhật thành công");
          closeEditModal();
          if (onUpdated) {
            onUpdated(updatedItem);
          }
          return updatedItem;
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          messages.updateError ||
          "Có lỗi xảy ra khi cập nhật";
        toastError(errorMessage);
        throw error;
      }
    },
    [composable, toastSuccess, toastError, messages, closeEditModal, onUpdated]
  );

  // Handle delete
  const handleDelete = useCallback(
    async (id: string | number) => {
      try {
        await composable.deleteItem?.(id);
        toastSuccess(messages.deleteSuccess || "Xóa thành công");
        closeDeleteModal();
        if (onDeleted) {
          onDeleted(id);
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          messages.deleteError ||
          "Có lỗi xảy ra khi xóa";
        toastError(errorMessage);
      }
    },
    [composable, toastSuccess, toastError, messages, closeDeleteModal, onDeleted]
  );

  return {
    // State
    items: composable.items,
    loading: composable.loading,
    pagination: composable.pagination,
    filters: composable.filters,
    apiErrors: composable.apiErrors,
    hasData,

    // Modals
    modals,
    selectedItem,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,

    // Actions
    updateFilters: composable.updateFilters,
    changePage: composable.changePage,
    refresh: composable.refresh,
    clearApiErrors: composable.clearApiErrors,
    handleCreate,
    handleUpdate,
    handleDelete,
    openModal,
    closeModal,

    // Utils
    getSerialNumber,
    showSuccess: toastSuccess,
    showError: toastError,
  };
}


