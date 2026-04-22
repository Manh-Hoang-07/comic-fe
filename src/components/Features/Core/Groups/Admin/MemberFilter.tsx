"use client";

import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface MemberFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function MemberFilter({
  initialFilters = {},
  onUpdateFilters,
  onFilterChange,
}: MemberFilterProps) {
  const sortOptions = [
    { value: "created_at:desc", label: "Mới nhất" },
    { value: "created_at:asc", label: "Cũ nhất" },
    { value: "username:asc", label: "Biệt danh (A-Z)" },
    { value: "username:desc", label: "Biệt danh (Z-A)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort_by"
      searchField="search"
      searchPlaceholder="Tìm theo tên đăng nhập, email..."
      hasAdvancedFilters={false}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
    />
  );
}
