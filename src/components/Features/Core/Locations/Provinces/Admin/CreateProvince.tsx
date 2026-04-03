"use client";

import ProvinceForm, { ProvinceFormValues } from "./ProvinceForm";

interface CreateProvinceProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onCreated: (data: ProvinceFormValues) => void;
}

export default function CreateProvince({
  show,
  apiErrors,
  onClose,
  onCreated,
}: CreateProvinceProps) {
  return (
    <ProvinceForm
      show={show}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onCreated}
    />
  );
}

