"use client";

import { useState, useEffect } from "react";
import RoleForm from "./RoleForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditRoleProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditRole({
  show,
  target,
  statusEnums,
  onSuccess,
  onClose,
}: EditRoleProps) {
  const [roleData, setRoleData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  useEffect(() => {
    if (show) {
      if (target?.fetchApi) {
        const fetchRoleDetails = async () => {
          setLoading(true);
          try {
            const response = await api.get(target.fetchApi!);
            const result = response.data?.data ?? response.data;
            setRoleData(result);
          } catch (error) {
            showError("Không thể tải thông tin vai trò");
            onClose?.();
          } finally {
            setLoading(false);
          }
        };
        fetchRoleDetails();
      } else if (target?.initialData) {
        setRoleData(target.initialData);
      }
    } else {
      setRoleData(null);
      setApiErrors(null);
    }
  }, [show, target, showError, onClose]);

  const handleSubmit = async (formData: any) => {
    if (!target?.updateApi) return;
    
    setApiErrors(null);
    try {
      await api.put(target.updateApi, formData);
      showSuccess("Cập nhật vai trò thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <RoleForm
      show={show}
      role={roleData}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




