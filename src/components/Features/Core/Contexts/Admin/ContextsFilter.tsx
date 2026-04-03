"use client";

import { useMemo } from "react";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";
import SelectFilter from "@/components/UI/Filters/SelectFilter";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface ContextsFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function ContextsFilter({
  initialFilters = {},
  statusEnums = [],
  onUpdateFilters,
}: ContextsFilterProps) {
  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    const statusArray = statusEnums && statusEnums.length > 0 ? statusEnums : getBasicStatusArray();
    statusArray.forEach((item) => {
      options.push({ value: item.value, label: item.label || (item as any).name || item.value });
    });
    return options;
  }, [statusEnums]);

  const sortOptions = [
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "name:asc", label: "Tên (A-Z)" },
    { value: "name:desc", label: "Tên (Z-A)" },
    { value: "type:asc", label: "Loại (A-Z)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tên hoặc mã context..."
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



