"use client";

import ComicForm from "./ComicForm";

interface CreateComicProps {
    show: boolean;
    apiErrors?: any;
    onClose: () => void;
    onCreated: (data: any) => Promise<any>;
}

export default function CreateComic({
    show,
    apiErrors,
    onClose,
    onCreated,
}: CreateComicProps) {
    return (
        <ComicForm
            show={show}
            apiErrors={apiErrors}
            onCancel={onClose}
            onSuccess={onCreated}
        />
    );
}


