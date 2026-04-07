"use client";

import { useState } from "react";
import WardForm, { WardFormValues } from "./WardForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreateWardProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateWard({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateWardProps) {
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  const handleSubmit = async (formData: WardFormValues) => {
    setApiErrors(null);
    try {
      await api.post(createApi, formData);
      showSuccess("Tạo Phường/Xã thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
    }
  };

  return (
    <WardForm
      show={show}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}


