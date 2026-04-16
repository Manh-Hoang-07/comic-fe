"use client";

import FAQForm from "./FAQForm";
import { useFormModal } from "@/hooks";

interface EditFAQProps {
  show: boolean;
  target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditFAQ({
  show,
  target,
  onSuccess,
  onClose,
}: EditFAQProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật câu hỏi thường gặp thành công",
      fetchErrorMessage: "Không thể tải thông tin FAQ",
      onSuccess,
      onClose,
    }
  );

  return (
    <FAQForm
      show={show}
      faq={entityData}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
