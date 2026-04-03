"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

const getCertificateTypeArray = () => [
  { value: "iso", label: "ISO" },
  { value: "quality", label: "Chất lượng" },
  { value: "safety", label: "An toàn" },
  { value: "environment", label: "Môi trường" },
  { value: "other", label: "Khác" },
];

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface CertificatesFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function CertificatesFilter({
  initialFilters = {},
  onUpdateFilters,
  onFilterChange,
}: CertificatesFilterProps) {
  const typeOptions = useMemo(() => {
    return [{ value: "", label: "Tất cả" }, ...getCertificateTypeArray()];
  }, []);

  const statusOptions = useMemo(() => {
    return [{ value: "", label: "Tất cả" }, ...getBasicStatusArray()];
  }, []);

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
      searchPlaceholder="Tìm theo tên chứng chỉ..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
      advancedFilters={({ filters, onChange }) => (
        <div className="flex gap-4">
          <div className="min-w-[160px]">
            <SelectFilter
              value={filters["type"] || ""}
              options={typeOptions}
              placeholder="Loại chứng chỉ"
              onChange={(value) => {
                filters["type"] = value;
                onChange();
              }}
            />
          </div>
          <div className="min-w-[160px]">
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




