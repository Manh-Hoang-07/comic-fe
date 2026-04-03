"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface BannersFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  locationEnums?: Array<{ id: number; name: string }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function BannersFilter({
  initialFilters = {},
  statusEnums = [],
  locationEnums = [],
  onUpdateFilters,
  onFilterChange,
}: BannersFilterProps) {
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

  const locationOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    if (locationEnums && Array.isArray(locationEnums)) {
      locationEnums.forEach((item) => {
        options.push({
          value: String(item.id),
          label: item.name,
        });
      });
    }
    return options;
  }, [locationEnums]);

  const includeDeletedOptions = [
    { value: "", label: "Mặc định" },
    { value: "true", label: "Bao gồm đã xóa" },
    { value: "false", label: "Chỉ chưa xóa" },
  ];

  const sortOptions = [
    { value: "title:asc", label: "Tiêu đề (A-Z)" },
    { value: "title:desc", label: "Tiêu đề (Z-A)" },
    { value: "sort_order:asc", label: "Thứ tự (tăng dần)" },
    { value: "sort_order:desc", label: "Thứ tự (giảm dần)" },
    { value: "created_at:asc", label: "Ngày tạo (cũ nhất)" },
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "updated_at:asc", label: "Ngày cập nhật (cũ nhất)" },
    { value: "updated_at:desc", label: "Ngày cập nhật (mới nhất)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tiêu đề..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
      advancedFilters={({ filters, onChange }) => (
        <>
          <div>
            <SelectFilter
              value={filters["include_deleted"] || ""}
              options={includeDeletedOptions}
              placeholder="Bao gồm đã xóa"
              onChange={(value) => {
                filters["include_deleted"] = value;
                onChange();
              }}
            />
          </div>
          <div className="flex gap-4">
            <div className="min-w-[150px]">
              <SelectFilter
                value={filters["status"] || ""}
                options={statusOptions}
                placeholder="Chọn trạng thái"
                onChange={(value) => {
                  filters["status"] = value;
                  onChange();
                }}
              />
            </div>
            <div className="min-w-[150px]">
              <SelectFilter
                value={filters["location_id"] || ""}
                options={locationOptions}
                placeholder="Chọn vị trí"
                onChange={(value) => {
                  filters["location_id"] = value;
                  onChange();
                }}
              />
            </div>
          </div>
        </>
      )}
    />
  );
}



