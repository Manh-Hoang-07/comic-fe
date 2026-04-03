"use client";

import TestimonialForm from "./TestimonialForm";

interface CreateTestimonialProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateTestimonial({
  show,
  apiErrors,
  onCreated,
  onClose,
}: CreateTestimonialProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <TestimonialForm
      show={show}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




