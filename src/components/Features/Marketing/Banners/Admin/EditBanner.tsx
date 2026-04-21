"use client";

import BannerForm from "./BannerForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditBannerProps {
  show: boolean;
  target: EditTarget | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  locationEnums?: Array<{ value: number; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditBanner({
  show,
  target,
  statusEnums,
  locationEnums,
  onSuccess,
  onClose,
}: EditBannerProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật banner thành công",
      fetchErrorMessage: "Không thể tải thông tin banner",
      onSuccess,
      onClose,
    }
  );

  return (
    <BannerForm
      show={show}
      banner={entityData}
      statusEnums={statusEnums}
      locationEnums={locationEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
