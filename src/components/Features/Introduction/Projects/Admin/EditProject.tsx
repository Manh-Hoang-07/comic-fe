"use client";

import { useState, useEffect } from "react";
import ProjectForm from "./ProjectForm";

interface Project {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  cover_image?: string | null;
  location?: string;
  area?: number | null;
  start_date?: string;
  end_date?: string;
  status?: string;
  client_name?: string;
  budget?: number | null;
  images?: string[];
  featured?: boolean;
  sort_order?: number;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string | null;
}

interface EditProjectProps {
  show: boolean;
  project?: Project | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditProject({
  show,
  project,
  statusEnums,
  apiErrors,
  onUpdated,
  onClose,
}: EditProjectProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  if (!showModal) return null;

  return (
    <ProjectForm
      show={showModal}
      project={project}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




