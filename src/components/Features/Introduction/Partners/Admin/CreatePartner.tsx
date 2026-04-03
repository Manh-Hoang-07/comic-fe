"use client";

import PartnerForm from "./PartnerForm";

interface CreatePartnerProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreatePartner({
  show,
  apiErrors,
  onCreated,
  onClose,
}: CreatePartnerProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <PartnerForm
      show={show}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




