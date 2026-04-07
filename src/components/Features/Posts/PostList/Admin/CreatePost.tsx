"use client";

import { useState } from "react";
import PostForm from "./PostForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreatePostProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  postTypeEnums?: Array<{ value: string; label?: string; name?: string }>;
  categoryEnums?: Array<{ value: number; label?: string; name?: string }>;
  tagEnums?: Array<{ value: number; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreatePost({
  show,
  createApi,
  statusEnums,
  postTypeEnums,
  categoryEnums,
  tagEnums,
  onSuccess,
  onClose,
}: CreatePostProps) {
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showSuccess, showError } = useToastContext();

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setApiErrors(null);
    try {
      await api.post(createApi, formData);
      showSuccess("Tạo bài viết thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PostForm
      show={show}
      statusEnums={statusEnums}
      postTypeEnums={postTypeEnums}
      categoryEnums={categoryEnums}
      tagEnums={tagEnums}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}




