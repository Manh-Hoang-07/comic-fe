"use client";

import { useState } from "react";
import PermissionForm from "./PermissionForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreatePermissionProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
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
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  const handleSubmit = async (formData: any) => {
    setApiErrors(null);
    try {
      await api.post(createApi, formData);
      showSuccess("Tạo quyền thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
    }
  };

  return (
    <PermissionForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




