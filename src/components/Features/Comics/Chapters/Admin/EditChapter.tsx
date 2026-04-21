"use client";

import ChapterForm from "./ChapterForm";
import Modal from "@/components/UI/Feedback/Modal";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditChapterProps {
    show: boolean;
    target: EditTarget | null;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function EditChapter({
    show,
    target,
    onSuccess,
    onClose,
}: EditChapterProps) {
    const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
        { mode: "edit", show, target },
        {
            updateSuccessMessage: "Cập nhật chương truyện thành công",
            fetchErrorMessage: "Không thể tải thông tin chương",
            onSuccess,
            onClose,
        }
    );

    return (
        <Modal
            show={show}
            onClose={onClose || (() => { })}
            title="Chỉnh sửa chương"
            size="xl"
            loading={loading}
        >
            <ChapterForm
                chapter={entityData}
                apiErrors={apiErrors}
                loading={loading}
                onCancel={onClose!}
                onSubmit={handleSubmit}
            />
        </Modal>
    );
}
