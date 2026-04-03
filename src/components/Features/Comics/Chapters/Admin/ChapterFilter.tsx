"use client";

import AdminFilter from "@/components/Shared/Admin/AdminFilter";
import SelectFilter from "@/components/UI/Filters/SelectFilter";

interface ChapterFilterProps {
    initialFilters?: Record<string, any>;
    onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function ChapterFilter({
    initialFilters = {},
    onUpdateFilters,
}: ChapterFilterProps) {
    const statusOptions = [
        { value: "", label: "Tất cả trạng thái" },
        { value: "draft", label: "Nháp" },
        { value: "published", label: "Đã xuất bản" },
    ];

    const sortOptions = [
        { value: "chapter_index:desc", label: "Chương mới nhất" },
        { value: "chapter_index:asc", label: "Chương cũ nhất" },
        { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sort"
            searchField="search"
            searchPlaceholder="Tìm kiếm tiêu đề chương..."
            hasAdvancedFilters={true}
            onUpdateFilters={onUpdateFilters}
            advancedFilters={({ filters, onChange }) => (
                <>
                    <div className="min-w-[150px]">
                        <SelectFilter
                            value={filters["status"] || ""}
                            options={statusOptions}
                            placeholder="Trạng thái"
                            onChange={(value) => {
                                filters["status"] = value;
                                onChange();
                            }}
                        />
                    </div>
                </>
            )}
        />
    );
}


