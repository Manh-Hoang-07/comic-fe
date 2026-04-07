"use client";

import { useState, useEffect } from "react";
import ProvinceForm, {
  AdminProvinceFormEntity,
  ProvinceFormValues,
} from "./ProvinceForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditProvinceProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditProvince({
  show,
  target,
  onSuccess,
  onClose,
}: EditProvinceProps) {
  const [provinceData, setProvinceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  useEffect(() => {
    if (show) {
      if (target?.fetchApi) {
        const fetchProvinceDetails = async () => {
          setLoading(true);
          try {
            const response = await api.get(target.fetchApi!);
            setProvinceData(response.data?.data || response.data);
          } catch (error) {
            showError("Không thể tải thông tin Tỉnh/Thành phố");
            onClose?.();
          } finally {
            setLoading(false);
          }
        };
        fetchProvinceDetails();
      } else if (target?.initialData) {
        setProvinceData(target.initialData);
      }
    } else {
      setProvinceData(null);
      setApiErrors(null);
    }
  }, [show, target, showError, onClose]);

  const handleSubmit = async (formData: ProvinceFormValues) => {
    if (!target?.updateApi) return;
    
    setApiErrors(null);
    try {
      await api.put(target.updateApi, formData);
      showSuccess("Cập nhật Tỉnh/Thành phố thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <ProvinceForm
      show={show}
      province={provinceData}
      apiErrors={apiErrors}
      loading={loading}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}


