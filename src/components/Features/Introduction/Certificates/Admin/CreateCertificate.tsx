"use client";

import CertificateForm from "./CertificateForm";
import { useFormModal } from "@/hooks";

interface CreateCertificateProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateCertificate({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateCertificateProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo chứng chỉ thành công", onSuccess, onClose }
  );

  return (
    <CertificateForm
      show={show}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}
