"use client";

import TestimonialForm from "./TestimonialForm";

interface Testimonial {
  id?: number;
  client_name?: string;
  client_position?: string;
  client_company?: string;
  client_avatar?: string | null;
  content?: string;
  rating?: number | null;
  project_id?: number | null;
  featured?: boolean;
  status?: string;
  sort_order?: number;
}

interface EditTestimonialProps {
  show: boolean;
  testimonial?: Testimonial | null;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditTestimonial({
  show,
  testimonial,
  apiErrors,
  onUpdated,
  onClose,
}: EditTestimonialProps) {
  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  return (
    <TestimonialForm
      show={show}
      testimonial={testimonial}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




