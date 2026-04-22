"use client";

import RoleForm from "./RoleForm";
import { useFormModal } from "@/hooks";
import { type EditRoleProps } from "./Constants/types";


export default function EditRole({
  show,
  target,
  statusEnums,
  onSuccess,
  onClose,
}: EditRoleProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    { updateSuccessMessage: "Cập nhật vai trò thành công", fetchErrorMessage: "Không thể tải thông tin vai trò", onSuccess, onClose }
  );

  return (
    <RoleForm
      show={show}
      role={entityData}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
