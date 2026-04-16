"use client";

import PartnerForm from "./PartnerForm";
import { useFormModal } from "@/hooks";

interface CreatePartnerProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreatePartner({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreatePartnerProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo đối tác thành công", onSuccess, onClose }
  );

  return (
    <PartnerForm
      show={show}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}
