"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/UI/Navigation/Button";
import FormField from "@/components/UI/Forms/FormField";
import { userService } from "@/lib/api/user";
import { useToastContext } from "@/contexts/ToastContext";

// 1. Define Change Password Schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mật khẩu hiện tại là bắt buộc"),
  newPassword: z.string().min(1, "Mật khẩu mới là bắt buộc").min(6, "Mật khẩu mới phải có ít nhất 6 ký tự").max(100, "Mật khẩu mới quá dài"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function UserChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToastContext();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true);
    setServerError(null);
    setSuccess(null);

    try {
      const response = await userService.changePassword({
        old_password: data.currentPassword,
        password: data.newPassword,
        password_confirmation: data.confirmPassword,
      });

      if (response.success) {
        showSuccess(response.message || "Đổi mật khẩu thành công!");
        reset();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Có lỗi xảy ra, vui lòng thử lại";
      showError(errorMessage);
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
              <h1 className="text-3xl font-bold text-gray-900">Đổi mật khẩu</h1>
              <p className="mt-2 text-gray-600">Thay đổi mật khẩu đăng nhập của bạn để bảo vệ tài khoản</p>
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
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              label="Mật khẩu hiện tại"
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              {...register("currentPassword")}
              error={errors.currentPassword?.message}
              required
            />

            <FormField
              label="Mật khẩu mới"
              type="password"
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              {...register("newPassword")}
              error={errors.newPassword?.message}
              required
            />

            <FormField
              label="Xác nhận mật khẩu mới"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              required
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
                {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


