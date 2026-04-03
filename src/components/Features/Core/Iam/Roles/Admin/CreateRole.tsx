"use client";

import { useState, useEffect } from "react";
import RoleForm from "./RoleForm";

interface CreateRoleProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateRole({
  show,
  statusEnums,
  apiErrors,
  onCreated,
  onClose,
}: CreateRoleProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  if (!showModal) return null;

  return (
    <RoleForm
      show={showModal}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



