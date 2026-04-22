import { z } from "zod";
import { emailField, statusField, optionalText, optionalImage, optionalNumber, booleanField } from "@/config/validations/common";

export const userSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập ít nhất 3 ký tự").max(50, "Tên đăng nhập không được vượt quá 50 ký tự"),
  email: emailField,
  phone: z.string().regex(/^[0-9+]{9,15}$/, "Số điện thoại không hợp lệ").optional().nullable(),
  password: z.string().optional().nullable().transform(val => val === "" ? undefined : val).refine(val => !val || val.length >= 6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự"
  }),
  name: z.string().min(1, "Họ tên là bắt buộc").max(255, "Họ tên không được vượt quá 255 ký tự"),
  gender: optionalText(),
  birthday: optionalText(),
  country_id: optionalNumber,
  province_id: optionalNumber,
  ward_id: optionalNumber,
  address: z.string().max(255, "Địa chỉ không được vượt quá 255 ký tự").optional().nullable(),
  image: optionalImage,
  about: optionalText(500),
  status: statusField,
  remove_image: booleanField(),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const changePasswordSchema = z.object({
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  password_confirmation: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["password_confirmation"],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
