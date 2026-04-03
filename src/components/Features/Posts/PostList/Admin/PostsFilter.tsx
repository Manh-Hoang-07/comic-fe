"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface PostsFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  categoryEnums?: Array<{ id: number; name: string }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function PostsFilter({
  initialFilters = {},
  statusEnums = [],
  categoryEnums = [],
  onUpdateFilters,
  onFilterChange,
}: PostsFilterProps) {
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

  const categoryOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    if (categoryEnums && Array.isArray(categoryEnums)) {
      categoryEnums.forEach((item) => {
        options.push({
          value: String(item.id),
          label: item.name,
        });
      });
    }
    return options;
  }, [categoryEnums]);

  const includeDeletedOptions = [
    { value: "", label: "Mặc định" },
    { value: "true", label: "Bao gồm đã xóa" },
    { value: "false", label: "Chỉ chưa xóa" },
  ];

  const sortOptions = [
    { value: "name:asc", label: "Tên (A-Z)" },
    { value: "name:desc", label: "Tên (Z-A)" },
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
          <div className="mt-4 flex gap-4">
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
                value={filters["category_id"] || ""}
                options={categoryOptions}
                placeholder="Chọn danh mục"
                onChange={(value) => {
                  filters["category_id"] = value;
                  onChange();
                }}
              />
            </div>
          </div>
        </div>
      )}
    />
  );
}





