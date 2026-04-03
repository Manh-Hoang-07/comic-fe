"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";

// 1. Define Certificate Schema
const certificateSchema = z.object({
  name: z.string().min(1, "Tên chứng chỉ là bắt buộc").max(255, "Tên chứng chỉ không được vượt quá 255 ký tự"),
  image: z.string().min(1, "Ảnh chứng chỉ là bắt buộc"),
  issued_by: z.string().max(255, "Cơ quan cấp tối đa 255 ký tự").optional().nullable(),
  issued_date: z.string().optional().nullable(),
  expiry_date: z.string().optional().nullable(),
  certificate_number: z.string().max(100, "Số chứng chỉ tối đa 100 ký tự").optional().nullable(),
  description: z.string().max(1000, "Mô tả tối đa 1000 ký tự").optional().nullable(),
  type: z.string().min(1, "Loại chứng chỉ là bắt buộc").default("license"),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
});

type CertificateFormValues = z.infer<typeof certificateSchema>;

const getCertificateTypeArray = () => [
  { value: "iso", label: "ISO" },
  { value: "quality", label: "Chất lượng" },
  { value: "safety", label: "An toàn" },
  { value: "environment", label: "Môi trường" },
  { value: "license", label: "Giấy phép" },
  { value: "other", label: "Khác" },
];

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Certificate {
  id?: number;
  name?: string;
  image?: string | null;
  issued_by?: string;
  issued_date?: string;
  expiry_date?: string;
  certificate_number?: string;
  description?: string;
  type?: string;
  status?: string;
  sort_order?: number;
}

interface CertificateFormProps {
  show: boolean;
  certificate?: Certificate | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function CertificateForm({
  show,
  certificate,
  apiErrors = {},
  onSubmit,
  onCancel,
}: CertificateFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name: "",
      image: "",
      issued_by: "",
      issued_date: "",
      expiry_date: "",
      certificate_number: "",
      description: "",
      type: "license",
      status: "active",
      sort_order: 0,
    },
  });

  const certificateTypeOptions = useMemo(() => getCertificateTypeArray(), []);
  const statusOptions = useMemo(() => getBasicStatusArray(), []);

  // Format date helper for datetime-local
  const normalizeDate = (value?: string): string => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
  };

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (certificate) {
        reset({
          name: certificate.name || "",
          image: certificate.image || "",
          issued_by: certificate.issued_by || "",
          issued_date: normalizeDate(certificate.issued_date),
          expiry_date: normalizeDate(certificate.expiry_date),
          certificate_number: certificate.certificate_number || "",
          description: certificate.description || "",
          type: certificate.type || "license",
          status: certificate.status || "active",
          sort_order: certificate.sort_order || 0,
        });
      } else {
        reset({
          name: "",
          image: "",
          issued_by: "",
          issued_date: "",
          expiry_date: "",
          certificate_number: "",
          description: "",
          type: "license",
          status: "active",
          sort_order: 0,
        });
      }
    }
  }, [certificate, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = certificate ? "Chỉnh sửa chứng chỉ" : "Thêm chứng chỉ mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin chứng chỉ</h3>
              <p className="text-xs text-gray-500">Giấy phép, ISO và các chứng nhận chất lượng</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                label="Tên chứng chỉ"
                {...register("name")}
                placeholder="Ví dụ: ISO 9001:2015"
                error={errors.name?.message}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="type"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormField
                      label="Loại"
                      required
                      type="select"
                      value={value}
                      onChange={onChange}
                      options={certificateTypeOptions}
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
              </div>
              <FormField
                label="Cơ quan cấp"
                {...register("issued_by")}
                placeholder="Tên tổ chức cấp chứng chỉ..."
                error={errors.issued_by?.message}
              />
              <FormField
                label="Số chứng chỉ / Giấy phép"
                {...register("certificate_number")}
                placeholder="Mã số định danh..."
                error={errors.certificate_number?.message}
              />
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-4 self-start">Ảnh chứng chỉ <span className="text-red-500">*</span></label>
              <Controller
                name="image"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader value={value} onChange={onChange} />
                )}
              />
              {errors.image && <p className="text-xs text-red-500 mt-2">{errors.image.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Ngày cấp"
              type="datetime-local"
              {...register("issued_date")}
              error={errors.issued_date?.message}
            />
            <FormField
              label="Ngày hết hạn"
              type="datetime-local"
              {...register("expiry_date")}
              error={errors.expiry_date?.message}
            />
            <FormField
              label="Thứ tự hiển thị"
              type="number"
              {...register("sort_order")}
              error={errors.sort_order?.message}
            />
          </div>

          <FormField
            label="Mô tả"
            type="textarea"
            rows={3}
            {...register("description")}
            placeholder="Mô tả ngắn về ý nghĩa hoặc phạm vi của chứng chỉ..."
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
            {isSubmitting ? "Đang xử lý..." : certificate ? "Cập nhật chứng chỉ" : "Thêm chứng chỉ"}
          </button>
        </div>
      </form>
    </Modal>
  );
}




