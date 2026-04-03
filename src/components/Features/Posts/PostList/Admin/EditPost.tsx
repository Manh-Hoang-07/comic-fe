"use client";

import { useState, useEffect, useCallback } from "react";
import PostForm from "./PostForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface EditPostProps {
  show: boolean;
  post?: any;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  postTypeEnums?: Array<{ value: string; label?: string; name?: string }>;
  categoryEnums?: Array<{ value: number; label?: string; name?: string }>;
  tagEnums?: Array<{ value: number; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditPost({
  show,
  post,
  statusEnums,
  postTypeEnums,
  categoryEnums,
  tagEnums,
  apiErrors,
  onUpdated,
  onClose,
}: EditPostProps) {
  const [showModal, setShowModal] = useState(false);
  const [postData, setPostData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchPostDetails = useCallback(async () => {
    if (!post?.id) return;

    setLoading(true);
    try {
      const response = await api.get(adminEndpoints.posts.show(post.id));
      if (response.data?.success) {
        setPostData(response.data.data);
      } else {
        setPostData(response.data.data || response.data);
      }
    } catch (error) {
      setPostData(post);
    } finally {
      setLoading(false);
    }
  }, [post]);

  useEffect(() => {
    setShowModal(show);
    if (show && post?.id) {
      setPostData(post);
      fetchPostDetails();
    } else {
      setPostData(null);
      setLoading(false);
    }
  }, [show, post, fetchPostDetails]);

  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  if (!showModal) return null;

  return (
    <PostForm
      show={showModal}
      post={postData}
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



