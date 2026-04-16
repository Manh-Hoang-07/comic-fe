"use client";

import CountryForm from "./CountryForm";
import { useFormModal } from "@/hooks";

interface EditCountryProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
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
