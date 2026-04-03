"use client";

import StaffForm from "./StaffForm";

interface CreateStaffProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateStaff({
  show,
  apiErrors,
  onCreated,
  onClose,
}: CreateStaffProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <StaffForm
      show={show}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




