"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import SearchableSelect from "@/components/UI/Forms/SearchableSelect";
import { adminEndpoints } from "@/lib/api/endpoints";

// 1. Define Menu Schema
const menuSchema = z.object({
  code: z.string().min(3, "Code phải có ít nhất 3 ký tự").max(120, "Code tối đa 120 ký tự"),
  name: z.string().min(1, "Tên menu là bắt buộc").max(150, "Tên menu tối đa 150 ký tự"),
  path: z.string().max(255, "Path tối đa 255 ký tự").optional().nullable(),
  api_path: z.string().max(255, "API Path tối đa 255 ký tự").optional().nullable(),
  icon: z.string().max(120, "Icon tối đa 120 ký tự").optional().nullable(),
  type: z.string().min(1, "Loại menu là bắt buộc").default("route"),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  parent_id: z.coerce.number().optional().nullable(),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
  is_public: z.boolean().default(false),
  show_in_menu: z.boolean().default(true),
  required_permission_id: z.coerce.number().optional().nullable(),
  group: z.string().min(1, "Group là bắt buộc").default("admin"),
});

type MenuFormValues = z.infer<typeof menuSchema>;

interface Menu {
  id?: number;
  code?: string;
  name?: string;
  path?: string | null;
  api_path?: string | null;
  icon?: string | null;
  type?: string;
  status?: string;
  parent_id?: number | string | null;
  sort_order?: number;
  is_public?: boolean;
  show_in_menu?: boolean;
  required_permission_id?: number | string | null;
  group?: string;
}

interface MenuFormProps {
  show: boolean;
  menu?: Menu | null;
  statusEnums?: Array<{ value: string; label?: string }>;
  parentMenus?: Array<any>;
  permissions?: Array<{ id: number; name: string; code: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function MenuForm({
  show,
  menu,
  statusEnums = [],
  parentMenus = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: MenuFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      code: "",
      name: "",
      path: "",
      api_path: "",
      icon: "",
      type: "route",
      status: "active",
      parent_id: null,
      sort_order: 0,
      is_public: false,
      show_in_menu: true,
      required_permission_id: null,
      group: "admin",
    },
  });

  const flattenMenus = useCallback((menusArray: any[], level = 0): any[] => {
    const result: any[] = [];
    if (!Array.isArray(menusArray) || menusArray.length === 0) return result;
    menusArray.forEach((m) => {
      if (!m?.id) return;
      const prefix = "  ".repeat(level);
      result.push({
        ...m,
        displayName: `${prefix}${m.name || ""}`,
      });
      if (m.children && Array.isArray(m.children) && m.children.length > 0) {
        result.push(...flattenMenus(m.children, level + 1));
      }
    });
    return result;
  }, []);

  const filteredParentMenus = useMemo(() => {
    const menus = Array.isArray(parentMenus) ? parentMenus : [];
    if (menus.length === 0) return [];
    if (!menu?.id) return flattenMenus(menus);

    const excludeIds = [menu.id];
    const getChildrenIds = (m: any) => {
      if (m?.children && Array.isArray(m.children) && m.children.length > 0) {
        m.children.forEach((child: any) => {
          if (child?.id) {
            excludeIds.push(child.id);
            getChildrenIds(child);
          }
        });
      }
    };

    const findAndExclude = (menusArr: any[]) => {
      menusArr.forEach((m) => {
        if (m?.id === menu.id) getChildrenIds(m);
        else if (m?.children && Array.isArray(m.children)) findAndExclude(m.children);
      });
    };

    findAndExclude(menus);
    return flattenMenus(menus).filter((m) => !excludeIds.includes(m.id));
  }, [parentMenus, menu, flattenMenus]);

  const statusOptions = useMemo(() =>
    statusEnums.map((s) => ({ value: s.value, label: s.label || s.value })),
    [statusEnums]
  );

