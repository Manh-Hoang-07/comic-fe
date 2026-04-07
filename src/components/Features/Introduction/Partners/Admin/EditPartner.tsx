"use client";

import { useState, useEffect } from "react";
import PartnerForm from "./PartnerForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditPartnerProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditPartner({
  show,
  target,
  onSuccess,
  onClose,
}: EditPartnerProps) {
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
            showError("Không thể tải thông tin đối tác");
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
      showSuccess("Cập nhật đối tác thành công");
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
    <PartnerForm
      show={show}
      partner={data}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}





