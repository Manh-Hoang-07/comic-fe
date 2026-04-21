"use client";

import TagForm from "./TagForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditTagProps {
  show: boolean;
  target: EditTarget | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditTag({
  show,
  target,
  statusEnums,
  onSuccess,
  onClose,
}: EditTagProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật thẻ thành công",
      fetchErrorMessage: "Không thể tải thông tin thẻ",
      onSuccess,
      onClose,
    }
  );

  return (
    <TagForm
      show={show}
      tag={entityData}
      statusEnums={statusEnums}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}
