"use client";

import BannerLocationForm from "./BannerLocationForm";

interface CreateBannerLocationProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateBannerLocation({
  show,
  statusEnums,
  apiErrors,
  onCreated,
  onClose,
}: CreateBannerLocationProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <BannerLocationForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



