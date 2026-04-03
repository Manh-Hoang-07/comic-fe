"use client";

import ChapterForm from "./ChapterForm";
import { AdminChapter } from "@/types/comic";
import Modal from "@/components/UI/Feedback/Modal";

interface EditChapterProps {
    show: boolean;
    chapter: AdminChapter;
    apiErrors?: any;
    onClose: () => void;
    onUpdated: (data: any) => Promise<any>;
}

export default function EditChapter({
    show,
    chapter,
    apiErrors,
    onClose,
    onUpdated,
}: EditChapterProps) {
    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Chỉnh sửa chương"
            size="xl"
        >
            <ChapterForm
                chapter={chapter}
                apiErrors={apiErrors}
                onCancel={onClose}
                onSuccess={onUpdated}
            />
        </Modal>
    );
}


