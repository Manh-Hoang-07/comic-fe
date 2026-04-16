"use client";

import StaffForm from "./StaffForm";
import { useFormModal } from "@/hooks";

interface CreateStaffProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateStaff({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateStaffProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Thêm nhân viên thành công", onSuccess, onClose }
  );

  return (
    <StaffForm
      show={show}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}
