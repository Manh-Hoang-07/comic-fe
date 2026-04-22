"use client";

import PermissionForm from "./PermissionForm";
import { useFormModal } from "@/hooks";
import { type EditPermissionProps } from "./Constants/types";


export default function EditPermission({
  show,
  target,
  statusEnums,
  onSuccess,
  onClose,
}: EditPermissionProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    { updateSuccessMessage: "Cập nhật quyền thành công", fetchErrorMessage: "Không thể tải thông tin quyền", onSuccess, onClose }
  );

  return (
    <PermissionForm
      show={show}
      permission={entityData}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
