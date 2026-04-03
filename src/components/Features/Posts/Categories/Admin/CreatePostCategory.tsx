"use client";

import PostCategoryForm from "./PostCategoryForm";

interface CreatePostCategoryProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreatePostCategory({
  show,
  statusEnums,
  apiErrors,
  onCreated,
  onClose,
}: CreatePostCategoryProps) {
  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  return (
    <PostCategoryForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



