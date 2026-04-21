"use client";

import GroupForm from "./GroupForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditGroupProps {
  show: boolean;
  target: EditTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditGroup({
  show,
  target,
  onSuccess,
  onClose,
}: EditGroupProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    { updateSuccessMessage: "Cập nhật nhóm thành công", fetchErrorMessage: "Không thể tải thông tin nhóm", onSuccess, onClose }
  );

  return (
    <GroupForm
      show={show}
      group={entityData}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
