"use client";

import WardForm, { WardFormValues } from "./WardForm";

interface CreateWardProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onCreated: (data: WardFormValues) => void;
}

export default function CreateWard({
  show,
  apiErrors,
  onClose,
  onCreated,
}: CreateWardProps) {
  return (
    <WardForm
      show={show}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onCreated}
    />
  );
}

