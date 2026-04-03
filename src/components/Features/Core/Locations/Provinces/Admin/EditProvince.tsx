"use client";

import ProvinceForm, {
  AdminProvinceFormEntity,
  ProvinceFormValues,
} from "./ProvinceForm";

interface EditProvinceProps {
  show: boolean;
  province: AdminProvinceFormEntity;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onUpdated: (data: ProvinceFormValues) => void;
}

export default function EditProvince({
  show,
  province,
  apiErrors,
  onClose,
  onUpdated,
}: EditProvinceProps) {
  return (
    <ProvinceForm
      show={show}
      province={province}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onUpdated}
    />
  );
}

