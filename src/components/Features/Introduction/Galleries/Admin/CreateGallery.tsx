"use client";

import { useState } from "react";
import GalleryForm from "./GalleryForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreateGalleryProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateGallery({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateGalleryProps) {
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showSuccess, showError } = useToastContext();

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setApiErrors(null);
    try {
      await api.post(createApi, formData);
      showSuccess("Tạo gallery thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GalleryForm
      show={show}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}





