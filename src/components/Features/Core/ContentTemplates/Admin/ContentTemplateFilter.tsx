"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface ContentTemplateFilterProps {
    initialFilters?: Record<string, any>;
    onUpdateFilters?: (filters: Record<string, any>) => void;
    onFilterChange?: () => void;
}

export default function ContentTemplateFilter({
    initialFilters = {},
    onUpdateFilters,
    onFilterChange,
}: ContentTemplateFilterProps) {
    const categoryOptions = [
        { value: "", label: "Tất cả phân loại" },
        { value: "render", label: "Render (HTML)" },
        { value: "file", label: "File" },
    ];

    const typeOptions = [
        { value: "", label: "Tất cả kênh/loại" },
        { value: "email", label: "Email" },
        { value: "telegram", label: "Telegram" },
        { value: "zalo", label: "Zalo" },
        { value: "sms", label: "SMS" },
        { value: "pdf_generated", label: "PDF Generated" },
    ];

    const statusOptions = [
        { value: "", label: "Tất cả trạng thái" },
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Tạm ngưng" },
    ];

    const sortOptions = [
        { value: "created_at:desc", label: "Mới nhất" },
        { value: "created_at:asc", label: "Cũ nhất" },
        { value: "name:asc", label: "Tên (A-Z)" },
        { value: "name:desc", label: "Tên (Z-A)" },
        { value: "code:asc", label: "Mã code (A-Z)" },
        { value: "code:desc", label: "Mã code (Z-A)" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sort_by"
            searchField="search"
            searchPlaceholder="Tìm theo tên hoặc mã code..."
            hasAdvancedFilters={true}
            onUpdateFilters={onUpdateFilters}
            onFilterChange={onFilterChange}
            advancedFilters={({ filters, onChange }) => (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phân loại</label>
                        <SelectFilter
                            value={filters["category"] || ""}
                            options={categoryOptions}
                            placeholder="Tất cả phân loại"
                            onChange={(value) => {
                                filters["category"] = value;
                                onChange();
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kênh/Loại</label>
                        <SelectFilter
                            value={filters["type"] || ""}
                            options={typeOptions}
                            placeholder="Tất cả kênh/loại"
                            onChange={(value) => {
                                filters["type"] = value;
                                onChange();
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Trạng thái</label>
                        <SelectFilter
                            value={filters["status"] || ""}
                            options={statusOptions}
                            placeholder="Tất cả trạng thái"
                            onChange={(value) => {
                                filters["status"] = value;
                                onChange();
                            }}
                        />
                    </div>
                </div>
            )}
        />
    );
}



