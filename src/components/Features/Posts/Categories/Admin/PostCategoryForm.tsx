"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";
import CKEditor from "@/components/UI/Forms/CKEditor";
import { userEndpoints } from "@/lib/api/endpoints";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";

// 1. Define Category Schema
const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc").max(255, "Tên danh mục không được vượt quá 255 ký tự"),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  og_image: z.string().optional().nullable(),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
  parent_id: z.coerce.number().optional().nullable(),
  meta_title: z.string().max(255, "Meta Title tối đa 255 ký tự").optional().nullable(),
  meta_description: z.string().max(1000, "Meta Description tối đa 1000 ký tự").optional().nullable(),
  canonical_url: z.string().url("URL không hợp lệ").or(z.literal("")).optional().nullable(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface PostCategory {
  id?: number;
  name?: string;
  description?: string;
  image?: string | null;
  og_image?: string | null;
  status?: string;
  sort_order?: number;
  parent_id?: number | null;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
}

interface PostCategoryFormProps {
  show: boolean;
  category?: PostCategory | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function PostCategoryForm({
  show,
  category,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: PostCategoryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      og_image: "",
      status: "active",
      sort_order: 0,
      parent_id: null,
      meta_title: "",
      meta_description: "",
      canonical_url: "",
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
      if (category) {
        reset({
          name: category.name || "",
          description: category.description || "",
          image: category.image || "",
          og_image: category.og_image || "",
          status: category.status || "active",
          sort_order: category.sort_order || 0,
          parent_id: category.parent_id || null,
          meta_title: category.meta_title || "",
          meta_description: category.meta_description || "",
          canonical_url: category.canonical_url || "",
        });
      } else {
        reset({
          name: "",
          description: "",
          image: "",
          og_image: "",
          status: "active",
          sort_order: 0,
          parent_id: null,
          meta_title: "",
          meta_description: "",
          canonical_url: "",
        });
      }
    }
  }, [category, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION 1: THÔNG TIN DANH MỤC */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin danh mục</h3>
              <p className="text-xs text-gray-500">Tên, mô tả và cấu hình cơ bản</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Tên danh mục"
                {...register("name")}
                placeholder="Ví dụ: Tin tức thị trường"
                error={errors.name?.message}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả danh mục</label>
              <Controller
                name="description"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CKEditor
                    value={value || ""}
                    onChange={onChange}
                    height="180px"
                    placeholder="Nhập nội dung mô tả chi tiết cho danh mục..."
                    uploadUrl={userEndpoints.uploads.image}
                  />
                )}
              />
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-4 self-start">Ảnh đại diện</label>
              <Controller
                name="image"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader value={value} onChange={onChange} />
                )}
              />
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-4 self-start">OG Image (Social Share)</label>
              <Controller
                name="og_image"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader value={value} onChange={onChange} />
                )}
              />
            </div>

            <div className="space-y-4">
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
              <FormField
                label="Thứ tự hiển thị"
                type="number"
                {...register("sort_order")}
                error={errors.sort_order?.message}
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: TỐI ƯU SEO */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tối ưu SEO</h3>
              <p className="text-xs text-gray-500">Cấu hình thẻ Meta và URL thân thiện với Google</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Meta Title (Tiêu đề SEO)"
              {...register("meta_title")}
              placeholder="Tiêu đề chuẩn SEO (từ 50-60 ký tự)"
              error={errors.meta_title?.message}
            />
            <FormField
              label="Canonical URL"
              {...register("canonical_url")}
              placeholder="https://yourdomain.com/canonical-url"
              error={errors.canonical_url?.message}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
              <Controller
                name="meta_description"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CKEditor
                    value={value || ""}
                    onChange={onChange}
                    height="120px"
                    placeholder="Mô tả chuẩn SEO (từ 150-160 ký tự)..."
                    uploadUrl={userEndpoints.uploads.image}
                  />
                )}
              />
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
            {isSubmitting ? "Đang xử lý..." : category ? "Cập nhật danh mục" : "Thêm danh mục"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



