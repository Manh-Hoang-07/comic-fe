"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { adminEndpoints } from "@/lib/api/endpoints";

// 1. Định nghĩa Banner Schema (Declarative)
export const bannerSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(255, "Tiêu đề quá dài"),
  subtitle: z.string().max(255, "Phụ đề quá dài").optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().min(1, "Hình ảnh desktop là bắt buộc"),
  mobile_image: z.string().optional().nullable(),
  link: z.string().url("Link không hợp lệ").or(z.literal("")).optional().nullable(),
  link_target: z.enum(["_self", "_blank"]).default("_self"),
  button_text: z.string().max(50, "Text nút quá dài").optional().nullable(),
  button_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Màu không hợp lệ").default("#ff6b6b"),
  text_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Màu không hợp lệ").default("#ffffff"),
  location_id: z.coerce.number({ invalid_type_error: "Vị trí là bắt buộc" }).positive("Vị trí không hợp lệ"),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(1),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  show: boolean;
  banner?: any;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  locationEnums?: Array<{ value: number; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: BannerFormValues) => void;
  onCancel?: () => void;
}

export default function BannerForm({
  show,
  banner,
  statusEnums = [],
  locationEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: BannerFormProps) {
  // 2. Cấu hình Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      image: "",
      mobile_image: "",
      link: "",
      link_target: "_self",
      button_text: "",
      button_color: "#ff6b6b",
      text_color: "#ffffff",
      location_id: undefined,
      sort_order: 1,
      status: "active",
      start_date: "",
      end_date: "",
    },
  });

  // Reset form khi banner data thay đổi (Edit mode)
  useEffect(() => {
    if (show) {
      if (banner) {
        reset({
          title: banner.title || "",
          subtitle: banner.subtitle || "",
          description: banner.description || "",
          image: banner.image || "",
          mobile_image: banner.mobile_image || "",
          link: banner.link || "",
          link_target: banner.link_target || "_self",
          button_text: banner.button_text || "",
          button_color: banner.button_color || "#ff6b6b",
          text_color: banner.text_color || "#ffffff",
          location_id: banner.location_id,
          sort_order: banner.sort_order || 1,
          status: banner.status || "active",
          start_date: banner.start_date ? new Date(banner.start_date).toISOString().slice(0, 16) : "",
          end_date: banner.end_date ? new Date(banner.end_date).toISOString().slice(0, 16) : "",
        });
      } else {
        reset({
          title: "",
          subtitle: "",
          description: "",
          image: "",
          mobile_image: "",
          link: "",
          link_target: "_self",
          button_text: "",
          button_color: "#ff6b6b",
          text_color: "#ffffff",
          location_id: undefined,
          sort_order: 1,
          status: "active",
          start_date: "",
          end_date: "",
        });
      }
    }
  }, [banner, reset, show]);

  // Map lỗi từ API vào fields
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const statusOptions = useMemo(() =>
    statusEnums.map(item => ({
      value: item.value,
      label: item.label || (item as any).name || item.value
    })), [statusEnums]);

  const formTitle = banner ? "Chỉnh sửa banner" : "Thêm banner mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN CƠ BẢN */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h3>
              <p className="text-xs text-gray-500">Cấu hình các thông tin hiển thị chính của banner</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Tiêu đề"
                placeholder="Nhập tiêu đề banner"
                {...register("title")}
                error={errors.title?.message}
                required
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Phụ đề"
                placeholder="Nhập phụ đề hiển thị bên dưới tiêu đề"
                {...register("subtitle")}
                error={errors.subtitle?.message}
              />
            </div>

            <Controller
              name="location_id"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  searchApi={adminEndpoints.bannerLocations.list}
                  label="Vị trí hiển thị"
                  labelField="name"
                  valueField="id"
                  placeholder="-- Chọn vị trí --"
                  error={errors.location_id?.message}
                  required
                />
              )}
            />

            <FormField
              label="Thứ tự hiển thị"
              type="number"
              placeholder="1"
              {...register("sort_order")}
              error={errors.sort_order?.message}
              helpText="Sắp xếp theo số nhỏ nhất"
            />

            <div className="md:col-span-2">
              <FormField
                label="Mô tả ngắn"
                type="textarea"
                rows={3}
                placeholder="Mô tả thêm thông tin chi tiết..."
                {...register("description")}
                error={errors.description?.message}
              />
            </div>
          </div>
        </div>

        {/* SECTION: HÌNH ẢNH & MEDIA */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hình ảnh & Media</h3>
              <p className="text-xs text-gray-500">Tải ảnh lên cho các phiên bản màn hình khác nhau</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-dashed border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-4 self-start">
                Ảnh Desktop <span className="text-red-500">*</span>
              </label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    {...field}
                  />
                )}
              />
              {errors.image && <p className="mt-2 text-xs text-red-500 font-medium">{errors.image.message}</p>}
            </div>

            <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-dashed border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-4 self-start">
                Ảnh Mobile
              </label>
              <Controller
                name="mobile_image"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    {...field}
                  />
                )}
              />
              {errors.mobile_image && <p className="mt-2 text-xs text-red-500 font-medium">{errors.mobile_image.message}</p>}
            </div>
          </div>
        </div>

        {/* SECTION: LIÊN KẾT & STYLE */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Liên kết & Nút bấm</h3>
              <p className="text-xs text-gray-500">Tùy chỉnh hành động khi khách hàng click vào banner</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Đường dẫn (URL)"
                placeholder="https://example.com/khuyen-mai"
                {...register("link")}
                error={errors.link?.message}
              />
            </div>

            <FormField
              label="Mở trong"
              type="select"
              options={[
                { value: "_self", label: "Cửa sổ hiện tại" },
                { value: "_blank", label: "Cửa sổ mới" },
              ]}
              {...register("link_target")}
              error={errors.link_target?.message}
            />

            <FormField
              label="Tên nút (Button Text)"
              placeholder="Xem ngay"
              {...register("button_text")}
              error={errors.button_text?.message}
            />

            <FormField
              label="Màu nút"
              type="color"
              inputClass="h-12 !p-1 cursor-pointer"
              {...register("button_color")}
              error={errors.button_color?.message}
            />

            <FormField
              label="Màu chữ"
              type="color"
              inputClass="h-12 !p-1 cursor-pointer"
              {...register("text_color")}
              error={errors.text_color?.message}
            />
          </div>
        </div>

        {/* SECTION: THỜI GIAN & TRẠNG THÁI */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thời gian & Trạng thái</h3>
              <p className="text-xs text-gray-500">Thiết lập thời điểm banner hiển thị trên website</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Ngày bắt đầu"
              type="datetime-local"
              {...register("start_date")}
              error={errors.start_date?.message}
            />

            <FormField
              label="Ngày kết thúc"
              type="datetime-local"
              {...register("end_date")}
              error={errors.end_date?.message}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  options={statusOptions}
                  label="Trạng thái"
                  placeholder="-- Chọn trạng thái --"
                  error={errors.status?.message}
                  required
                />
              )}
            />
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100">
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
            {isSubmitting ? "Đang xử lý..." : banner ? "Cập nhật Banner" : "Tạo Banner mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



