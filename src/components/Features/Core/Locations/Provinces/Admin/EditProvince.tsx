"use client";

import ProvinceForm from "./ProvinceForm";
import { useFormModal } from "@/hooks";

interface EditProvinceProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditProvince({
  show,
  target,
  onSuccess,
  onClose,
}: EditProvinceProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    { updateSuccessMessage: "Cập nhật Tỉnh/Thành phố thành công", fetchErrorMessage: "Không thể tải thông tin Tỉnh/Thành phố", onSuccess, onClose }
  );

  return (
    <ProvinceForm
      show={show}
      province={entityData}
      apiErrors={apiErrors}
      loading={loading}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}
