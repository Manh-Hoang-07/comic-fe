"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface FAQsFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function FAQsFilter({
  initialFilters = {},
  onUpdateFilters,
  onFilterChange,
}: FAQsFilterProps) {
  const statusOptions = useMemo(() => {
    return [{ value: "", label: "Tất cả" }, ...getBasicStatusArray()];
  }, []);

  const sortOptions = [
    { value: "question:asc", label: "Câu hỏi (A-Z)" },
    { value: "question:desc", label: "Câu hỏi (Z-A)" },
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "sort_order:asc", label: "Thứ tự (tăng dần)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo câu hỏi..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
      advancedFilters={({ filters, onChange }) => (
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
      )}
    />
  );
}





