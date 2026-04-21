"use client";

import TestimonialForm from "./TestimonialForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditTestimonialProps {
  show: boolean;
  target: EditTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditTestimonial({
  show,
  target,
  onSuccess,
  onClose,
}: EditTestimonialProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật đánh giá thành công",
      fetchErrorMessage: "Không thể tải thông tin đánh giá",
      onSuccess,
      onClose,
    }
  );

  return (
    <TestimonialForm
      show={show}
      testimonial={entityData}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
