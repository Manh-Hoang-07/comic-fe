"use client";

import { useState, useEffect, useCallback } from "react";
import TagForm from "./TagForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface Tag {
  id?: number;
  name?: string;
  description?: string;
  status?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
}

interface EditTagProps {
  show: boolean;
  tag?: Tag | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditTag({
  show,
  tag,
  statusEnums,
  apiErrors,
  onUpdated,
  onClose,
}: EditTagProps) {
  const [tagData, setTagData] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTagDetails = useCallback(async () => {
    if (!tag?.id) return;

    setLoading(true);
    try {
      const response = await api.get(adminEndpoints.postTags.show(tag.id));
      const data = response.data?.data || response.data;
      setTagData(data);
    } catch (error) {
      console.error("Error fetching tag:", error);
      setTagData(tag);
    } finally {
      setLoading(false);
    }
  }, [tag]);

  useEffect(() => {
    if (show && tag?.id) {
      fetchTagDetails();
    }
  }, [show, tag?.id, fetchTagDetails]);

  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <TagForm
      show={show && !loading}
      tag={tagData || tag}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



