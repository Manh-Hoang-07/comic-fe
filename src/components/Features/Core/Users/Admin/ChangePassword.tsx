"use client";

import { useState, useEffect } from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface ChangePasswordProps {
  show: boolean;
  user?: any;
  onPasswordChanged?: () => void;
  onClose?: () => void;
}

export default function ChangePassword({
  show,
  user,
  onPasswordChanged,
  onClose,
}: ChangePasswordProps) {
  const [showModal, setShowModal] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setShowModal(show);
    if (!show) {
      setApiErrors({});
    }
  }, [show]);

  const resetErrors = () => {
    setApiErrors({});
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!user?.id) return;

    resetErrors();
    try {
      await api.patch(adminEndpoints.users.changePassword(user.id), formData);
      onPasswordChanged?.();
      onClose?.();
    } catch (error: any) {
      const response = error?.response;
      const payload = response?.data;

      if (payload?.errors) {
        const errors: Record<string, string> = {};
        Object.keys(payload.errors).forEach((field) => {
          const value = payload.errors[field];
          errors[field] = Array.isArray(value) ? value[0] : value;
        });
        setApiErrors(errors);
      } else if (Array.isArray(payload?.message) && payload.message.length) {
        setApiErrors({ password: payload.message[0] });
      } else if (typeof payload?.message === "string") {
        setApiErrors({ password: payload.message });
      }
    }
  };

  if (!showModal) return null;

  return (
    <ChangePasswordForm
      show={showModal}
      user={user}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}


