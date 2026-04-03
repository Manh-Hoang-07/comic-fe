"use client";

import AboutSectionForm from "./AboutSectionForm";

interface CreateAboutSectionProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateAboutSection({
  show,
  apiErrors,
  onCreated,
  onClose,
}: CreateAboutSectionProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <AboutSectionForm
      show={show}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




