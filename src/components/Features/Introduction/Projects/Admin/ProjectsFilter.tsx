"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

const getProjectStatusArray = () => [
  { value: "planning", label: "Đang lập kế hoạch" },
  { value: "in_progres", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
  { value: "on_hold", label: "Tạm dừng" },
  { value: "cancelled", label: "Đã hủy" },
];

interface ProjectsFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function ProjectsFilter({
  initialFilters = {},
  statusEnums = [],
  onUpdateFilters,
  onFilterChange,
}: ProjectsFilterProps) {
  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    const statusArray = statusEnums && statusEnums.length > 0 ? statusEnums : getProjectStatusArray();
    statusArray.forEach((item) => {
      options.push({
        value: item.value,
        label: item.label || (item as any).name || item.value,
      });
    });
    return options;
  }, [statusEnums]);

  const featuredOptions = [
    { value: "", label: "Tất cả" },
    { value: "true", label: "Nổi bật" },
    { value: "false", label: "Không nổi bật" },
  ];

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
    { value: "sort_order:asc", label: "Thứ tự (tăng dần)" },
    { value: "sort_order:desc", label: "Thứ tự (giảm dần)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tên dự án..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
      advancedFilters={({ filters, onChange }) => (
        <div className="space-y-4">
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
                value={filters["featured"] || ""}
                options={featuredOptions}
                placeholder="Nổi bật"
                onChange={(value) => {
                  filters["featured"] = value;
                  onChange();
                }}
              />
            </div>
          </div>
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
        </div>
      )}
    />
  );
}