  const parentMenuOptions = useMemo(() =>
    filteredParentMenus.map((m) => ({ value: m.id, label: m.displayName || m.name })),
    [filteredParentMenus]
  );

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (menu) {
        reset({
          code: menu.code || "",
          name: menu.name || "",
          path: menu.path || "",
          api_path: menu.api_path || "",
          icon: menu.icon || "",
          type: menu.type || "route",
          status: menu.status || "active",
          parent_id: menu.parent_id ? Number(menu.parent_id) : null,
          sort_order: menu.sort_order || 0,
          is_public: !!menu.is_public,
          show_in_menu: menu.show_in_menu !== false,
          required_permission_id: menu.required_permission_id ? Number(menu.required_permission_id) : null,
          group: menu.group || "admin",
        });
      } else {
        reset({
          code: "",
          name: "",
          path: "",
          api_path: "",
          icon: "",
          type: "route",
          status: "active",
          parent_id: null,
          sort_order: 0,
          is_public: false,
          show_in_menu: true,
          required_permission_id: null,
          group: "admin",
        });
      }
    }
  }, [menu, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = menu ? "Chỉnh sửa Menu" : "Thêm Menu mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN CƠ BẢN */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h3>
              <p className="text-xs text-gray-500">Định danh, tên gọi và cấu trúc menu</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Mã Menu (Code)"
              {...register("code")}
              placeholder="Ví dụ: admin.dashboard"
              error={errors.code?.message}
              required
              disabled={!!menu}
              helpText={menu ? "Code không thể thay đổi sau khi tạo" : "Dùng để xác định menu trong code"}
            />
            <FormField
              label="Tên hiển thị"
              {...register("name")}
              placeholder="Ví dụ: Bảng điều khiển"
              error={errors.name?.message}
              required
            />

            <Controller
              name="parent_id"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Menu cha</label>
                  <SingleSelectEnhanced
                    value={value || ""}
                    options={[{ value: "", label: "Root (Không có cha)" }, ...parentMenuOptions]}
                    onChange={(val) => onChange(val || null)}
                    placeholder="Chọn menu cha..."
                  />
                  {errors.parent_id && <p className="text-xs text-red-500">{errors.parent_id.message}</p>}
                </div>
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Loại Menu <span className="text-red-500">*</span></label>
                  <SingleSelectEnhanced
                    value={value}
                    options={[
                      { value: "route", label: "Route (Nội bộ)" },
                      { value: "group", label: "Group (Nhóm)" },
                      { value: "link", label: "Link (Bên ngoài)" },
                    ]}
                    onChange={onChange}
                  />
                </div>
              )}
            />
            <Controller
              name="group"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nhóm (Context) <span className="text-red-500">*</span>
                  </label>
                  <SingleSelectEnhanced
                    value={value}
                    options={[
                      { value: "admin", label: "Admin - Quản trị" },
                      { value: "client", label: "Client - Website" },
                    ]}
                    onChange={onChange}
                  />
                </div>
              )}
            />
          </div>
        </section>

        {/* SECTION: ĐƯỜNG DẪN & ICON */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Đường dẫn & Hiển thị</h3>
              <p className="text-xs text-gray-500">Cấu hình URL, API và icon biểu tượng</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Đường dẫn (Path)"
              {...register("path")}
              placeholder="/admin/users"
              error={errors.path?.message}
            />
            <FormField
              label="API Path (Tùy chọn)"
              {...register("api_path")}
              placeholder="/api/admin/users"
              error={errors.api_path?.message}
            />
            <FormField
              label="Biểu tượng (Icon)"
              {...register("icon")}
              placeholder="mdi-home hoặc 🏠"
              error={errors.icon?.message}
            />
            <FormField
              label="Thứ tự sắp xếp"
              type="number"
              {...register("sort_order")}
              error={errors.sort_order?.message}
            />
          </div>
        </section>

        {/* SECTION: PHÂN QUYỀN & TRẠNG THÁI */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Quyền hạn & Trạng thái</h3>
              <p className="text-xs text-gray-500">Kiểm soát truy cập và khả năng hiển thị</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="required_permission_id"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Permission yêu cầu</label>
                  <SearchableSelect
                    value={value || ""}
                    searchApi={adminEndpoints.permissions.list}
                    placeholder="Không yêu cầu (Công khai)"
                    labelField="name"
                    onChange={(val) => onChange(val || null)}
                  />
                </div>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
                  <SingleSelectEnhanced
                    value={value}
                    options={statusOptions}
                    onChange={onChange}
                  />
                </div>
              )}
            />

            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="is_public"
                {...register("is_public")}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_public" className="text-sm font-bold text-gray-700 cursor-pointer">
                Cho phép truy cập công khai
              </label>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="show_in_menu"
                {...register("show_in_menu")}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="show_in_menu" className="text-sm font-bold text-gray-700 cursor-pointer">
                Hiển thị trên thanh Menu
              </label>
            </div>
          </div>
        </section>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang xử lý..." : menu ? "Cập nhật Menu" : "Tạo Menu mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



