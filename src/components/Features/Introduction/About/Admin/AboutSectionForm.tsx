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

// 1. Define AboutSection Schema
const aboutSectionSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(255, "Tiêu đề tối đa 255 ký tự"),
  slug: z.string().max(255, "Slug tối đa 255 ký tự").optional().nullable(),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  image: z.string().optional().nullable(),
  video_url: z.string().url("URL không hợp lệ").or(z.literal("")).optional().nullable(),
  section_type: z.string().min(1, "Loại Section là bắt buộc").default("history"),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
});

type AboutSectionFormValues = z.infer<typeof aboutSectionSchema>;

const getAboutSectionTypeArray = () => [
  { value: "history", label: "Lịch sử" },
  { value: "mission", label: "Sứ mệnh" },
  { value: "vision", label: "Tầm nhìn" },
  { value: "values", label: "Giá trị cốt lõi" },
  { value: "culture", label: "Văn hóa" },
  { value: "achievement", label: "Thành tựu" },
  { value: "other", label: "Khác" },
];

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface AboutSection {
  id?: number;
  title?: string;
  slug?: string;
  content?: string;
  image?: string | null;
  video_url?: string;
  section_type?: string;
  status?: string;
  sort_order?: number;
}

interface AboutSectionFormProps {
  show: boolean;
  section?: AboutSection | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function AboutSectionForm({
  show,
  section,
  apiErrors = {},
  onSubmit,
  onCancel,
}: AboutSectionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AboutSectionFormValues>({
    resolver: zodResolver(aboutSectionSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      image: "",
      video_url: "",
      section_type: "history",
      status: "active",
      sort_order: 0,
    },
  });

  const sectionTypeOptions = useMemo(() => getAboutSectionTypeArray(), []);
  const statusOptions = useMemo(() => getBasicStatusArray(), []);

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (section) {
        reset({
          title: section.title || "",
          slug: section.slug || "",
          content: section.content || "",
          image: section.image || "",
          video_url: section.video_url || "",
          section_type: section.section_type || "history",
          status: section.status || "active",
          sort_order: section.sort_order || 0,
        });
      } else {
        reset({
          title: "",
          slug: "",
          content: "",
          image: "",
          video_url: "",
          section_type: "history",
          status: "active",
          sort_order: 0,
        });
      }
    }
  }, [section, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = section ? "Chỉnh sửa Section Giới thiệu" : "Thêm Section Giới thiệu mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN CHÍNH */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin Section</h3>
              <p className="text-xs text-gray-500">Tiêu đề, loại nội dung và trạng thái hiển thị</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Tiêu đề"
                {...register("title")}
                placeholder="Ví dụ: Tầm nhìn & Sứ mệnh của công ty"
                error={errors.title?.message}
                required
              />
            </div>

            <FormField
              label="Đường dẫn tĩnh (Slug)"
              {...register("slug")}
              placeholder="tam-nhin-su-menh (Tự sinh nếu trống)"
              error={errors.slug?.message}
            />

            <Controller
              name="section_type"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Loại Section"
                  required
                  type="select"
                  value={value}
                  options={sectionTypeOptions}
                  onChange={onChange}
                  error={errors.section_type?.message}
                />
              )}
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
                  options={statusOptions}
                  onChange={onChange}
                  error={errors.status?.message}
                />
              )}
            />

            <FormField
              label="Thứ tự hiển thị"
              type="number"
              {...register("sort_order")}
              error={errors.sort_order?.message}
              helpText="Số càng nhỏ hiển thị càng trước"
            />
          </div>
        </section>

        {/* SECTION: NỘI DUNG CHI TIẾT */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Nội dung chi tiết</h3>
              <p className="text-xs text-gray-500">Mô tả đầy đủ nội dung cho section này</p>
            </div>
          </header>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nội dung <span className="text-red-500">*</span></label>
              <Controller
                name="content"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CKEditor
                    value={value}
                    onChange={onChange}
                    height="400px"
                    uploadUrl={userEndpoints.uploads.image}
                  />
                )}
              />
              {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
            </div>

            <FormField
              label="Video URL (Tùy chọn)"
              {...register("video_url")}
              placeholder="https://youtube.com/watch?v=..."
              error={errors.video_url?.message}
              helpText="Hiển thị video embed nếu được hỗ trợ bởi giao diện"
            />
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
              <h3 className="text-lg font-bold text-gray-900">Hình ảnh minh họa</h3>
              <p className="text-xs text-gray-500">Ảnh đại diện hoặc minh họa cho section</p>
            </div>
          </header>

          <Controller
            name="image"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ImageUploader value={value} onChange={onChange} />
            )}
          />
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
            {isSubmitting ? "Đang xử lý..." : section ? "Cập nhật Section" : "Thêm Section"}
          </button>
        </div>
      </form>
    </Modal>
  );
}




