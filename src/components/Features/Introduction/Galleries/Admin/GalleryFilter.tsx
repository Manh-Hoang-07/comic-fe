"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface GalleryFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function GalleryFilter({
  initialFilters = {},
  onUpdateFilters,
}: GalleryFilterProps) {
  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    getBasicStatusArray().forEach((item) =>
      options.push({ value: item.value, label: item.label })
    );
    return options;
  }, []);

  const featuredOptions = [
    { value: "", label: "Tất cả" },
    { value: "true", label: "Nổi bật" },
    { value: "false", label: "Không nổi bật" },
  ];

  const sortOptions = [
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "sort_order:asc", label: "Thứ tự (tăng dần)" },
    { value: "title:asc", label: "Tiêu đề (A-Z)" },
    { value: "title:desc", label: "Tiêu đề (Z-A)" },
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
      )}
    />
  );
}



