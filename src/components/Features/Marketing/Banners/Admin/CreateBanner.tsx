"use client";

import BannerForm from "./BannerForm";
import { useFormModal } from "@/hooks";

interface CreateBannerProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  locationEnums?: Array<{ value: number; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateBanner({
  show,
  createApi,
  statusEnums,
  locationEnums,
  onSuccess,
  onClose,
}: CreateBannerProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo banner thành công", onSuccess, onClose }
  );

  return (
    <BannerForm
      show={show}
      statusEnums={statusEnums}
      locationEnums={locationEnums}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}
