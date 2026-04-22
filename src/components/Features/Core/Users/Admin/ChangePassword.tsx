"use client";

import { useState } from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";
import { type ChangePasswordProps } from "./Constants/types";


export default function ChangePassword({
  show,
  target,
  onSuccess,
  onClose,
}: ChangePasswordProps) {
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const { showError, showSuccess } = useToastContext();

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (!target?.passApi) return;

    setApiErrors({});
    try {
      await api.patch(target.passApi, formData);
      showSuccess("Mật khẩu đã được thay đổi thành công");
      onSuccess?.();
    } catch (error: unknown) {
      const e = error as { response?: { data?: { errors?: Record<string, string | string[]>; message?: string | string[] } } };
      const response = e?.response;
      const payload = response?.data;

      if (payload?.errors) {
        const errors: Record<string, string> = {};
        Object.keys(payload.errors).forEach((field) => {
          const value = payload.errors![field];
          errors[field] = Array.isArray(value) ? value[0] : value;
        });
        setApiErrors(errors);
      } else {
        const msg = payload?.message || "Có lỗi xảy ra khi đổi mật khẩu";
        setApiErrors({ password: typeof msg === "string" ? msg : Array.isArray(msg) ? msg[0] : "Lỗi không xác định" });
        showError(typeof msg === "string" ? msg : "Có lỗi xảy ra");
      }
    }
  };

  if (!show || !target) return null;

  return (
    <ChangePasswordForm
      show={show}
      user={target.user}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



