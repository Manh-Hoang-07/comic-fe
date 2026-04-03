"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface StaffFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function StaffFilter({
  initialFilters = {},
  onUpdateFilters,
  onFilterChange,
}: StaffFilterProps) {
  const statusOptions = useMemo(() => {
    return [{ value: "", label: "Tất cả" }, ...getBasicStatusArray()];
  }, []);

  const departmentOptions = [
    { value: "", label: "Tất cả" },
    { value: "Kỹ thuật", label: "Kỹ thuật" },
    { value: "Marketing", label: "Marketing" },
    { value: "Kinh doanh", label: "Kinh doanh" },
    { value: "Khác", label: "Khác" },
  ];

  const sortOptions = [
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "sort_order:asc", label: "Thứ tự (tăng dần)" },
    { value: "name:asc", label: "Tên (A-Z)" },
    { value: "name:desc", label: "Tên (Z-A)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tên..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
      advancedFilters={({ filters, onChange }) => (
        <div className="flex gap-4">
          <div className="min-w-[140px]">
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
          <div className="min-w-[140px]">
            <SelectFilter
              value={filters["department"] || ""}
              options={departmentOptions}
              placeholder="Phòng ban"
              onChange={(value) => {
                filters["department"] = value;
                onChange();
              }}
            />
          </div>
        </div>
      )}
    />
  );
}




