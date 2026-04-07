"use client";

import { useState, useEffect } from "react";
import PermissionForm from "./PermissionForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

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
  target: { fetchApi?: string; initialData?: Permission; updateApi: string } | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditPermission({
  show,
  target,
  statusEnums,
  onSuccess,
  onClose,
}: EditPermissionProps) {
  const [permissionData, setPermissionData] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  useEffect(() => {
    if (show) {
      if (target?.fetchApi) {
        const fetchPermissionDetails = async () => {
          setLoading(true);
          try {
            const response = await api.get(target.fetchApi!);
            const data = response.data?.data || response.data;
            setPermissionData(data);
          } catch (error) {
            showError("Không thể tải thông tin quyền");
            onClose?.();
          } finally {
            setLoading(false);
          }
        };
        fetchPermissionDetails();
      } else if (target?.initialData) {
        setPermissionData(target.initialData);
      }
    } else {
      setPermissionData(null);
      setApiErrors(null);
    }
  }, [show, target, showError, onClose]);

  const handleSubmit = async (formData: any) => {
    if (!target?.updateApi) return;
    
    setApiErrors(null);
    try {
      await api.put(target.updateApi, formData);
      showSuccess("Cập nhật quyền thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <PermissionForm
      show={show}
      permission={permissionData}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




