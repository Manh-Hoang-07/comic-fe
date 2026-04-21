"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
const ComicForm = dynamic(() => import("./ComicForm"), {
  ssr: false,
  loading: () => <div className="p-6 animate-pulse"><div className="h-8 w-48 bg-gray-200 rounded mb-4" /><div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded" />)}</div></div>,
});
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";
import { adminComicService } from "@/lib/api/admin/comic";

interface CreateComicProps {
    show: boolean;
    createApi: string;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function CreateComic({
    show,
    createApi,
    onSuccess,
    onClose,
}: CreateComicProps) {
    const [apiErrors, setApiErrors] = useState<Record<string, string | string[]> | null>(null);
    const [loading, setLoading] = useState(false);
    const { showError, showSuccess } = useToastContext();

    const handleSubmit = async (formData: Record<string, unknown>) => {
        setApiErrors(null);
        setLoading(true);
        try {
            // handle cover image separately if it's a file
            const coverFile = formData.cover_image instanceof File ? formData.cover_image : null;
            const submitData = { ...formData };
            if (coverFile) delete submitData.cover_image;

            const response = await api.post(createApi, submitData);
            const savedItem = response.data?.data || response.data;
            
            showSuccess("Tạo truyện thành công");

            if (coverFile && savedItem?.id) {
                try {
                    await adminComicService.uploadCover(savedItem.id, coverFile);
                } catch (err) {
                    showError("Tạo truyện thành công nhưng không thể tải lên ảnh bìa");
                }
            }

            onSuccess?.();
        } catch (error: unknown) {
            const e = error as { response?: { data?: { errors?: Record<string, string | string[]>; message?: string } } };
            const errors = e.response?.data?.errors || e.response?.data || {};
            setApiErrors(errors as Record<string, string | string[]>);
            showError(e.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ComicForm
            show={show}
            apiErrors={apiErrors}
            loading={loading}
            onCancel={onClose!}
            onSubmit={handleSubmit}
        />
    );
}



