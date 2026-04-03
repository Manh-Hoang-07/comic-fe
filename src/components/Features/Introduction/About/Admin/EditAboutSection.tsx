"use client";

import AboutSectionForm from "./AboutSectionForm";

interface AboutSection {
  id?: number;
  title?: string;
  slug?: string;
  content?: string;
  image?: string | null;
  video_url?: string;
  section_type?: string;
  status?: string;
  sort_order?: number;
}

interface EditAboutSectionProps {
  show: boolean;
  section?: AboutSection | null;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditAboutSection({
  show,
  section,
  apiErrors,
  onUpdated,
  onClose,
}: EditAboutSectionProps) {
  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  return (
    <AboutSectionForm
      show={show}
      section={section}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




