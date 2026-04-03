"use client";

import StaffForm from "./StaffForm";

interface Staff {
  id?: number;
  name?: string;
  position?: string;
  department?: string;
  bio?: string;
  avatar?: string | null;
  email?: string;
  phone?: string;
  social_links?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
  experience?: number;
  expertise?: string;
  status?: string;
  sort_order?: number;
}

interface EditStaffProps {
  show: boolean;
  staff?: Staff | null;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditStaff({
  show,
  staff,
  apiErrors,
  onUpdated,
  onClose,
}: EditStaffProps) {
  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  return (
    <StaffForm
      show={show}
      staff={staff}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




