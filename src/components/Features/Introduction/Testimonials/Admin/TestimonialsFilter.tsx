"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface TestimonialsFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function TestimonialsFilter({
  initialFilters = {},
  onUpdateFilters,
}: TestimonialsFilterProps) {
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

  const ratingOptions = [
    { value: "", label: "Tất cả" },
    { value: "5", label: "5 sao" },
    { value: "4", label: "4 sao" },
    { value: "3", label: "3 sao" },
    { value: "2", label: "2 sao" },
    { value: "1", label: "1 sao" },
  ];

  const sortOptions = [
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "sort_order:asc", label: "Thứ tự (tăng dần)" },
    { value: "rating:desc", label: "Đánh giá cao -> thấp" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tên khách hàng..."
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
          <div className="min-w-[140px]">
            <SelectFilter
              value={filters["rating"] || ""}
              options={ratingOptions}
              placeholder="Đánh giá"
              onChange={(value) => {
                filters["rating"] = value;
                onChange();
              }}
            />
          </div>
        </div>
      )}
    />
  );
}



