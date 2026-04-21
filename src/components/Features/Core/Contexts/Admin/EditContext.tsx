"use client";

import ContextForm from "./ContextForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditContextProps {
  show: boolean;
  target: EditTarget | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditContext({
  show,
  target,
  statusEnums,
  onSuccess,
  onClose,
}: EditContextProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    { updateSuccessMessage: "Cập nhật thành công", fetchErrorMessage: "Không thể tải thông tin chi tiết", onSuccess, onClose }
  );

  return (
    <ContextForm
      show={show}
      context={entityData}
      loading={loading}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
