"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/UI/Navigation/Button";
import FormField from "@/components/UI/Forms/FormField";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/contexts/ToastContext";

// 1. Define Register Schema
const registerSchema = z.object({
  name: z.string().min(1, "Họ và tên là bắt buộc").max(100, "Họ và tên tối đa 100 ký tự"),
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ").max(255, "Email quá dài"),
  phone: z.string().regex(/^[0-9+]{9,15}$/, "Số điện thoại không hợp lệ").optional().nullable().or(z.literal("")),
  password: z.string().min(1, "Mật khẩu là bắt buộc").min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(100, "Mật khẩu quá dài"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  otp: z.string().min(6, "Mã OTP phải có ít nhất 6 ký tự").max(10, "Mã OTP quá dài"),
  agreeTerms: z.boolean().refine(val => val === true, "Bạn phải đồng ý với điều khoản sử dụng"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, sendOtpRegister } = useAuthStore();
  const { showSuccess, showError } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      otp: "",
      agreeTerms: false,
    },
  });

  const email = watch("email");

  const handleSendOtp = async () => {
    if (!email || errors.email) {
      setError("email", { message: "Vui lòng nhập email hợp lệ trước khi gửi mã OTP" });
      return;
    }

    setIsSendingOtp(true);
    try {
      const result = await sendOtpRegister(email);
      if (result.success) {
        setOtpSent(true);
        setCountdown(60); // 60 seconds throttle
        showSuccess(result.message || "Mã OTP đã được gửi đến email của bạn.");
      } else {
        showError(result.message || "Không thể gửi OTP. Vui lòng thử lại.");
      }
    } catch (err: any) {
      showError("Có lỗi xảy ra khi gửi OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
        confirmPassword: data.confirmPassword,
        otp: data.otp,
      });

      if (result.success) {
        showSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        if (result.errors) {
          Object.keys(result.errors).forEach((key) => {
            const messages = result.errors![key];
            if (messages?.[0]) {
              setError(key as any, { message: messages[0] });
            }
          });
        }
        showError(result.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (err: any) {
      showError(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              đăng nhập vào tài khoản hiện có
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                label="Họ và tên"
                placeholder="Nhập họ và tên"
                {...register("name")}
                error={errors.name?.message}
                required
              />

              <FormField
                label="Số điện thoại"
                type="tel"
                placeholder="Nhập số điện thoại"
                {...register("phone")}
                error={errors.phone?.message}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <FormField
                    type="email"
                    placeholder="nhap@email.com"
                    {...register("email")}
                    error={errors.email?.message}
                    noLabel
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || countdown > 0}
                  className="h-[42px] px-3 whitespace-nowrap"
                >
                  {isSendingOtp ? "Đang gửi..." : countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi OTP"}
                </Button>
              </div>
            </div>

            <FormField
              label="Mã OTP"
              placeholder="Nhập mã xác thực email"
              {...register("otp")}
              error={errors.otp?.message}
              required
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
                required
              />

              <FormField
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                required
              />
            </div>

            <div className="space-y-1">
              <FormField
                type="checkbox"
                checkboxLabel={
                  <span className="text-sm text-gray-900">
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-500">điều khoản sử dụng</a> và{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-500">chính sách bảo mật</a>
                  </span>
                }
                {...register("agreeTerms")}
                required
              />
              {errors.agreeTerms && (
                <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold"
                glow
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký tài khoản"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


