"use client";

import WardForm from "./WardForm";
import { useFormModal } from "@/hooks";

interface CreateWardProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateWard({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateWardProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo Phường/Xã thành công", onSuccess, onClose }
  );

  return (
    <WardForm
      show={show}
      apiErrors={apiErrors}
      loading={loading}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}
