"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface UsersFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function UsersFilter({
  initialFilters = {},
  statusEnums = [],
  onUpdateFilters,
  onFilterChange,
}: UsersFilterProps) {
  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    if (statusEnums && Array.isArray(statusEnums)) {
      statusEnums.forEach((item) => {
        options.push({
          value: item.value,
          label: item.label || (item as any).name || item.value,
        });
      });
    }
    return options;
  }, [statusEnums]);

  const sortOptions = [
    { value: "created_at:desc", label: "Mới nhất" },
    { value: "created_at:asc", label: "Cũ nhất" },
    { value: "username:asc", label: "Tên đăng nhập (A-Z)" },
    { value: "username:desc", label: "Tên đăng nhập (Z-A)" },
    { value: "email:asc", label: "Email (A-Z)" },
    { value: "email:desc", label: "Email (Z-A)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort_by"
      searchField="search"
      searchPlaceholder="Tìm theo tên đăng nhập, email..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
      advancedFilters={({ filters, onChange }) => (
        <div>
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
      )}
    />
  );
}



