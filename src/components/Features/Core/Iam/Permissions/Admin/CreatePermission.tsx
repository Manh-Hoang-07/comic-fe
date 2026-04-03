"use client";

import PermissionForm from "./PermissionForm";

interface CreatePermissionProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreatePermission({
  show,
  statusEnums,
  apiErrors,
  onCreated,
  onClose,
}: CreatePermissionProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <PermissionForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



