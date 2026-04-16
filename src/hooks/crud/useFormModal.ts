"use client";

import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

// ===== TYPES =====

export interface UseFormModalOptions {
  /** Message khi tạo thành công */
  createSuccessMessage?: string;
  /** Message khi cập nhật thành công */
  updateSuccessMessage?: string;
  /** Message khi không thể tải dữ liệu (edit mode) */
  fetchErrorMessage?: string;
  /** Callback sau khi submit thành công */
  onSuccess?: () => void;
  /** Callback khi đóng modal */
  onClose?: () => void;
}

export interface CreateModeProps {
  mode: "create";
  show: boolean;
  createApi: string;
}

export interface EditModeProps {
  mode: "edit";
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
}

export type FormModalProps = CreateModeProps | EditModeProps;

export interface UseFormModalResult {
  /** Dữ liệu entity (chỉ có ở edit mode, sau khi fetch) */
  entityData: any;
  /** Đang loading (fetch hoặc submit) */
  loading: boolean;
  /** Lỗi từ API */
  apiErrors: any;
  /** Handler submit form - tự detect create/edit */
  handleSubmit: (formData: any) => Promise<void>;
  /** True nếu đang ở edit mode */
  isEditMode: boolean;
}

// ===== HOOK =====

/**
 * Hook gộp logic chung của Create/Edit modal.
 *
 * @example
 * // Trong CreateTag.tsx - thay thế toàn bộ file
 * const { loading, apiErrors, handleSubmit } = useFormModal(
 *   { mode: "create", show, createApi },
 *   { createSuccessMessage: "Thêm thẻ thành công", onSuccess, onClose }
 * );
 * return <TagForm show={show} onSubmit={handleSubmit} loading={loading} apiErrors={apiErrors} onCancel={onClose} />;
 *
 * // Trong EditTag.tsx - thay thế toàn bộ file
 * const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
 *   { mode: "edit", show, target },
 *   { updateSuccessMessage: "Cập nhật thẻ thành công", onSuccess, onClose }
 * );
 * return <TagForm show={show} tag={entityData} onSubmit={handleSubmit} loading={loading} apiErrors={apiErrors} onCancel={onClose} />;
 */
export function useFormModal(
  props: FormModalProps,
  options: UseFormModalOptions = {}
): UseFormModalResult {
  const {
    createSuccessMessage = "Tạo thành công",
    updateSuccessMessage = "Cập nhật thành công",
    fetchErrorMessage = "Không thể tải dữ liệu",
    onSuccess,
    onClose,
  } = options;

  const [entityData, setEntityData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showSuccess, showError } = useToastContext();

  const isEditMode = props.mode === "edit";

  // Fetch entity data khi edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const { show, target } = props as EditModeProps;

    if (show) {
      if (target?.fetchApi) {
        const fetchData = async () => {
          setLoading(true);
          try {
            const response = await apiClient.get(target.fetchApi!);
            setEntityData(response.data?.data || response.data);
          } catch {
            showError(fetchErrorMessage);
            onClose?.();
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      } else if (target?.initialData) {
        setEntityData(target.initialData);
      }
    } else {
      setEntityData(null);
      setApiErrors(null);
    }
  }, [isEditMode, props.show, isEditMode ? (props as EditModeProps).target : null]);

  const handleSubmit = useCallback(
    async (formData: any) => {
      setApiErrors(null);
      setLoading(true);

      try {
        if (isEditMode) {
          const { target } = props as EditModeProps;
          if (!target?.updateApi) return;
          await apiClient.put(target.updateApi, formData);
          showSuccess(updateSuccessMessage);
        } else {
          const { createApi } = props as CreateModeProps;
          await apiClient.post(createApi, formData);
          showSuccess(createSuccessMessage);
        }
        onSuccess?.();
      } catch (error: any) {
        const errors = error.response?.data?.errors || error.response?.data || error;
        setApiErrors(errors);
        showError(error.response?.data?.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    },
    [isEditMode, props, showSuccess, showError, createSuccessMessage, updateSuccessMessage, onSuccess]
  );

  return {
    entityData,
    loading,
    apiErrors,
    handleSubmit,
    isEditMode,
  };
}
