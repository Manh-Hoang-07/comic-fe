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
import { ArrowLeft, Mail, KeyRound, CheckCircle2 } from "lucide-react";

// Schema for step 1: Email
const emailSchema = z.object({
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
});

// Schema for step 2: Reset Password
const resetPasswordSchema = z.object({
    email: z.string().email(),
    otp: z.string().min(6, "Mã OTP phải có ít nhất 6 ký tự"),
    password: z.string().min(1, "Mật khẩu mới là bắt buộc").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { sendOtpForgotPassword, resetPassword } = useAuthStore();
    const { showSuccess, showError } = useToastContext();

    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP & Reset, 3: Success
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Form for Step 1
    const emailForm = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "" },
    });

    // Form for Step 2
    const resetForm = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
            otp: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onEmailSubmit = async (data: EmailFormValues) => {
        setIsLoading(true);

        try {
            const result = await sendOtpForgotPassword(data.email);
            if (result.success) {
                setUserEmail(data.email);
                resetForm.setValue("email", data.email);
                setStep(2);
                setCountdown(60);
                showSuccess(result.message || "Mã OTP đã được gửi đến email của bạn.");
            } else {
                showError(result.message || "Email không tồn tại trong hệ thống.");
            }
        } catch (err) {
            showError("Đã có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const onResetSubmit = async (data: ResetPasswordFormValues) => {
        setIsLoading(true);

        try {
            const result = await resetPassword(data);
            if (result.success) {
                showSuccess("Mật khẩu đã được thay đổi thành công!");
                setStep(3);
            } else {
                showError(result.message || "Mã OTP không đúng hoặc đã hết hạn.");
            }
        } catch (err) {
            showError("Đã có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;
        setIsLoading(true);
        try {
            const result = await sendOtpForgotPassword(userEmail);
            if (result.success) {
                setCountdown(60);
                showSuccess("Mã OTP mới đã được gửi.");
            } else {
                showError(result.message || "Không thể gửi lại OTP.");
            }
        } catch (err) {
            showError("Không thể gửi lại OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Back Link */}
                {step !== 3 && (
                    <Link
                        href="/login"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại đăng nhập
                    </Link>
                )}

                <div className="bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100">
                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Quên mật khẩu?</h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    Nhập email của bạn để nhận mã xác thực khôi phục mật khẩu.
                                </p>
                            </div>

                            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                                <FormField
                                    label="Email"
                                    placeholder="nhap@email.com"
                                    {...emailForm.register("email")}
                                    error={emailForm.formState.errors.email?.message}
                                    required
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 text-base font-semibold"
                                    glow
                                >
                                    {isLoading ? "Đang xử lý..." : "Gửi mã xác thực"}
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* Step 2: OTP & Reset Password */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <KeyRound className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Thiết lập mật khẩu mới</h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    Mã OTP đã được gửi đến <b>{userEmail}</b>. Vui lòng kiểm tra hộp thư.
                                </p>
                            </div>

                            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                                <FormField
                                    label="Mã OTP"
                                    placeholder="123456"
                                    {...resetForm.register("otp")}
                                    error={resetForm.formState.errors.otp?.message}
                                    required
                                />

                                <FormField
                                    label="Mật khẩu mới"
                                    type="password"
                                    placeholder="••••••••"
                                    {...resetForm.register("password")}
                                    error={resetForm.formState.errors.password?.message}
                                    required
                                />

                                <FormField
                                    label="Xác nhận mật khẩu"
                                    type="password"
                                    placeholder="••••••••"
                                    {...resetForm.register("confirmPassword")}
                                    error={resetForm.formState.errors.confirmPassword?.message}
                                    required
                                />

                                <div className="text-center text-sm">
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={countdown > 0 || isLoading}
                                        className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
                                    >
                                        {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : "Gửi lại mã OTP"}
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 text-base font-semibold"
                                    glow
                                >
                                    {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="text-center py-4 space-y-6">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Thành công!</h2>
                            <p className="text-gray-600">
                                Mật khẩu của bạn đã được thay đổi thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
                            </p>
                            <Button
                                onClick={() => router.push("/login")}
                                className="w-full h-12 text-base font-semibold"
                                glow
                            >
                                Đăng nhập ngay
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


