"use client";

import { useState } from "react";
import ContentTemplateForm from "./ContentTemplateForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

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
    const [apiErrors, setApiErrors] = useState<any>(null);
    const { showError, showSuccess } = useToastContext();

    const handleSubmit = async (formData: any) => {
        setApiErrors(null);
        try {
            await api.post(createApi, formData);
            showSuccess("Tạo mẫu nội dung thành công");
            onSuccess?.();
        } catch (error: any) {
            const errors = error.response?.data?.errors || error.response?.data || error;
            setApiErrors(errors);
            showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
        }
    };

    return (
        <ContentTemplateForm
            apiErrors={apiErrors}
            onCancel={onClose}
            onSubmit={handleSubmit}
        />
    );
}
