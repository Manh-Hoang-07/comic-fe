"use client";

import { useState, useEffect } from "react";
import UserForm from "./UserForm";

interface CreateUserProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  genderEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateUser({
  show,
  statusEnums,
  genderEnums,
  apiErrors,
  onCreated,
  onClose,
}: CreateUserProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleSubmit = (formData: any) => {
    const data = formData || {};

    // Chỉ giữ các trường được API chấp nhận
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

    onCreated?.(payload);
  };

  if (!showModal) return null;

  return (
    <UserForm
      show={showModal}
      statusEnums={statusEnums}
      genderEnums={genderEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}


