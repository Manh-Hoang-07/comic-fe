"use client";

import ContentTemplateForm from "./ContentTemplateForm";
import { useFormModal } from "@/hooks";

interface CreateContentTemplateProps {
    show: boolean;
    createApi: string;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function CreateContentTemplate({
    show,
    createApi,
    onSuccess,
    onClose,
}: CreateContentTemplateProps) {
    const { loading, apiErrors, handleSubmit } = useFormModal(
        { mode: "create", show, createApi },
        { createSuccessMessage: "Tạo mẫu nội dung thành công", onSuccess, onClose }
    );

    return (
        <ContentTemplateForm
            apiErrors={apiErrors}
            loading={loading}
            onCancel={onClose}
            onSubmit={handleSubmit}
        />
    );
}
