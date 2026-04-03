"use client";

import ComicForm from "./ComicForm";
import { AdminComic } from "@/types/comic";

interface EditComicProps {
    show: boolean;
    comic: AdminComic;
    apiErrors?: any;
    onClose: () => void;
    onUpdated: (data: any) => Promise<any>;
}

export default function EditComic({
    show,
    comic,
    apiErrors,
    onClose,
    onUpdated,
}: EditComicProps) {
    return (
        <ComicForm
            show={show}
            comic={comic}
            apiErrors={apiErrors}
            onCancel={onClose}
            onSuccess={onUpdated}
        />
    );
}


