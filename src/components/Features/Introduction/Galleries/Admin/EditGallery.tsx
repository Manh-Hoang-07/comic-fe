"use client";

import GalleryForm from "./GalleryForm";

interface Gallery {
  id?: number;
  title?: string;
  slug?: string;
  description?: string;
  cover_image?: string | null;
  images?: string[];
  featured?: boolean;
  status?: string;
  sort_order?: number;
}

interface EditGalleryProps {
  show: boolean;
  gallery?: Gallery | null;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditGallery({
  show,
  gallery,
  apiErrors,
  onUpdated,
  onClose,
}: EditGalleryProps) {
  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  return (
    <GalleryForm
      show={show}
      gallery={gallery}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




