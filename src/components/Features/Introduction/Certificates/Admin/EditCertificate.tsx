"use client";

import CertificateForm from "./CertificateForm";

interface Certificate {
  id?: number;
  name?: string;
  image?: string | null;
  issued_by?: string;
  issued_date?: string;
  expiry_date?: string;
  certificate_number?: string;
  description?: string;
  type?: string;
  status?: string;
  sort_order?: number;
}

interface EditCertificateProps {
  show: boolean;
  certificate?: Certificate | null;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditCertificate({
  show,
  certificate,
  apiErrors,
  onUpdated,
  onClose,
}: EditCertificateProps) {
  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  return (
    <CertificateForm
      show={show}
      certificate={certificate}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




