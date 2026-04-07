"use client";

import { useState } from "react";
import StaffForm from "./StaffForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreateStaffProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateStaff({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateStaffProps) {
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showSuccess, showError } = useToastContext();

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setApiErrors(null);
    try {
      await api.post(createApi, formData);
      showSuccess("Thêm nhân viên thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi thêm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffForm
      show={show}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}





