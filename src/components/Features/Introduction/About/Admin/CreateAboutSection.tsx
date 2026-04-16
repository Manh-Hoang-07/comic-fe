"use client";

import AboutSectionForm from "./AboutSectionForm";
import { useFormModal } from "@/hooks";

interface CreateAboutSectionProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateAboutSection({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateAboutSectionProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo section giới thiệu thành công", onSuccess, onClose }
  );

  return (
    <AboutSectionForm
      show={show}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}
