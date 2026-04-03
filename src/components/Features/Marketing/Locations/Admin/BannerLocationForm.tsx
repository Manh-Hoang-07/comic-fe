"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";

// 1. Define BannerLocation Schema
const bannerLocationSchema = z.object({
  code: z.string()
    .min(1, "Mã vị trí là bắt buộc")
    .regex(/^[a-z0-9_]+$/, "Mã vị trí chỉ chứa chữ cái thường, số và dấu gạch dưới")
    .max(100, "Mã tối đa 100 ký tự"),
  name: z.string().min(1, "Tên vị trí là bắt buộc").max(255, "Tên tối đa 255 ký tự"),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional().nullable(),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
});

type BannerLocationFormValues = z.infer<typeof bannerLocationSchema>;

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface BannerLocation {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  status?: string;
}

interface BannerLocationFormProps {
  show: boolean;
  location?: BannerLocation | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function BannerLocationForm({
  show,
  location,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: BannerLocationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BannerLocationFormValues>({
    resolver: zodResolver(bannerLocationSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
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
      if (location) {
        reset({
          code: location.code || "",
          name: location.name || "",
          description: location.description || "",
          status: location.status || "active",
        });
      } else {
        reset({
          code: "",
          name: "",
          description: "",
          status: "active",
        });
      }
    }
  }, [location, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = location ? "Chỉnh sửa Vị trí Banner" : "Thêm Vị trí Banner mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN VỊ TRÍ */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin Vị trí</h3>
              <p className="text-xs text-gray-500">Mã định danh và tên gợi nhớ cho vùng hiển thị banner</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Mã vị trí (Code)"
              {...register("code")}
              placeholder="home_slider, sidebar_adv..."
              error={errors.code?.message}
              required
              disabled={!!location}
              helpText={location ? "Mã vị trí không thể thay đổi sau khi tạo" : "Dùng để lấy banners cho vị trí này trong code"}
            />
            <FormField
              label="Tên vị trí"
              {...register("name")}
              placeholder="Ví dụ: Slider Trang chủ"
              error={errors.name?.message}
              required
            />

            <div className="md:col-span-2">
              <FormField
                label="Mô tả"
                type="textarea"
                rows={3}
                {...register("description")}
                placeholder="Nhập mô tả về cách sử dụng vị trí banner này..."
                error={errors.description?.message}
              />
            </div>

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
            {isSubmitting ? "Đang xử lý..." : location ? "Cập nhật Vị trí" : "Thêm Vị trí"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



