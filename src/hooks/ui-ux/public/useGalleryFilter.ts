"use client";
import { useState, useMemo } from "react";

export interface GalleryItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image: string;
    images: string[];
    featured: boolean;
    status: string;
    category?: string;
    date?: string;
}

export function useGalleryFilter(initialItems: GalleryItem[]) {
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filteredItems = useMemo(() => {
        if (!search) return initialItems;
        const lower = search.toLowerCase();
        return initialItems.filter(
            item =>
                item.title.toLowerCase().includes(lower) ||
                item.description.toLowerCase().includes(lower)
        );
    }, [initialItems, search]);

    return { filteredItems, search, setSearch, viewMode, setViewMode };
}
