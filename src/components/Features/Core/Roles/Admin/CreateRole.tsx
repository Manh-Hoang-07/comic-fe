"use client";

import { useState } from "react";
import RoleForm from "./RoleForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

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
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  const handleSubmit = async (formData: any) => {
    setApiErrors(null);
    try {
      await api.post(createApi, formData);
      showSuccess("Tạo vai trò thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
    }
  };

  return (
    <RoleForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




