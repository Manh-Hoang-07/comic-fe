"use client";

import BannerLocationForm from "./BannerLocationForm";
import { useFormModal } from "@/hooks";

interface CreateBannerLocationProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateBannerLocation({
  show,
  createApi,
  statusEnums,
  onSuccess,
  onClose,
}: CreateBannerLocationProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo vị trí banner thành công", onSuccess, onClose }
  );

  return (
    <BannerLocationForm
      show={show}
      statusEnums={statusEnums}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}
