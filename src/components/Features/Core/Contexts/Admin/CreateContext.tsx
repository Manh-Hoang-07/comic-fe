"use client";

import ContextForm from "./ContextForm";

interface CreateContextProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateContext({
  show,
  statusEnums,
  apiErrors,
  onCreated,
  onClose,
}: CreateContextProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <ContextForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



