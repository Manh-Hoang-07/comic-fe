"use client";

import CountryForm from "./CountryForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditCountryProps {
  show: boolean;
  target: EditTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditCountry({
  show,
  target,
  onSuccess,
  onClose,
}: EditCountryProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    { updateSuccessMessage: "Cập nhật quốc gia thành công", fetchErrorMessage: "Không thể tải thông tin quốc gia", onSuccess, onClose }
  );

  return (
    <CountryForm
      show={show}
      country={entityData}
      apiErrors={apiErrors}
      loading={loading}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}
