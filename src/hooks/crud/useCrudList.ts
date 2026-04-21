"use client";

import { useCallback } from "react";
import { useListPage, type UseListPageOptions, type ListItem } from "./useListPage";
import useModal from "../ui-ux/useModal";
import { useToastContext } from "@/contexts/ToastContext";
import apiClient from "@/lib/api/client";

// ===== TYPES =====


export interface CreateModalData {
  createApi: string;
}

export interface EditModalData {
  fetchApi?: string;
  initialData?: any;
  updateApi: string;
}

export interface DeleteModalData {
  id: number | string;
  deleteApi: string;
  /** Tên item để hiển thị trong confirm modal */
  displayName?: string;
}

export interface CrudEndpoints {
  list: string;
  create: string;
  show: (id: number | string) => string;
  update: (id: number | string) => string;
  delete: (id: number | string) => string;
}

export interface UseCrudListOptions extends UseListPageOptions {
  /** Message hiển thị khi xóa thành công */
  deleteSuccessMessage?: string;
}

// ===== HOOK =====

/**
 * Hook dùng cho bất kỳ trang CRUD list nào (admin, user, hoặc public).
 * Gộp: useListPage + 3 modals (create/edit/delete) + delete handler + toast.
 */
export function useCrudList(options: UseCrudListOptions) {
  const { deleteSuccessMessage = "Xóa thành công", ...listOptions } = options;

  const { data, actions, ui } = useListPage(listOptions);
  const { showSuccess, showError } = useToastContext();

  const createModal = useModal<CreateModalData>();
  const editModal = useModal<EditModalData>();
  const deleteModal = useModal<DeleteModalData>();

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteModal.data?.deleteApi) return;
    try {
      await apiClient.delete(deleteModal.data.deleteApi);
      showSuccess(deleteSuccessMessage);
      deleteModal.close();
      actions.refresh();
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showError(msg || "Có lỗi xảy ra khi xóa");
    }
  }, [deleteModal, showSuccess, showError, deleteSuccessMessage, actions]);

  const openCreate = useCallback(
    (createApi: string) => {
      createModal.open({ createApi });
    },
    [createModal]
  );

  const openEdit = useCallback(
    (item: ListItem, endpoints: CrudEndpoints) => {
      editModal.open({
        fetchApi: endpoints.show(item.id),
        updateApi: endpoints.update(item.id),
      });
    },
    [editModal]
  );

  const openDelete = useCallback(
    (item: ListItem, endpoints: CrudEndpoints, displayNameField = "name") => {
      deleteModal.open({
        id: item.id,
        displayName: String(item[displayNameField] ?? item.name ?? item.title ?? ""),
        deleteApi: endpoints.delete(item.id),
      });
    },
    [deleteModal]
  );

  return {
    data,
    actions,
    ui,
    toast: { success: showSuccess, error: showError },
    createModal,
    editModal,
    deleteModal,
    handleDeleteConfirm,
    openCreate,
    openEdit,
    openDelete,
  };
}

