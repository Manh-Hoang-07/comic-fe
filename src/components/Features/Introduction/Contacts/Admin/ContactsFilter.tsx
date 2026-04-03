"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface ContactsFilterProps {
    initialFilters?: Record<string, any>;
    onUpdateFilters?: (filters: Record<string, any>) => void;
    onFilterChange?: () => void;
}

export default function ContactsFilter({
    initialFilters = {},
    onUpdateFilters,
    onFilterChange,
}: ContactsFilterProps) {
    const statusOptions = [
        { value: "new", label: "Mới" },
        { value: "read", label: "Đã xem" },
        { value: "processing", label: "Đang xử lý" },
        { value: "replied", label: "Đã phản hồi" },
        { value: "closed", label: "Đã đóng" },
    ];

    const sortOptions = [
        { value: "created_at:desc", label: "Mới nhất" },
        { value: "created_at:asc", label: "Cũ nhất" },
        { value: "name:asc", label: "Họ tên (A-Z)" },
        { value: "name:desc", label: "Họ tên (Z-A)" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sort_by"
            searchField="search"
            searchPlaceholder="Tìm theo tên, email, số điện thoại..."
            hasAdvancedFilters={true}
            onUpdateFilters={onUpdateFilters}
            onFilterChange={onFilterChange}
            advancedFilters={({ filters, onChange }) => (
                <div>
                    <SelectFilter
                        value={filters["status"] || ""}
                        options={statusOptions}
                        label="Trạng thái"
                        placeholder="Tất cả trạng thái"
                        onChange={(value) => {
                            filters["status"] = value;
                            onChange();
                        }}
                    />
                </div>
            )}
        />
    );
}



