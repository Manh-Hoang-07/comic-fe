"use client";

import { useState, useEffect } from "react";
import GroupForm from "./GroupForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditGroupProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditGroup({
  show,
  target,
  onSuccess,
  onClose,
}: EditGroupProps) {
  const [groupData, setGroupData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  useEffect(() => {
    if (show) {
      if (target?.fetchApi) {
        const fetchGroupDetails = async () => {
          setLoading(true);
          try {
            const response = await api.get(target.fetchApi!);
            setGroupData(response.data?.data || response.data);
          } catch (error) {
            showError("Không thể tải thông tin nhóm");
            onClose?.();
          } finally {
            setLoading(false);
          }
        };
        fetchGroupDetails();
      } else if (target?.initialData) {
        setGroupData(target.initialData);
      }
    } else {
      setGroupData(null);
      setApiErrors(null);
    }
  }, [show, target, showError, onClose]);

  const handleSubmit = async (formData: any) => {
    if (!target?.updateApi) return;
    
    setApiErrors(null);
    try {
      await api.put(target.updateApi, formData);
      showSuccess("Cập nhật nhóm thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <GroupForm
      show={show}
      group={groupData}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




