"use client";

import { useState, useEffect } from "react";
import MenuForm from "./MenuForm";

interface CreateMenuProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  parentMenus?: Array<any>;
  permissions?: Array<any>;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateMenu({
  show,
  statusEnums,
  parentMenus,
  permissions,
  apiErrors,
  onCreated,
  onClose,
}: CreateMenuProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  if (!showModal) return null;

  return (
    <MenuForm
      show={showModal}
      statusEnums={statusEnums}
      parentMenus={parentMenus}
      permissions={permissions}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



