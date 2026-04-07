"use client";

import { useState, useEffect } from "react";
import BannerForm, { BannerFormValues } from "./BannerForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditBannerProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  locationEnums?: Array<{ value: number; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditBanner({
  show,
  target,
  statusEnums,
  locationEnums,
  onSuccess,
  onClose,
}: EditBannerProps) {
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
            showError("Không thể tải thông tin banner");
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

  const handleSubmit = async (formData: BannerFormValues) => {
    if (!target?.updateApi) return;
    
    setApiErrors(null);
    setLoading(true);
    try {
      await api.put(target.updateApi, formData);
      showSuccess("Cập nhật banner thành công");
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
    <BannerForm
      show={show}
      banner={data}
      statusEnums={statusEnums}
      locationEnums={locationEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




