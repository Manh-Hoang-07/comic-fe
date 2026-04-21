"use client";

import PostCategoryForm from "./PostCategoryForm";
import { useFormModal } from "@/hooks";

interface CreatePostCategoryProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreatePostCategory({
  show,
  createApi,
  statusEnums,
  onSuccess,
  onClose,
}: CreatePostCategoryProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo danh mục thành công", onSuccess, onClose }
  );

  return (
    <PostCategoryForm
      show={show}
      statusEnums={statusEnums}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}
