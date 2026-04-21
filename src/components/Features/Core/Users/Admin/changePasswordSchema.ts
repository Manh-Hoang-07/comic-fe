import { z } from "zod";

export const changePasswordSchema = z.object({
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  password_confirmation: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["password_confirmation"],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
