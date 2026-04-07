"use client";

import { useState, useEffect } from "react";
import WardForm, {
  AdminWardFormEntity,
  WardFormValues,
} from "./WardForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditWardProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditWard({
  show,
  target,
  onSuccess,
  onClose,
}: EditWardProps) {
  const [wardData, setWardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  useEffect(() => {
    if (show) {
      if (target?.fetchApi) {
        const fetchWardDetails = async () => {
          setLoading(true);
          try {
            const response = await api.get(target.fetchApi!);
            setWardData(response.data?.data || response.data);
          } catch (error) {
            showError("Không thể tải thông tin Phường/Xã");
            onClose?.();
          } finally {
            setLoading(false);
          }
        };
        fetchWardDetails();
      } else if (target?.initialData) {
        setWardData(target.initialData);
      }
    } else {
      setWardData(null);
      setApiErrors(null);
    }
  }, [show, target, showError, onClose]);

  const handleSubmit = async (formData: WardFormValues) => {
    if (!target?.updateApi) return;
    
    setApiErrors(null);
    try {
      await api.put(target.updateApi, formData);
      showSuccess("Cập nhật Phường/Xã thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <WardForm
      show={show}
      ward={wardData}
      apiErrors={apiErrors}
      loading={loading}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}


