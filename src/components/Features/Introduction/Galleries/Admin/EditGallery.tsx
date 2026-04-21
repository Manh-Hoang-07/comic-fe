"use client";

import GalleryForm from "./GalleryForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditGalleryProps {
  show: boolean;
  target: EditTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditGallery({
  show,
  target,
  onSuccess,
  onClose,
}: EditGalleryProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật gallery thành công",
      fetchErrorMessage: "Không thể tải thông tin gallery",
      onSuccess,
      onClose,
    }
  );

  return (
    <GalleryForm
      show={show}
      gallery={entityData}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
