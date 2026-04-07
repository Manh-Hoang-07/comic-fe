"use client";

import { useState } from "react";
import UserForm from "./UserForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreateUserProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  genderEnums?: Array<{ value: string; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateUser({
  show,
  createApi,
  statusEnums,
  genderEnums,
  onSuccess,
  onClose,
}: CreateUserProps) {
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  const handleSubmit = async (formData: any) => {
    const data = formData || {};
    const baseKeys = ["username", "email", "phone", "status", "password", "name", "image"] as const;
    const profileKeys = ["gender", "birthday", "address", "about", "country_id", "province_id", "ward_id"] as const;

    const payload: Record<string, any> = {};
    baseKeys.forEach((key) => {
      const value = (data as any)[key];
      if (value !== undefined && value !== null && value !== "") {
        payload[key] = value;
      }
    });

    const profile: Record<string, any> = {};
    profileKeys.forEach((key) => {
      const value = (data as any)[key];
      if (value !== undefined && value !== null && value !== "") {
        profile[key] = value;
      }
    });

    if (Object.keys(profile).length > 0) {
      payload.profile = profile;
    }

    setApiErrors(null);
    try {
      await api.post(createApi, payload);
      showSuccess("Người dùng đã được tạo thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
    }
  };

  return (
    <UserForm
      show={show}
      statusEnums={statusEnums}
      genderEnums={genderEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



