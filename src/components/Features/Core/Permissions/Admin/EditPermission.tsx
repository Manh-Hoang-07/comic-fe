"use client";

import { useState, useEffect, useCallback } from "react";
import PermissionForm from "./PermissionForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface Permission {
  id?: number;
  code?: string;
  name?: string;
  scope?: string;
  parent_id?: number | null;
  status?: string;
}

interface EditPermissionProps {
  show: boolean;
  permission?: Permission | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditPermission({
  show,
  permission,
  statusEnums,
  apiErrors,
  onUpdated,
  onClose,
}: EditPermissionProps) {
  const [permissionData, setPermissionData] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPermissionDetails = useCallback(async () => {
    if (!permission?.id) return;

    setLoading(true);
    try {
      const response = await api.get(adminEndpoints.permissions.show(permission.id));
      const data = response.data?.data || response.data;
      setPermissionData(data);
    } catch (error) {
      console.error("Error fetching permission:", error);
      setPermissionData(permission);
    } finally {
      setLoading(false);
    }
  }, [permission]);

  useEffect(() => {
    if (show && permission?.id) {
      fetchPermissionDetails();
    }
  }, [show, permission?.id, fetchPermissionDetails]);

  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <PermissionForm
      show={show && !loading}
      permission={permissionData || permission}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



