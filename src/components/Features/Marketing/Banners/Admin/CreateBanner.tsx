"use client";

import { useState } from "react";
import BannerForm, { BannerFormValues } from "./BannerForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreateBannerProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  locationEnums?: Array<{ value: number; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateBanner({
  show,
  createApi,
  statusEnums,
  locationEnums,
  onSuccess,
  onClose,
}: CreateBannerProps) {
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showSuccess, showError } = useToastContext();

  const handleSubmit = async (formData: BannerFormValues) => {
    setLoading(true);
    setApiErrors(null);
    try {
      await api.post(createApi, formData);
      showSuccess("Tạo banner thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BannerForm
      show={show}
      statusEnums={statusEnums}
      locationEnums={locationEnums}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}




