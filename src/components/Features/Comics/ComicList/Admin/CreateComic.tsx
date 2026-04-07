"use client";

import { useState } from "react";
import ComicForm from "./ComicForm";
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
    const [apiErrors, setApiErrors] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { showError, showSuccess } = useToastContext();

    const handleSubmit = async (formData: any) => {
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
        } catch (error: any) {
            const errors = error.response?.data?.errors || error.response?.data || error;
            setApiErrors(errors);
            showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
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



