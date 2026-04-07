"use client";

import { useState } from "react";
import MenuForm from "./MenuForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

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
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  const handleSubmit = async (formData: any) => {
    setApiErrors(null);
    try {
      await api.post(createApi, formData);
      showSuccess("Tạo menu thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
    }
  };

  return (
    <MenuForm
      show={show}
      statusEnums={statusEnums}
      parentMenus={parentMenus}
      permissions={permissions}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




