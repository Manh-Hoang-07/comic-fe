"use client";

import CountryForm from "./CountryForm";
import { useFormModal } from "@/hooks";

interface CreateCountryProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateCountry({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateCountryProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo quốc gia thành công", onSuccess, onClose }
  );

  return (
    <CountryForm
      show={show}
      apiErrors={apiErrors}
      loading={loading}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}
