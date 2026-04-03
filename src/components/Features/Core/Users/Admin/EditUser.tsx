"use client";

import { useState, useEffect, useCallback } from "react";
import UserForm from "./UserForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface EditUserProps {
  show: boolean;
  user?: any;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  genderEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
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
  user,
  statusEnums,
  genderEnums,
  apiErrors,
  onUpdated,
  onClose,
}: EditUserProps) {
  const [showModal, setShowModal] = useState(false);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchUserDetail = useCallback(async () => {
    if (!user?.id || loading) return;

    try {
      setLoading(true);
      const response = await api.get(adminEndpoints.users.show(user.id));
      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        const profile = data?.profile || {};

        // Parse roles từ user_role_assignments hoặc roles
        let roles: any[] = [];
        if (data?.user_role_assignments && Array.isArray(data.user_role_assignments)) {
          roles = data.user_role_assignments
            .map((assignment: any) => assignment.role)
            .filter((role: any) => role != null);
        } else if (Array.isArray(data?.roles)) {
          roles = data.roles;
        }

        // Transform API shape to flat form-consumable structure
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
          email_verified_at: data?.email_verified_at || null,
          phone_verified_at: data?.phone_verified_at || null,
          last_login_at: data?.last_login_at || null,
          created_at: data?.created_at || null,
          updated_at: data?.updated_at || null,
        });
      } else {
        setUserDetail(user || {});
      }
    } catch (error) {
      setUserDetail(user || {});
    } finally {
      setLoading(false);
    }
  }, [user, loading]);

  useEffect(() => {
    setShowModal(show);

    if (show && user?.id) {
      const currentUserId = user.id;
      if (!hasFetched || userDetail?.id !== currentUserId) {
        fetchUserDetail();
        setHasFetched(true);
      }
    } else if (!show) {
      setUserDetail(null);
      setLoading(false);
      setHasFetched(false);
    }
  }, [show, user?.id, hasFetched, userDetail?.id, fetchUserDetail]);

  const handleSubmit = (formData: Record<string, any>) => {
    const data = formData || {};

    // Chỉ giữ các trường được API chấp nhận; password chỉ gửi khi có giá trị
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

    onUpdated?.(payload);
  };

  if (!showModal) return null;

  return (
    <UserForm
      show={showModal}
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


