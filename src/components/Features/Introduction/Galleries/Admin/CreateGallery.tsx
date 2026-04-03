"use client";

import GalleryForm from "./GalleryForm";

interface CreateGalleryProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateGallery({
  show,
  apiErrors,
  onCreated,
  onClose,
}: CreateGalleryProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <GalleryForm
      show={show}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




