"use client";

import GalleryForm from "./GalleryForm";
import { useFormModal } from "@/hooks";

interface CreateGalleryProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateGallery({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateGalleryProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo gallery thành công", onSuccess, onClose }
  );

  return (
    <GalleryForm
      show={show}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}
