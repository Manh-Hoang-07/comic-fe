"use client";

import BannerLocationForm from "./BannerLocationForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditBannerLocationProps {
  show: boolean;
  target: EditTarget | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditBannerLocation({
  show,
  target,
  statusEnums,
  onSuccess,
  onClose,
}: EditBannerLocationProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật vị trí banner thành công",
      fetchErrorMessage: "Không thể tải thông tin vị trí banner",
      onSuccess,
      onClose,
    }
  );

  return (
    <BannerLocationForm
      show={show}
      location={entityData}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
