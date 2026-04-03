"use client";

import ComicCategoryForm from "./ComicCategoryForm";
import Modal from "@/components/UI/Feedback/Modal";

interface CreateComicCategoryProps {
    show: boolean;
    apiErrors?: any;
    onClose: () => void;
    onCreated: (data: any) => Promise<any>;
}

export default function CreateComicCategory({
    show,
    apiErrors,
    onClose,
    onCreated,
}: CreateComicCategoryProps) {
    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Thêm danh mục mới"
            size="lg"
        >
            <ComicCategoryForm
                apiErrors={apiErrors}
                onCancel={onClose}
                onSuccess={onCreated}
            />
        </Modal>
    );
}


