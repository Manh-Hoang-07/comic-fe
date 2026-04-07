"use client";

import { useState } from "react";
import CountryForm, { CountryFormValues } from "./CountryForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreateCountryProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateCountry({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateCountryProps) {
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  const handleSubmit = async (formData: CountryFormValues) => {
    setApiErrors(null);
    try {
      await api.post(createApi, formData);
      showSuccess("Tạo quốc gia thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
    }
  };

  return (
    <CountryForm
      show={show}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}


