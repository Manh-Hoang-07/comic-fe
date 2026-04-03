"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";

// 1. Define Partner Schema
const partnerSchema = z.object({
  name: z.string().min(1, "Tên đối tác là bắt buộc").max(255, "Tên đối tác không được vượt quá 255 ký tự"),
  logo: z.string().min(1, "Logo là bắt buộc"),
  website: z.string().url("URL không hợp lệ").or(z.literal("")).optional().nullable(),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional().nullable(),
  type: z.string().min(1, "Loại đối tác là bắt buộc").default("client"),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

const getPartnerTypeArray = () => [
  { value: "supplier", label: "Nhà cung cấp" },
  { value: "client", label: "Khách hàng" },
  { value: "partner", label: "Đối tác" },
  { value: "sponsor", label: "Nhà tài trợ" },
  { value: "other", label: "Khác" },
];

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Partner {
  id?: number;
  name?: string;
  logo?: string | null;
  website?: string;
  description?: string;
  type?: string;
  status?: string;
  sort_order?: number;
}

interface PartnerFormProps {
  show: boolean;
  partner?: Partner | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function PartnerForm({
  show,
  partner,
  apiErrors = {},
  onSubmit,
  onCancel,
}: PartnerFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      logo: "",
      website: "",
      description: "",
      type: "client",
      status: "active",
      sort_order: 0,
    },
  });

  const statusOptions = useMemo(() => getBasicStatusArray(), []);
  const typeOptions = useMemo(() => getPartnerTypeArray(), []);

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (partner) {
        reset({
          name: partner.name || "",
          logo: partner.logo || "",
          website: partner.website || "",
          description: partner.description || "",
          type: partner.type || "client",
          status: partner.status || "active",
          sort_order: partner.sort_order || 0,
        });
      } else {
        reset({
          name: "",
          logo: "",
          website: "",
          description: "",
          type: "client",
          status: "active",
          sort_order: 0,
        });
      }
    }
  }, [partner, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = partner ? "Chỉnh sửa đối tác" : "Thêm đối tác mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="lg" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin đối tác</h3>
              <p className="text-xs text-gray-500">Thông tin định danh và logo thương hiệu</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                label="Tên đối tác"
                {...register("name")}
                placeholder="Ví dụ: Công ty TNHH ABC"
                error={errors.name?.message}
                required
              />
            </div>

            <Controller
              name="type"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Loại đối tác"
                  required
                  type="select"
                  value={value}
                  onChange={onChange}
                  options={typeOptions}
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
              label="Website"
              {...register("website")}
              placeholder="https://example.com"
              error={errors.website?.message}
            />

            <FormField
              label="Thứ tự hiển thị"
              type="number"
              {...register("sort_order")}
              error={errors.sort_order?.message}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Logo đối tác <span className="text-red-500">*</span></label>
            <div className="flex justify-center p-4 bg-white rounded-xl border border-gray-200">
              <Controller
                name="logo"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader value={value} onChange={onChange} />
                )}
              />
            </div>
            {errors.logo && <p className="text-xs text-red-500 mt-1">{errors.logo.message}</p>}
          </div>

          <FormField
            label="Mô tả"
            type="textarea"
            rows={3}
            {...register("description")}
            placeholder="Nhập mô tả ngắn về đối tác..."
            error={errors.description?.message}
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
            {isSubmitting ? "Đang xử lý..." : partner ? "Cập nhật đối tác" : "Thêm đối tác"}
          </button>
        </div>
      </form>
    </Modal>
  );
}




