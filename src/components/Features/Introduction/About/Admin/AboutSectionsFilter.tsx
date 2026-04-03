"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

// Enum helpers - these should be moved to a shared utils file
const getAboutSectionTypeArray = () => [
  { value: "history", label: "Lịch sử" },
  { value: "mission", label: "Sứ mệnh" },
  { value: "vision", label: "Tầm nhìn" },
  { value: "values", label: "Giá trị cốt lõi" },
  { value: "culture", label: "Văn hóa" },
  { value: "achievement", label: "Thành tựu" },
  { value: "other", label: "Khác" },
];

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface AboutSectionsFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function AboutSectionsFilter({
  initialFilters = {},
  onUpdateFilters,
  onFilterChange,
}: AboutSectionsFilterProps) {
  const sectionTypeOptions = useMemo(() => {
    return [{ value: "", label: "Tất cả" }, ...getAboutSectionTypeArray()];
  }, []);

  const statusOptions = useMemo(() => {
    return [{ value: "", label: "Tất cả" }, ...getBasicStatusArray()];
  }, []);

  const sortOptions = [
    { value: "title:asc", label: "Tiêu đề (A-Z)" },
    { value: "title:desc", label: "Tiêu đề (Z-A)" },
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "sort_order:asc", label: "Thứ tự (tăng dần)" },
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
        <div className="flex gap-4">
          <div className="min-w-[150px]">
            <SelectFilter
              value={filters["section_type"] || ""}
              options={sectionTypeOptions}
              placeholder="Loại section"
              onChange={(value) => {
                filters["section_type"] = value;
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
        </div>
      )}
    />
  );
}




