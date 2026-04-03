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
import Image from "next/image";

// 1. Define Project Schema
const projectSchema = z.object({
  name: z.string().min(1, "Tên dự án là bắt buộc").max(255, "Tên dự án không được vượt quá 255 ký tự"),
  slug: z.string().max(255, "Slug không được vượt quá 255 ký tự").optional().nullable(),
  description: z.string().min(1, "Mô tả chi tiết là bắt buộc"),
  short_description: z.string().max(500, "Mô tả ngắn tối đa 500 ký tự").optional().nullable(),
  cover_image: z.string().min(1, "Ảnh bìa là bắt buộc"),
  location: z.string().max(255, "Địa điểm tối đa 255 ký tự").optional().nullable(),
  area: z.coerce.number().positive("Diện tích phải là số dương").optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("planning"),
  client_name: z.string().max(255, "Tên khách hàng tối đa 255 ký tự").optional().nullable(),
  budget: z.coerce.number().positive("Ngân sách phải là số dương").optional().nullable(),
  images: z.array(z.string()).min(1, "Bộ sưu tập ảnh dự án phải có ít nhất 1 ảnh"),
  featured: z.boolean().default(false),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
  meta_title: z.string().max(255, "Meta Title tối đa 255 ký tự").optional().nullable(),
  meta_description: z.string().max(500, "Meta Description tối đa 500 ký tự").optional().nullable(),
  canonical_url: z.string().url("URL không hợp lệ").or(z.literal("")).optional().nullable(),
  og_image: z.string().optional().nullable(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const getProjectStatusArray = () => [
  { value: "planning", label: "Đang lập kế hoạch" },
  { value: "in_progres", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
  { value: "on_hold", label: "Tạm dừng" },
  { value: "cancelled", label: "Đã hủy" },
];

interface Project {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  cover_image?: string | null;
  location?: string;
  area?: number | null;
  start_date?: string;
  end_date?: string;
  status?: string;
  client_name?: string;
  budget?: number | null;
  images?: string[];
  featured?: boolean;
  sort_order?: number;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string | null;
}

interface ProjectFormProps {
  show: boolean;
  project?: Project | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function ProjectForm({
  show,
  project,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      short_description: "",
      cover_image: "",
      location: "",
      area: null,
      start_date: "",
      end_date: "",
      status: "planning",
      client_name: "",
      budget: null,
      images: [],
      featured: false,
      sort_order: 0,
      meta_title: "",
      meta_description: "",
      canonical_url: "",
      og_image: "",
    },
  });

  const statusOptions = useMemo(() => {
    const statusArray = statusEnums.length > 0 ? statusEnums : getProjectStatusArray();
    return statusArray.map((opt) => ({
      value: opt.value,
      label: opt.label || (opt as any).name || String(opt.value),
    }));
  }, [statusEnums]);

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (project) {
        reset({
          name: project.name || "",
          slug: project.slug || "",
          description: project.description || "",
          short_description: project.short_description || "",
          cover_image: project.cover_image || "",
          location: project.location || "",
          area: project.area || null,
          start_date: (typeof project.start_date === "string" ? project.start_date.split("T")[0] : project.start_date) || "",
          end_date: (typeof project.end_date === "string" ? project.end_date.split("T")[0] : project.end_date) || "",
          status: project.status || "planning",
          client_name: project.client_name || "",
          budget: project.budget || null,
          images: Array.isArray(project.images) ? project.images : [],
          featured: !!project.featured,
          sort_order: project.sort_order || 0,
          meta_title: project.meta_title || "",
          meta_description: project.meta_description || "",
          canonical_url: project.canonical_url || "",
          og_image: project.og_image || "",
        });
      } else {
        reset({
          name: "",
          slug: "",
          description: "",
          short_description: "",
          cover_image: "",
          location: "",
          area: null,
          start_date: "",
          end_date: "",
          status: "planning",
          client_name: "",
          budget: null,
          images: [],
          featured: false,
          sort_order: 0,
          meta_title: "",
          meta_description: "",
          canonical_url: "",
          og_image: "",
        });
      }
    }
  }, [project, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = project ? "Chỉnh sửa dự án" : "Thêm dự án mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN DỰ ÁN */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin dự án</h3>
              <p className="text-xs text-gray-500">Mô tả và các thông số cơ bản</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                label="Tên dự án"
                {...register("name")}
                error={errors.name?.message}
                placeholder="Nhập tên dự án..."
                required
              />
            </div>
            <FormField
              label="Slug"
              {...register("slug")}
              error={errors.slug?.message}
              placeholder="Để trống để tự động tạo..."
            />
            <Controller
              name="status"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Trạng thái"
                  required
                  type="select"
                  value={value}
                  onChange={onChange}
                  options={statusOptions}
                  error={errors.status?.message}
                />
              )}
            />
            <FormField
              label="Địa điểm"
              {...register("location")}
              error={errors.location?.message}
              placeholder="Ví dụ: Quận 1, TP. HCM"
            />
            <FormField
              label="Diện tích (m²)"
              type="number"
              {...register("area")}
              error={errors.area?.message}
              placeholder="0.00"
            />
            <FormField
              label="Khách hàng"
              {...register("client_name")}
              error={errors.client_name?.message}
              placeholder="Tên khách hàng/đối tác"
            />
            <FormField
              label="Ngân sách"
              type="number"
              {...register("budget")}
              error={errors.budget?.message}
              placeholder="VNĐ"
            />
            <FormField
              label="Ngày bắt đầu"
              type="date"
              {...register("start_date")}
              error={errors.start_date?.message}
            />
            <FormField
              label="Ngày kết thúc"
              type="date"
              {...register("end_date")}
              error={errors.end_date?.message}
            />
          </div>

          <FormField
            label="Mô tả ngắn"
            type="textarea"
            rows={2}
            {...register("short_description")}
            error={errors.short_description?.message}
            placeholder="Tóm tắt dự án trong 1-2 câu..."
          />

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Mô tả chi tiết</label>
            <Controller
              name="description"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CKEditor
                  value={value || ""}
                  onChange={onChange}
                  height="300px"
                  placeholder="Nhập nội dung chi tiết..."
                  uploadUrl={userEndpoints.uploads.image}
                />
              )}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>
        </section>

        {/* SECTION: HÌNH ẢNH DỰ ÁN */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hình ảnh & media</h3>
              <p className="text-xs text-gray-500">Ảnh bìa và bộ sưu tập ảnh dự án</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Ảnh bìa (Cover)</label>
              <Controller
                name="cover_image"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader value={value} onChange={onChange} />
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Thứ tự & Hiển thị</label>
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register("featured")}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">Dự án nổi bật</label>
                </div>
                <FormField
                  label="Thứ tự sắp xếp"
                  type="number"
                  {...register("sort_order")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700">Bộ sưu tập ảnh dự án (Showcase) <span className="text-red-500">*</span></label>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-white hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  // Here we should handle actual file uploading or use preview URLs
                  // For now, let's keep the logic but fix the setValue call
                  const currentImages = control._formValues.images || [];
                  const newImages = [...currentImages, ...files.map(f => URL.createObjectURL(f))];
                  setValue("images", newImages, { shouldValidate: true });
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-2 text-xs text-gray-400">Có thể chọn nhiều ảnh. Ảnh đầu tiên nên là ảnh chính.</p>
            </div>
            {errors.images && <p className="text-xs text-red-500">{errors.images.message}</p>}

            {/* Simple Image Gallery Preview */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4">
              {control._formValues.images?.map((img: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                  <Image
                    src={img}
                    alt="preview"
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImgs = control._formValues.images.filter((_: any, i: number) => i !== idx);
                      setValue("images", newImgs);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: TỐI ƯU SEO */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tối ưu SEO</h3>
              <p className="text-xs text-gray-500">Cấu hình cho công cụ tìm kiếm và mạng xã hội</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Meta Title" {...register("meta_title")} error={errors.meta_title?.message} />
            <FormField label="Canonical URL" {...register("canonical_url")} error={errors.canonical_url?.message} />
            <div className="md:col-span-2">
              <FormField label="Meta Description" type="textarea" rows={3} {...register("meta_description")} error={errors.meta_description?.message} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">OpenGraph Image</label>
              <Controller
                name="og_image"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader value={value} onChange={onChange} />
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
            {isSubmitting ? "Đang xử lý..." : project ? "Cập nhật dự án" : "Thêm dự án mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}




