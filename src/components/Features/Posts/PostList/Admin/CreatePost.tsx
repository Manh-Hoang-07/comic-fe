"use client";

import { useState, useEffect } from "react";
import PostForm from "./PostForm";

interface CreatePostProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  postTypeEnums?: Array<{ value: string; label?: string; name?: string }>;
  categoryEnums?: Array<{ value: number; label?: string; name?: string }>;
  tagEnums?: Array<{ value: number; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreatePost({
  show,
  statusEnums,
  postTypeEnums,
  categoryEnums,
  tagEnums,
  apiErrors,
  onCreated,
  onClose,
}: CreatePostProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  if (!showModal) return null;

  return (
    <PostForm
      show={showModal}
      statusEnums={statusEnums}
      postTypeEnums={postTypeEnums}
      categoryEnums={categoryEnums}
      tagEnums={tagEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



