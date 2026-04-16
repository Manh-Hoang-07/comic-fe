"use client";

import GroupForm from "./GroupForm";
import { useFormModal } from "@/hooks";

interface CreateGroupProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateGroup({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateGroupProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo nhóm thành công", onSuccess, onClose }
  );

  return (
    <GroupForm
      show={show}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
