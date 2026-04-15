"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
const ProjectForm = dynamic(() => import("./ProjectForm"), {
  ssr: false,
  loading: () => <div className="p-6 animate-pulse"><div className="h-8 w-48 bg-gray-200 rounded mb-4" /><div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded" />)}</div></div>,
});
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreateProjectProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateProject({
  show,
  createApi,
  statusEnums,
  onSuccess,
  onClose,
}: CreateProjectProps) {
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<any>(null);
  const { showSuccess, showError } = useToastContext();

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setApiErrors(null);
    try {
      await api.post(createApi, formData);
      showSuccess("Tạo dự án thành công");
      onSuccess?.();
    } catch (error: any) {
      const errors = error.response?.data?.errors || error.response?.data || error;
      setApiErrors(errors);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectForm
      show={show}
      statusEnums={statusEnums}
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors}
    />
  );
}





