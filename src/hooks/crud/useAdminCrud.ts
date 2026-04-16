"use client";

import { useCallback } from "react";
import { useListPage, type UseListPageOptions } from "./useListPage";
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

export interface AdminCrudEndpoints {
  list: string;
  create: string;
  show: (id: any) => string;
  update: (id: any) => string;
  delete: (id: any) => string;
}

export interface UseAdminCrudOptions extends UseListPageOptions {
  /** Message hiển thị khi xóa thành công */
  deleteSuccessMessage?: string;
}

export interface UseAdminCrudResult {
  /** Data từ useListPage */
  data: ReturnType<typeof useListPage>["data"];
  /** Actions từ useListPage */
  actions: ReturnType<typeof useListPage>["actions"];
  /** UI helpers (getSerialNumber) */
  ui: ReturnType<typeof useListPage>["ui"];
  /** Toast helpers */
  toast: { success: (msg: string) => void; error: (msg: string) => void };
  /** Modal cho create */
  createModal: ReturnType<typeof useModal<CreateModalData>>;
  /** Modal cho edit */
  editModal: ReturnType<typeof useModal<EditModalData>>;
  /** Modal cho delete */
  deleteModal: ReturnType<typeof useModal<DeleteModalData>>;
  /** Handler xóa - gọi API và refresh list */
  handleDeleteConfirm: () => Promise<void>;
  /** Helper: mở create modal với đúng endpoint */
  openCreate: (createApi: string) => void;
  /** Helper: mở edit modal cho item */
  openEdit: (item: any, endpoints: AdminCrudEndpoints) => void;
  /** Helper: mở delete modal cho item */
  openDelete: (item: any, endpoints: AdminCrudEndpoints, displayNameField?: string) => void;
}

// ===== HOOK =====

export function useAdminCrud(options: UseAdminCrudOptions): UseAdminCrudResult {
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
    } catch (error: any) {
      showError(error.response?.data?.message || "Có lỗi xảy ra khi xóa");
    }
  }, [deleteModal, showSuccess, showError, deleteSuccessMessage, actions]);

  const openCreate = useCallback(
    (createApi: string) => {
      createModal.open({ createApi });
    },
    [createModal]
  );

  const openEdit = useCallback(
    (item: any, endpoints: AdminCrudEndpoints) => {
      editModal.open({
        fetchApi: endpoints.show(item.id),
        updateApi: endpoints.update(item.id),
      });
    },
    [editModal]
  );

  const openDelete = useCallback(
    (item: any, endpoints: AdminCrudEndpoints, displayNameField = "name") => {
      deleteModal.open({
        id: item.id,
        displayName: item[displayNameField] || item.name || item.title || "",
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
