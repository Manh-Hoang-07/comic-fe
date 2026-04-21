"use client";

import PartnerForm from "./PartnerForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditPartnerProps {
  show: boolean;
  target: EditTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditPartner({
  show,
  target,
  onSuccess,
  onClose,
}: EditPartnerProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật đối tác thành công",
      fetchErrorMessage: "Không thể tải thông tin đối tác",
      onSuccess,
      onClose,
    }
  );

  return (
    <PartnerForm
      show={show}
      partner={entityData}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
