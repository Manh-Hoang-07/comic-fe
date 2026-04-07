"use client";

import { useState, useEffect } from "react";
import CountryForm, {
  AdminCountryFormEntity,
  CountryFormValues,
} from "./CountryForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditCountryProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditCountry({
  show,
  target,
  onSuccess,
  onClose,
}: EditCountryProps) {
  const [countryData, setCountryData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showError, showSuccess } = useToastContext();

  useEffect(() => {
    if (show) {
      if (target?.fetchApi) {
        const fetchCountryDetails = async () => {
          setLoading(true);
          try {
            const response = await api.get(target.fetchApi!);
            setCountryData(response.data?.data || response.data);
          } catch (error) {
            showError("Không thể tải thông tin quốc gia");
            onClose?.();
          } finally {
            setLoading(false);
          }
        };
        fetchCountryDetails();
      } else if (target?.initialData) {
        setCountryData(target.initialData);
      }
    } else {
      setCountryData(null);
      setApiErrors(null);
    }
  }, [show, target, showError, onClose]);

  const handleSubmit = async (formData: CountryFormValues) => {
    if (!target?.updateApi) return;
    
    setApiErrors(null);
    try {
      await api.put(target.updateApi, formData);
      showSuccess("Cập nhật quốc gia thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <CountryForm
      show={show}
      country={countryData}
      apiErrors={apiErrors}
      loading={loading}
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}


