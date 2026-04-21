"use client";

import WardForm from "./WardForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditWardProps {
  show: boolean;
  target: EditTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditWard({
  show,
  target,
  onSuccess,
  onClose,
}: EditWardProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    { updateSuccessMessage: "Cập nhật Phường/Xã thành công", fetchErrorMessage: "Không thể tải thông tin Phường/Xã", onSuccess, onClose }
  );

  return (
    <WardForm
      show={show}
      ward={entityData}
      apiErrors={apiErrors}
      loading={loading}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}
