"use client";

import { useCallback, useMemo } from "react";
import UserForm from "./UserForm";
import { useFormModal } from "@/hooks";
import { type EditUserProps, type User } from "./Constants/types";
import { formatDate } from "@/utils/formatters";


const transformUserData = (data: Record<string, unknown>): Record<string, unknown> => {
  if (!data) return {};

  const profile = (data?.profile as Record<string, unknown>) || {};

  let roles: Record<string, unknown>[] = [];
  if (data?.user_role_assignments && Array.isArray(data.user_role_assignments)) {
    roles = (data.user_role_assignments as Record<string, unknown>[])
      .map((assignment: Record<string, unknown>) => assignment.role as Record<string, unknown>)
      .filter((role: Record<string, unknown>) => role != null);
  } else if (Array.isArray(data?.roles)) {
    roles = data.roles as Record<string, unknown>[];
  }

  return {
    id: data?.id,
    username: (data?.username as string) || "",
    email: (data?.email as string) || "",
    phone: (data?.phone as string) || "",
    status: (data?.status as string) || "",
    name: (data?.name as string) || "",
    address: (profile?.address as string) || "",
    gender: (profile?.gender as string) || "",
    birthday: formatDate(profile?.birthday as string | undefined, "yyyy-MM-dd"),
    country_id: profile?.country_id ? Number(profile.country_id) : null,
    province_id: profile?.province_id ? Number(profile.province_id) : null,
    ward_id: profile?.ward_id ? Number(profile.ward_id) : null,
    image: (data?.image as string) || null,
    about: (profile?.about as string) || "",
    roles: roles,
    role_ids: roles.filter((r) => r != null).map((r) => r?.id).filter(Boolean),
  };
};

const buildUserPayload = (formData: Record<string, unknown>) => {
  const data = formData || {};
  const baseKeys = ["username", "email", "phone", "status", "password", "name", "image"] as const;
  const profileKeys = ["gender", "birthday", "address", "about", "country_id", "province_id", "ward_id"] as const;

  const payload: Record<string, unknown> = {};
  baseKeys.forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null && value !== "") {
      if (key === "password" && !value) return;
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

export default function EditUser({
  show,
  target,
  statusEnums,
  genderEnums,
  onSuccess,
  onClose,
}: EditUserProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    { updateSuccessMessage: "Cập nhật người dùng thành công", fetchErrorMessage: "Không thể tải thông tin người dùng", onSuccess, onClose }
  );

  const userData = useMemo(() => entityData ? transformUserData(entityData) as unknown as User : null, [entityData]);

  const handleFormSubmit = useCallback(
    (formData: Record<string, unknown>) => handleSubmit(buildUserPayload(formData)),
    [handleSubmit]
  );

  return (
    <UserForm
      show={show}
      user={userData}
      statusEnums={statusEnums}
      genderEnums={genderEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleFormSubmit}
      onCancel={onClose}
    />
  );
}
