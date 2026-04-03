"use client";

import FAQForm from "./FAQForm";

interface FAQ {
  id?: number;
  question?: string;
  answer?: string;
  status?: string;
  sort_order?: number;
}

interface EditFAQProps {
  show: boolean;
  faq?: FAQ | null;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditFAQ({
  show,
  faq,
  apiErrors,
  onUpdated,
  onClose,
}: EditFAQProps) {
  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  return (
    <FAQForm
      show={show}
      faq={faq}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




