"use client";

import TagForm from "./TagForm";
import { useFormModal } from "@/hooks";

interface CreateTagProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateTag({
  show,
  createApi,
  statusEnums,
  onSuccess,
  onClose,
}: CreateTagProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Thêm thẻ mới thành công", onSuccess, onClose }
  );

  return (
    <TagForm
      show={show}
      statusEnums={statusEnums}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}
