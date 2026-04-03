"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

const getPartnerTypeArray = () => [
  { value: "supplier", label: "Nhà cung cấp" },
  { value: "client", label: "Khách hàng" },
  { value: "partner", label: "Đối tác" },
  { value: "sponsor", label: "Nhà tài trợ" },
  { value: "other", label: "Khác" },
];

interface PartnersFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function PartnersFilter({
  initialFilters = {},
  onUpdateFilters,
}: PartnersFilterProps) {
  const typeOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    getPartnerTypeArray().forEach((item) =>
      options.push({ value: item.value, label: item.label })
    );
    return options;
  }, []);

  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    getBasicStatusArray().forEach((item) =>
      options.push({ value: item.value, label: item.label })
    );
    return options;
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
      searchPlaceholder="Tìm theo tên đối tác..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      advancedFilters={({ filters, onChange }) => (
        <div className="flex gap-4">
          <div className="min-w-[140px]">
            <SelectFilter
              value={filters["type"] || ""}
              options={typeOptions}
              placeholder="Loại đối tác"
              onChange={(value) => {
                filters["type"] = value;
                onChange();
              }}
            />
          </div>
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
        </div>
      )}
    />
  );
}



