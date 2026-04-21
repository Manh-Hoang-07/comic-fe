"use client";

import dynamic from "next/dynamic";
const ProjectForm = dynamic(() => import("./ProjectForm"), {
  ssr: false,
  loading: () => <div className="p-6 animate-pulse"><div className="h-8 w-48 bg-gray-200 rounded mb-4" /><div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded" />)}</div></div>,
});
import { useFormModal } from "@/hooks";

interface CreateProjectProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
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
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo dự án thành công", onSuccess, onClose }
  );

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
