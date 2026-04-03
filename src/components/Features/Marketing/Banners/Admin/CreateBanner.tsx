"use client";

import { useState, useEffect } from "react";
import BannerForm from "./BannerForm";

interface CreateBannerProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  locationEnums?: Array<{ value: number; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateBanner({
  show,
  statusEnums,
  locationEnums,
  apiErrors,
  onCreated,
  onClose,
}: CreateBannerProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  if (!showModal) return null;

  return (
    <BannerForm
      show={showModal}
      statusEnums={statusEnums}
      locationEnums={locationEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



