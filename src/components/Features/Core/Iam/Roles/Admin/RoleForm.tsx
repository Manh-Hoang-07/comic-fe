"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import SearchableSelect from "@/components/UI/Forms/SearchableSelect";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import MultipleSelect from "@/components/UI/Forms/MultipleSelect";
import { adminEndpoints } from "@/lib/api/endpoints";
import api from "@/lib/api/client";

// 1. Define Role Schema
const roleSchema = z.object({
  code: z.string().min(1, "Mã code là bắt buộc").max(100, "Mã code không được vượt quá 100 ký tự"),
  name: z.string().min(1, "Tên vai trò là bắt buộc").max(150, "Tên vai trò không được vượt quá 150 ký tự"),
  parent_id: z.coerce.number().optional().nullable(),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  context_ids: z.array(z.number()).default([]),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface Role {
  id?: number;
  code?: string;
  name?: string;
  parent_id?: number | null;
  status?: string;
  contexts?: Array<{ id: number; name: string; type: string }>;
}

interface RoleFormProps {
  show: boolean;
  role?: Role | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  loading?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function RoleForm({
  show,
  role,
  statusEnums = [],
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: RoleFormProps) {
  const [contexts, setContexts] = useState<Array<{ id: number; name: string; type: string }>>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      code: "",
      name: "",
      parent_id: null,
      status: "active",
      context_ids: [],
    },
  });

  const contextOptions = useMemo(() =>
    contexts.map((ctx) => ({ value: ctx.id, label: `${ctx.name} (${ctx.type})` })),
    [contexts]);

  const statusOptions = useMemo(() =>
    statusEnums.length > 0
      ? statusEnums.map(opt => ({ value: opt.value, label: opt.label || (opt as any).name || opt.value }))
      : [{ value: "active", label: "Hoạt động" }, { value: "inactive", label: "Ngừng hoạt động" }],
    [statusEnums]);

  // Load Contexts
  useEffect(() => {
    if (show) {
      const loadContexts = async () => {
        try {
          const response = await api.get(adminEndpoints.contexts.list);
          const data = response.data?.data || response.data || [];
          setContexts(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to load contexts", err);
        }
      };
      loadContexts();
    }
  }, [show]);

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (role) {
        reset({
          code: role.code || "",
          name: role.name || "",
          parent_id: role.parent_id || null,
          status: role.status || "active",
          context_ids: role.contexts?.map(ctx => ctx.id) || [],
        });
      } else {
        reset({
          code: "",
          name: "",
          parent_id: null,
          status: "active",
          context_ids: [],
        });
      }
    }
  }, [role, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = role ? "Chỉnh sửa vai trò" : "Thêm vai trò mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={loading || isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN VAI TRÒ */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin định danh</h3>
              <p className="text-xs text-gray-500">Mã code hệ thống và tên vai trò</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Mã code"
              {...register("code")}
              error={errors.code?.message}
              disabled={!!role}
              placeholder="admin, manager, editor..."
              required
              helpText={role ? "Không thể thay đổi mã code sau khi tạo" : "Sử dụng chữ thường, không dấu, phân cách bằng gạch ngang"}
            />
            <FormField
              label="Tên vai trò"
              {...register("name")}
              error={errors.name?.message}
              placeholder="Quản trị viên, Biên tập viên..."
              required
            />
          </div>
        </section>

        {/* SECTION: CẤU TRÚC & TRẠNG THÁI */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Phân cấp & Trạng thái</h3>
              <p className="text-xs text-gray-500">Thiết lập quan hệ cha-con và tính khả dụng</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Vai trò cha</label>
                  <SearchableSelect
                    {...field}
                    searchApi={adminEndpoints.roles.list}
                    placeholder="Tìm kiếm vai trò cha..."
                    excludeId={role?.id}
                    labelField="name"
                    error={errors.parent_id?.message}
                  />
                </div>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  label="Trạng thái"
                  options={statusOptions}
                  placeholder="-- Chọn trạng thái --"
                  error={errors.status?.message}
                  required
                />
              )}
            />
          </div>
        </section>

        {/* SECTION: PHẠM VI ÁP DỤNG */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 012.5 2.5V14a2 2 0 002 2h1.545M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Contexts (Phạm vi)</h3>
              <p className="text-xs text-gray-500">Giới hạn vai trò trong các khu vực cụ thể</p>
            </div>
          </header>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Gán cho Contexts</label>
            <Controller
              name="context_ids"
              control={control}
              render={({ field }) => (
                <MultipleSelect
                  {...field}
                  options={contextOptions}
                  placeholder="Chọn contexts..."
                />
              )}
            />
            <p className="text-[10px] text-gray-400 mt-1 italic">* Để trống nếu đây là vai trò dành cho System Admin</p>
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
            disabled={isSubmitting || loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang xử lý..." : role ? "Cập nhật vai trò" : "Thêm vai trò mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



