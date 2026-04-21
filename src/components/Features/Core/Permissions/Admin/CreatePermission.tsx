"use client";

import PermissionForm from "./PermissionForm";
import { useFormModal } from "@/hooks";

interface CreatePermissionProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreatePermission({
  show,
  createApi,
  statusEnums,
  onSuccess,
  onClose,
}: CreatePermissionProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo quyền thành công", onSuccess, onClose }
  );

  return (
    <PermissionForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
