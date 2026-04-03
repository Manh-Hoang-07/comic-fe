"use client";

import TagForm from "./TagForm";

interface CreateTagProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateTag({
  show,
  statusEnums,
  apiErrors,
  onCreated,
  onClose,
}: CreateTagProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <TagForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



