"use client";

import PartnerForm from "./PartnerForm";
import { useFormModal } from "@/hooks";

interface EditPartnerProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
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
