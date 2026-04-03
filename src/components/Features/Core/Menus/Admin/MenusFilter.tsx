"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";

interface MenusFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  parentMenus?: Array<{ id: number; name: string; children?: any[] }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function MenusFilter({
  initialFilters = {},
  statusEnums = [],
  parentMenus = [],
  onUpdateFilters,
  onFilterChange,
}: MenusFilterProps) {
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

  const parentMenuOptions = useMemo(() => {
    const options = [
      { value: "", label: "Tất cả" },
      { value: "null", label: "Root (Không có menu cha)" },
    ];
    if (parentMenus && Array.isArray(parentMenus)) {
      const flattenMenus = (menus: any[], level = 0): any[] => {
        const result: any[] = [];
        menus.forEach((menu) => {
          const prefix = "  ".repeat(level);
          result.push({
            value: String(menu.id),
            label: `${prefix}${menu.name}`,
          });
          if (menu.children && menu.children.length > 0) {
            result.push(...flattenMenus(menu.children, level + 1));
          }
        });
        return result;
      };
      options.push(...flattenMenus(parentMenus));
    }
    return options;
  }, [parentMenus]);

  const showInMenuOptions = [
    { value: "", label: "Tất cả" },
    { value: "true", label: "Hiển thị" },
    { value: "false", label: "Ẩn" },
  ];

  const typeOptions = [
    { value: "", label: "Tất cả" },
    { value: "route", label: "Route" },
    { value: "group", label: "Group" },
    { value: "link", label: "Link" },
  ];

  const sortOptions = [
    { value: "sort_order:ASC", label: "Thứ tự (tăng dần)" },
    { value: "sort_order:DESC", label: "Thứ tự (giảm dần)" },
    { value: "name:ASC", label: "Tên (A-Z)" },
    { value: "name:DESC", label: "Tên (Z-A)" },
    { value: "created_at:ASC", label: "Ngày tạo (cũ nhất)" },
    { value: "created_at:DESC", label: "Ngày tạo (mới nhất)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="q"
      searchPlaceholder="Tìm theo tên, code..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
      advancedFilters={({ filters, onChange }) => (
        <>
          <div>
            <SelectFilter
              value={filters["parent_id"] || ""}
              options={parentMenuOptions}
              placeholder="Chọn menu cha"
              onChange={(value) => {
                filters["parent_id"] = value;
                onChange();
              }}
            />
          </div>
          <div>
            <SelectFilter
              value={filters["type"] || ""}
              options={typeOptions}
              placeholder="Chọn loại menu"
              onChange={(value) => {
                filters["type"] = value;
                onChange();
              }}
            />
          </div>
          <div>
            <SelectFilter
              value={filters["group"] || ""}
              options={[
                { value: "", label: "Tất cả nhóm" },
                { value: "admin", label: "Nhóm Admin" },
                { value: "client", label: "Nhóm Client" },
              ]}
              placeholder="Chọn nhóm menu"
              onChange={(value) => {
                filters["group"] = value;
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
                value={filters["show_in_menu"] || ""}
                options={showInMenuOptions}
                placeholder="Hiển thị trong menu"
                onChange={(value) => {
                  filters["show_in_menu"] = value;
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



