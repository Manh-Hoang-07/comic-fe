"use client";

import { useMemo } from "react";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";
import SelectFilter from "@/components/UI/Filters/SelectFilter";

interface CountryFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function CountryFilter({
  initialFilters = {},
  onUpdateFilters,
}: CountryFilterProps) {
  const statusOptions = useMemo(
    () => [
      { value: "", label: "Tất cả trạng thái" },
      { value: "active", label: "Hoạt động" },
      { value: "inactive", label: "Ngừng hoạt động" },
    ],
    []
  );

  const sortOptions = [
    { value: "name:asc", label: "Tên (A-Z)" },
    { value: "name:desc", label: "Tên (Z-A)" },
    { value: "code:asc", label: "Mã (A-Z)" },
    { value: "code:desc", label: "Mã (Z-A)" },
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "created_at:asc", label: "Ngày tạo (cũ nhất)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort_by"
      searchField="search"
      searchPlaceholder="Tìm theo tên, mã quốc gia..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      advancedFilters={({ filters, onChange }) => (
        <div className="min-w-[180px]">
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
      )}
    />
  );
}


