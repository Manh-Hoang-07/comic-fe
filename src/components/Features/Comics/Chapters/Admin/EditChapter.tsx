"use client";

import { useState, useEffect } from "react";
import ChapterForm from "./ChapterForm";
import Modal from "@/components/UI/Feedback/Modal";
import api from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";

interface EditChapterProps {
    show: boolean;
    target: { fetchApi?: string; initialData?: any; updateApi: string } | null;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function EditChapter({
    show,
    target,
    onSuccess,
    onClose,
}: EditChapterProps) {
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
                        showError("Không thể tải thông tin chương");
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
            showSuccess("Cập nhật chương truyện thành công");
            onSuccess?.();
        } catch (error: any) {
            const errors = error.response?.data?.errors || error.response?.data || error;
            setApiErrors(errors);
            showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
        }
    };

    return (
        <Modal
            show={show}
            onClose={onClose || (() => { })}
            title="Chỉnh sửa chương"
            size="xl"
            loading={loading}
        >
            <ChapterForm
                chapter={data}
                apiErrors={apiErrors}
                loading={loading}
                onCancel={onClose!}
                onSubmit={handleSubmit}
            />
        </Modal>
    );
}



