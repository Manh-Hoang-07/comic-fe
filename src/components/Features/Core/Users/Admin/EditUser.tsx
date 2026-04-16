"use client";

import { useCallback, useMemo } from "react";
import UserForm from "./UserForm";
import { useFormModal } from "@/hooks";

interface EditUserProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  genderEnums?: Array<{ value: string; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

const formatDate = (dateString?: string, format: string = "yyyy-MM-dd"): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  if (format === "yyyy-MM-dd") {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return dateString;
};

const transformUserData = (data: any): any => {
  if (!data) return null;

  const profile = data?.profile || {};

  let roles: any[] = [];
  if (data?.user_role_assignments && Array.isArray(data.user_role_assignments)) {
    roles = data.user_role_assignments
      .map((assignment: any) => assignment.role)
      .filter((role: any) => role != null);
  } else if (Array.isArray(data?.roles)) {
    roles = data.roles;
  }

  return {
    id: data?.id,
    username: data?.username || "",
    email: data?.email || "",
    phone: data?.phone || "",
    status: data?.status || "",
    name: data?.name || "",
    address: profile?.address || "",
    gender: profile?.gender || "",
    birthday: formatDate(profile?.birthday, "yyyy-MM-dd"),
    country_id: profile?.country_id ? Number(profile.country_id) : null,
    province_id: profile?.province_id ? Number(profile.province_id) : null,
    ward_id: profile?.ward_id ? Number(profile.ward_id) : null,
    image: data?.image || null,
    about: profile?.about || "",
    roles: roles,
    role_ids: roles.filter((r) => r != null).map((r) => r?.id).filter(Boolean),
  };
};

const buildUserPayload = (formData: any) => {
  const data = formData || {};
  const baseKeys = ["username", "email", "phone", "status", "password", "name", "image"] as const;
  const profileKeys = ["gender", "birthday", "address", "about", "country_id", "province_id", "ward_id"] as const;

  const payload: Record<string, any> = {};
  baseKeys.forEach((key) => {
    const value = (data as any)[key];
    if (value !== undefined && value !== null && value !== "") {
      if (key === "password" && !value) return;
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

  const userData = useMemo(() => transformUserData(entityData), [entityData]);

  const handleFormSubmit = useCallback(
    (formData: Record<string, any>) => handleSubmit(buildUserPayload(formData)),
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
