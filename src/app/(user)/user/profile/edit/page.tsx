"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/UI/Navigation/Button";
import FormField from "@/components/UI/Forms/FormField";
import { useAuthStore } from "@/lib/store/authStore";
import ImageUploader from "@/components/UI/Forms/ImageUploader";
import { userService } from "@/lib/api/user";
import { useToastContext } from "@/contexts/ToastContext";

// 1. Define Profile Schema
const profileSchema = z.object({
  name: z.string().min(1, "Họ và tên là bắt buộc").max(100, "Họ và tên tối đa 100 ký tự"),
  phone: z.string().regex(/^[0-9+]{9,15}$/, "Số điện thoại không hợp lệ").optional().nullable().or(z.literal("")),
  image: z.string().optional().nullable(),
  birthday: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  address: z.string().max(255, "Địa chỉ tối đa 255 ký tự").optional().nullable(),
  about: z.string().max(1000, "Giới thiệu tối đa 1000 ký tự").optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function UserProfileEditPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToastContext();
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      image: "",
      birthday: "",
      gender: "",
      address: "",
      about: "",
    },
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        phone: user.phone || "",
        image: user.image || "",
        birthday: user.birthday || "",
        gender: user.gender || "",
        address: user.address || "",
        about: user.about || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setSuccess(null);

    try {
      // Clean data: convert null to undefined for API
      const cleanData = {
        name: data.name,
        image: data.image || undefined,
        birthday: data.birthday || undefined,
        gender: data.gender || undefined,
        address: data.address || undefined,
        about: data.about || undefined,
      };

      const response = await userService.updateProfile(cleanData);

      if (response.success) {
        showSuccess(response.message || "Cập nhật thông tin thành công!");

        // Update user in auth store
        if (response.data) {
          // Flatten profile data for authStore compatibility
          const updatedUser = {
            ...response.data,
            name: response.data.profile?.name || response.data.name,
            image: response.data.profile?.image || response.data.image,
            birthday: response.data.profile?.birthday || response.data.birthday,
            gender: response.data.profile?.gender || response.data.gender,
            address: response.data.profile?.address || response.data.address,
            about: response.data.profile?.about || response.data.about,
          };
          useAuthStore.getState().setUser(updatedUser);
        }
      }
    } catch (err: any) {
      console.error("Update profile error:", err);
      showError(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa thông tin</h1>
              <p className="mt-2 text-gray-600">Cập nhật thông tin cá nhân của bạn</p>
            </div>
            <Link
              href="/user/profile"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm animate-in fade-in duration-300">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4 self-start">Ảnh đại diện</label>
              <Controller
                name="image"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader value={value} onChange={onChange} />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Họ và tên"
                placeholder="Nhập họ và tên"
                {...register("name")}
                error={errors.name?.message}
                required
              />

              <FormField
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                {...register("phone")}
                error={errors.phone?.message}
              />

              <FormField
                label="Ngày sinh"
                type="date"
                {...register("birthday")}
                error={errors.birthday?.message}
              />

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Giới tính</label>
                <select
                  {...register("gender")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
              </div>
            </div>

            <FormField
              label="Địa chỉ"
              placeholder="Nhập địa chỉ của bạn"
              {...register("address")}
              error={errors.address?.message}
            />

            <FormField
              label="Giới thiệu bản thân"
              type="textarea"
              rows={4}
              placeholder="Viết một vài dòng giới thiệu về bản thân..."
              {...register("about")}
              error={errors.about?.message}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Link
                href="/user/profile"
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all active:scale-95"
              >
                Hủy
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2.5"
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


