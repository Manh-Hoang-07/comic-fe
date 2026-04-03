"use client";

import { useEffect } from "react";
import { usePageStore } from "@/lib/store/pageStore";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageMetaProps {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default function PageMeta({ title, breadcrumbs = [] }: PageMetaProps) {
    const setPageMeta = usePageStore((state) => state.setPageMeta);

    useEffect(() => {
        setPageMeta({ title, breadcrumbs });
    }, [title, breadcrumbs, setPageMeta]);

    return null;
}


