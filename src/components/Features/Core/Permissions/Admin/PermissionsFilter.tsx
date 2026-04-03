"use client";

import { useMemo } from "react";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";
import SelectFilter from "@/components/UI/Filters/SelectFilter";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface PermissionsFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function PermissionsFilter({
  initialFilters = {},
  statusEnums = [],
  onUpdateFilters,
}: PermissionsFilterProps) {
  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    const statusArray = statusEnums && statusEnums.length > 0 ? statusEnums : getBasicStatusArray();
    statusArray.forEach((item) => {
      options.push({ value: item.value, label: item.label || (item as any).name || item.value });
    });
    return options;
  }, [statusEnums]);

  const scopeOptions = [
    { value: "", label: "Tất cả" },
    { value: "context", label: "Context" },
    { value: "system", label: "System" },
  ];

  const sortOptions = [
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "code:asc", label: "Mã code (A-Z)" },
    { value: "code:desc", label: "Mã code (Z-A)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo mã code hoặc tên quyền..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      advancedFilters={({ filters, onChange }) => (
        <>
          <div className="min-w-[150px]">
            <SelectFilter
              value={filters["scope"] || ""}
              options={scopeOptions}
              placeholder="Phạm vi"
              onChange={(value) => {
                filters["scope"] = value;
                onChange();
              }}
            />
          </div>
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



