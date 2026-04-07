"use client";

import { useState, useEffect } from "react";
import ContextForm from "./ContextForm";
import apiClient from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditContextProps {
  show: boolean;
  target: { fetchApi?: string; updateApi: string; initialData?: any } | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditContext({
  show,
  target,
  statusEnums,
  onSuccess,
  onClose,
}: EditContextProps) {
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
            const response = await apiClient.get(target.fetchApi!);
            const result = response.data?.data ?? response.data;
            setData(result);
          } catch (error) {
            showError("Không thể tải thông tin chi tiết");
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
    }
  }, [show, target, showError, onClose]);

  const handleSubmit = async (formData: any) => {
    if (!target?.updateApi) return;
    
    setApiErrors(null);
    try {
      await apiClient.put(target.updateApi, formData);
      showSuccess("Cập nhật thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <ContextForm
      show={show}
      context={data}
      loading={loading}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




