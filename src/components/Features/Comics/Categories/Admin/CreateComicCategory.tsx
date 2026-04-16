"use client";

import ComicCategoryForm from "./ComicCategoryForm";
import Modal from "@/components/UI/Feedback/Modal";
import { useFormModal } from "@/hooks";

interface CreateComicCategoryProps {
    show: boolean;
    createApi: string;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function CreateComicCategory({
    show,
    createApi,
    onSuccess,
    onClose,
}: CreateComicCategoryProps) {
    const { loading, apiErrors, handleSubmit } = useFormModal(
        { mode: "create", show, createApi },
        { createSuccessMessage: "Tạo danh mục truyện thành công", onSuccess, onClose }
    );

    return (
        <Modal
            show={show}
            onClose={onClose || (() => { })}
            title="Thêm danh mục mới"
            size="lg"
        >
            <ComicCategoryForm
                apiErrors={apiErrors}
                loading={loading}
                onCancel={onClose!}
                onSubmit={handleSubmit}
            />
        </Modal>
    );
}
