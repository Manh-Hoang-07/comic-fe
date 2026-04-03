"use client";

import { useState, useEffect } from "react";
import ProjectForm from "./ProjectForm";

interface CreateProjectProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateProject({
  show,
  statusEnums,
  apiErrors,
  onCreated,
  onClose,
}: CreateProjectProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  if (!showModal) return null;

  return (
    <ProjectForm
      show={showModal}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




