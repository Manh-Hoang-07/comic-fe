"use client";

import PartnerForm from "./PartnerForm";

interface Partner {
  id?: number;
  name?: string;
  logo?: string | null;
  website?: string;
  description?: string;
  type?: string;
  status?: string;
  sort_order?: number;
}

interface EditPartnerProps {
  show: boolean;
  partner?: Partner | null;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditPartner({
  show,
  partner,
  apiErrors,
  onUpdated,
  onClose,
}: EditPartnerProps) {
  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  return (
    <PartnerForm
      show={show}
      partner={partner}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




