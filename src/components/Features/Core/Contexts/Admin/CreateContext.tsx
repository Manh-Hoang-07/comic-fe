"use client";

import ContextForm from "./ContextForm";
import { useFormModal } from "@/hooks";

interface CreateContextProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateContext({
  show,
  createApi,
  statusEnums,
  onSuccess,
  onClose,
}: CreateContextProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo mới thành công", onSuccess, onClose }
  );

  return (
    <ContextForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
