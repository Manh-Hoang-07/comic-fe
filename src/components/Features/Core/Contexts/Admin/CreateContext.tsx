"use client";

import { useState } from "react";
import ContextForm from "./ContextForm";
import apiClient from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreateContextProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateContext({
  show,
  createApi,
  statusEnums,
  onSuccess,
  onClose,
}: CreateContextProps) {
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  const handleSubmit = async (formData: any) => {
    setApiErrors(null);
    try {
      await apiClient.post(createApi, formData);
      showSuccess("Tạo mới thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
    }
  };

  return (
    <ContextForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




