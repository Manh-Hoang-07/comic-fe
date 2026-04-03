"use client";

import { useState, useEffect } from "react";
import GroupForm from "./GroupForm";

interface CreateGroupProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateGroup({
  show,
  apiErrors,
  onCreated,
  onClose,
}: CreateGroupProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  if (!showModal) return null;

  return (
    <GroupForm
      show={showModal}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



