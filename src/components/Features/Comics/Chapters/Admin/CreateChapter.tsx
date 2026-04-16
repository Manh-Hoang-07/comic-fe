"use client";

import ChapterForm from "./ChapterForm";
import Modal from "@/components/UI/Feedback/Modal";
import { useFormModal } from "@/hooks";

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
    const { loading, apiErrors, handleSubmit } = useFormModal(
        { mode: "create", show, createApi },
        { createSuccessMessage: "Tạo chương truyện thành công", onSuccess, onClose }
    );

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
                loading={loading}
                onCancel={onClose!}
                onSubmit={handleSubmit}
            />
        </Modal>
    );
}
