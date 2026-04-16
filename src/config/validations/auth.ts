import { z } from "zod";
import { emailField, passwordField, passwordConfirmRefinement } from "./common";

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
  rememberMe: z.boolean().default(false),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, "Họ và tên là bắt buộc").max(100, "Họ và tên tối đa 100 ký tự"),
  email: emailField,
  phone: z.string().regex(/^[0-9+]{9,15}$/, "Số điện thoại không hợp lệ").optional().nullable().or(z.literal("")),
  password: passwordField,
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  otp: z.string().min(6, "Mã OTP phải có ít nhất 6 ký tự").max(10, "Mã OTP quá dài"),
  agreeTerms: z.boolean().refine(val => val === true, "Bạn phải đồng ý với điều khoản sử dụng"),
}).refine(passwordConfirmRefinement.validate, {
  message: passwordConfirmRefinement.message,
  path: passwordConfirmRefinement.path,
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const emailOnlySchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
});
export type EmailFormValues = z.infer<typeof emailOnlySchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, "Mã OTP phải có ít nhất 6 ký tự"),
  password: passwordField,
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine(passwordConfirmRefinement.validate, {
  message: passwordConfirmRefinement.message,
  path: passwordConfirmRefinement.path,
});
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mật khẩu hiện tại là bắt buộc"),
  newPassword: passwordField,
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  { message: "Mật khẩu xác nhận không khớp", path: ["confirmPassword"] }
);
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
