"use client";

import ContentTemplateForm from "./ContentTemplateForm";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditContentTemplateProps {
    show: boolean;
    target: EditTarget | null;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function EditContentTemplate({
    show,
    target,
    onSuccess,
    onClose,
}: EditContentTemplateProps) {
    const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
        { mode: "edit", show, target },
        { updateSuccessMessage: "Cập nhật mẫu nội dung thành công", fetchErrorMessage: "Không thể tải thông tin mẫu nội dung", onSuccess, onClose }
    );

    return (
        <ContentTemplateForm
            initialData={entityData}
            apiErrors={apiErrors}
            loading={loading}
            onCancel={onClose}
            onSubmit={handleSubmit}
        />
    );
}
