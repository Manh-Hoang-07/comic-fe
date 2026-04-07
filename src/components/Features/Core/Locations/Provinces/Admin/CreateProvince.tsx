"use client";

import { useState } from "react";
import ProvinceForm, { ProvinceFormValues } from "./ProvinceForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreateProvinceProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateProvince({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateProvinceProps) {
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  const handleSubmit = async (formData: ProvinceFormValues) => {
    setApiErrors(null);
    try {
      await api.post(createApi, formData);
      showSuccess("Tạo Tỉnh/Thành phố thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
    }
  };

  return (
    <ProvinceForm
      show={show}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}


