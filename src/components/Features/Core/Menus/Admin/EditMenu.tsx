"use client";

import MenuForm from "./MenuForm";
import { useFormModal } from "@/hooks";
import { type EditMenuProps } from "./Constants/types";


export default function EditMenu({
  show,
  target,
  statusEnums,
  parentMenus,
  permissions,
  onSuccess,
  onClose,
}: EditMenuProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    { updateSuccessMessage: "Cập nhật menu thành công", fetchErrorMessage: "Không thể tải thông tin menu", onSuccess, onClose }
  );

  return (
    <MenuForm
      show={show}
      menu={entityData}
      statusEnums={statusEnums}
      parentMenus={parentMenus}
      permissions={permissions}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
