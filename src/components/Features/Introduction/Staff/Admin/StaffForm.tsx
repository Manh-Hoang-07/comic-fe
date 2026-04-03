"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";

// 1. Define Staff Schema
const staffSchema = z.object({
  name: z.string().min(1, "Họ tên là bắt buộc").max(100, "Họ tên không được vượt quá 100 ký tự"),
  position: z.string().min(1, "Chức vụ là bắt buộc").max(100, "Chức vụ không được vượt quá 100 ký tự"),
  department: z.string().max(100, "Phòng ban tối đa 100 ký tự").optional().nullable(),
  bio: z.string().max(1000, "Tiểu sử tối đa 1000 ký tự").optional().nullable(),
  avatar: z.string().optional().nullable(),
  email: z.string().email("Email không hợp lệ").or(z.literal("")).optional().nullable(),
  phone: z.string().max(20, "Số điện thoại tối đa 20 ký tự").optional().nullable(),
  social_links: z.object({
    facebook: z.string().url("URL không hợp lệ").or(z.literal("")).optional().nullable(),
    linkedin: z.string().url("URL không hợp lệ").or(z.literal("")).optional().nullable(),
    twitter: z.string().url("URL không hợp lệ").or(z.literal("")).optional().nullable(),
  }).optional(),
  experience: z.coerce.number().min(0, "Kinh nghiệm không được âm").default(0),
  expertise: z.string().max(500, "Chuyên môn tối đa 500 ký tự").optional().nullable(),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
});

type StaffFormValues = z.infer<typeof staffSchema>;

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Staff {
  id?: number;
  name?: string;
  position?: string;
  department?: string;
  bio?: string;
  avatar?: string | null;
  email?: string;
  phone?: string;
  social_links?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
  experience?: number;
  expertise?: string;
  status?: string;
  sort_order?: number;
}

interface StaffFormProps {
  show: boolean;
  staff?: Staff | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function StaffForm({
  show,
  staff,
  apiErrors = {},
  onSubmit,
  onCancel,
}: StaffFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      position: "",
      department: "",
      bio: "",
      avatar: "",
      email: "",
      phone: "",
      social_links: {
        facebook: "",
        linkedin: "",
        twitter: "",
      },
      experience: 0,
      expertise: "",
      status: "active",
      sort_order: 0,
    },
  });

  const statusOptions = useMemo(() => getBasicStatusArray(), []);

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (staff) {
        reset({
          name: staff.name || "",
          position: staff.position || "",
          department: staff.department || "",
          bio: staff.bio || "",
          avatar: staff.avatar || "",
          email: staff.email || "",
          phone: staff.phone || "",
          social_links: {
            facebook: staff.social_links?.facebook || "",
            linkedin: staff.social_links?.linkedin || "",
            twitter: staff.social_links?.twitter || "",
          },
          experience: staff.experience || 0,
          expertise: staff.expertise || "",
          status: staff.status || "active",
          sort_order: staff.sort_order || 0,
        });
      } else {
        reset({
          name: "",
          position: "",
          department: "",
          bio: "",
          avatar: "",
          email: "",
          phone: "",
          social_links: {
            facebook: "",
            linkedin: "",
            twitter: "",
          },
          experience: 0,
          expertise: "",
          status: "active",
          sort_order: 0,
        });
      }
    }
  }, [staff, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = staff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN CÁ NHÂN */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin cá nhân</h3>
              <p className="text-xs text-gray-500">Thông tin cơ bản và ảnh đại diện</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                label="Họ tên"
                {...register("name")}
                error={errors.name?.message}
                placeholder="Nguyễn Văn A"
                required
              />
              <FormField
                label="Chức vụ"
                {...register("position")}
                error={errors.position?.message}
                placeholder="Giám đốc, Trưởng phòng..."
                required
              />
              <FormField
                label="Phòng ban"
                {...register("department")}
                error={errors.department?.message}
                placeholder="Kỹ thuật, Kinh doanh..."
              />
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-4 self-start">Ảnh đại diện</label>
              <Controller
                name="avatar"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader value={value} onChange={onChange} />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              placeholder="name@example.com"
            />
            <FormField
              label="Số điện thoại"
              {...register("phone")}
              error={errors.phone?.message}
              placeholder="0123 456 789"
            />
            <FormField
              label="Kinh nghiệm (năm)"
              type="number"
              {...register("experience")}
              error={errors.experience?.message}
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
        </section>

        {/* SECTION: CHUYÊN MÔN & TIỂU SỬ */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Năng lực & Tiểu sử</h3>
              <p className="text-xs text-gray-500">Kỹ năng chuyên môn và quá trình công tác</p>
            </div>
          </header>

          <FormField
            label="Chuyên môn"
            type="textarea"
            rows={3}
            {...register("expertise")}
            error={errors.expertise?.message}
            placeholder="Các lĩnh vực chuyên môn chính..."
          />
          <FormField
            label="Tiểu sử"
            type="textarea"
            rows={4}
            {...register("bio")}
            error={errors.bio?.message}
            placeholder="Giới thiệu chi tiết về nhân viên..."
          />
        </section>

        {/* SECTION: LIÊN KẾT MẠNG XÃ HỘI */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Liên kết mạng xã hội</h3>
              <p className="text-xs text-gray-500">Các kênh thông tin kết nối</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Facebook"
              {...register("social_links.facebook")}
              error={errors.social_links?.facebook?.message}
              placeholder="https://facebook.com/..."
            />
            <FormField
              label="LinkedIn"
              {...register("social_links.linkedin")}
              error={errors.social_links?.linkedin?.message}
              placeholder="https://linkedin.com/in/..."
            />
            <FormField
              label="Twitter/X"
              {...register("social_links.twitter")}
              error={errors.social_links?.twitter?.message}
              placeholder="https://twitter.com/..."
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
            {isSubmitting ? "Đang xử lý..." : staff ? "Cập nhật nhân viên" : "Thêm nhân viên"}
          </button>
        </div>
      </form>
    </Modal>
  );
}




