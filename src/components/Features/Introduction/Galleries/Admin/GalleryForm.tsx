"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";
import Image from "next/image";

// 1. Define Gallery Schema
const gallerySchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(255, "Tiêu đề tối đa 255 ký tự"),
  slug: z.string().max(255, "Slug tối đa 255 ký tự").optional().nullable(),
  description: z.string().max(1000, "Mô tả tối đa 1000 ký tự").optional().nullable(),
  cover_image: z.string().optional().nullable(),
  images: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 ảnh"),
  featured: z.boolean().default(false),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Gallery {
  id?: number;
  title?: string;
  slug?: string;
  description?: string;
  cover_image?: string | null;
  images?: string[];
  featured?: boolean;
  status?: string;
  sort_order?: number;
}

interface GalleryFormProps {
  show: boolean;
  gallery?: Gallery | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function GalleryForm({
  show,
  gallery,
  apiErrors = {},
  onSubmit,
  onCancel,
}: GalleryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      cover_image: "",
      images: [],
      featured: false,
      status: "active",
      sort_order: 0,
    },
  });

  const statusOptions = useMemo(() => getBasicStatusArray(), []);

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (gallery) {
        reset({
          title: gallery.title || "",
          slug: gallery.slug || "",
          description: gallery.description || "",
          cover_image: gallery.cover_image || "",
          images: Array.isArray(gallery.images) ? gallery.images : [],
          featured: Boolean(gallery.featured),
          status: gallery.status || "active",
          sort_order: gallery.sort_order || 0,
        });
      } else {
        reset({
          title: "",
          slug: "",
          description: "",
          cover_image: "",
          images: [],
          featured: false,
          status: "active",
          sort_order: 0,
        });
      }
    }
  }, [gallery, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = gallery ? "Chỉnh sửa Gallery" : "Thêm Gallery mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN CƠ BẢN */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin bộ sưu tập</h3>
              <p className="text-xs text-gray-500">Tiêu đề, đường dẫn và cấu hình hiển thị</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Tiêu đề Gallery"
                {...register("title")}
                placeholder="Ví dụ: Lễ hội Xuân 2024"
                error={errors.title?.message}
                required
              />
            </div>
            <FormField
              label="Đường dẫn (Slug)"
              {...register("slug")}
              placeholder="bo-suu-tap-anh-le-hoi (Tự tạo nếu trống)"
              error={errors.slug?.message}
            />
            <FormField
              label="Trạng thái"
              type="select"
              {...register("status")}
              options={statusOptions}
              error={errors.status?.message}
              required
            />
            <FormField
              label="Thứ tự hiển thị"
              type="number"
              {...register("sort_order")}
              error={errors.sort_order?.message}
            />
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="featured"
                {...register("featured")}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm font-bold text-gray-700 cursor-pointer">
                Đánh dấu là nổi bật
              </label>
            </div>
            <div className="md:col-span-2">
              <FormField
                label="Mô tả bộ sưu tập"
                type="textarea"
                {...register("description")}
                placeholder="Giới thiệu ngắn về bộ sưu tập ảnh này..."
                rows={3}
                error={errors.description?.message}
              />
            </div>
          </div>
        </section>

        {/* SECTION: HÌNH ẢNH */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hình ảnh Gallery</h3>
              <p className="text-xs text-gray-500">Quản lý ảnh bìa và danh sách ảnh thành viên</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh bìa (Cover Image)</label>
              <Controller
                name="cover_image"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader value={value} onChange={onChange} />
                )}
              />
              {errors.cover_image && <p className="mt-1 text-xs text-red-500">{errors.cover_image.message}</p>}
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Danh sách ảnh thành viên <span className="text-red-500">*</span>
              </label>
              <Controller
                name="images"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-white hover:bg-gray-50 hover:border-blue-400 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <p className="text-sm font-medium">Click để chọn nhiều ảnh</p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            // For simplicity, we just use blob URLs here as per original code pattern
                            // In a real app, this should handle file uploads properly
                            const urls = files.map(f => URL.createObjectURL(f));
                            onChange([...value, ...urls]);
                          }}
                        />
                      </label>
                    </div>

                    {value.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-4 bg-white rounded-2xl border border-gray-200">
                        {value.map((url, idx) => (
                          <div key={idx} className="relative aspect-square group rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <Image
                              src={url}
                              alt={`Gallery ${idx}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <button
                              type="button"
                              onClick={() => onChange(value.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
              {errors.images && <p className="mt-1 text-xs text-red-500 font-medium">{errors.images.message}</p>}
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
            {isSubmitting ? "Đang xử lý..." : gallery ? "Cập nhật Gallery" : "Tạo Gallery"}
          </button>
        </div>
      </form>
    </Modal >
  );
}




