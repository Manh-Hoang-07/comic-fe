"use client";

import AdminFilter from "@/components/Shared/Admin/AdminFilter";
import SelectFilter from "@/components/UI/Filters/SelectFilter";

interface ComicFilterProps {
    initialFilters?: Record<string, any>;
    onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function ComicFilter({
    initialFilters = {},
    onUpdateFilters,
}: ComicFilterProps) {
    const statusOptions = [
        { value: "", label: "Tất cả trạng thái" },
        { value: "draft", label: "Nháp" },
        { value: "published", label: "Đã xuất bản" },
        { value: "completed", label: "Hoàn thành" },
        { value: "hidden", label: "Ẩn" },
    ];

    const sortOptions = [
        { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
        { value: "created_at:asc", label: "Ngày tạo (cũ nhất)" },
        { value: "title:asc", label: "Tên (A-Z)" },
        { value: "title:desc", label: "Tên (Z-A)" },
        { value: "view_count:desc", label: "Lượt xem (giảm dần)" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sort"
            searchField="search"
            searchPlaceholder="Tìm kiếm tên truyện, tác giả..."
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


