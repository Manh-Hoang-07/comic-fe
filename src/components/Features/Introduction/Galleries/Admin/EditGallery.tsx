"use client";

import GalleryForm from "./GalleryForm";
import { useFormModal } from "@/hooks";

interface EditGalleryProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
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
