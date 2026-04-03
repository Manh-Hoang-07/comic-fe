"use client";

import FAQForm from "./FAQForm";

interface CreateFAQProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateFAQ({
  show,
  apiErrors,
  onCreated,
  onClose,
}: CreateFAQProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <FAQForm
      show={show}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




