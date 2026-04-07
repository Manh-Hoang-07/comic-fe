"use client";

import { useState, useEffect } from "react";
import UserForm from "./UserForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

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

export default function EditUser({
  show,
  target,
  statusEnums,
  genderEnums,
  onSuccess,
  onClose,
}: EditUserProps) {
  const [userDetail, setUserDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  useEffect(() => {
    if (show) {
      if (target?.fetchApi) {
        const fetchUserDetail = async () => {
          setLoading(true);
          try {
            const response = await api.get(target.fetchApi!);
            if (response.data?.success && response.data?.data) {
              const data = response.data.data;
              const profile = data?.profile || {};

              // Parse roles
              let roles: any[] = [];
              if (data?.user_role_assignments && Array.isArray(data.user_role_assignments)) {
                roles = data.user_role_assignments
                  .map((assignment: any) => assignment.role)
                  .filter((role: any) => role != null);
              } else if (Array.isArray(data?.roles)) {
                roles = data.roles;
              }

              setUserDetail({
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
              });
            } else {
              setUserDetail(target.initialData || {});
            }
          } catch (error) {
            showError("Không thể tải thông tin người dùng");
            onClose?.();
          } finally {
            setLoading(false);
          }
        };
        fetchUserDetail();
      } else if (target?.initialData) {
        setUserDetail(target.initialData);
      }
    } else {
      setUserDetail(null);
      setApiErrors(null);
    }
  }, [show, target, showError, onClose]);

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!target?.updateApi) return;
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

    setApiErrors(null);
    try {
      await api.put(target.updateApi, payload);
      showSuccess("Cập nhật người dùng thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <UserForm
      show={show}
      user={userDetail}
      statusEnums={statusEnums}
      genderEnums={genderEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



