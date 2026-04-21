"use client";

import CertificateForm from "./CertificateForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditCertificateProps {
  show: boolean;
  target: EditTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditCertificate({
  show,
  target,
  onSuccess,
  onClose,
}: EditCertificateProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật chứng chỉ thành công",
      fetchErrorMessage: "Không thể tải thông tin chứng chỉ",
      onSuccess,
      onClose,
    }
  );

  return (
    <CertificateForm
      show={show}
      certificate={entityData}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
