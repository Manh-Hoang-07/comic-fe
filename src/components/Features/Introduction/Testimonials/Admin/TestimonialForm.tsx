"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";

// 1. Define Testimonial Schema
const testimonialSchema = z.object({
  client_name: z.string().min(1, "Tên khách hàng là bắt buộc").max(100, "Tên khách hàng không được vượt quá 100 ký tự"),
  client_position: z.string().max(100, "Chức vụ tối đa 100 ký tự").optional().nullable(),
  client_company: z.string().max(100, "Công ty tối đa 100 ký tự").optional().nullable(),
  client_avatar: z.string().optional().nullable(),
  content: z.string().min(1, "Nội dung là bắt buộc").max(2000, "Nội dung không được vượt quá 2000 ký tự"),
  rating: z.coerce.number().min(1, "Đánh giá tối thiểu 1 sao").max(5, "Đánh giá tối đa 5 sao").optional().nullable(),
  project_id: z.coerce.number().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Testimonial {
  id?: number;
  client_name?: string;
  client_position?: string;
  client_company?: string;
  client_avatar?: string | null;
  content?: string;
  rating?: number | null;
  project_id?: number | null;
  featured?: boolean;
  status?: string;
  sort_order?: number;
}

interface TestimonialFormProps {
  show: boolean;
  testimonial?: Testimonial | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function TestimonialForm({
  show,
  testimonial,
  apiErrors = {},
  onSubmit,
  onCancel,
}: TestimonialFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      client_name: "",
      client_position: "",
      client_company: "",
      client_avatar: "",
      content: "",
      rating: 5,
      project_id: null,
      featured: false,
      status: "active",
      sort_order: 0,
    },
  });

  const statusOptions = useMemo(() => getBasicStatusArray(), []);
  const ratingOptions = useMemo(
    () => [
      { value: "1", label: "1 sao" },
      { value: "2", label: "2 sao" },
      { value: "3", label: "3 sao" },
      { value: "4", label: "4 sao" },
      { value: "5", label: "5 sao" },
    ],
    []
  );

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (testimonial) {
        reset({
          client_name: testimonial.client_name || "",
          client_position: testimonial.client_position || "",
          client_company: testimonial.client_company || "",
          client_avatar: testimonial.client_avatar || "",
          content: testimonial.content || "",
          rating: testimonial.rating || 5,
          project_id: testimonial.project_id || null,
          featured: Boolean(testimonial.featured),
          status: testimonial.status || "active",
          sort_order: testimonial.sort_order || 0,
        });
      } else {
        reset({
          client_name: "",
          client_position: "",
          client_company: "",
          client_avatar: "",
          content: "",
          rating: 5,
          project_id: null,
          featured: false,
          status: "active",
          sort_order: 0,
        });
      }
    }
  }, [testimonial, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = testimonial ? "Chỉnh sửa đánh giá" : "Thêm đánh giá mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="lg" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin khách hàng</h3>
              <p className="text-xs text-gray-500">Cảm nhận và đánh giá từ phía đối tác</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-4 self-start">Ảnh đại diện</label>
              <Controller
                name="client_avatar"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader value={value} onChange={onChange} />
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                label="Tên khách hàng"
                {...register("client_name")}
                placeholder="Nguyễn Văn A"
                error={errors.client_name?.message}
                required
              />
              <FormField
                label="Công ty"
                {...register("client_company")}
                placeholder="Tập đoàn ABC"
                error={errors.client_company?.message}
              />
              <FormField
                label="Chức vụ"
                {...register("client_position")}
                placeholder="Giám đốc điều hành"
                error={errors.client_position?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="rating"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Đánh giá (Sao)"
                  required
                  type="select"
                  value={String(value || "")}
                  onChange={onChange}
                  options={ratingOptions}
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
                  onChange={onChange}
                  options={statusOptions}
                />
              )}
            />
            <FormField
              label="Thứ tự hiển thị"
              type="number"
              {...register("sort_order")}
              error={errors.sort_order?.message}
            />
          </div>

          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <input
              type="checkbox"
              id="featured"
              {...register("featured")}
              className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="featured" className="text-sm font-bold text-blue-900 cursor-pointer">
              Đánh giá nổi bật (Hiển thị ưu tiên)
            </label>
          </div>

          <FormField
            label="Nội dung đánh giá"
            type="textarea"
            rows={5}
            {...register("content")}
            placeholder="Khách hàng nói gì về dự án/dịch vụ của bạn..."
            error={errors.content?.message}
            required
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
            {isSubmitting ? "Đang xử lý..." : testimonial ? "Cập nhật đánh giá" : "Thêm đánh giá"}
          </button>
        </div>
      </form>
    </Modal>
  );
}




