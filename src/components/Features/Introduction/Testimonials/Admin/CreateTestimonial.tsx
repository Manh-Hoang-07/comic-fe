"use client";

import { useState } from "react";
import TestimonialForm from "./TestimonialForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreateTestimonialProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateTestimonial({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateTestimonialProps) {
  const [apiErrors, setApiErrors] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useToastContext();

  const handleSubmit = async (formData: any) => {
    setApiErrors(null);
    setLoading(true);
    try {
      await api.post(createApi, formData);
      showSuccess("Tạo đánh giá thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TestimonialForm
      show={show}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}





