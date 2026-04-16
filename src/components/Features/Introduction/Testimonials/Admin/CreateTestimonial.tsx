"use client";

import TestimonialForm from "./TestimonialForm";
import { useFormModal } from "@/hooks";

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
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo đánh giá thành công", onSuccess, onClose }
  );

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
