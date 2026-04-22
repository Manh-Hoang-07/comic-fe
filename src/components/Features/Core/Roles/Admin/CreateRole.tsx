"use client";

import RoleForm from "./RoleForm";
import { useFormModal } from "@/hooks";
import { type CreateRoleProps } from "./Constants/types";


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
