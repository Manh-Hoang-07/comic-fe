"use client";

import { useState, useEffect } from "react";
import MenuForm from "./MenuForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditMenuProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  parentMenus?: Array<any>;
  permissions?: Array<any>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditMenu({
  show,
  target,
  statusEnums,
  parentMenus,
  permissions,
  onSuccess,
  onClose,
}: EditMenuProps) {
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  useEffect(() => {
    if (show) {
      if (target?.fetchApi) {
        const fetchMenuDetails = async () => {
          setLoading(true);
          try {
            const response = await api.get(target.fetchApi!);
            setMenuData(response.data?.data || response.data);
          } catch (error) {
            showError("Không thể tải thông tin menu");
            onClose?.();
          } finally {
            setLoading(false);
          }
        };
        fetchMenuDetails();
      } else if (target?.initialData) {
        setMenuData(target.initialData);
      }
    } else {
      setMenuData(null);
      setApiErrors(null);
    }
  }, [show, target, showError, onClose]);

  const handleSubmit = async (formData: any) => {
    if (!target?.updateApi) return;
    
    setApiErrors(null);
    try {
      await api.put(target.updateApi, formData);
      showSuccess("Cập nhật menu thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <MenuForm
      show={show}
      menu={menuData}
      statusEnums={statusEnums}
      parentMenus={parentMenus}
      permissions={permissions}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}




