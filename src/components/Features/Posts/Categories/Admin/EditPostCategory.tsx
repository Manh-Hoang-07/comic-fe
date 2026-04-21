"use client";

import PostCategoryForm from "./PostCategoryForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditPostCategoryProps {
  show: boolean;
  target: EditTarget | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditPostCategory({
  show,
  target,
  statusEnums,
  onSuccess,
  onClose,
}: EditPostCategoryProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật danh mục thành công",
      fetchErrorMessage: "Không thể tải thông tin danh mục",
      onSuccess,
      onClose,
    }
  );

  return (
    <PostCategoryForm
      show={show}
      category={entityData}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
