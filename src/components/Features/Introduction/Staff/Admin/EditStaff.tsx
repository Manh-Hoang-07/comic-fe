"use client";

import StaffForm from "./StaffForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditStaffProps {
  show: boolean;
  target: EditTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditStaff({
  show,
  target,
  onSuccess,
  onClose,
}: EditStaffProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật nhân viên thành công",
      fetchErrorMessage: "Không thể tải thông tin nhân viên",
      onSuccess,
      onClose,
    }
  );

  return (
    <StaffForm
      show={show}
      staff={entityData}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
