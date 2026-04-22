"use client";

import PermissionForm from "./PermissionForm";
import { useFormModal } from "@/hooks";
import { type CreatePermissionProps } from "./Constants/types";


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
