"use client";

import { useState, useEffect } from "react";
import PostCategoryForm from "./PostCategoryForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditPostCategoryProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditPostCategory({
  show,
  target,
  statusEnums,
  onSuccess,
  onClose,
}: EditPostCategoryProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  useEffect(() => {
    if (show) {
      if (target?.fetchApi) {
        const fetchData = async () => {
          setLoading(true);
          try {
            const response = await api.get(target.fetchApi!);
            setData(response.data?.data || response.data);
          } catch (error) {
            showError("Không thể tải thông tin danh mục");
            onClose?.();
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      } else if (target?.initialData) {
        setData(target.initialData);
      }
    } else {
      setData(null);
      setApiErrors(null);
    }
  }, [show, target, showError, onClose]);

  const handleSubmit = async (formData: any) => {
    if (!target?.updateApi) return;
    
    setApiErrors(null);
    setLoading(true);
    try {
      await api.put(target.updateApi, formData);
      showSuccess("Cập nhật danh mục thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PostCategoryForm
      show={show}
      category={data}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




