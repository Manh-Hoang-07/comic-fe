"use client";

import ComicCategoryForm from "./ComicCategoryForm";
import { AdminComicCategory } from "@/types/comic";
import Modal from "@/components/UI/Feedback/Modal";

interface EditComicCategoryProps {
    show: boolean;
    category: AdminComicCategory;
    apiErrors?: any;
    onClose: () => void;
    onUpdated: (data: any) => Promise<any>;
}

export default function EditComicCategory({
    show,
    category,
    apiErrors,
    onClose,
    onUpdated,
}: EditComicCategoryProps) {
    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Chỉnh sửa danh mục"
            size="lg"
        >
            <ComicCategoryForm
                category={category}
                apiErrors={apiErrors}
                onCancel={onClose}
                onSuccess={onUpdated}
            />
        </Modal>
    );
}


