"use client";

import ProvinceForm from "./ProvinceForm";
import { useFormModal } from "@/hooks";

interface CreateProvinceProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateProvince({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateProvinceProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo Tỉnh/Thành phố thành công", onSuccess, onClose }
  );

  return (
    <ProvinceForm
      show={show}
      apiErrors={apiErrors}
      loading={loading}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}
