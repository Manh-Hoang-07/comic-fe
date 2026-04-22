"use client";

import { useCallback } from "react";
import UserForm from "./UserForm";
import { useFormModal } from "@/hooks";
import { type CreateUserProps } from "./Constants/types";


const buildUserPayload = (formData: Record<string, unknown>) => {
  const data = formData || {};
  const baseKeys = ["username", "email", "phone", "status", "password", "name", "image"] as const;
  const profileKeys = ["gender", "birthday", "address", "about", "country_id", "province_id", "ward_id"] as const;

  const payload: Record<string, unknown> = {};
  baseKeys.forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null && value !== "") {
      payload[key] = value;
    }
  });

  const profile: Record<string, unknown> = {};
  profileKeys.forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null && value !== "") {
      profile[key] = value;
    }
  });

  if (Object.keys(profile).length > 0) {
    payload.profile = profile;
  }

  return payload;
};

export default function CreateUser({
  show,
  createApi,
  statusEnums,
  genderEnums,
  onSuccess,
  onClose,
}: CreateUserProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Người dùng đã được tạo thành công", onSuccess, onClose }
  );

  const handleFormSubmit = useCallback(
    (formData: Record<string, unknown>) => handleSubmit(buildUserPayload(formData)),
    [handleSubmit]
  );

  return (
    <UserForm
      show={show}
      statusEnums={statusEnums}
      genderEnums={genderEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleFormSubmit}
      onCancel={onClose}
    />
  );
}
