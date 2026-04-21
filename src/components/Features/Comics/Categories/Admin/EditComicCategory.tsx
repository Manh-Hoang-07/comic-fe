"use client";

import ComicCategoryForm from "./ComicCategoryForm";
import Modal from "@/components/UI/Feedback/Modal";
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditComicCategoryProps {
    show: boolean;
    target: EditTarget | null;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function EditComicCategory({
    show,
    target,
    onSuccess,
    onClose,
}: EditComicCategoryProps) {
    const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
        { mode: "edit", show, target },
        {
            updateSuccessMessage: "Cập nhật danh mục thành công",
            fetchErrorMessage: "Không thể tải thông tin danh mục",
            onSuccess,
            onClose,
        }
    );

    return (
        <Modal
            show={show}
            onClose={onClose || (() => { })}
            title="Chỉnh sửa danh mục"
            size="lg"
            loading={loading}
        >
            <ComicCategoryForm
                category={entityData}
                apiErrors={apiErrors}
                loading={loading}
                onCancel={onClose!}
                onSubmit={handleSubmit}
            />
        </Modal>
    );
}
