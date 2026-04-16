"use client";

import FAQForm from "./FAQForm";
import { useFormModal } from "@/hooks";

interface CreateFAQProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateFAQ({
  show,
  createApi,
  onSuccess,
  onClose,
}: CreateFAQProps) {
  const { loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "create", show, createApi },
    { createSuccessMessage: "Tạo câu hỏi thường gặp thành công", onSuccess, onClose }
  );

  return (
    <FAQForm
      show={show}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
