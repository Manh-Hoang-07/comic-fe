"use client";

import ContextForm from "./ContextForm";

interface Context {
  id?: number;
  type?: string;
  code?: string;
  name?: string;
  status?: string;
}

interface EditContextProps {
  show: boolean;
  context?: Context | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditContext({
  show,
  context,
  statusEnums,
  apiErrors,
  onUpdated,
  onClose,
}: EditContextProps) {
  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  return (
    <ContextForm
      show={show}
      context={context}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



