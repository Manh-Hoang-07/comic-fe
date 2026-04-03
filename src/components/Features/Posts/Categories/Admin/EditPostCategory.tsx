"use client";

import { useState, useEffect, useCallback } from "react";
import PostCategoryForm from "./PostCategoryForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface PostCategory {
  id?: number;
  name?: string;
  description?: string;
  image?: string | null;
  og_image?: string | null;
  status?: string;
  sort_order?: number;
  parent_id?: number | null;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
}

interface EditPostCategoryProps {
  show: boolean;
  category?: PostCategory | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditPostCategory({
  show,
  category,
  statusEnums,
  apiErrors,
  onUpdated,
  onClose,
}: EditPostCategoryProps) {
  const [categoryData, setCategoryData] = useState<PostCategory | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCategoryDetails = useCallback(async () => {
    if (!category?.id) return;

    setLoading(true);
    try {
      const response = await api.get(adminEndpoints.postCategories.show(category.id));
      const data = response.data?.data || response.data;
      setCategoryData(data);
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategoryData(category);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (show && category?.id) {
      fetchCategoryDetails();
    }
  }, [show, category?.id, fetchCategoryDetails]);

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
    <PostCategoryForm
      show={show && !loading}
      category={categoryData || category}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



