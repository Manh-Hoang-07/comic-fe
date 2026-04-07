"use client";

import { useState } from "react";
import ChapterForm from "./ChapterForm";
import Modal from "@/components/UI/Feedback/Modal";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface CreateChapterProps {
    show: boolean;
    createApi: string;
    comicId?: number | string | null;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function CreateChapter({
    show,
    createApi,
    comicId,
    onSuccess,
    onClose,
}: CreateChapterProps) {
    const [apiErrors, setApiErrors] = useState<any>(null);
    const { showError, showSuccess } = useToastContext();

    const handleSubmit = async (formData: any) => {
        setApiErrors(null);
        try {
            await api.post(createApi, formData);
            showSuccess("Tạo chương truyện thành công");
            onSuccess?.();
        } catch (error: any) {
            const errors = error.response?.data?.errors || error.response?.data || error;
            setApiErrors(errors);
            showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo mới");
        }
    };

    return (
        <Modal
            show={show}
            onClose={onClose || (() => { })}
            title="Tạo chương mới"
            size="xl"
        >
            <ChapterForm
                comicId={comicId}
                apiErrors={apiErrors}
                onCancel={onClose!}
                onSubmit={handleSubmit}
            />
        </Modal>
    );
}



