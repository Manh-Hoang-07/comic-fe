"use client";

import WardForm, {
  AdminWardFormEntity,
  WardFormValues,
} from "./WardForm";

interface EditWardProps {
  show: boolean;
  ward: AdminWardFormEntity;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onUpdated: (data: WardFormValues) => void;
}

export default function EditWard({
  show,
  ward,
  apiErrors,
  onClose,
  onUpdated,
}: EditWardProps) {
  return (
    <WardForm
      show={show}
      ward={ward}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onUpdated}
    />
  );
}

