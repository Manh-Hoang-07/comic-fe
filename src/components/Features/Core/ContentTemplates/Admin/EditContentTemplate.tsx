"use client";

import { useState, useEffect } from "react";
import ContentTemplateForm from "./ContentTemplateForm";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditContentTemplateProps {
    show: boolean;
    target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function EditContentTemplate({
    show,
    target,
    onSuccess,
    onClose,
}: EditContentTemplateProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [apiErrors, setApiErrors] = useState<any>(null);
    const { showError, showSuccess } = useToastContext();

    useEffect(() => {
        if (show) {
            if (target?.fetchApi) {
                const fetchData = async () => {
                    setLoading(true);
                    try {
                        const response = await api.get(target.fetchApi!);
                        setData(response.data?.data || response.data);
                    } catch (error) {
                        showError("Không thể tải thông tin mẫu nội dung");
                        onClose?.();
                    } finally {
                        setLoading(false);
                    }
                };
                fetchData();
            } else if (target?.initialData) {
                setData(target.initialData);
            }
        } else {
            setData(null);
            setApiErrors(null);
        }
    }, [show, target, showError, onClose]);

    const handleSubmit = async (formData: any) => {
        if (!target?.updateApi) return;
        
        setApiErrors(null);
        try {
            await api.put(target.updateApi, formData);
            showSuccess("Cập nhật mẫu nội dung thành công");
            onSuccess?.();
        } catch (error: any) {
            const errors = error.response?.data?.errors || error.response?.data || error;
            setApiErrors(errors);
            showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
        }
    };

    return (
        <ContentTemplateForm
            initialData={data}
            apiErrors={apiErrors}
            loading={loading}
            onCancel={onClose}
            onSubmit={handleSubmit}
        />
    );
}
