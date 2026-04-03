"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";

const contextSchema = z.object({
  type: z.string().min(1, "Loại context là bắt buộc").max(100, "Loại context tối đa 100 ký tự"),
  code: z.string().max(100, "Mã code tối đa 100 ký tự").optional().nullable(),
  name: z.string().min(1, "Tên context là bắt buộc").max(255, "Tên context tối đa 255 ký tự"),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
});

type ContextFormValues = z.infer<typeof contextSchema>;

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Context {
  id?: number;
  type?: string;
  code?: string;
  name?: string;
  status?: string;
}

interface ContextFormProps {
  show: boolean;
  context?: Context | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function ContextForm({
  show,
  context,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: ContextFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContextFormValues>({
    resolver: zodResolver(contextSchema),
    defaultValues: {
      type: "",
      code: "",
      name: "",
      status: "active",
    },
  });

  const statusOptions = useMemo(() => {
    const statusArray = statusEnums && statusEnums.length > 0 ? statusEnums : getBasicStatusArray();
    return statusArray.map((opt) => ({
      value: opt.value,
      label: opt.label || (opt as any).name || opt.value,
    }));
  }, [statusEnums]);

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (context) {
        reset({
          type: context.type || "",
          code: context.code || "",
          name: context.name || "",
          status: context.status || "active",
        });
      } else {
        reset({
          type: "",
          code: "",
          name: "",
          status: "active",
        });
      }
    }
  }, [context, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = context ? "Chỉnh sửa Context" : "Thêm Context mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN CƠ BẢN */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h3>
              <p className="text-xs text-gray-500">Phân loại, mã định danh và tên gọi</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Loại Context"
              {...register("type")}
              placeholder="system, shop, team, community..."
              error={errors.type?.message}
              required
              disabled={!!context}
              helpText={context ? "Loại context không thể thay đổi sau khi tạo" : "Xác định nhóm tài nguyên mà context này quản lý"}
            />
            <FormField
              label="Mã định danh (Code)"
              {...register("code")}
              placeholder="vi-du-shop-01 (Tự sinh nếu trống)"
              error={errors.code?.message}
              disabled={!!context}
              helpText={context ? "Mã định danh không thể thay đổi" : "Dùng cho lập trình và định tuyến URL"}
            />
            <FormField
              label="Tên Context"
              {...register("name")}
              placeholder="Ví dụ: Cửa hàng Quận 1"
              error={errors.name?.message}
              required
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
                    placeholder="Chọn trạng thái..."
                  />
                  {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
                </div>
              )}
            />
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
            {isSubmitting ? "Đang xử lý..." : context ? "Cập nhật Context" : "Thêm Context"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



