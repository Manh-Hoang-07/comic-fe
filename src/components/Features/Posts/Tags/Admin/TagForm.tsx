"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import CKEditor from "@/components/UI/Forms/CKEditor";
import { userEndpoints } from "@/lib/api/endpoints";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";

// 1. Define Tag Schema
const tagSchema = z.object({
  name: z.string().min(1, "Tên thẻ là bắt buộc").max(255, "Tên thẻ không được vượt quá 255 ký tự"),
  description: z.string().optional().nullable(),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  meta_title: z.string().max(255, "Meta Title tối đa 255 ký tự").optional().nullable(),
  meta_description: z.string().max(1000, "Meta Description tối đa 1000 ký tự").optional().nullable(),
  canonical_url: z.string().url("URL không hợp lệ").or(z.literal("")).optional().nullable(),
});

type TagFormValues = z.infer<typeof tagSchema>;

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Tag {
  id?: number;
  name?: string;
  description?: string;
  status?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
}

interface TagFormProps {
  show: boolean;
  tag?: Tag | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function TagForm({
  show,
  tag,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: TagFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
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
      if (tag) {
        reset({
          name: tag.name || "",
          description: tag.description || "",
          status: tag.status || "active",
          meta_title: tag.meta_title || "",
          meta_description: tag.meta_description || "",
          canonical_url: tag.canonical_url || "",
        });
      } else {
        reset({
          name: "",
          description: "",
          status: "active",
          meta_title: "",
          meta_description: "",
          canonical_url: "",
        });
      }
    }
  }, [tag, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = tag ? "Chỉnh sửa thẻ (Tag)" : "Thêm thẻ mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION 1: THÔNG TIN THẺ */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin thẻ</h3>
              <p className="text-xs text-gray-500">Tên gọi và mô tả chi tiết của thẻ nội dung</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Tên thẻ"
              {...register("name")}
              placeholder="Ví dụ: Công nghệ mới"
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

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả thẻ</label>
              <Controller
                name="description"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CKEditor
                    value={value || ""}
                    onChange={onChange}
                    height="180px"
                    placeholder="Nhập thông tin giới thiệu cho thẻ này..."
                    uploadUrl={userEndpoints.uploads.image}
                  />
                )}
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
              <p className="text-xs text-gray-500">Cấu hình thẻ Meta và URL thân thiện giúp tăng thứ hạng tìm kiếm</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Meta Title (Tiêu đề SEO)"
              {...register("meta_title")}
              placeholder="Tiêu đề hiển thị trên Google"
              error={errors.meta_title?.message}
            />
            <FormField
              label="Canonical URL"
              {...register("canonical_url")}
              placeholder="https://yourdomain.com/tags/slug"
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
                    placeholder="Mô tả chuẩn SEO cho thẻ..."
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
            {isSubmitting ? "Đang xử lý..." : tag ? "Cập nhật thẻ" : "Thêm thẻ mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



