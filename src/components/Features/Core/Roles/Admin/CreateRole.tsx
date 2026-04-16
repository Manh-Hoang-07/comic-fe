"use client";

import RoleForm from "./RoleForm";
import { useFormModal } from "@/hooks";

interface CreateRoleProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateRole({
  show,
  createApi,
  statusEnums,
  onSuccess,
  onClose,
}: CreateRoleProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo vai trò thành công", onSuccess, onClose }
  );

  return (
    <RoleForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
