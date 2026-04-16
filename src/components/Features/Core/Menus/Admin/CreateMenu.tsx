"use client";

import MenuForm from "./MenuForm";
import { useFormModal } from "@/hooks";

interface CreateMenuProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  parentMenus?: Array<any>;
  permissions?: Array<any>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateMenu({
  show,
  createApi,
  statusEnums,
  parentMenus,
  permissions,
  onSuccess,
  onClose,
}: CreateMenuProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo menu thành công", onSuccess, onClose }
  );

  return (
    <MenuForm
      show={show}
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
