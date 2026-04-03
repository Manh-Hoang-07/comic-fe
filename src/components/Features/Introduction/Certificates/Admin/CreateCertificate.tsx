"use client";

import CertificateForm from "./CertificateForm";

interface CreateCertificateProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateCertificate({
  show,
  apiErrors,
  onCreated,
  onClose,
}: CreateCertificateProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <CertificateForm
      show={show}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




