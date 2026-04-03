"use client";

import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface ComicCategoryFilterProps {
    initialFilters?: Record<string, any>;
    onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function ComicCategoryFilter({
    initialFilters = {},
    onUpdateFilters,
}: ComicCategoryFilterProps) {
    const sortOptions = [
        { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
        { value: "name:asc", label: "Tên (A-Z)" },
        { value: "name:desc", label: "Tên (Z-A)" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sort"
            searchField="search"
            searchPlaceholder="Tìm kiếm danh mục truyện..."
            hasAdvancedFilters={false}
            onUpdateFilters={onUpdateFilters}
        />
    );
}


