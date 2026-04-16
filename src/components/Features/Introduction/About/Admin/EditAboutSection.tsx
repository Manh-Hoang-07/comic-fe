"use client";

import AboutSectionForm from "./AboutSectionForm";
import { useFormModal } from "@/hooks";

interface EditAboutSectionProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditAboutSection({
  show,
  target,
  onSuccess,
  onClose,
}: EditAboutSectionProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật section thành công",
      fetchErrorMessage: "Không thể tải thông tin section",
      onSuccess,
      onClose,
    }
  );

  return (
    <AboutSectionForm
      show={show}
      section={entityData}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
