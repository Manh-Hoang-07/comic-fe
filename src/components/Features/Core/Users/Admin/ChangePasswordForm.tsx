"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import { changePasswordSchema, type ChangePasswordFormValues } from "./Constants/schemas";
import { type ChangePasswordFormProps } from "./Constants/types";


export default function ChangePasswordForm({
  show,
  user,
  apiErrors = {},
  onSubmit,
  onCancel,
}: ChangePasswordFormProps) {
  const formTitle = `Đổi mật khẩu cho ${user?.username || "người dùng"}`;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (show) {
      reset({
        password: "",
        password_confirmation: "",
      });
    }
  }, [show, reset]);

  // Handle server-side errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="lg" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-6">
        <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0-1.657-1.343-3-3-3H7a3 3 0 100 6h2a3 3 0 003-3zm0 0V7m0 4v4"
              ></path>
            </svg>
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h3>
            <p className="text-sm text-gray-500">Nhập mật khẩu mới cho người dùng</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            {...register("password")}
            label="Mật khẩu mới"
            type="password"
            error={errors.password?.message}
            required
            autocomplete="new-password"
          />
          <FormField
            {...register("password_confirmation")}
            label="Xác nhận mật khẩu mới"
            type="password"
            error={errors.password_confirmation?.message}
            required
            autocomplete="new-password"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



